/**
 * @file config edp-webserver
 * @author EFE
 */

/* globals home, redirect, content, empty, autocss, file, less, stylus, proxyNoneExists */

function amdify(context) {
    context.content =  ''
        + 'define(function (require, exports, module) {\n'
        +     context.content
        + '\n});';
}

var babel = require('babel');

var fs = require('fs');
var mime = require('mime');
var path = require('path');

exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;
exports.getLocations = function () {
    return [
        {
            location: /\/$/,
            handler: home('index.html')
        },
        {
            location: /\.jsx\.js($|\?)/,
            handler: [
                function (context) {
                    var docRoot  = context.conf.documentRoot;
                    var pathname = context.request.pathname.replace(/\.js$/, '');
                    var file = path.join(docRoot, pathname);
                    if (fs.existsSync(file)) {
                        context.header['content-type'] = mime.lookup('js');
                        context.content = fs.readFileSync(file, 'utf8');
                    }
                },
                amdify,
                function (context) {
                    try {
                        context.content = babel.transform(context.content).code;
                    }
                    catch (e) {
                        process.stderr.write(e.stack);
                        context.status = 500;
                    }

                }
            ]
        },
        {
            location: function (req) {
                var pathname = req.pathname;
                return pathname.indexOf('/src') === 0 && /\.js($|\?)/.test(pathname);
            },
            handler: [
                file(),
                amdify
            ]
        },
        {
            location: '/empty',
            handler: empty()
        },
        {
            location: /\.css($|\?)/,
            handler: [
                autocss()
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /\.styl($|\?)/,
            handler: [
                file(),
                stylus()
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

/* eslint-disable guard-for-in */
exports.injectResource = function (res) {
    for (var key in res) {
        global[key] = res[key];
    }
};
