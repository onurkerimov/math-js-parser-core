import * as acornLoose from 'acorn-loose/dist/acorn-loose.js'
import * as acornWalk from 'acorn-walk'
import { applyPatches } from './utils'

export default string => {
  let patches = []
  const addPatch = (pos, str) => patches.push({ pos, str })
  let acornNodes = acornLoose.parse(string)

  acornWalk.full(acornNodes, node => {
    if (
      [
        'WhileStatement',
        'ForStatement',
        'IfStatement',
        'ForInStatement',
        'DoWhileStatement',
        'ForOfStatement'
      ].includes(node.type)
    ) {
      let wrapBlock = (node.body && node.body.type !== 'BlockStatement') 
      addPatch(node.start, '_start();')
      if(wrapBlock) addPatch(node.body.start, '{_start();')
      addPatch(node.end, wrapBlock ? ';_end()};_end();': ';_end();')

    } else if(node.type === 'BlockStatement') {
      let pos1 = node.start+1
      let pos2 = node.end-1
      if(pos1 !== pos2) {
        addPatch(pos1, '_start();')
        addPatch(pos2, ';_end()')
      } else {
        addPatch(pos1, '_start();end()')
      }
  
    }
  })
  return applyPatches(string, patches)
}
