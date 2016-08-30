$(document).ready(function() {

  // Possible color choices
  const colorChoices = ["green", "red", "blue", "yellow"];
  let colorMemory = [];
  let gameStarted = false;
  let currentLevel = 0;
  const maxLevel = 20;
  let intervalBetweenColors = 1000;
  let durationOfComputerButtonPress = 320;
  let playerChoiceMemory = [];
  let playerChoosing = false;
  let numPickedSoFar = 0;
  let strictModeOn = false;
  let timeouts = [];

  // Turn color buttons off
  turnColorButtonsOff();

  // One of the four buttons are pressed
  $(".color_buttons").mousedown(function() {
    let button_id = "#" + $(this).attr('id');
    buttonPress(button_id);
  });

  // Reset all colors when mouse click is released
  $(document).mouseup(function() {
    resetButtonColors();
    return false;
  });

  // Strict button
  $("#strict_button").mousedown(function() {
    if (strictModeOn) {
      $("#status_message").text("Strict Off");
    } else {
      $("#status_message").text("Strict On");
    }

    setTimeout(function() {
      $("#status_message").text("");
    }, 1000);
    strictModeOn = !strictModeOn;
  });

  function buttonPress(buttonId) {
    let colorPressed;
    if (buttonId === "#green_button") {
      $(buttonId).css("background-color", "#00cc44");
      let sound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
      sound.play();
      colorPressed = "green";
    } else if (buttonId === "#red_button") {
      $(buttonId).css("background-color", "#ff1a1a");
      let sound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
      sound.play();
      colorPressed = "red";
    } else if (buttonId === "#yellow_button") {
      $(buttonId).css("background-color", "#e6e600");
      let sound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
      sound.play();
      colorPressed = "yellow";
    } else if (buttonId === "#blue_button") {
      $(buttonId).css("background-color", "#005ce6");
      let sound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
      sound.play();
      colorPressed = "blue";
    }

    if (playerChoosing) {
      if (colorPressed !== colorMemory[numPickedSoFar]) {
        incorrectInput();
      } else {
        playerChoiceMemory.push(colorPressed);
        numPickedSoFar++;
        if (numPickedSoFar === currentLevel) {
          correctInput();
        }
      }
    }
  }

  function incorrectInput() {
    $("#status_message").text("Incorrect!");
    if (strictModeOn) {
      stopGame();
    } else {
      stopTurn();
      setTimeout(function() {
        $("#status_message").html("&nbsp");
        replayTurn();
      }, 2000);
    }
  }

  function correctInput() {
    stopTurn();
    $("#status_message").text("Correct!");
    if (currentLevel === maxLevel) {
      // Player wins game.
      setTimeout(function() {
        $("#status_message").html("&nbsp");
        gameWon();
      }, 2000);
    } else {
      setTimeout(function() {
        $("#status_message").html("&nbsp");
        startTurn();
      }, 2000);
    }
  }

  // Reset button colors.
  function resetButtonColors() {
    $("#green_button").css("background-color", "#006600");
    $("#red_button").css("background-color", "#cc0000");
    $("#yellow_button").css("background-color", "#DAA520");
    $("#blue_button").css("background-color", "#0000b3");
  }

  // Start game
  $("#start_button").click(function() {
    if (gameStarted) {
      stopGame();
    } else {
      // Start button is pressed.
      $("#status_message").text("Starting...");
      // Disable start button for a while.
      $("#start_button").prop('disabled', true);
      // Turn strict button fof
      $("#strict_button").prop('disabled', true);
      setTimeout(function() {
        // Re-eanble start/stop button
        $("#start_button").prop('disabled', false);
        // html here instead of text since we have to treat &nbsp as html.
        $("#status_message").html("&nbsp");
        $("#start_button").text("Stop");
        $("#start_button").css("background-color", "#ff3333");
        gameStarted = true;
        startGame();
      }, 1000);
    }
  });

  function startGame() {
    intervalBetweenColors = 1000;
    startTurn();
  }

  function stopGame() {
    clearTimeouts();
    setInterval(function() {
      resetButtonColors();
    }, 600);
    // Stop button is pressed while game is running.
    $("#start_button").text("Start");
    $("#start_button").css("background-color", "#00ff00");
    $("#status_message").text("Exiting");
    $("#level_message").text("");
    setTimeout(function() {
      $("#status_message").text("");
    }, 1000);

    // Turn strict button back on since game is over
    $("#strict_button").prop('disabled', false);

    colorMemory = [];
    gameStarted = false;
    playerChoiceMemory = [];
    currentLevel = 0;
    turnColorButtonsOff();
    playerChoosing = false;
    numPickedSoFar = 0;
  }

  function gameWon() {
    turnColorButtonsOff();
    $("#status_message").text("You win!");
    setTimeout(function() {
      stopGame();
    }, 2000);
  }

  function playColorButtonSequence() {
    // Play stored colors in memory
    let i = 0;
    for (i = 0; i < currentLevel - 1; i++) {
      let currentButtonId = "#" + colorMemory[i] + "_button";
      let buttonTimeout = setTimeout(function() {
        buttonPress(currentButtonId);
        setTimeout(function() {
          resetButtonColors();
        }, durationOfComputerButtonPress);
      }, intervalBetweenColors * i);
      timeouts.push(buttonTimeout);
    }

    let buttonTimeout = setTimeout(function() {
      // Play and add a random color at the end
      let randomIndex = Math.floor(Math.random() * colorChoices.length);
      let randomColor = colorChoices[randomIndex];
      let randomButtonId = "#" + randomColor + "_button";
      colorMemory.push(randomColor);
      buttonPress(randomButtonId);
      setTimeout(function() {
        resetButtonColors();
      }, durationOfComputerButtonPress);
    }, intervalBetweenColors * i);
    timeouts.push(buttonTimeout);
  }

  function clearTimeouts() {
    for (let i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }
  }

  // Start turn.
  function startTurn() {
    playerChoosing = false;
    timeouts = [];
    currentLevel++;
    if (currentLevel === 5) {
      intervalBetweenColors = 800;
      durationOfComputerButtonPress = 240;
    } else if (currentLevel === 9) {
      intervalBetweenColors = 600;
      durationOfComputerButtonPress = 160;
    } else if (currentLevel === 13) {
      intervalBetweenColors = 400;
      durationOfComputerButtonPress = 80;
    }
    $("#level_message").text("Level " + currentLevel);
    playColorButtonSequence();
    // Timeout is set so that player goes after all the buttons are played
    setTimeout(function() {
      // Turn color buttons so player can click on them.
      turnColorButtonsOn();
      // Set playerChoosing to true since the player is clicking buttons now
      playerChoosing = true;
    }, intervalBetweenColors * currentLevel);

  }

  // Stop turn.
  function stopTurn() {
    playerChoiceMemory = [];
    playerChoosing = false;
    turnColorButtonsOff();
    setInterval(function() {
      resetButtonColors();
    }, 600);
    numPickedSoFar = 0;
    $("#level_message").text("");
  }

  // Replay turn when strict mode is off and user makes a mistake.
  function replayTurn() {
    $("#level_message").text("Level " + currentLevel);
    setTimeout(function() {
      // Turn color buttons so player can click on them.
      turnColorButtonsOn();
      // Set playerChoosing to true since the player is clicking buttons now
      playerChoosing = true;
    }, intervalBetweenColors * currentLevel);

    let i = 0;
    for (i = 0; i < currentLevel; i++) {
      let currentButtonId = "#" + colorMemory[i] + "_button";
      setTimeout(function() {
        buttonPress(currentButtonId);
        setTimeout(function() {
          resetButtonColors();
        }, durationOfComputerButtonPress);
      }, intervalBetweenColors * i);
    }
  }

  // Turn color buttons on so user can click on them.
  function turnColorButtonsOn() {
    $(".color_buttons").prop('disabled', false);
  }

  // Turn color buttons off so user cannot click on them.
  function turnColorButtonsOff() {
    $(".color_buttons").prop('disabled', true);
  }

});