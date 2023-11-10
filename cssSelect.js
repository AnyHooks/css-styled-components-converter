const fs = require('fs');
const css = require('css');
const cssSelect = require('css-select');

// Read and parse the CSS file
const cssContent = fs.readFileSync(process.argv[3], 'utf8');
const parsedStyles = css.parse(cssContent);

// Read the text file with selectors
const selectors = fs.readFileSync(process.argv[2], 'utf8').split('\n');

// Process each selector
selectors.forEach(selector => {
  const result = cssSelect.selectOne(selector, parsedStyles.stylesheet.rules);
  if (result) {
    console.log(`Found: '${selector}'`);
  } else {
    console.log(`Not found: '${selector}'`);
  }
});

// Additional CSS file if needed
const additionalCssContent = fs.readFileSync(process.argv[4], 'utf8');
const additionalParsedStyles = css.parse(additionalCssContent);

// Repeat the process for the additional CSS file
selectors.forEach(selector => {
  const result = cssSelect.selectOne(selector, additionalParsedStyles.stylesheet.rules);
  if (result) {
    console.log(`Found in additional CSS: '${selector}'`);
  }
});

