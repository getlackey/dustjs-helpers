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

var optionsParser = require('lackey-options-parser');

module.exports = function (dust) {
    if (!dust) {
        throw new Error('Parameter "dust" is not defined.');
    }

    dust.helpers = dust.helpers || {};

    dust.helpers.var = function (chunk, context, bodies, params) {
        var name = dust.helpers.tap(params.name, chunk, context),
            model = dust.helpers.tap(params.model, chunk, context),
            type = dust.helpers.tap(params.type, chunk, context) || 'text',
            options = dust.helpers.tap(params.options, chunk, context), //used in type="select"
            isEdit = context.get('isEdit'),
            isCMS = context.get('isCMS'),
            cursor,
            itemKey,
            html = '';

        if (options) {
            // we need to parse the options just in case it's
            // a json file that has to be imported
            options = optionsParser(options);
        }

        function replacePageKey(key) {
            if (name.indexOf('[self]') === -1) {
                return key;
            }

            var url = context.get('url'),
                id = context.get('id'),
                keyParts = [],
                maxI = url.pathname.length,
                i = 0;

            if (url.pathname[maxI - 1] === 'edit') {
                maxI -= 1;
            }

            for (i = 0; i < maxI; i += 1) {
                if (i === 1 && id) {
                    keyParts.push(id);
                } else {
                    keyParts.push(url.pathname[i]);
                }
            }

            if (keyParts.length === 0) {
                keyParts.push('index');
            }
            return key.replace('[self]', keyParts.join('.'));
        }

        function getValue(key) {
            var value,
                keyParts;

            keyParts = key.split('.');

            if (!keyParts.length) {
                return '';
            }

            while (keyParts.length && !value) {
                value = context.get(keyParts.join('.'));
                keyParts.shift();
            }

            return value;
        }

        itemKey = (name && replacePageKey(name)) || model;

        if (isEdit || isCMS) {
            html = '<lk-var';

            if (name) {
                html += ' data-name="' + itemKey + '"';
            }

            if (model) {
                html += ' data-model="' + model + '"';
            }

            html += ' data-type="' + type + '"';

            if (options) {
                html += ' data-options="' + options.toString() + '"';
            }

            if (bodies.block) {
                cursor = chunk.capture(bodies.block, context, function (templateHtml, chunkCapture) {
                    html += '>' + templateHtml + '</lk-var>';
                    chunkCapture.write(html);
                    chunkCapture.end();
                });
                return cursor;
            }

            html += '></lk-var>';
            chunk.write(html);
            return chunk;
        }

        html = getValue(itemKey);
        if (html) {
            chunk.write(html);
        }
        return chunk;
    };
};