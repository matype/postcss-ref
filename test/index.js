var fs = require('fs')
var test = require('tape')
var postcss = require('postcss')
var ref = require('..')

function fixture (name, atRule) {
    var folder = atRule ? 'atrule/' : 'function/'

    return fs.readFileSync('test/fixtures/' + folder + name + '.css', 'utf-8').trim()
}

function output (name, atRule) {
    var folder = atRule ? 'atrule/' : 'function/'

    return fs.readFileSync('test/fixtures/' + folder + name + '.out.css', 'utf-8').trim()
}

function compare (name, atRule) {
    return test(name, function (t) {
        var res = postcss().use(ref({ atRule: atRule })).process(fixture(name, atRule)).css.trim()
        t.same(res, output(name, atRule))
        t.end()
    })
}

// At rules
compare('simple', true)
compare('same-rules', true)
compare('specify-property', true)
compare('custom-properties', true)
compare('nested-selector', true)
compare('nested-media-selector', true)

// Functions
compare('simple', false)
compare('same-rules', false)
compare('specify-property', false)
compare('custom-properties', false)
compare('nested-selector', false)
compare('nested-media-selector', false)
