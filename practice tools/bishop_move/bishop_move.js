// DOM elements
const gameDescription = document.getElementById("game-description");
const possibleBtn = document.getElementById("possible-btn");
const impossibleBtn = document.getElementById("impossible-btn");
const message = document.getElementById("message");
const scoreDisplay = document.getElementById("score");

let score = 0;
let moveCount = 0; // To track the number of moves (alternating between correct/incorrect)

// Function to convert chess notation (e.g., 'a1') to board indices
function positionToIndex(pos) {
  const file = pos.charCodeAt(0) - 'a'.charCodeAt(0); // 'a' -> 0, 'b' -> 1, ...
  const rank = parseInt(pos[1]) - 1; // '1' -> 0, '2' -> 1, ...
  return [rank, file];
}

// Function to convert index back to chess notation (e.g., [0, 0] -> 'a1')
function indexToPosition(index) {
  const file = String.fromCharCode(index[1] + 97); // 0 -> 'a', 1 -> 'b', ...
  const rank = index[0] + 1; // 0 -> '1', 1 -> '2', ...
  return file + rank;
}

// Function to check if a bishop can move between two squares
function isBishopMovePossible(start, end) {
  const [startX, startY] = positionToIndex(start);
  const [endX, endY] = positionToIndex(end);
  
  // A bishop moves diagonally, so the absolute differences in ranks and files should be equal
  return Math.abs(startX - endX) === Math.abs(startY - endY);
}

// Function to get the diagonal neighbors of a square
function getPossibleNeighbors(square) {
  const [x, y] = positionToIndex(square);
  const neighbors = [];

  const directions = [
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  directions.forEach(([dx, dy]) => {
    for (let i = 1; i < 8; i++) {
      const newX = x + dx * i;
      const newY = y + dy * i;

      if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
        neighbors.push(indexToPosition([newX, newY]));
      }
    }
  });

  return neighbors;
}

// Function to get all neighboring squares (including non-diagonal)
function getAllNeighbors(square) {
  const [x, y] = positionToIndex(square);
  const neighbors = [];

  const directions = [
    [-1, -1], [-1, 1], [1, -1], [1, 1], // Diagonals
    [-1, 0], [1, 0], [0, -1], [0, 1]   // Orthogonals
  ];

  directions.forEach(([dx, dy]) => {
    const newX = x + dx;
    const newY = y + dy;

    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
      neighbors.push(indexToPosition([newX, newY]));
    }
  });

  return neighbors;
}

// Function to generate random squares
function generateRandomSquares() {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const startPos = files[Math.floor(Math.random() * 8)] + ranks[Math.floor(Math.random() * 8)];
  const validNeighbors = getPossibleNeighbors(startPos);
  const allNeighbors = getAllNeighbors(startPos);

  let endPos;

  if (moveCount % 2 === 0) {
    // Generate a valid move
    endPos = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
  } else {
    // Generate an invalid move
    const invalidNeighbors = allNeighbors.filter(neighbor => !isBishopMovePossible(startPos, neighbor));

    if (invalidNeighbors.length > 0) {
      endPos = invalidNeighbors[Math.floor(Math.random() * invalidNeighbors.length)];
    } else {
      // Fall back to valid neighbors if no invalid neighbors exist
      endPos = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
    }
  }

  moveCount++;
  return { startPos, endPos };
}

// Game state
let gameState = generateRandomSquares();

// Function to start a new game round
function startGame() {
  gameState = generateRandomSquares();
  gameDescription.textContent = `Can the bishop move from ${gameState.startPos} to ${gameState.endPos}?`;
  message.textContent = ""; // Clear previous feedback
}

// Function to handle user answer
function handleAnswer(isPossible) {
  const correctAnswer = isBishopMovePossible(gameState.startPos, gameState.endPos);

  if (isPossible === correctAnswer) {
    message.textContent = "Correct!";
    message.style.color = "green";
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  } else {
    message.textContent = `Incorrect! The correct answer was ${correctAnswer ? "Possible" : "Impossible"}.`;
    message.style.color = "red";
  }

  // Start a new game round
  startGame();
}

// Event listeners
possibleBtn.addEventListener("click", () => handleAnswer(true));
impossibleBtn.addEventListener("click", () => handleAnswer(false));

// Initial game round
startGame();
