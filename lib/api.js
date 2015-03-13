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

module.exports = function (dust) {
    var request = require('request');

    if (!dust) {
        throw new Error('Parameter "dust" is not defined.');
    }

    dust.helpers = dust.helpers || {};


    function requestResource(uri, cb) {
        request({
            method: 'GET',
            uri: uri,
            json: true
        }, function (error, response, body) {
            if (!error || response.statusCode === 200) {
                return cb(null, body);
            }
            cb(new Error('Unable to make request to ' + uri));
        });
    }

    dust.helpers.api = function (chunk, context, bodies, params) {
        var resource = dust.helpers.tap(params.resource, chunk, context),
            cursor;

        cursor = chunk.map(function (chunk) {
            requestResource(resource, function (err, data) {
                var obj = {},
                    cur;

                if (err) {
                    console.log(err);
                    return chunk.end('Error: Unable to fetch data from resource');
                }

                if (data.length) {
                    obj.items = data;
                } else {
                    obj = data;
                }

                cur = chunk.render(bodies.block, context.push(obj));
                cur.flushable = true;

                return chunk.end();
            });
        });

        cursor.flushable = true;

        return cursor;
    };
};