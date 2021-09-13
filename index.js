const fs = require('fs')
const path = require('path')
const core = require('@actions/core');

const processIncludes = fileName => {
    try {
        const currentPath = path.dirname(fileName);
        const fileContent = fs.readFileSync(fileName, 'utf8');

        core.info("processing file: " + fileName);

        return fileContent.replace(/^#include "([^"]+)"/m, (match, includeFile) => {
            const realPath = path.resolve(currentPath + '/' + includeFile);
            core.info('#include "'+ includeFile +'"');
            return processIncludes(realPath);
        });

    } catch (err) {
        process.stderr.write(err);
        process.exit(1);
    }
};

const inputFile = core.getInput('input');
const outputFile = core.getInput('output');

const processed = processIncludes(inputFile);

core.info("Writing processed file contents to: "+ outputFile);
core.info(processed);

fs.writeFileSync(outputFile, processed);
