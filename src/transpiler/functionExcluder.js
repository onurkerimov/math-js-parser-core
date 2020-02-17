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
