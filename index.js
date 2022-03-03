const dimensionX = 10;
const dimensionY = 10;

let lockedNodes = [];

const args = process.argv.slice(2);
const lockedNodesArgs = args.slice(4);
const startingPoint = {
  x: args[0],
  y: args[1],
  g: 0,
};
const goalPoint = {
  x: args[2],
  y: args[3],
};

for (let i = 0; i < lockedNodesArgs.length; i += 2) {
  lockedNodes.push([lockedNodesArgs[i], lockedNodesArgs[i + 1]]);
}

let dimensionArray = [];
for (let i = 0; i < dimensionX; i++) {
  dimensionArray.push([]);
}

for (let x = 0; x < dimensionArray.length; x++) {
  for (let y = 0; y < dimensionY; y++) {
    lockedNodes.find((node) => node[0] == x && node[1] == y)
      ? dimensionArray[x].push("═")
      : dimensionArray[x].push("░");
  }
}

if (
  isNaN(startingPoint.x) ||
  isNaN(startingPoint.y) ||
  isNaN(goalPoint.x) ||
  isNaN(goalPoint.y)
)
  throw new Error("Missing or invlid data.");

if (
  (startingPoint.x || goalPoint.x) > dimensionX - 1 ||
  (startingPoint.y || goalPoint.y) > dimensionY - 1
)
  throw new Error("Dimension limits exceded.");

if (startingPoint.x == goalPoint.x && startingPoint.y == goalPoint.y)
  throw new Error("Coordinates must not match.");

dimensionArray[startingPoint.x][startingPoint.y] = "A";
dimensionArray[goalPoint.x][goalPoint.y] = "B";

let currentNode = startingPoint;
let possibleNodes = [];
let pathNodes = [];
let found = false;
pathNodes[0] = startingPoint;

while (!found) {
  currentNode = pathNodes[pathNodes.length - 1];
  for (let x = currentNode.x - 1; x < currentNode.x - 1 + 3; x++) {
    for (let y = currentNode.y - 1; y < currentNode.y - 1 + 3; y++) {
      if (
        x < 0 ||
        y < 0 ||
        x > dimensionX - 1 ||
        y > dimensionY - 1 ||
        (x == currentNode.x && y == currentNode.y)
      )
        continue;
      node = new Node(x, y);
      possibleNodes.push(node);
    }
  }

  chosenNode = possibleNodes
    .filter(
      (node) =>
        !node.locked &&
        !pathNodes.find(
          (pathNode) => pathNode.x == node.x && pathNode.y == node.y
        )
    )
    .reduce((prev, current) => (+prev.f < +current.f ? prev : current));
  console.log(possibleNodes);
  if (chosenNode.h == 0 || chosenNode.g > 500) found = true;
  pathNodes.push(chosenNode);
  possibleNodes = [];
}

pathNodes = pathNodes.slice(1, pathNodes.length - 1);
console.log(pathNodes);

function Node(x, y) {
  this.x = x;
  this.y = y;
  this.g =
    Math.abs(currentNode.x - currentNode.y) == Math.abs(x - y)
      ? 14 + currentNode.g
      : 10 + currentNode.g;
  this.h = Math.floor(
    Math.sqrt(Math.pow(x - goalPoint.x, 2) + Math.pow(y - goalPoint.y, 2)) * 10
  );
  this.f = this.g + this.h;
  this.locked = lockedNodes.find(
    (node) => node[0] == this.x && node[1] == this.y
  )
    ? true
    : false;
}

for (node of pathNodes) {
  dimensionArray[node.x][node.y] = "■";
}

console.log(dimensionArray.join("\n"));
