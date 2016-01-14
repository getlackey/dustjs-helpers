/*jslint node:true, browser:true, -W030:true */
/*global describe, it */
'use strict';

var should = require('should'),
    contextMockup;

function createDust() {
    var dust = require('dustjs-linkedin');
    dust.helpers = require('dustjs-helpers').helpers;
    return dust;
}

contextMockup = {
    _set: function (name, value) {
        this._mock[name] = value;
    },
    _clean: function () {
        this._mock = {
            "url": {
                "protocol": null,
                "slashes": null,
                "auth": null,
                "host": null,
                "port": null,
                "hostname": null,
                "hash": null,
                "search": null,
                "query": null,
                "pathname": ["path"],
                "path": "/path",
                "href": "/path"
            },
            "req": {
                "query": {},
                "params": {}
            },
            "env": "development",
            "baseUrl": "http://127.0.0.1:8000"
        };
    },
    resolve: function (name) {
        return name;
    },
    get: function (name) {
        return this._mock[name];
    }
};

function Chunk(callback) {

    this._data = '';

    this.write = function (html) {
        this._data += html;
    };

    this.end = function () {
        callback(this._data);
    };

    this.toString = function () {
        return this._data;
    };

    this.capture = function (block, context, callback) {
        callback(block, this);
    };

}


describe('var', function () {

    it('Handle no dust ', function () {
        var error = null;
        try {
            require('./../lib/var')();
        } catch (exception) {
            error = exception;
        }
        should.exist(error);
    });



    it('Should setup', function () {
        var dust = createDust();
        require('./../lib/var')(dust);
        should.exist(dust);
        should.exist(dust.helpers);
        should.exist(dust.helpers.var);
        dust.helpers.var.should.be.Function;
    });



    it('Handle no params', function () {

        var dust = createDust(),
            error = false;

        require('./../lib/var')(dust);
        try {
            dust.helpers.var({}, contextMockup, {}, {});
        } catch (exception) {
            error = exception;
        }
        should.exist(error);
    });

    it('Hanldle invalid name', function () {

        var dust = createDust(),
            chunk = new Chunk(),
            error,
            MOCKUP_TEXT = 'My title';

        contextMockup._clean();
        contextMockup._set('title', MOCKUP_TEXT);

        require('./../lib/var')(dust);
        try {
            chunk = dust.helpers.var(chunk, contextMockup, {}, {
                name: ''
            });
        } catch (exception) {
            error = exception;
        }
        should.exist(error);

    });

    it('Hanldle .title', function () {

        var dust = createDust(),
            chunk = new Chunk(),
            MOCKUP_TEXT = 'My title';

        contextMockup._clean();
        contextMockup._set('title', MOCKUP_TEXT);

        require('./../lib/var')(dust);

        chunk = dust.helpers.var(chunk, contextMockup, {}, {
            name: 'title'
        });

        chunk.toString().should.eql(MOCKUP_TEXT);

    });

    it('Hanldle [self].title', function () {

        var dust = createDust(),
            chunk = new Chunk(),
            MOCKUP_TEXT = 'My title';

        contextMockup._clean();
        contextMockup._set('title', MOCKUP_TEXT);

        require('./../lib/var')(dust);

        chunk = dust.helpers.var(chunk, contextMockup, {}, {
            name: '[self].title'
        });

        chunk.toString().should.eql(MOCKUP_TEXT);

    });

    it('Hanldle title:length', function () {

        var dust = createDust(),
            chunk = new Chunk();

        contextMockup._clean();
        contextMockup._set('length', 12);

        require('./../lib/var')(dust);

        chunk = dust.helpers.var(chunk, contextMockup, {}, {
            name: 'title:length'
        });

        chunk.toString().should.eql('12');

    });

    it('Hanldle title:length (empty path and id)', function () {

        var dust = createDust(),
            chunk = new Chunk();

        contextMockup._clean();
        contextMockup._mock.url.pathname = [];

        require('./../lib/var')(dust);

        chunk = dust.helpers.var(chunk, contextMockup, {}, {
            name: '[self].title'
        });

        chunk.toString().should.eql('');

    });

    it('Hanldle title:length (empty path)', function () {

        var dust = createDust(),
            chunk = new Chunk();

        contextMockup._clean();
        contextMockup._mock.url.pathname.push('more');
        contextMockup._mock.id = 12345;
        contextMockup._set('length', 12);

        require('./../lib/var')(dust);

        chunk = dust.helpers.var(chunk, contextMockup, {}, {
            name: '[self].title.length'
        });
        chunk.toString().should.be.eql('12');

    });

    it('Hanldle isCMS', function () {

        var dust = createDust(),
            chunk = new Chunk(),
            MOCKUP_TEXT = 'My title';

        contextMockup._clean();
        contextMockup._set('title', MOCKUP_TEXT);
        contextMockup._set('isCMS', true);

        require('./../lib/var')(dust);

        chunk = dust.helpers.var(chunk, contextMockup, {}, {
            name: 'title',
            model: 'model',
            placeholder: 'placeholder',
            maxlength: 20,
            hook: 'hook'
        });

        chunk.toString().should.be.eql('<lk-var data-name="title" data-model="model" placeholder="placeholder" maxlength="20" data-type="text" data-hook="hook"></lk-var>');

        //console.log(chunk.toString('12'));

    });

    it('Hanldle isCMS with body', function (done) {

        var dust = createDust(),
            chunk = new Chunk(function () {
                chunk.toString().should.be.eql('<lk-var data-name="title" data-type="text">abc</lk-var>');
                done();
            }),
            MOCKUP_TEXT = 'My title';

        contextMockup._clean();
        contextMockup._set('title', MOCKUP_TEXT);
        contextMockup._set('isCMS', true);

        require('./../lib/var')(dust);

        chunk = dust.helpers.var(chunk, contextMockup, {
            block: 'abc'
        }, {
            name: 'title'
        });

    });

    it('Hanldle isCMS with options', function () {

        var dust = createDust(),
            chunk = new Chunk(),
            MOCKUP_TEXT = 'My title';

        contextMockup._clean();
        contextMockup._set('title', MOCKUP_TEXT);
        contextMockup._set('isCMS', true);

        require('./../lib/var')(dust);

        chunk = dust.helpers.var(chunk, contextMockup, {}, {
            name: 'title',
            type: 'select',
            options: 'opt1 opt2 opt3:testThis'
        });

        chunk.toString().should.be.eql('<lk-var data-name="title" data-type="select" data-options="opt1 opt2 opt3:testThis"></lk-var>');

    });

});
