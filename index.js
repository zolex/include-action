const fs = require('fs')
const path = require('path')
const core = require('@actions/core');

const processIncludes = fileName => {
    try {
        const currentPath = path.dirname(fileName);
        core.info("current path: " + currentPath);
        core.info("read file: " + fileName);

        const fileContent = fs.readFileSync(fileName, 'utf8');

        return fileContent.replace(/^#include "([^"]+)"/m, (match, includeFile) => {
            const realPath = path.resolve(currentPath + '/' + includeFile);
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
fs.writeFileSync(outputFile, processed);
