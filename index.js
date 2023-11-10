#!/usr/bin/env node

const assert = require('assert')

const tree = {}

const print = (obj) => console.log(JSON.stringify(obj, null, 2))

const expandNode = (prefix, node) => {
  let suggestions = []
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === 'object') {
      suggestions = [...suggestions, ...expandNode(prefix + k, v)]
    } else {
      suggestions = [...suggestions, {
        value: prefix,
        count: v,
      }]
    }
  }
  return suggestions
}

const cache = {}

const suggest = (prefix) => {
  let node = tree

  prefix.split('').map((letter, i, all) => {
    const nextNode = node[letter] || {}
    if (i === all.length - 1) {
      // assume this is a new word we're learning
      nextNode['.'] = (nextNode['.'] || 0) + 1
    }
    node[letter] = nextNode
    node = nextNode
  })
  // TODO: Use the cache while also updating the count.
  // if (prefix in cache) {
  //   console.log('cached')
  //   return cache[prefix]
  // }
  const result = expandNode(prefix, node)
    .filter(x => x.value !== prefix)
    .sort((a, b) => b.count - a.count)
    .map(x => x.value)
  cache[prefix] = result
  return result
}

// /--------------------------------------------------------------------------------/
// initial state
// /--------------------------------------------------------------------------------/
[
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
].map(word => suggest(word))


// /--------------------------------------------------------------------------------/
// tests
// /--------------------------------------------------------------------------------/

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

// suggest by popularity
suggest('beans')
suggest('beer')
actual = suggest('be')
expected = ['beans', 'beer']
assert.deepEqual(actual, expected)
suggest('beer')
actual = suggest('be')
expected = ['beer', 'beans']
assert.deepEqual(actual, expected)

// caching
for (let i = 0; i < 100; i++) {
  let start = process.hrtime.bigint()
  suggest('la')
  const first = process.hrtime.bigint() - start
  start = process.hrtime.bigint()
  suggest('la')
  const second = process.hrtime.bigint() - start
  // assert(second < first, 'second call should be faster')
}
