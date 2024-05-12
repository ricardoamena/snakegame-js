// HTML Elements
const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");

// Game Settings
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
  emptySquare: 0,
  snakeSquare: 1,
  foodSquare: 2,
};

const directions = {
  arrowUp: -10,
  arrowDown: 10,
  arrowRight: 1,
  arrowLeft: -1,
};

// Game Variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const drawSnake = () => {
  snake.forEach((square) => drawSquare(square, "snakeSquare"));
};

// Rellena cada cuadrado del tablero
// @params
// square: posicion del cuadrado,
// type: tipo de cuadrado (emtySquare, snakeSquare, foodSquare)
const drawSquare = (square, type) => {
  const [row, column] = square.split("");
  boardSquares[row][column] = squareTypes[type];
  const squareElement = document.getElementById(square);
  squareElement.setAttribute("class", `square ${type}`);
  if (type === "emptySquare") {
    emptySquares.push(square);
  } else {
    if (emptySquares.indexOf(square) !== -1) {
      emptySquares.splice(emptySquares.indexOf(square), 1);
    }
  }
};

// Función para mover la serpiente
const moveSnake = () => {
    const newSquare = String(
      Number(snake[snake.length - 1]) + directions[direction]
    ).padStart(2, "0");
    const [row, column] = newSquare.split("");
  
    if (
      newSquare < 0 ||
      newSquare >= boardSize * boardSize ||
      (direction === "ArrowRight" && column === "0") ||
      (direction === "ArrowLeft" && column === "9") ||
      boardSquares[row][column] === squareTypes.snakeSquare
    ) {
      gameOver();
    } else {
      snake.push(newSquare);
      if (boardSquares[row][column] === squareTypes.foodSquare) {
        addFood(); // Debes definir esta función
      } else {
        const emptySquare = snake.shift();
        drawSquare(emptySquare, "emptySquare");
      }
    }
  };

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}


const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval)
    startButton.disable = false;
}


const setDirection = (newDirection) => {
  direction = newDirection;
};

const directEvent = (key) => {
  switch (key.code) {
    case "arrowUp":
      direction != "arrowDown" && setDirection(key.code);
      break;
    case "arrowDown":
      direction != "arrowUp" && setDirection(key.code);
      break;
    case "arrowLeft":
      direction != "arrowRight" && setDirection(key.code);
      break;
    case "arrowRight":
      direction != "arrowLeft" && setDirection(key.code);
      break;
  }
};

const createRandomFood = () => {
  const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  drawSquare(randomEmptySquare, "foodSquare");
};

const updateScore = () => {
  scoreBoard.innerText = score;
};

const createBoard = () => {
  boardSquares.forEach((row, rowIndex) => {
    row.forEach((collumn, columnndex) => {
      const squareValue = `${rowIndex}${columnndex}`;
      const squareElement = document.createElement("div");
      squareElement.setAttribute("class", "square emptySquare");
      squareElement.setAttribute("id", squareValue);
      board.appendChild(squareElement);
      emptySquares.push(squareValue);
    });
  });
};

const setGame = () => {
  snake = ["00", "01", "02", "03"];
  score = snake.length;
  direction = "arrowRight";
  boardSquares = Array.from(Array(boardSize), () =>
    new Array(boardSize).fill(squareTypes.emptySquare)
  );
  board.innerHTML = "";
  emptySquares = [];
  createBoard();
};

const startGame = () => {
  setGame();
  gameOverSign.style.display = "none";
  startButton.disabled = true;
  drawSnake();
  updateScore();
  createRandomFood();
  document.addEventListener("keydown", directionEvent);
  moveInterval = setInterval( () => moveSnake(), gameSpeed);
};

startButton.addEventListener("click", startGame);
