const fs = require("fs");
const path = require("path");

const DIRECTORY = path.join(__dirname, ".next");
const SEARCH_PATTERN = /\/static\/_next\/static/g;  // Ajustado para buscar corretamente
const REPLACEMENT = "/static";

let modifiedFiles = [];
let unchangedFiles = [];

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    if (SEARCH_PATTERN.test(content)) {
      content = content.replace(SEARCH_PATTERN, REPLACEMENT);
      fs.writeFileSync(filePath, content, "utf8");
      modifiedFiles.push(filePath);
      console.log(`✅ Arquivo atualizado: ${filePath}`);
    } else {
      unchangedFiles.push(filePath);
    }
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((file) => {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      processDirectory(fullPath);
    } else {
      replaceInFile(fullPath);
    }
  });
}

console.log("🔄 Iniciando atualização dos caminhos...");
processDirectory(DIRECTORY);
console.log("✅ Atualização concluída.");

// Exibir arquivos não modificados
if (unchangedFiles.length > 0) {
  console.log("\n🔍 Arquivos que NÃO precisaram de alteração:");
  unchangedFiles.forEach((file) => console.log(`  - ${file}`));
}
