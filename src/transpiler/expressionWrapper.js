import Foldmaker, { tokenize, visitor } from 'foldmaker'

let REGEX = /^(if|else|while|for)$/
let lineNumbers = true

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
      ['\n', /\n/], // Newline
      ['i', /[\w$]+/], // Identifier or keyword
      ['e', /[\s\S]/] // Unknown
    ],
    ({ type, value }) => {
      if (type === 'i') type = REGEX.test(value) ? 'k' : 'e'
      else if (type === 's') type = value
      else if (type === 'c') value = '/*' + value.substring(2) + ' */'
      else if (type === 'f') return { type: 'e', value: '${' + value.substring(2, value.length - 2) + '}' }
      return { type, value }
    }
  )

  let i = 1

  let fm = Foldmaker(tokens)
    // join expressions together
    .parse(/e[e, ]+|e\([e, \n]*?\)/, result => {
      let e = result[0].includes('\n')
        ? result[0].join('') //.replace(/\n/g, 'MOO\n')
        : result[0].join('')
      return ['e', e]
    })
    // wrap expressions
    .replace([
      visitor(/e/, result => {
        let val = result[0].join('')
        return '_`' + val.trim() + '`'
      }),
      visitor(/\n/, result => {
        if (lineNumbers) return '_line()\n;'
        else return '\n'
      })
    ])

  let str = fm.array.join('').replace(/(_line\(\))?\n/g, (result, hasLine) => {
    i++
    //if(lineNumbers) return hasLine ? `;_line(${i})\n` : '\n'
    //else
    return result
  })
  return [str, fm]
}
