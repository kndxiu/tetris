let originalWidth, originalHeight;

function onResize() {
  var container = document.getElementById("body");
  var containerWidth = container.offsetWidth;
  var containerHeight = container.offsetHeight;
  var div = document.getElementById("container");
  var divWidth = div.offsetWidth;
  var divHeight = div.offsetHeight;

  if (!originalWidth) {
    originalWidth = divWidth;
    originalHeight = divHeight;
  }

  if (divWidth > containerWidth - 32 || divHeight > containerHeight - 32) {
    var scale = Math.min(
      (containerWidth - 32) / originalWidth,
      (containerHeight - 32) / originalHeight
    );
    div.style.transform = "scale(" + scale + ")";
  } else {
    div.style.transform = "scale(1)";
  }
}

onResize();

window.addEventListener("resize", onResize);

const shapes = ["I", "J", "L", "O", "S", "T", "Z"];

const shapeRotations = {
  I: [
    [
      [0, "I", 0, 0],
      [0, "I", 0, 0],
      [0, "I", 0, 0],
      [0, "I", 0, 0],
    ],
    [
      [0, 0, 0, 0],
      ["I", "I", "I", "I"],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, "I", 0],
      [0, 0, "I", 0],
      [0, 0, "I", 0],
      [0, 0, "I", 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      ["I", "I", "I", "I"],
      [0, 0, 0, 0],
    ],
  ],
  J: [
    [
      [0, "J", 0],
      [0, "J", 0],
      ["J", "J", 0],
    ],
    [
      ["J", 0, 0],
      ["J", "J", "J"],
      [0, 0, 0],
    ],
    [
      [0, "J", "J"],
      [0, "J", 0],
      [0, "J", 0],
    ],
    [
      [0, 0, 0],
      ["J", "J", "J"],
      [0, 0, "J"],
    ],
  ],
  L: [
    [
      [0, "L", 0],
      [0, "L", 0],
      [0, "L", "L"],
    ],
    [
      [0, 0, 0],
      ["L", "L", "L"],
      ["L", 0, 0],
    ],
    [
      ["L", "L", 0],
      [0, "L", 0],
      [0, "L", 0],
    ],
    [
      [0, 0, "L"],
      ["L", "L", "L"],
      [0, 0, 0],
    ],
  ],
  O: [
    [
      ["O", "O"],
      ["O", "O"],
    ],
  ],
  S: [
    [
      [0, "S", "S"],
      ["S", "S", 0],
      [0, 0, 0],
    ],
    [
      [0, "S", 0],
      [0, "S", "S"],
      [0, 0, "S"],
    ],
    [
      [0, 0, 0],
      [0, "S", "S"],
      ["S", "S", 0],
    ],
    [
      ["S", 0, 0],
      ["S", "S", 0],
      [0, "S", 0],
    ],
  ],
  T: [
    [
      [0, "T", 0],
      ["T", "T", "T"],
      [0, 0, 0],
    ],
    [
      [0, "T", 0],
      [0, "T", "T"],
      [0, "T", 0],
    ],
    [
      [0, 0, 0],
      ["T", "T", "T"],
      [0, "T", 0],
    ],
    [
      [0, "T", 0],
      ["T", "T", 0],
      [0, "T", 0],
    ],
  ],
  Z: [
    [
      ["Z", "Z", 0],
      [0, "Z", "Z"],
      [0, 0, 0],
    ],
    [
      [0, 0, "Z"],
      [0, "Z", "Z"],
      [0, "Z", 0],
    ],
    [
      [0, 0, 0],
      ["Z", "Z", 0],
      [0, "Z", "Z"],
    ],
    [
      [0, "Z", 0],
      ["Z", "Z", 0],
      ["Z", 0, 0],
    ],
  ],
};

const colors = [
  "#215bd6",
  "#eed442",
  "#f036ff",
  "#4cdef8",
  "#d9e0f0",
  "#4cdf3f",
  "#ff2222",
];

let currentColor = 0;

let intervalId, intervalTime;

let level = 1;
let score = 0;

let interval = 1000;
let scoreMultiplier = 1;

let completedLines = 0;

let levelThresholds = [
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150,
];

function generateTable() {
  let table = [];
  for (let i = 0; i < 20; i++) {
    table[i] = [];
    for (let j = 0; j < 10; j++) {
      table[i][j] = 0;
    }
  }
  return table;
}

function addShapeToBoard(shape, board, x, y) {
  for (let i = 0; i < shape.shape.length; i++) {
    for (let j = 0; j < shape.shape[i].length; j++) {
      if (shape.shape[i][j] !== 0) {
        board[y + i][
          x + j
        ] = `<div style="background-color: ${shape.color}" data-shape ="${shape.shapeName}"></div>`;
      }
    }
  }
  return board;
}

function clearBoard(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (staticBlocksTable[i][j] == 0) {
        board[i][j] = 0;
      }
    }
  }
  displayBoard(board);
}

