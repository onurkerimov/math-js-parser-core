import expressionWrapper from './expressionWrapper'
import * as acornLoose from 'acorn-loose'
import blockWrapper from './blockWrapper'
import { applyPatches } from './utils'

export default string => {
  let wrappedExpressions = expressionWrapper(string)
  let acornNodes = acornLoose.parse(wrappedExpressions)
  let patches = blockWrapper(acornNodes)
  let outputString = applyPatches(wrappedExpressions, patches)
  return outputString  
}


// let conditions = [
//   node => {
//     return node.type === "FunctionDeclaration";
//   },
//   node => {
//     let validTypes = ["FunctionExpression", "ArrowFunctionExpression"];
//     return (
//       node.type === "VariableDeclaration" &&
//       node.declarations &&
//       validTypes.includes(node.declarations[0].init.type)
//     );
//   }
// ];
// const getTopLevelFunctions = node => {
//   return node.body.filter(node => conditions.some(fn => fn(node)));
// };

// let RootNode = acornLoose.parse(input);
// let topLevelFunctions = getTopLevelFunctions(RootNode);

// topLevelFunctions.forEach(node => {
//   console.log(node)
// })
