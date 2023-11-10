#!/usr/bin/env node

const assert = require('assert')

const words = [
  'lady',
  'ladybird',
  'land',
  'laser',
  'laserbeam',
  'laserface',
  'lasergun',
  'lemon',
  'lemons',
  'less',
  'lesson',
  'lord',
  'lordhuron',
]

let tree = {}

words.map(word => {
  let node = tree
  word.split('').map((letter, i, all) => {
    const nextNode = node[letter] || {}
    if (i === all.length - 1) {
      nextNode['.'] = 1
    }
    node[letter] = nextNode
    node = node[letter]
  })
})


const print = (obj) => console.log(JSON.stringify(obj, null, 2))

const expandNode = (prefix, node) => {
  let words = []
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === 'object') {
      words = [...words, ...expandNode(prefix + k, v)]
    } else {
      words = [...words, prefix]
    }
  }
  return words
}

const suggest = (tree, prefix) => {
  let node = tree
  prefix.split('').map(letter => {
    node = node[letter]
  })
  // TODO: bail when we have no suggestions
  return expandNode(prefix, node)
}

const actual = suggest(tree, 'las')
const expected = [
  'laser',
  'laserbeam',
  'laserface',
  'lasergun',
]
assert.deepEqual(actual, expected)
