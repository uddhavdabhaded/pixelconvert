import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { spawnSync } from "node:child_process";

const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const out = path.resolve("scripts/.smoke");
fs.mkdirSync(out, { recursive: true });

function crc32(data) {
  let crc = ~0;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return ~crc >>> 0;
}
function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, checksum]);
}
function makePng(width, height) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x += 1) {
      const index = row + 1 + x * 4;
      raw[index] = (x * 13) % 255;
      raw[index + 1] = (y * 17) % 255;
      raw[index + 2] = 180;
      raw[index + 3] = x < 20 ? 0 : 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const pngPath = path.join(out, "sample.png");
const junkPath = path.join(out, "notes.txt");
const corruptPath = path.join(out, "broken.jpg");
fs.writeFileSync(pngPath, makePng(400, 250));
fs.writeFileSync(junkPath, "hello");
fs.writeFileSync(corruptPath, Buffer.from("this is not a jpeg"));

const tinyJpeg = Buffer.from(
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFRUXGBcYGBgYGBgYGBgYGBgYGBgYGBgYHSggGBolHRgXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGy0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAAMAAQMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAADAAIEBQYBB//EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGf/9k=",
  "base64",
);
const jpgPath = path.join(out, "tiny.jpg");
fs.writeFileSync(jpgPath, tinyJpeg);

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
  throw new Error(message);
}
function assert(condition, message) {
  if (!condition) fail(message);
}

const routes = [
  ["/", "Convert, Crop & Optimize Images Online"],
  ["/tools", "Image tools"],
  ["/image-converter", "Image Converter"],
  ["/image-cropper", "Image Cropper"],
  ["/image-resizer", "Image Resizer"],
  ["/image-compressor", "Image Compressor"],
  ["/jpg-to-png", "JPG to PNG"],
  ["/png-to-jpg", "PNG to JPG"],
  ["/jpg-to-webp", "JPG to WEBP"],
  ["/png-to-webp", "PNG to WEBP"],
  ["/webp-to-jpg", "WEBP to JPG"],
  ["/webp-to-png", "WEBP to PNG"],
  ["/about", "About PixelConvert"],
  ["/faq", "Frequently asked questions"],
  ["/blog", "Blog"],
  ["/blog/jpg-vs-png-vs-webp", "JPG vs PNG vs WEBP"],
  ["/contact", "Contact"],
  ["/privacy", "Privacy policy"],
  ["/terms", "Terms of use"],
];

async function readDimensions(page, label) {
  const text = await page.locator("dt", { hasText: label }).locator("xpath=following-sibling::dd[1]").first().innerText();
  const match = text.replace(/,/g, "").match(/(\d+)\s×\s(\d+)/);
  assert(match, `${label} dimensions were ${text}`);
  return { width: Number(match[1]), height: Number(match[2]), text };
}

async function upload(page, file) {
  await page.locator("input[type=file]").first().setInputFiles(file);
}

