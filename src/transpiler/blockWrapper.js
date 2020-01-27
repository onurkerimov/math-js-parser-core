const walk = require("acorn-walk");

export default rootNode => {
  var patches = [];
  walk.full(rootNode, node => {
    switch (node.type) {
      case "WhileStatement":
      case "ForStatement":
      case "IfStatement":
      case "ForInStatement":
      case "DoWhileStatement":
      case "ForOfStatement":
        patches.push({
          pos: node.start,
          str: "_start();"
        });
        patches.push({
          pos: node.end,
          str: ";_end()"
        });
        break;
      case "BlockStatement":
        patches.push({
          pos: node.start + 1,
          str: "_start();"
        });
        patches.push({
          pos: node.end - 1,
          str: ";_end()"
        });
        break;
      default:
        break;
    }
  });
  return patches;
};
