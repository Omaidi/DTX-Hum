// generate-simpatik-list.js
// Jalankan: node generate-simpatik-list.js
const fs = require('fs');
const path = require('path');

const folder = path.resolve('c:/CODING/Simpatik'); // folder Simpatik
const outFile = path.resolve('c:/CODING/simpatik-list.js');

const allowedExt = new Set(['.webm', '.mp3', '.wav', '.ogg']);

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  list.forEach(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(full));
    } else if (allowedExt.has(path.extname(entry.name).toLowerCase())) {
      // buat path relatif dari root project
      const rel = path.relative('c:/CODING', full).replace(/\\/g, '/');
      results.push(rel);
    }
  });
  return results;
}

if (!fs.existsSync(folder)) {
  console.error('Folder Simpatik tidak ditemukan:', folder);
  process.exit(1);
}

const files = walk(folder);

let content = '// Auto‑generated list of Simpatik audio files\n';
content += 'const libSimpatik = [\n';
files.forEach(f => {
  content += `    "${f}",\n`;
});
content += '];\n';
content += 'export { libSimpatik };\n';

fs.writeFileSync(outFile, content, 'utf8');
console.log(`✅ libSimpatik dibuat dengan ${files.length} file di ${outFile}`);
