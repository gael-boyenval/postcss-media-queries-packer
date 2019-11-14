let postcss = require('postcss')
let startPacking = false
let atRules = {}

function addToAtRules (atRule) {
  const key = atRule.params

  if (!atRules[key]) {
    atRules[key] = postcss.atRule({ name: atRule.name, params: atRule.params })
  }
  atRule.nodes.forEach(node => {
    atRules[key].append(node.clone())
  })

  atRule.remove()
}

module.exports = postcss.plugin('postcss-media-queries-packer', () => root => {
  root.walk(node => {
    if (node.type === 'comment' && node.text === 'mqp:start') {
      startPacking = true
      node.remove()
    }

    if (node.type === 'comment' && node.text === 'mqp:end') {
      startPacking = false
    }

    if (node.type === 'atrule' && startPacking === true) {
      addToAtRules(node)
    }

    if (
      node.type === 'comment' &&
        node.text === 'mqp:end' &&
        startPacking === false
    ) {
      Object.keys(atRules).forEach(key => node.before(atRules[key]))
      node.remove()
      atRules = {}
    }
  })
})
