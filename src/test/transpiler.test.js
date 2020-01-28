import transform from '../transpiler'
import testString from './transpiler.txt'

let pre = document.createElement('pre')
pre.innerHTML = testString
document.body.appendChild(pre)

console.log(transform(testString))