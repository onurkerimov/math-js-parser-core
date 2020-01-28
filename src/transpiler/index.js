import functionExcluder from './functionExcluder'
import expressionWrapper from './expressionWrapper'
import blockWrapper from './blockWrapper'
import lineMapper from './lineMapper'

export default string => {
  let excludedFunctions = functionExcluder(string)
  let wrappedExpressions = expressionWrapper(excludedFunctions)
  let wrappedBlocks = blockWrapper(wrappedExpressions)
  let outputString = lineMapper(wrappedBlocks)
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
