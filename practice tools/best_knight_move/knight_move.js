// DOM elements
const gameDescription = document.getElementById("game-description");
const userInput = document.getElementById("user-input");
const submitBtn = document.getElementById("submit-btn");
const hintBtn = document.getElementById("hint-btn");
const message = document.getElementById("message");
const optimalSolutionDisplay = document.getElementById("optimal-solution");
const scoreDisplay = document.getElementById("score");

let score = 0;

// Knight's possible movements (8 directions)
const knightMoves = [
  [-2, -1], [-2, 1], [2, -1], [2, 1],
  [-1, -2], [-1, 2], [1, -2], [1, 2]
];

// Function to convert chess notation (e.g., 'a1') to board indices
function positionToIndex(pos) {
  const file = pos.charCodeAt(0) - 'a'.charCodeAt(0); // 'a' -> 0, 'b' -> 1, ...
  const rank = parseInt(pos[1]) - 1; // '1' -> 0, '2' -> 1, ...
  return [rank, file];
}

// Function to check if a move is inside the board
function isInsideBoard(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}

// BFS to find the shortest path
function findShortestPath(start, end) {
  const queue = [[start]];
  const visited = new Set();
  visited.add(start.join(","));

  while (queue.length > 0) {
    const path = queue.shift();
    const [currentX, currentY] = path[path.length - 1];

    // If we reach the destination, return the path
    if (currentX === end[0] && currentY === end[1]) {
      return path;
    }

    for (let [dx, dy] of knightMoves) {
      const newX = currentX + dx;
      const newY = currentY + dy;

      if (isInsideBoard(newX, newY) && !visited.has([newX, newY].join(","))) {
        visited.add([newX, newY].join(","));
        queue.push([...path, [newX, newY]]);
      }
    }
  }
  return [];
}

// Function to generate a random start and end position
function generateRandomPositions() {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const startPos = files[Math.floor(Math.random() * 8)] + ranks[Math.floor(Math.random() * 8)];
  const endPos = files[Math.floor(Math.random() * 8)] + ranks[Math.floor(Math.random() * 8)];

  return { startPos, endPos };
}

// Function to start the game
function startGame() {
  // Generate random start and end positions
  const { startPos, endPos } = generateRandomPositions();
  
  const startIdx = positionToIndex(startPos);
  const endIdx = positionToIndex(endPos);
  
  const shortestPath = findShortestPath(startIdx, endIdx);
  
  const optimalSolution = shortestPath.map(([x, y]) => `${String.fromCharCode(y + 97)}${x + 1}`).join(" ");
  
  gameDescription.textContent = `Move the knight from ${startPos} to ${endPos}.`;
  optimalSolutionDisplay.textContent = optimalSolution;
  
  return { startPos, endPos, optimalSolution, shortestPath };
}

// Game state
let gameState = startGame();

// Function to check the user's input
function checkAnswer() {
  const userMoves = userInput.value.trim().toLowerCase().split(" ");
  
  const correctMoves = gameState.optimalSolution.split(" ");
  
  // Check if the number of moves is correct
  if (userMoves.length > correctMoves.length) {
    message.textContent = "Your path is too long. Try to find the shortest solution!";
    message.style.color = "red";
  } else if (userMoves.length === correctMoves.length) {
    // Check if the moves are valid knight moves
    let validMoves = true;
    for (let i = 0; i < userMoves.length - 1; i++) {
      const [currentX, currentY] = positionToIndex(userMoves[i]);
      const [nextX, nextY] = positionToIndex(userMoves[i + 1]);
      
      const validMove = knightMoves.some(([dx, dy]) => currentX + dx === nextX && currentY + dy === nextY);
      
      if (!validMove) {
        validMoves = false;
        break;
      }
    }

    if (validMoves) {
      message.textContent = userMoves.join(" ") === correctMoves.join(" ") 
        ? "Correct! You found the optimal solution." 
        : "Valid path but not the optimal one.";
      message.style.color = userMoves.join(" ") === correctMoves.join(" ") ? "green" : "orange";
      
      if (userMoves.join(" ") === correctMoves.join(" ")) {
        score++; // Increase the score for correct solution
        scoreDisplay.textContent = `Score: ${score}`;
        gameState = startGame(); // Generate new random start and end positions for next round
      }
    } else {
      message.textContent = "Invalid knight moves. Please try again.";
      message.style.color = "red";
    }
  }
  
  userInput.value = ""; // Clear input field
}

// Show the first two moves as a hint
function showHint() {
  const hintMoves = gameState.optimalSolution.split(" ").slice(0, 2).join(" ");
  message.textContent = `Hint: The first two moves are: ${hintMoves}`;
  message.style.color = "blue";
}

// Event listeners
submitBtn.addEventListener("click", checkAnswer);
hintBtn.addEventListener("click", showHint);
