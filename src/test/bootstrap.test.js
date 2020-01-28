//import { _, _start, _end, _multi, _line } from '../bootstrap'
import { create, all } from 'mathjs'
const math = create(all)

/* prettier-ignore */
math.import({
  print: el => {
    if (el._toString) el = el._toString()
    console.log(el)
  }
}, { override: true })

const options = { noError: true }

const generateHashInner = () => {
  /* prettier-ignore */
  return '_' + Math.random().toString(36).substring(2, 15)
}

const generateHash = scope => {
  let hash = generateHashInner()
  if (scope[hash] !== undefined) return generateHash()
  else return hash
}

class Parser {
  constructor() {
    this.scope = {}
    this.inherited = {}
    this.parentScopes = []
    this.parentInherited = []
    this.currentLine = 1
  }

  start() {
    // Clone the scope and move there
    this.parentScopes.push(this.scope)
    this.scope = { ...this.scope }
    this.parentInherited.push(this.inherited)
    this.inherited = { ...this.inherited }
  }

  end() {
    // Return to previously declared scope
    let overrides = {}
    //Object.keys(this.inherited).forEach(key => {
    //  overrides[key] = this.scope[key]
    //})
    this.scope = { ...this.parentScopes.pop(), ...overrides }
    this.inherited = this.parentInherited.pop()
  }

  line(number) {
    this.currentLine = number
  }

  evaluate(array, ...holes) {
    // Build the new string with hashes
    let string = array[0]
    holes.forEach((hole, i) => {
      let hash = generateHash(this.scope)
      string += hash + array[i + 1]
      // also pollute the current scope with hashes
      this.scope[hash] = hole
    })

    // if (string.substring(0, 4) === 'let ') {
    //   string = string.substring(4)
    //   let node = math.parse(string) }

    //try {
    //let newString = this._letWorker(string)
    let node = math.parse(string)
    // Checks if we are also modifying one of parent block's variables
    this._assignmentWorker(node)
    node.compile().evaluate(this.scope)
    //} catch (err) {
    //  this._error(err.message + ' at line ' + this.currentLine)
    //}
  }

  _assignmentWorker(node) {
    if (node.type === 'AssignmentNode') {
      let name = node.object.name
      if (this.inherited[name]) {
      } else {
        let parent = this.parentScopes[this.parentScopes.length - 1]
        if (parent[name]) this.inherited[name] = true
      }
    }
  }

  _error(message) {
    if (options.noError) console.error(message)
    else throw new Error(message)
  }
}

const parser = new Parser()
const _start = parser.start.bind(parser)
const _end = parser.end.bind(parser)
const _line = parser.line.bind(parser)
const _ = parser.evaluate.bind(parser)

/* prettier-ignore */
{
// _`print(mahmut)`;_line(2)
// _start();_line(3)
// _`mahmut = 25`;_line(4)
// _`print(mahmut)`;_line(5)
// _end();_line(6)
// _`print(mahmut)`;_line(7)  
}

/* prettier-ignore */
{
_start();
_`mahmut = 25`
      _start();

              _start();
              _`mahmut = 1`
              _`ali = 5`
              _`print(mahmut)`;
              _end();
      _`print(mahmut)`; 
      _end();
_`print(mahmut)`; 
_`print(ali)`; 
  // _start();for (_`j = 0`; _`j < 5`; _`j = j+1`) {_start();_line(2)
  //   _start();if(_`1000 m === 1 km`) _`print('YAY')`;_end();_line(3)
  // ;_end()};_end();_line(4)

}
