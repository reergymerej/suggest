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

const suggest = (prefix) => {
  let node = tree
  prefix.split('').map((letter, i, all) => {
    const nextNode = node[letter] || {}
    if (i === all.length - 1) {
      // assume this is a new word we're learning
      nextNode['.'] = 1
    }
    node[letter] = nextNode
    node = nextNode
  })
  return expandNode(prefix, node)
    .filter(x => x !== prefix)
    .sort()
}

words.map(word => suggest(word))



// happy path
let actual = suggest('las')
let expected = [
  'laser',
  'laserbeam',
  'laserface',
  'lasergun',
]
assert.deepEqual(actual, expected)

// missing value
actual = suggest('juic')
expected = []
assert.deepEqual(actual, expected)

// build tree as values are asked for
actual = suggest('kiwi')
expected = []
assert.deepEqual(actual, expected)
actual = suggest('k')
expected = ['kiwi']
assert.deepEqual(actual, expected)