const browser = await chromium.launch({ channel: process.env.BROWSER || "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const consoleErrors = [];
page.on("pageerror", (error) => consoleErrors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});

try {
  for (const [route, heading] of routes) {
    const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    assert(response && response.ok(), `${route} returned ${response?.status()}`);
    await page.getByRole("heading", { level: 1, name: new RegExp(heading) }).waitFor();
    const privacy = await page.locator("body").innerText();
    if (route !== "/contact" && route !== "/blog" && !route.startsWith("/blog/") && route !== "/about" && route !== "/terms" && route !== "/faq" && route !== "/tools") {
      assert(privacy.includes("Your images are processed locally in your browser and are not uploaded to our servers."), `${route} missing privacy sentence`);
    }
  }

  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const wasDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await page.waitForFunction((dark) => document.documentElement.classList.contains("dark") !== dark, wasDark);
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await page.waitForFunction((dark) => document.documentElement.classList.contains("dark") === dark, wasDark);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const route of ["/", "/tools", "/image-cropper", "/image-converter"]) {
    await mobile.goto(`${base}${route}`, { waitUntil: "networkidle" });
    const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert(overflow <= 1, `${route} overflows on mobile by ${overflow}px`);
  }
  await mobile.getByRole("button", { name: "Open menu" }).click();
  await mobile.locator("#mobile-nav").getByRole("link", { name: "Cropper", exact: true }).click();
  await mobile.getByRole("heading", { name: "Image Cropper" }).waitFor();
  await mobile.close();

  await page.goto(`${base}/image-converter`, { waitUntil: "networkidle" });
  await upload(page, junkPath);
  const unsupported = page.getByRole("alert").filter({ hasText: "not supported" });
  await unsupported.waitFor();
  assert((await unsupported.innerText()).includes("not supported"), "unsupported file message");

  await page.goto(`${base}/jpg-to-png`, { waitUntil: "networkidle" });
  await upload(page, pngPath);
  const wrongType = page.getByRole("alert").filter({ hasText: "accepts JPG" });
  await wrongType.waitFor();
  assert((await wrongType.innerText()).includes("accepts JPG"), "jpg page rejected a png");

  await page.goto(`${base}/image-cropper`, { waitUntil: "networkidle" });
  await upload(page, corruptPath);
  const corrupt = page.getByRole("alert").filter({ hasText: /could not be read|corrupted/i });
  await corrupt.waitFor();
  assert(/could not be read|corrupted/i.test(await corrupt.innerText()), "corrupt file message");

  await page.goto(`${base}/image-cropper`, { waitUntil: "networkidle" });
  await upload(page, pngPath);
  await page.locator(".cropper-container").waitFor();
  const box = await page.locator(".cropper-container").boundingBox();
  assert(box && box.height > 240, `cropper stage too small: ${box?.height}`);
  await page.getByRole("radio", { name: "1:1" }).click();
  await page.waitForFunction(() => {
    const current = [...document.querySelectorAll("dt")].find((node) => node.textContent === "Current");
    const value = current?.nextElementSibling?.textContent?.replace(/,/g, "") ?? "";
    const match = value.match(/(\d+)\s×\s(\d+)/);
    return match && Math.abs(Number(match[1]) - Number(match[2])) <= 2;
  });
  const lockedRatios = [
    ["4:3", 4 / 3],
    ["3:4", 3 / 4],
    ["3:2", 3 / 2],
    ["2:3", 2 / 3],
    ["16:9", 16 / 9],
    ["9:16", 9 / 16],
    ["21:9", 21 / 9],
  ];
  for (const [label, expected] of lockedRatios) {
    await page.getByRole("radio", { name: label, exact: true }).click();
    await page.waitForFunction((target) => {
      const current = [...document.querySelectorAll("dt")].find((node) => node.textContent === "Current");
      const value = current?.nextElementSibling?.textContent?.replace(/,/g, "") ?? "";
      const match = value.match(/(\d+)\s×\s(\d+)/);
      if (!match) return false;
      return Math.abs(Number(match[1]) / Number(match[2]) - target) < 0.08;
    }, expected);
  }
  await page.getByRole("radio", { name: "Original", exact: true }).click();
  await page.waitForFunction(() => {
    const current = [...document.querySelectorAll("dt")].find((node) => node.textContent === "Current");
    const value = current?.nextElementSibling?.textContent?.replace(/,/g, "") ?? "";
    const match = value.match(/(\d+)\s×\s(\d+)/);
    if (!match) return false;
    return Math.abs(Number(match[1]) / Number(match[2]) - 400 / 250) < 0.08;
  });
  await page.getByRole("radio", { name: "Free", exact: true }).click();
  await page.getByRole("radio", { name: "16:9" }).click();
  await page.waitForFunction(() => {
    const current = [...document.querySelectorAll("dt")].find((node) => node.textContent === "Current");
    const value = current?.nextElementSibling?.textContent?.replace(/,/g, "") ?? "";
    const match = value.match(/(\d+)\s×\s(\d+)/);
    if (!match) return false;
    const ratio = Number(match[1]) / Number(match[2]);
    return Math.abs(ratio - 16 / 9) < 0.08;
  });
  await page.getByRole("button", { name: "Instagram Story" }).click();
  await page.waitForFunction(() => {
    const current = [...document.querySelectorAll("dt")].find((node) => node.textContent === "Current");
    const value = current?.nextElementSibling?.textContent?.replace(/,/g, "") ?? "";
    const match = value.match(/(\d+)\s×\s(\d+)/);
    if (!match) return false;
    return Number(match[2]) / Number(match[1]) > 1.6;
  });
  await page.getByLabel("Width").fill("2");
  await page.getByLabel("Height").fill("1");
  await page.getByRole("button", { name: "Apply custom ratio" }).click();
  await page.waitForFunction(() => {
    const current = [...document.querySelectorAll("dt")].find((node) => node.textContent === "Current");
    const value = current?.nextElementSibling?.textContent?.replace(/,/g, "") ?? "";
    const match = value.match(/(\d+)\s×\s(\d+)/);
    if (!match) return false;
    return Number(match[1]) / Number(match[2]) > 1.8;
  });
  await page.getByRole("button", { name: "Right 90°" }).click();
  await page.getByRole("button", { name: "Horizontal" }).click();
  await page.getByRole("button", { name: "Vertical" }).click();
  await page.getByLabel("Zoom in").click();
  await page.getByRole("button", { name: "Apply Crop" }).click();
  await page.getByRole("status").waitFor();
  await page.locator(".cropper-canvas").waitFor();
  const cropDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  const download = await cropDownload;
  const croppedPath = path.join(out, await download.suggestedFilename());
  await download.saveAs(croppedPath);
  assert(fs.statSync(croppedPath).size > 100, "cropped download was empty");

  await page.getByRole("link", { name: "2. Resize" }).click();
  await page.waitForURL("**/image-resizer");
  await page.getByRole("button", { name: "Apply resize" }).waitFor();
  const before = await readDimensions(page, "Current");
  await page.getByLabel("Width in pixels").fill(String(Math.round(before.width / 2)));
  await page.waitForFunction(
    ([width]) => {
      const node = [...document.querySelectorAll("input")].find((input) => input.getAttribute("aria-label") === "Height in pixels");
      return node && Math.abs(Number(node.value) - width) <= 1;
    },
    [Math.round((before.height / before.width) * Math.round(before.width / 2))],
  );
  await page.getByRole("button", { name: "50%", exact: true }).click();
  await page.getByRole("button", { name: "Left 90°" }).click();
  await page.getByRole("button", { name: "Apply resize" }).waitFor();
  const resizeDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download JPG" }).click();
  const resized = await resizeDownload;
  await resized.saveAs(path.join(out, "resized.jpg"));
  assert(fs.statSync(path.join(out, "resized.jpg")).size > 100, "resized jpg empty");

  await page.getByRole("link", { name: "3. Compress" }).click();
  await page.waitForURL("**/image-compressor");
  await page.getByRole("slider", { name: "Quality" }).fill("40");
  await page.waitForFunction(() => {
    const node = [...document.querySelectorAll("dt")].find((item) => item.textContent === "Compressed size");
    const value = node?.nextElementSibling?.textContent ?? "";
    return value.length > 0 && !value.includes("Calculating");
  });
  const compressDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download WEBP" }).click();
  const compressed = await compressDownload;
  const webpPath = path.join(out, "compressed.webp");
  await compressed.saveAs(webpPath);
  assert(fs.statSync(webpPath).size > 50, "webp download empty");

  await page.goto(`${base}/image-converter`, { waitUntil: "networkidle" });
  await page.getByRole("radio", { name: "PNG" }).click();
  await upload(page, [pngPath, jpgPath]);
  await page.getByRole("button", { name: "Convert" }).click();
  await page.getByText("Conversion finished on this device.").waitFor();
  const zipDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download all" }).click();
  const zip = await zipDownload;
  const zipPath = path.join(out, "images.zip");
  await zip.saveAs(zipPath);
  const extract = path.join(out, "zip");
  fs.rmSync(extract, { recursive: true, force: true });
  fs.mkdirSync(extract);
  const expanded = spawnSync("powershell", ["-NoProfile", "-Command", `Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${extract}' -Force`], { encoding: "utf8" });
  assert(expanded.status === 0, `zip extract failed: ${expanded.stderr}`);
  const extracted = fs.readdirSync(extract);
  assert(extracted.length === 2, `expected 2 files in zip, got ${extracted.join(", ")}`);

  await page.goto(`${base}/webp-to-jpg`, { waitUntil: "networkidle" });
  await upload(page, webpPath);
  await page.getByRole("button", { name: "Convert" }).click();
  await page.getByText("Ready to download").waitFor();
  const webpJpg = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download", exact: true }).click();
  const convertedJpg = await webpJpg;
  assert((await convertedJpg.suggestedFilename()).endsWith(".jpg"), "webp to jpg filename");

  await page.goto(`${base}/png-to-webp`, { waitUntil: "networkidle" });
  await upload(page, pngPath);
  await page.getByRole("button", { name: "Convert" }).click();
  await page.getByText("Ready to download").first().waitFor();

  const serious = consoleErrors.filter((item) => !/favicon|download/i.test(item));
  assert(serious.length === 0, `console errors: ${serious.join(" | ")}`);
  console.log("smoke tests passed");
} finally {
  await browser.close();
}
