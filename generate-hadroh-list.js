// generate-hadroh-list.js
// Run: node generate-hadroh-list.js
const fs = require('fs');
const path = require('path');

const folder = path.resolve('c:/CODING/Hadroh'); // Hadroh folder
const outFile = path.resolve('c:/CODING/hadroh-list.js');

const allowedExt = new Set(['.webm', '.mp3', '.wav', '.ogg']);

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });
    list.forEach(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(walk(full));
        } else if (allowedExt.has(path.extname(entry.name).toLowerCase())) {
            const rel = path.relative('c:/CODING', full).replace(/\\\\/g, '/');
            results.push(rel);
        }
    });
    return results;
}

if (!fs.existsSync(folder)) {
    console.error('Folder Hadroh tidak ditemukan:', folder);
    process.exit(1);
}

const files = walk(folder);

let content = '// Auto‑generated list of Hadroh audio files\n';
content += 'window.libHadroh = [\n';
files.forEach(f => {
    content += `    "${f}",\n`;
});
content += '];\n';
fs.writeFileSync(outFile, content, 'utf8');
console.log(`✅ libHadroh dibuat dengan ${files.length} file di ${outFile}`);
