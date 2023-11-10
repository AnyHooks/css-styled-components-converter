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
    // Convert the string into a valid CSS selector
    const validSelector = selector.replace('class="', '.').replace('"', '');
  
    try {
      const result = cssSelect.selectOne(validSelector, parsedStyles.stylesheet.rules);
      if (result) {
        console.log(`Found: '${validSelector}'`);
      } else {
        console.log(`Not found: '${validSelector}'`);
      }
    } catch (error) {
      console.error(`Error processing selector '${validSelector}': ${error.message}`);
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

