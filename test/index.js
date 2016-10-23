var fs = require('fs')
var test = require('tape')
var postcss = require('postcss')
var ref = require('..')

function fixture (name) {
    return fs.readFileSync('test/fixtures/' + name + '.css', 'utf-8').trim()
}

function output (name) {
    return fs.readFileSync('test/fixtures/' + name + '.out.css', 'utf-8').trim()
}

function compare (name) {
    return test(name, function (t) {
        var res = postcss().use(ref()).process(fixture(name)).css.trim()
        t.same(res, output(name))
        t.end()
    })
}

compare('simple')
compare('same-rules')
compare('specify-property')
compare('custom-properties')
compare('nested-selector')