function displayBoard(board) {
  document.querySelector(".frame").innerHTML = "";
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== 0) {
        let divString = board[i][j];
        let parser = new DOMParser();
        let htmlDoc = parser.parseFromString(divString, "text/html");
        let div = htmlDoc.body.firstChild;
        div.style.gridColumnStart = j + 1;
        div.style.gridRowStart = i + 1;
        div.classList.add("cube");
        document.querySelector(".frame").appendChild(div);
      } else {
        let div = document.createElement("div");
        div.style.gridColumnStart = j + 1;
        div.style.gridRowStart = i + 1;
        div.classList.add("cube");
        document.querySelector(".frame").appendChild(div);
      }
    }
  }
}

function gameLost() {
  document.getElementById("start-screen").style.opacity = "1";
  document.getElementById("start-screen").style.visibility = "visible";
  gameTable = [];
  staticBlocksTable = [];
  document.querySelector(".frame").innerHTML = "";
  document.getElementById("start-screen").innerHTML = `
    <span>Tetris</span>
    <div style="color: red">YOU LOST</div>
    <button id="start-button" onclick="startGame()">restart</button>
  `;
  completedLines = 0;
  score = 0;
  level = 1;
  intervalTime = 1000;
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    shape.moveDown();
    addShapeToBoard(shape, gameTable, shape.x, shape.y);
    displayBoard(gameTable);
  }, intervalTime);
  updateScore();
  updateLevel();
  updateLines();
}

function clearCompletedRows(staticBlocksTable, addPoints) {
  let completedRows = 0;

  for (let i = staticBlocksTable.length - 1; i >= 0; i--) {
    let isRowCompleted = true;

    for (let j = 0; j < staticBlocksTable[i].length; j++) {
      if (staticBlocksTable[i][j] === 0) {
        isRowCompleted = false;
        break;
      }
    }

    if (isRowCompleted) {
      staticBlocksTable.splice(i, 1);
      completedRows++;
    }
  }
  if (addPoints === true) {
    if (completedRows == 1) {
      score += 100 * scoreMultiplier;
    } else if (completedRows == 2) {
      score += 300 * scoreMultiplier;
    } else if (completedRows == 3) {
      score += 500 * scoreMultiplier;
    } else if (completedRows == 4) {
      score += 800 * scoreMultiplier;
    }
    if (completedRows > 0) {
      completedLines += completedRows;
      updateLines();
    }
  }

  updateScore();

  while (completedRows-- > 0) {
    staticBlocksTable.unshift(Array(staticBlocksTable[0].length).fill(0));
  }

  // console.log("Po usunięciu wiersza:");
  // console.table(gameTable);
  // console.log("_______");
  // console.table(staticBlocksTable);
}

function getNextRotation(shape, currentRotationIndex) {
  const rotations = shapeRotations[shape];
  const nextRotationIndex = (currentRotationIndex + 1) % rotations.length;
  return rotations[nextRotationIndex];
}

function checkStaticCollision(x, y, shape, staticBlocks) {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] !== 0) {
        if (
          x + j < 0 ||
          x + j >= staticBlocks[0].length ||
          y + i >= staticBlocks.length ||
          staticBlocks[y + i][x + j] !== 0
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function checkBottomCollision(y, shape) {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] !== 0) {
        if (y + i + 1 >= gameTable.length) {
          return true;
        }
      }
    }
  }
  return false;
}

class Tetromino {
  constructor() {
    this.shapeName = this.randomShape();
    this.shape = shapeRotations[this.shapeName][0];
    this.color = this.randomColor();
    this.currentRotationIndex = 0;
    this.x = 3;
    this.y = 0;
  }

  randomShape() {
    let shape =
      shapes[
        Object.keys(shapes)[
          Math.floor(Math.random() * Object.keys(shapes).length)
        ]
      ];
    return shape;
  }

  randomColor() {
    let color = colors[currentColor];
    currentColor = (currentColor + 1) % colors.length;
    return color;
  }

  rotate() {
    let newShape = [];
    for (let i = 0; i < this.shape.length; i++) {
      let row = [];
      for (let j = 0; j < this.shape[i].length; j++) {
        row.push(this.shape[this.shape.length - 1 - j][i]);
      }
      newShape.push(row);
    }
    for (let i = 0; i < newShape.length; i++) {
      for (let j = 0; j < newShape[i].length; j++) {
        if (newShape[i][j] !== 0) {
          // check if the block goes out of bounds after rotation
          if (
            this.x + j < 0 ||
            this.x + j >= gameTable[0].length ||
            this.y + i < 0 ||
            this.y + i >= gameTable.length
          ) {
            return;
          }
          // check if the block overlaps with a static block after rotation
          if (staticBlocksTable[this.y + i][this.x + j] !== 0) {
            return;
          }
        }
      }
    }
    this.shape = newShape;
    clearBoard(gameTable);
  }

