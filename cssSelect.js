const fs = require('fs');
const css = require('css');
const cssSelect = require('css-select');

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
