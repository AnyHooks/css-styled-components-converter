const css = require('css');
const cssSelect = require('css-select');

// Parse the CSS file
const parsedStyles = css.parse(yourCssFileContent);

// Extract styles using a selector
const extractedStyles = cssSelect.selectOne('.your-selector', parsedStyles.stylesheet.rules);

// Work with the extracted styles
console.log(extractedStyles);
