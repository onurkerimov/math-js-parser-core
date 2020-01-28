//import { _, _start, _end, _multi, _line } from '../bootstrap'
import { create, all } from 'mathjs'
const math = create(all)
const parser = math.parser()

const generateHashInner = () => {
  return '_' + Math.random().toString(36).substring(2, 15)
}

const generateHash = (scope) => {
  let hash = generateHashInner()
  if(scope[hash] !== undefined) return generateHash()
  else return hash
}

const _start = () => {}
const _end = () => {}
const _line = () => {}
const _ = (array, ...holes) => {
  let scope = parser.scope
  let string = array[0]
  holes.forEach((hole, i) => {
    let hash = generateHash(scope)
    scope[hash] = hole
    string += hash + array[i + 1]
  })
  console.log(parser)
  parser.evaluate(string)
}

_`map([1,2,4,5,6], ${elem => {
  _start()
  _line(8)
  console.log(elem)
  _line(9)
  _end()
}})`
_line(10)
