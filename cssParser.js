const fs = require('fs');
const CSSOM = require('cssom');

// Primeiro argumento: Arquivo de texto contendo os seletores
const textFile = process.argv[2];

// Resto dos argumentos: Arquivos CSS
const cssFiles = process.argv.slice(3);

// Lendo o arquivo de texto
fs.readFile(textFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo de texto:', err);
        return;
    }

    // Separando as linhas do arquivo de texto
    const selectors = data.split('\n');

    // Processando cada arquivo CSS
    cssFiles.forEach(cssFile => {
        fs.readFile(cssFile, 'utf8', (err, cssData) => {
            if (err) {
                console.error(`Erro ao ler o arquivo CSS (${cssFile}):`, err);
                return;
            }

            // Parsing do CSS
            const parsedCSS = CSSOM.parse(cssData);

            // Verificando cada seletor
            selectors.forEach(selector => {
                let found = false;
                parsedCSS.cssRules.forEach(rule => {
                    if (rule.selectorText === selector) {
                        console.log(`Encontrado '${selector}' em ${cssFile}`);
                        found = true;
                    }
                });
                if (!found) {
                    console.log(`Não encontrado: '${selector}' em ${cssFile}`);
                }
            });
        });
    });
});
