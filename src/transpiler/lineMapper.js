export default string => {
  let i = 0
  return string
    .replace(/(_multi}\n)|(;?\n)/g, (whole, multiline) => {
      i++
      return multiline ? `_multi(${i})}\n` : `;_line(${i})\n`
    })
}
