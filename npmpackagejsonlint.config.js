'use strict';

module.exports = {
    extends: '@busybox/npm-package-json-lint-config',
    overrides: [
        {
            patterns: ['apps/**/package.json'],
            rules: {
                'require-repository': 'error',
                'require-repository-directory': 'error'
            },
        },
    ],
};