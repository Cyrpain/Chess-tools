// DOM elements
const tileDisplay = document.getElementById("current-tile");
const userInput = document.getElementById("user-input");
const submitBtn = document.getElementById("submit-btn");
const scoreDisplay = document.getElementById("score");
const message = document.getElementById("message");

let score = 0;

// Function to generate a random chess tile (e.g., "a1", "h8")
function getRandomTile() {
  const files = "abcdefgh"; // Chess files (columns)
  const ranks = "12345678"; // Chess ranks (rows)
  const file = files[Math.floor(Math.random() * files.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  return file + rank;
}

// Function to determine if a tile is black or white
function isTileBlack(tile) {
  const fileIndex = tile.charCodeAt(0) - 97; // Convert 'a'-'h' to 0-7
  const rankIndex = parseInt(tile[1]) - 1;   // Convert '1'-'8' to 0-7

  // Adjusted logic: Black if sum of indices is even
  return (fileIndex + rankIndex) % 2 === 0; // Black -> Even sum
}

// Function to update the tile display
function updateTile() {
  const newTile = getRandomTile();
  tileDisplay.textContent = newTile; // Display the new tile
}

// Function to check the user's answer
function checkAnswer() {
  const currentTile = tileDisplay.textContent;
  const userAnswer = userInput.value.trim().toLowerCase();
  const correctAnswer = isTileBlack(currentTile) ? "black" : "white";

  // Accept both full and abbreviated answers
  const isBlackAnswer = userAnswer === "black" || userAnswer === "b" || userAnswer === "czarny";
  const isWhiteAnswer = userAnswer === "white" || userAnswer === "w" || userAnswer === "bialy";

  if ((correctAnswer === "black" && isBlackAnswer) || (correctAnswer === "white" && isWhiteAnswer)) {
    score++;
    message.textContent = "Correct!";
    message.style.color = "green";
  } else {
    message.textContent = `Wrong! It was ${correctAnswer}.`;
    message.style.color = "red";
  }

  scoreDisplay.textContent = score; // Update score
  userInput.value = "";            // Clear input field
  updateTile();                    // Show a new tile
}

// Add event listeners
submitBtn.addEventListener("click", checkAnswer);
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

// Initialize the first tile
updateTile();
