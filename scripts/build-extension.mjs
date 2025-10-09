import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const dist = 'dist';
// Limpa e cria o diretório de distribuição
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);

// Copia os arquivos essenciais da extensão
console.log('Copiando arquivos da extensão...');
fs.copyFileSync('manifest.json', path.join(dist, 'manifest.json'));
fs.cpSync('src', path.join(dist, 'src'), { recursive: true });
fs.cpSync('icons', path.join(dist, 'icons'), { recursive: true });
console.log('Arquivos copiados para dist/');

// Gera o arquivo .zip a partir da pasta dist
console.log('Gerando o arquivo extension.zip...');
const output = fs.createWriteStream(path.join(dist, 'extension.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Build finalizado: ${archive.pointer()} bytes totais.`);
  console.log('Build gerado em dist/ e dist/extension.zip');
});

archive.pipe(output);
archive.directory(dist, false);
await archive.finalize();