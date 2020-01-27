import Foldmaker, { tokenize, flatten } from 'foldmaker'

let REGEX = /^(if|else|while|for)$/

export default (string, settings = {}) => {
  let tokens = tokenize(
    string.replace(/\r\n/g, '\n'),
    [
      ['c', /(\/\/).*?(?=[\n$])/], // Comment
      ['m', /\/\*[\s\S]*?\*\//], // Multiline comment
      ['e', /(['"])(\\\1|[\s\S])*?\1/], // String
      ['e', /(\[.*?\])/], // Array
      ['s', /[\{\}\(\),;]/], // { } ( ) , ; remains unchanged
      [' ', /[ \t]+/], // Space
      ['\n', /[\n]+/], // Newline
      ['i', /[\w$]+/], // Identifier or keyword
      ['e', /[\s\S]/] // Unknown
    ],
    ({ type, value }) => {
      if (type === 'i') type = REGEX.test(value) ? 'k' : 'e'
      else if (type === 's') type = value
      else if (type === 'c') value = '/*' + value.substring(2) + ' */'
      return { type, value }
    }
  )

  return (
    Foldmaker(tokens)
      // join expressions together
      .parse(/e[e, ]+|e\([e, \n]*?\)/, result => {
        if (result[0].includes('\n'))
          result = flatten(result[0])
            .join('')
            .replace(/\n/g, '${_multi}\n')
        return ['e', result]
      })
      // wrap expressions
      .parse(/e/, result => {
        let val = flatten(result[0]).join('')
        return '_(`' + val.trim() + '`)'
      })
      .flatten()
      .join('')
  )
}
