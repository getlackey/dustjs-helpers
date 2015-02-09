/*jslint node:true, unparam:true*/
'use strict';

var optionsParser = require('lackey-options-parser');

module.exports = function (dust) {
    if (!dust) {
        throw new Error('Parameter "dust" is not defined.');
    }

    dust.helpers = dust.helpers || {};

    dust.helpers.options = function (chunk, context, bodies, params) {
        var resource = dust.helpers.tap(params.resource, chunk, context),
            key = dust.helpers.tap(params.key, chunk, context),
            options = optionsParser(resource);

        chunk.write(options[key]);

        return chunk;
    };
};