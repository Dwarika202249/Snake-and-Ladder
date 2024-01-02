document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const rollDiceButton = document.getElementById("rollDice");
  let clickCount = 0;
  let playerPosition = 1; // initialize player position

  // create the game board
  for (let i = 1; i <= 100; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.id = i;
    cell.textContent = i;
    board.appendChild(cell);
  }

  // define snakes and ladders
  const snakesAndLadders = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78,
  };

  // add snakes and ladders to the board
  for (const [start, end] of Object.entries(snakesAndLadders)) {
    document.getElementById(start).classList.add("snake");
    document.getElementById(end).classList.add("ladder");
  }

// function to move the player
function movePlayer(currentPosition, diceValue, clickCount) {
    const newPosition = currentPosition + diceValue;
  
    // Check if the player has landed on a snake
    if (snakesAndLadders[newPosition]) {
      playSnakeOrLadderAudio(); 
      playSnakeAnimation(newPosition); // Play GIF animation
      return snakesAndLadders[newPosition];
    }
  
    // Check if the player has reached position 100
    if (newPosition == 100) {
      showWinPopup(clickCount);
      return 100; // Set the player's position to 100 (winning position)
    }

    // Check if the player has exceeded position 100
    if (newPosition > 100) {
      return currentPosition; // player position will not change
    }
  
    return newPosition;
  }
  
  // function to play GIF animation for snake or ladder
  function playSnakeAnimation(position) {
    const animationContainer = document.createElement('div');
    animationContainer.className = 'snake-ladder-animation';
    animationContainer.innerHTML = `<img src="./images/snake_animation.gif" alt="Snake Animation">`;
    document.getElementById(position).appendChild(animationContainer);
  
    // Add a delay and then remove the animation container
    setTimeout(() => {
      document.getElementById(position).removeChild(animationContainer);
    }, 2000);
  }



  // function to play audio for snake or ladder
  function playSnakeOrLadderAudio() {
    const snakeOrLadderAudio = new Audio("./audio/bite.mp3");
    snakeOrLadderAudio.play();
  }

  // function to show the win pop-up
  function showWinPopup(clickCount) {
    const winPopup = document.createElement("div");
    winPopup.className = "win-popup";
    winPopup.innerHTML = `<h2>Congratulations! You won!</h2>
                          <h3>You rolled the Dice ${clickCount} times.</h3>`;
    document.body.appendChild(winPopup);
    // Play winning audio
    const winningAudio = new Audio("./audio/winning_sound.mp3");
    winningAudio.play();

    // Disable the "Roll Dice" button during the pop-up duration
    rollDiceButton.disabled = true;

    // Optional: Add a delay and then remove the win pop-up
    setTimeout(() => {
      document.body.removeChild(winPopup);
      // Reset click count to 0
      clickCount = 0;
      // Reset player position to 1
      playerPosition = 1;

      // Update the player position on the board
      updatePlayerPosition();
      // Enable the "Roll Dice" button
      rollDiceButton.disabled = false;
    }, 10000); // Adjust the delay as needed (3000 milliseconds = 3 seconds)
  }

  function updatePlayerPosition() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => cell.classList.remove("active"));
    document.getElementById(playerPosition).classList.add("active");
  }

  // function to animate player movement
  function animatePlayerMovement(start, end) {
    const duration = 500; // Animation duration in milliseconds
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = elapsedTime / duration;

      if (progress < 1) {
        // Interpolate between start and end positions
        const newPosition = start + Math.floor((end - start) * progress);
        updatePlayerPosition(newPosition);
        requestAnimationFrame(animate);
      } else {
        // Ensure the final position is reached
        updatePlayerPosition(end);
      }
    }

    requestAnimationFrame(animate);
  }

  function rollDice() {
    const diceContainer = document.getElementById("diceContainer");
    const diceRollSound = document.getElementById("diceRollSound");

    // Disable the "Roll Dice" button during the rolling
    rollDiceButton.disabled = true;

    // Remove existing dice elements
    while (diceContainer.firstChild) {
      diceContainer.removeChild(diceContainer.firstChild);
    }

    // Play the dice rolling sound
    diceRollSound.play();

    // Create a new dice element
    const dice = document.createElement("div");
    dice.className = "dice";

    // Append the new dice element to the container
    diceContainer.appendChild(dice);

    // Simulate dice rolling animation
    let currentFrame = 1;
    const totalFrames = 5; // Adjust the number of frames for smoother animation

    const rollingInterval = setInterval(() => {
      // Simulate getting a random dice number (1 to 6)
      const tempRandomDiceNumber = Math.floor(Math.random() * 6) + 1;
      // Set the background image based on the random dice number
      dice.style.backgroundImage = `url('./images/${tempRandomDiceNumber}.png')`;

      currentFrame++;

      if (currentFrame >= totalFrames) {
        // Stop the interval after the desired number of frames
        clearInterval(rollingInterval);

        // Set the final background image based on the random dice number
        dice.style.backgroundImage = `url('./images/${tempRandomDiceNumber}.png')`;

      }
    }, 150); // Adjust the interval duration for smoother animation

    // Simulate getting a random dice number (1 to 6)
    const randomDiceNumber = Math.floor(Math.random() * 6) + 1;

    // Simulate the dice rolling animation with a delay
    setTimeout(() => {
      // Set the background image based on the random dice number
      dice.style.backgroundImage = `url('./images/${randomDiceNumber}.png')`;
      // Enable the "Roll Dice" button
      rollDiceButton.disabled = false;
    }, 1000); // Adjust the timeout duration as needed

    return randomDiceNumber;
  }

  // handle dice roll
  rollDiceButton.addEventListener("click", () => {
    clickCount = clickCount + 1;
    const diceValue = rollDice();
    const newPosition = movePlayer(playerPosition, diceValue, clickCount);

    // Animate the player movement
    animatePlayerMovement(playerPosition, newPosition);

    playerPosition = newPosition;
    updatePlayerPosition();
  });

  // initialize player position on the board
  updatePlayerPosition();
});
