var postcss = require('postcss')

module.exports = postcss.plugin('postcss-ref', function (opts) {
    opts = opts || { atRule: true }

    return function (root) {
        if (opts.atRule) {
            root.walkAtRules('ref', function (atrule) {
                var params = atrule.params.split(',')
                var selector = params[0].trim()
                var refedProperty = params[1].trim()
                var newProperty = params.length === 3 ? params[2].trim() : refedProperty

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
        } else {
            var ruleCache = {}
            var refCache = []

            root.walk(function (node) {
                var type = node.type

                if (type === 'rule') {
                    ruleCache[node.selector] = node
                } else if (type === 'decl') {
                    if (node.value.indexOf('ref(') !== -1) {
                        refCache.push(node)
                    }
                }
            })

            refCache.forEach(function(decl) {
                var match = decl.value.match(/ref\((.*), (.*)\)/)
                var selector = match[1]
                var refedProperty = match[2]

                var wantedSelector = ruleCache[selector]

                var newValue

                wantedSelector.nodes.forEach(function(decl) {
                    newValue = decl.value

                    if (isCustomProperty(refedProperty)) {
                        newValue = 'var(' + refedProperty + ')'
                    }
                })

                decl.value = newValue
            })
        }
    }
})

function isCustomProperty(property) {
    return /^--/.test(property)
}
