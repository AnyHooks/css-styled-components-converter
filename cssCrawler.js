const puppeteer = require('puppeteer');

async function extractCSS(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Extrair links de CSS
  const cssLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    return links.map(link => link.href);
  });

  // Carregar e exibir o conteúdo CSS
  for (const link of cssLinks) {
    const cssContent = await page.goto(link).then(response => response.text());
    console.log(cssContent);
  }

  await browser.close();
}

extractCSS('https://portaldatransparencia.gov.br/beneficios/beneficiario/consulta?paginacaoSimples=true&tamanhoPagina=&offset=&direcaoOrdenacao=asc&ano=2023&tipoBeneficio=6&colunasSelecionadas=linkDetalhamento%2CnomeBeneficiario%2ClinguagemCidada%2CnisBeneficio%2CcpfBeneficiario%2Cmunicipio%2Cano%2Cvalor&ordenarPor=nomeBeneficiario&direcao=asc');
