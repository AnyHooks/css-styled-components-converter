const fs = require('fs');
const css = require('css');
const cssSelect = require('css-select');
const axios = require('axios');
const cheerio = require('cheerio');

async function loadCSSFromHTML(url) {
  try {
    const htmlResponse = await axios.get(url);
    const $ = cheerio.load(htmlResponse.data);
    const cssLinks = [];

    $('link[rel="stylesheet"]').each((index, element) => {
      cssLinks.push($(element).attr('href'));
    });

    return Promise.all(cssLinks.map(async link => {
      try {
        const response = await axios.get(link);
        return response.data;
      } catch (error) {
        console.error(`Erro ao carregar CSS de ${link}: ${error.message}`);
        return '';  // Retorna uma string vazia em caso de erro
      }
    }));
  } catch (error) {
    console.error(`Erro ao carregar HTML: ${error.message}`);
    return []; // Retorna um array vazio em caso de erro
  }
}

async function loadCSSFromHTML(url) {
  try {
    const htmlResponse = await axios.get(url);
    const $ = cheerio.load(htmlResponse.data);
    const cssLinks = [];

    $('link[rel="stylesheet"]').each((index, element) => {
      cssLinks.push($(element).attr('href'));
    });

    return Promise.all(cssLinks.map(link => axios.get(link).then(response => response.data)));
  } catch (error) {
    console.error(`Erro ao carregar CSS: ${error.message}`);
  }
}

async function processCSSContent(cssContent, selectors) {
  const parsedStyles = css.parse(cssContent);
  selectors.forEach(selector => {
    let validSelector = selector.includes('class="') ? selector.replace('class="', '.').replace('"', '') :
                        selector.includes('id="') ? selector.replace('id="', '#').replace('"', '') : selector;
    const result = cssSelect.selectOne(validSelector, parsedStyles.stylesheet.rules);
    console.log(result ? `Found: '${validSelector}'` : `Not found: '${validSelector}'`);
  });
}

async function main() {
  const selectors = fs.readFileSync(process.argv[2], 'utf8').split('\n');

  for (let i = 3; i < process.argv.length; i++) {
    if (process.argv[i].startsWith('http://') || process.argv[i].startsWith('https://')) {
      const cssContents = await loadCSSFromHTML(process.argv[i]);
      cssContents.forEach(cssContent => processCSSContent(cssContent, selectors));
    } else {
      const cssContent = fs.readFileSync(process.argv[i], 'utf8');
      processCSSContent(cssContent, selectors);
    }
  }
}

main();
