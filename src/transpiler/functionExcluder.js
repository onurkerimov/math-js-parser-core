// let conditions = [
//   node => {
//     return node.type === 'FunctionDeclaration'
//   },
//   node => {
//     let validTypes = ['FunctionExpression', 'ArrowFunctionExpression']
//     return (
//       node.type === 'VariableDeclaration' &&
//       node.declarations &&
//       validTypes.includes(node.declarations[0].init.type)
//     )
//   }
// ]

// const getTopLevelFunctions = node => {
//   return node.body.filter(node => conditions.some(fn => fn(node)))
// }

// let RootNode = acornLoose.parse(input)
// let topLevelFunctions = getTopLevelFunctions(RootNode)

// topLevelFunctions.forEach(node => {
//   console.log(node)
// })

import * as acornLoose from 'acorn-loose/dist/acorn-loose.js'
import * as acornWalk from 'acorn-walk'
import { applyPatches } from './utils'

export default string => {
  let patches = []
  let acornNodes = acornLoose.parse(string)

  acornWalk.full(acornNodes, node => {
    switch (node.type) {
      case 'FunctionExpression':
      case 'ArrowFunctionExpression':
        patches.push({
          pos: node.start,
          str: "@@"
        });
        patches.push({
          pos: node.end,
          str: "@@"
        });
        break
      default:
        break
    }
  })
  return applyPatches(string, patches)
}
