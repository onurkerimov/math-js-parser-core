export const applyPatches = (string, patches) => {
  patches
    .sort(function(a, b) {
      return b.pos - a.pos
    })
    .forEach(function(patch) {
      string = string.slice(0, patch.pos) + patch.str + string.slice(patch.pos)
    })
  return string
}

export const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
