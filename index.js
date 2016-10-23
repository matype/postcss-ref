var postcss = require('postcss')

module.exports = postcss.plugin('postcss-ref', function () {
    return function (root) {
        root.walkAtRules('ref', function (atrule) {
            var params = atrule.params.split(' ')
            var selector = params[0]
            var refedProperty = params[1]
            var newProperty = params.length === 3 ? params[2] : refedProperty

            var newValue
            root.walkRules(selector, function (rule) {
                rule.walkDecls(refedProperty, function (decl) {
                    newValue = decl.value
                    if (isCustomProperty(refedProperty)) {
                      newValue = 'var(' + refedProperty + ')'
                    }
                })
            })

            if (atrule.parent.type === 'rule') {
                atrule.parent.insertBefore(atrule, {
                    prop: newProperty,
                    value: newValue
                })
            }

            atrule.remove()
        })
    }
})

function isCustomProperty(property) {
    return /^--/.test(property)
}
