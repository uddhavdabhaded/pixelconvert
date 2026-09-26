const CRC_TABLE = new Uint32Array(256);
for (let index = 0; index < 256; index += 1) {
  let crc = index;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  CRC_TABLE[index] = crc >>> 0;
}

export function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (let index = 0; index < data.length; index += 1) {
    crc = CRC_TABLE[(crc ^ data[index]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function safeZipName(name: string, used: Set<string>) {
  const leaf = name.replace(/\\/g, "/").split("/").pop() || "image";
  const base = leaf.replace(/[^\w.\- ]+/g, "").trim() || "image";
  let candidate = base;
  let count = 2;
  while (used.has(candidate.toLowerCase())) {
    const dot = base.lastIndexOf(".");
    candidate = dot > 0 ? `${base.slice(0, dot)}-${count}${base.slice(dot)}` : `${base}-${count}`;
    count += 1;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}

export async function zipBlobs(files: Array<{ name: string; blob: Blob }>) {
  if (files.length === 0) throw new Error("There are no converted images to download yet.");
  const now = new Date();
  const time =
    (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const encoder = new TextEncoder();
  const parts: BlobPart[] = [];
  const central: Uint8Array[] = [];
  const used = new Set<string>();
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(safeZipName(file.name, used));
    const data = new Uint8Array(await file.blob.arrayBuffer());
    const checksum = crc32(data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(8, 0, true);
    local.setUint16(10, time, true);
    local.setUint16(12, date, true);
    local.setUint32(14, checksum, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, name.length, true);
    parts.push(local.buffer, name, data);

    const header = new DataView(new ArrayBuffer(46));
    header.setUint32(0, 0x02014b50, true);
    header.setUint16(4, 20, true);
    header.setUint16(6, 20, true);
    header.setUint16(12, time, true);
    header.setUint16(14, date, true);
    header.setUint32(16, checksum, true);
    header.setUint32(20, data.length, true);
    header.setUint32(24, data.length, true);
    header.setUint16(28, name.length, true);
    header.setUint32(42, offset, true);
    const centralBytes = new Uint8Array(46 + name.length);
    centralBytes.set(new Uint8Array(header.buffer), 0);
    centralBytes.set(name, 46);
    central.push(centralBytes);
    offset += 30 + name.length + data.length;
  }

  const centralOffset = offset;
  let centralSize = 0;
  for (const header of central) {
    parts.push(new Uint8Array(header).buffer);
    centralSize += header.length;
  }

  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, centralOffset, true);
  parts.push(end.buffer);
  return new Blob(parts, { type: "application/zip" });
}
