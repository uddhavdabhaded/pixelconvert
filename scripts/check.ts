import assert from "node:assert/strict";
import { crc32, zipBlobs } from "../src/lib/image/zip";
import { customRatioValue, gcd, simplifyRatio } from "../src/lib/ratios";
import { parsePixelSize, validateFile } from "../src/lib/image/validate";

assert.equal(crc32(new TextEncoder().encode("123456789")), 0xcbf43926);
assert.equal(gcd(1920, 1080), 120);
assert.equal(simplifyRatio(1920, 1080), "16:9");
assert.equal(simplifyRatio(1080, 1080), "1:1");
assert.equal(simplifyRatio(9, 16), "9:16");
assert.equal(customRatioValue(1200, 800), 1.5);
assert.equal(customRatioValue(0, 800), null);
assert.equal(parsePixelSize("1080"), 1080);
assert.equal(parsePixelSize("0"), null);
assert.equal(parsePixelSize("9000"), null);

const text = new File([new Uint8Array([1, 2, 3])], "notes.txt", { type: "text/plain" });
assert.match(validateFile(text) ?? "", /not supported/);
const empty = new File([], "photo.jpg", { type: "image/jpeg" });
assert.match(validateFile(empty) ?? "", /empty/);
const jpeg = new File([new Uint8Array([1])], "photo.jpg", { type: "image/jpeg" });
assert.equal(validateFile(jpeg, ["image/png"]), "This tool accepts PNG files. photo.jpg is a JPG image.");
assert.equal(validateFile(jpeg), null);

const zip = await zipBlobs([
  { name: "one.png", blob: new Blob(["alpha"]) },
  { name: "one.png", blob: new Blob(["beta"]) },
]);
const bytes = new Uint8Array(await zip.arrayBuffer());
assert.equal(bytes[0], 0x50);
assert.equal(bytes[1], 0x4b);
const decoded = new TextDecoder().decode(bytes);
assert.equal(decoded.includes("one.png"), true);
assert.equal(decoded.includes("one-2.png"), true);
console.log("unit tests passed");
