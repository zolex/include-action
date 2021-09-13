const fs = require('fs')
const path = require('path')
const process = require('process')
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
        core.error(err);
        process.exit(1);
    }
};

const inputFile = core.getInput('input') || process.argv[2];
const outputFile = core.getInput('output') || process.argv[3];
const writeContent = content => {
    if (outputFile) {
        fs.writeFileSync(outputFile, content);
        core.info("Writing processed file contents to: "+ outputFile);
    }

    core.info(processed);
};

const processed = processIncludes(inputFile);
writeContent(processed);
