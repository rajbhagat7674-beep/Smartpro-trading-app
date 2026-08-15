// Generates valid PNG icons for PWA WebAPK
const fs = require('fs');
const zlib = require('zlib');

function makePNG(width, height) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const r = width * 0.45;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter byte

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Dark sleek navy background
      let rVal = 11;
      let gVal = 16;
      let bVal = 29;
      let aVal = 255;

      // Rounded rect background border / glow
      const nx = Math.abs(dx) / (width * 0.42);
      const ny = Math.abs(dy) / (height * 0.42);
      const inBox = Math.pow(nx, 4) + Math.pow(ny, 4) <= 1.0;

      if (!inBox) {
        rVal = 7;
        gVal = 10;
        bVal = 17;
      }

      // Draw Candlestick / Bullish Growth Arrow in emerald & cyan
      // Candle 1 (Green)
      if (x >= width * 0.28 && x <= width * 0.38 && y >= height * 0.45 && y <= height * 0.72) {
        rVal = 16; gVal = 185; bVal = 129;
      }
      // Wick 1
      if (x >= width * 0.32 && x <= width * 0.34 && y >= height * 0.35 && y <= height * 0.80) {
        rVal = 16; gVal = 185; bVal = 129;
      }

      // Candle 2 (Cyan/Emerald taller)
      if (x >= width * 0.45 && x <= width * 0.55 && y >= height * 0.32 && y <= height * 0.65) {
        rVal = 6; gVal = 182; bVal = 212;
      }
      // Wick 2
      if (x >= width * 0.49 && x <= width * 0.51 && y >= height * 0.22 && y <= height * 0.75) {
        rVal = 6; gVal = 182; bVal = 212;
      }

      // Candle 3 (Emerald peak)
      if (x >= width * 0.62 && x <= width * 0.72 && y >= height * 0.20 && y <= height * 0.52) {
        rVal = 16; gVal = 185; bVal = 129;
      }
      // Wick 3
      if (x >= width * 0.66 && x <= width * 0.68 && y >= height * 0.12 && y <= height * 0.62) {
        rVal = 16; gVal = 185; bVal = 129;
      }

      // Dynamic trend curve overlay
      const curveY = height * (0.68 - 0.45 * Math.pow(x / width, 1.2));
      if (Math.abs(y - curveY) <= Math.max(2, width * 0.018) && x >= width * 0.2 && x <= width * 0.8) {
        rVal = 52; gVal = 211; bVal = 153;
      }

      rawData[pxOffset] = rVal;
      rawData[pxOffset + 1] = gVal;
      rawData[pxOffset + 2] = bVal;
      rawData[pxOffset + 3] = aVal;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeInt32BE(crc, 8 + len);
  return chunk;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ -1) | 0;
}

const path = require('path');
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), makePNG(192, 192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), makePNG(512, 512));
console.log('Successfully generated icon-192.png and icon-512.png in public dir');
