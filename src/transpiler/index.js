import functionExcluder from './functionExcluder'
import expressionWrapper from './expressionWrapper'
import blockWrapper from './blockWrapper'

export default string => {
  let excludedFunctions = functionExcluder(string)
  let [wrappedExpressions, richString] = expressionWrapper(excludedFunctions)
  let wrappedBlocks = blockWrapper(wrappedExpressions)
  return [wrappedExpressions, richString]
}
