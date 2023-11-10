#!/usr/bin/env node

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


console.log(JSON.stringify(tree, null, 2))
