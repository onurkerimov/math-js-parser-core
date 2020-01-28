import * as acornLoose from 'acorn-loose/dist/acorn-loose.js'
import * as acornWalk from 'acorn-walk'
import { applyPatches } from './utils'

export default string => {
  let patches = [];  
  let acornNodes = acornLoose.parse(string)

  acornWalk.full(acornNodes, node => {
    switch (node.type) {
      case "WhileStatement":
      case "ForStatement":
      case "IfStatement":
      case "ForInStatement":
      case "DoWhileStatement":
      case "ForOfStatement":
        patches.push({
          pos: node.start,
          str: "_start();"
        });
        patches.push({
          pos: node.end,
          str: ";_end()"
        });
        break;
      case "BlockStatement":
        patches.push({
          pos: node.start + 1,
          str: "_start();"
        });
        patches.push({
          pos: node.end - 1,
          str: ";_end()"
        });
        break;
      default:
        break;
    }
  });
  return applyPatches(string, patches);
};
