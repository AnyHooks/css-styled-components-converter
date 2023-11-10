const fs = require('fs');
const css = require('css');
const cssSelect = require('css-select');
const axios = require('axios');
const cheerio = require('cheerio');

async function loadCSSFromHTML(url) {
  try {
    // Carrega o conteúdo HTML da URL
    const htmlResponse = await axios.get(url);
    const $ = cheerio.load(htmlResponse.data);

    // Procura por todos os links de arquivos CSS
    $('link[rel="stylesheet"]').each(async (index, element) => {
      const cssLink = $(element).attr('href');

      // Carrega cada arquivo CSS
      const cssResponse = await axios.get(cssLink);
      // Aqui você pode processar o conteúdo CSS conforme necessário
      console.log(cssResponse.data);
    });
  } catch (error) {
    console.error(`Erro ao carregar CSS: ${error.message}`);
  }
}

// Substitua pela URL do seu HTML
loadCSSFromHTML('https://example.com');

// Read the text file with selectors
const selectors = fs.readFileSync(process.argv[2], 'utf8').split('\n');

// Process each CSS file
for (let i = 3; i < process.argv.length; i++) {
    const cssContent = fs.readFileSync(process.argv[i], 'utf8');
    const parsedStyles = css.parse(cssContent);

    selectors.forEach(selector => {
        let validSelector;
        try {
            if (selector.includes('class="')) {
                validSelector = selector.replace('class="', '.').replace('"', '');
            } else if (selector.includes('id="')) {
                validSelector = selector.replace('id="', '#').replace('"', '');
            } else {
                validSelector = selector;
            }

            const result = cssSelect.selectOne(validSelector, parsedStyles.stylesheet.rules);
            if (result) {
                console.log(`Found in ${process.argv[i]}: '${validSelector}'`);
            } else {
                console.log(`Not found in ${process.argv[i]}: '${validSelector}'`);
            }
        } catch (error) {
            console.error(`Error processing selector '${validSelector}' in ${process.argv[i]}: ${error.message}`);
        }
    });
}
