/*jslint node:true, unparam:true*/
'use strict';
/*
    Copyright 2015 Enigma Marketing Services Limited

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

var path = require('path');

module.exports = function (dust) {
    var allowedParams = ['find', 'select', 'sort', 'limit', 'populate'];

    if (!dust) {
        throw new Error('Parameter "dust" is not defined.');
    }

    dust.helpers = dust.helpers || {};

    dust.helpers.mongoose = function (chunk, context, bodies, params) {
        var Model,
            query,
            cursor;

        // build query
        if (!params.model) {
            return chunk;
        }
        if (!bodies.block) {
            return chunk;
        }

        try {
            Model = require(path.join(process.cwd(), params.model));
        } catch (e) {
            return chunk.write('Error: The model "' + params.model + '" doesn\'t exist');
        }

        allowedParams.forEach(function (param) {
            var val = dust.helpers.tap(params[param], chunk, context);

            if (!val && param === 'populate') {
                return;
            }

            if (['find', 'sort'].indexOf(param) > -1) {
                if (val) {
                    try {
                        val = JSON.parse(val.replace(/'/g, '"'));
                    } catch (ignore) {}
                }
            }

            query = (query || Model)[param](val);
        });

        // render
        cursor = chunk.map(function (chunk) {
            query.lean(true).exec(function (err, data) {
                var obj = {},
                    cur;

                if (err) {
                    return chunk.end('Error: Unable to fetch data from Database');
                }

                obj.items = data;
                cur = chunk.render(bodies.block, context.push(obj));
                cur.flushable = true;
                return chunk.end();
            });
        });

        cursor.flushable = true;
        return cursor;
    };
};