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
            options = optionsParser(resource),
            cursor;

        if (key) {
            chunk.write(options[key]);
            return chunk;
        }

        cursor = chunk.map(function (chunk) {
            var arr = Object.keys(options).map(function (key) {
                    return {
                        key: key,
                        value: options[key]
                    };
                }),
                cur;

            if (bodies.block) {
                cur = chunk.render(bodies.block, context.push({
                    items: arr
                }));
                cur.flushable = true;
            }

            return chunk.end();
        });

        cursor.flushable = true;

        return cursor;
    };
};