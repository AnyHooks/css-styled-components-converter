const puppeteer = require('puppeteer');

async function extractCSS(url) {
  console.log(`Iniciando o Puppeteer para a URL: ${url}`);
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url);
  console.log("Página carregada");

  // Extrair links de CSS
  const cssLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    return links.map(link => link.href);
  });
  console.log(`Links de CSS encontrados: ${cssLinks.length}`);

  // Carregar e exibir o conteúdo CSS
  for (const link of cssLinks) {
    console.log(`Carregando CSS de: ${link}`);
    const cssContent = await page.goto(link).then(response => response.text());
    console.log(`Conteúdo CSS de ${link}:`);
    console.log(cssContent);
  }

  console.log("Fechando o navegador");
  await browser.close();
}

extractCSS('https://portaldatransparencia.gov.br/beneficios/beneficiario/consulta?paginacaoSimples=true&tamanhoPagina=&offset=&direcaoOrdenacao=asc&ano=2023&tipoBeneficio=6&colunasSelecionadas=linkDetalhamento%2CnomeBeneficiario%2ClinguagemCidada%2CnisBeneficio%2CcpfBeneficiario%2Cmunicipio%2Cano%2Cvalor&ordenarPor=nomeBeneficiario&direcao=asc');