  moveLeft() {
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i].length; j++) {
        if (this.shape[i][j] !== 0) {
          if (staticBlocksTable[this.y + i][this.x + j - 1] === `O`) {
            return;
          }
          if (this.x + j - 1 < 0) {
            return;
          }
        }
      }
    }

    clearBoard(gameTable);
    this.x--;
  }

  moveRight() {
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i].length; j++) {
        if (this.shape[i][j] !== 0) {
          if (staticBlocksTable[this.y + i][this.x + j + 1] === `O`) {
            return;
          }
          if (this.x + j + 1 >= gameTable[0].length) {
            return;
          }
        }
      }
    }

    clearBoard(gameTable);
    this.x++;
  }

  moveDown() {
    if (
      checkBottomCollision(this.y, this.shape) ||
      checkStaticCollision(this.x, this.y + 1, this.shape, staticBlocksTable)
    ) {
      addShapeToBoard(this, gameTable, this.x, this.y);
      for (let i = 0; i < shape.shape.length; i++) {
        for (let j = 0; j < shape.shape[i].length; j++) {
          if (shape.shape[i][j] !== 0) {
            staticBlocksTable[shape.y + i][shape.x + j] = `O`;
          }
        }
      }
      clearCompletedRows(gameTable, true);
      clearCompletedRows(staticBlocksTable, false);
      clearBoard(gameTable);
      shape = new Tetromino();
      for (let row = 0; row < shape.shape.length; row++) {
        for (let col = 0; col < shape.shape[row].length; col++) {
          if (shape.shape[row][col] !== 0) {
            if (gameTable[shape.y + row][shape.x + col] !== 0) {
              gameLost();
              return;
            }
          }
        }
      }
      addShapeToBoard(shape, gameTable, shape.x, shape.y);
      // console.table(gameTable);
      displayBoard(gameTable);
      return;
    }
    clearBoard(gameTable);
    this.y++;
  }
  checkLoss(gameTable) {
    for (let row = 0; row < this.shape.length; row++) {
      for (let col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col] === 1) {
          let x = this.x + col;
          let y = this.y + row;
          if (y >= gameTable.length || gameTable[y][x] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

const updateLevel = () => {
  if (levelThresholds[level - 1] < completedLines) {
    level++;
    document.getElementById("level").innerText = level;
    intervalTime = intervalTime > 250 ? intervalTime - 50 : 250;
    console.log(intervalTime);
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      shape.moveDown();
      addShapeToBoard(shape, gameTable, shape.x, shape.y);
      displayBoard(gameTable);
    }, intervalTime);
    scoreMultiplier += 0.2;
  }
};

const updateLines = () => {
  document.getElementById("lines").innerText = completedLines;
};

const updateScore = () => {
  document.getElementById("score").innerText = parseInt(score);
  updateLevel();
};

function startGame() {
  document.getElementById("start-screen").style.opacity = "0";
  document.getElementById("start-screen").style.visibility = "hidden";
  setTimeout(() => {
    level = 1;
    score = 0;

    interval = 1000;
    scoreMultiplier = 1;

    completedLines = 0;
    gameTable = generateTable();
    staticBlocksTable = generateTable();
    shape = new Tetromino();
    addShapeToBoard(shape, gameTable, shape.x, shape.y);
    displayBoard(gameTable);
    updateScore();
    intervalTime = 1000 - (level - 1) * 50;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      shape.moveDown();
      addShapeToBoard(shape, gameTable, shape.x, shape.y);
      displayBoard(gameTable);
    }, intervalTime);
  }, 300);
}

// Add event listeners for arrow keys
document.addEventListener("keydown", (event) => {
  if (shape !== undefined) {
    switch (event.keyCode) {
      case 37:
        shape.moveLeft();
        break;
      case 38:
        shape.rotate();
        break;
      case 39:
        shape.moveRight();
        break;
      case 40:
        shape.moveDown();
        score += 1 * scoreMultiplier;
        updateScore();
        break;
    }
    addShapeToBoard(shape, gameTable, shape.x, shape.y);
    displayBoard(gameTable);
  }
});

document.querySelector(".buttons .left").addEventListener("click", () => {
  shape.moveLeft();
  addShapeToBoard(shape, gameTable, shape.x, shape.y);
  displayBoard(gameTable);
});
document.querySelector(".buttons .down").addEventListener("click", () => {
  shape.moveDown();
  addShapeToBoard(shape, gameTable, shape.x, shape.y);
  displayBoard(gameTable);
  score += 1 * scoreMultiplier;
  updateScore();
});
document.querySelector(".buttons .right").addEventListener("click", () => {
  shape.moveRight();
  addShapeToBoard(shape, gameTable, shape.x, shape.y);
  displayBoard(gameTable);
});
document.querySelector(".buttons .rotate").addEventListener("click", () => {
  shape.rotate();
  addShapeToBoard(shape, gameTable, shape.x, shape.y);
  displayBoard(gameTable);
});

document.getElementById("start-button").addEventListener("click", startGame);
