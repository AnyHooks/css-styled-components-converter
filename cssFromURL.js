const fs = require('fs');
const css = require('css');
const cssSelect = require('css-select');
const axios = require('axios');
const cheerio = require('cheerio');

async function loadCSSFromURL(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Erro ao carregar CSS de ${url}: ${error.message}`);
        return '';
    }
}

async function loadAndParseCSS(url) {
    const cssData = await loadCSSFromURL(url);
    return css.parse(cssData);
}

async function processCSSContent(parsedCSS, selectors) {
    selectors.forEach(selector => {
        let validSelector = selector.includes('class="') ? selector.replace('class="', '.').replace('"', '') :
                            selector.includes('id="') ? selector.replace('id="', '#').replace('"', '') : selector;
        const result = cssSelect.selectOne(validSelector, parsedCSS.stylesheet.rules);
        console.log(result ? `Found: '${validSelector}'` : `Not found: '${validSelector}'`);
    });
}

async function main() {
    const selectors = fs.readFileSync(process.argv[2], 'utf8').split('\n');

    for (let i = 3; i < process.argv.length; i++) {
        if (process.argv[i].startsWith('http://') || process.argv[i].startsWith('https://')) {
            const parsedCSS = await loadAndParseCSS(process.argv[i]);
            await processCSSContent(parsedCSS, selectors);
        } else {
            const cssContent = fs.readFileSync(process.argv[i], 'utf8');
            const parsedCSS = css.parse(cssContent);
            await processCSSContent(parsedCSS, selectors);
        }
    }
}

main();
