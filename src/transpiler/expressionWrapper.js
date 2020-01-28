import Foldmaker, { tokenize, flatten } from 'foldmaker'

let REGEX = /^(if|else|while|for)$/

export default (string, settings = {}) => {
  let tokens = tokenize(
    string.replace(/\r\n/g, '\n').replace(/\t/g, ' '),
    [
      ['c', /(\/\/).*?(?=[\n$])/], // Comment
      ['m', /\/\*[\s\S]*?\*\//], // Multiline comment
      ['e', /(['"])(\\\1|[\s\S])*?\1/], // String
      ['f', /@@[\s\S]*?@@/], // Function, to be ignored
      ['e', /(\[.*?\])/], // Array
      ['s', /[\{\}\(\),;]/], // { } ( ) , ; remains unchanged
      [' ', / +/], // Space
      ['\n', /[\n]+/], // Newline
      ['i', /[\w$]+/], // Identifier or keyword
      ['e', /[\s\S]/] // Unknown
    ],
    ({ type, value }) => {
      if (type === 'i') type = REGEX.test(value) ? 'k' : 'e'
      else if (type === 's') type = value
      else if (type === 'c') value = '/*' + value.substring(2) + ' */'
      else if (type === 'f') return { type: 'e', value: '${' + value.substring(2, value.length-2) + '}' }
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
        return '_`' + val.trim() + '`'
      })
      .flatten()
      .join('')
  )
}

