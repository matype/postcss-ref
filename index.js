var postcss = require('postcss')

module.exports = postcss.plugin('postcss-ref', function () {
    return function (root) {
        root.walkAtRules('ref', function (atrule) {
            var params = atrule.params.split(',')
            var selector = params[0].trim()
            var refedProperty = params[1].trim()
            var newProperty = params.length === 3 ? params[2].trim() : refedProperty
            var newValue = lookUpProperty(root, selector, refedProperty)

            replaceAtRef(atrule, {
                prop: newProperty,
                value: newValue
            })
        })
    }
})

function isCustomProperty (property) {
    return /^--/.test(property)
}

function lookUpProperty (root, selector, refedProperty) {
    var ret
    root.walkRules(selector, function (rule) {
        rule.walkDecls(refedProperty, function (decl) {
            ret = isCustomProperty(refedProperty) ? ret = 'var(' + refedProperty + ')' : decl.value
        })
    })

    return ret
}

function replaceAtRef (atrule, newDecl) {
    if (atrule.parent.type === 'rule') {
        atrule.parent.insertBefore(atrule, newDecl)
    }
    atrule.remove()
}
