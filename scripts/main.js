/**
 * Created by JMiah on 04/01/2016.
 */
/* TODO - Polluting global scope and giving away implementation details.
/* refactor to use module design pattern?
*/

/* declare global variables */
var commandEntered = false;
var errorMessage = document.getElementById("error");
var reportMessage = document.getElementById("report");
var direction = ['NORTH', 'SOUTH', 'EAST', 'WEST'];
var maxX = 4;
var maxY = 4;
var robot = null;
var currentPosition = {};
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d"); // get canvas context

/* helper to write error message to UI */
function error(msg) {
  errorMessage.innerHTML = msg;
}

/* helper to validate X position to ensure its an integer and not out of range */
function validateX(axis) {
  if (isNaN(axis)) {
    error("Please enter a numeric X position!");
    return false;
  } else if (axis < 0 || axis > maxX) {
    error("X position out of range!");
    return false;
  } else {
    return true;
  }
}

/* helper to validate Y position to ensure its an integer and not out of range */
function validateY(axis) {
  if (isNaN(axis)) {
      error("Please enter a numeric Y position!");
    return false;
  } else if (axis < 0 || axis > maxY) {
      error("Y position out of range!");
    return false;
  } else {
    return true;
  }
}

function validDirection(face) {
  if (direction.indexOf(face) === -1) {
    error("Wrong direction!");
    return false;
  } else {
    return true;
  }
}

/* constructor to create an instance of a robot */
function Robot(x, y, f) {
  this.x = x;
  this.y = y;
  this.f = f;
}

function place(positionCommand) {
  var newPosition = positionCommand.split(","); // get x y f from the command
  var newX = parseInt(newPosition[0].trim());
  var newY = parseInt(newPosition[1].trim());
  var newDirection = newPosition[2].trim().toUpperCase();
  if (validateX(newX) && validateY(newY) && validDirection(newDirection)) {
    robot.x = newX;
    robot.y = newY;
    robot.f = newDirection;
    drawRobot(robot);
  }
}

/* helper to move robot on the canvas */
function move() {
  switch (currentPosition.f) {
    case "NORTH":
      var newY = currentPosition.y + 1;
      if (validateY(newY)) {
        robot.y = newY;
        drawRobot(robot);
      }
      break;
    case "SOUTH":
      var newY = currentPosition.y - 1;
      if (validateY(newY)) {
        robot.y = newY;
        drawRobot(robot);
      }
      break;
    case "EAST":
      var newX = currentPosition.x + 1;
      if (validateX(newX)) {
        robot.x = newX;
        drawRobot(robot);
      }
      break;
    case "WEST":
      var newX = currentPosition.x - 1;
      if (validateX(newX)) {
        robot.x = newX;
        drawRobot(robot);
      }
      break;
    default:
      break;
  }
}

/* rotate anticlockwise */
function rotate(direction) {
  if (direction === "left") {
    switch (currentPosition.f) {
      case "NORTH":
        robot.f = "WEST";
        break;
      case "SOUTH":
        robot.f = "EAST";
        break;
      case "EAST":
        robot.f = "NORTH";
        break;
      case "WEST":
        robot.f = "SOUTH";
        break;
      default:
        break;
    }
  } /* rotate clockwise */
  else if (direction === "right") {
    switch (currentPosition.f) {
      case "NORTH":
        robot.f = "EAST";
        break;
      case "SOUTH":
        robot.f = "WEST";
        break;
      case "EAST":
        robot.f = "SOUTH";
        break;
      case "WEST":
        robot.f = "NORTH";
        break;
      default:
        break;
    }
  }
}

/* helper to print results  */
function report() {
  reportMessage.innerHTML = robot.x + "," + robot.y + "," + robot.f;
}

/* TODO - Uncaught Type Error - cannot read property trim.
 *  This happens when command 'PLACE' is entered. Need a better way to handle this error!
 *  Wrap logic into a try catch?
*/
function processCommand(command) {
  console.log(command);
  error(""); // clear error message

  /* initialise current position object */
  currentPosition = {
    x: robot.x,
    y: robot.y,
    f: robot.f
  };

  /* create comma separated array with command */
  var completeCmd = command.split(" ");
  var literalCmd = completeCmd[0].toUpperCase(); // get either PLACE, MOVE, LEFT, RIGHT, REPORT

  if (commandEntered) {
    switchLiteralCommand(literalCmd, completeCmd);
  } else if ((!commandEntered && literalCmd === 'PLACE')) {
    commandEntered = true;
    var posCmd = completeCmd.slice(1).join(""); // avoid cases when user types extra spaces after positions e.g. place 2, 2,  north
    place(posCmd);
  } else {
    error("The first command must be a PLACE command!");
  }
}

function switchLiteralCommand(literalCmd, completeCmd) {
  switch (literalCmd) {
    case "PLACE":
      var posCmd = completeCmd.slice(1).join(""); // avoid cases when user types extra spaces after positions e.g. place 2, 2,  north
      place(posCmd);
      break;
    case "MOVE":
      move();
      break;
    case "LEFT":
      rotate("left");
      break;
    case "RIGHT":
      rotate("right");
      break;
    case "REPORT":
      report();
      break;
    default:
      error("Invalid command!");
      break;
  }
}

/* clear current robot when moved */
function clearCurrentRobot(currentX, currentY) {
  var axisX = currentX * 100 + 51;
  var axisY = (5 - currentY) * 100 - 49;
  context.clearRect(axisX, axisY, 98, 98);
}

/* draw robot on canvas */
function drawRobot(newRobot) {
  clearCurrentRobot(currentPosition.x, currentPosition.y); // clear the current robot
  context.beginPath();
  var axisX = (newRobot.x + 1) * 100;
  var axisY = (5 - newRobot.y) * 100;
  context.arc(axisX, axisY, 35, 0, 2 * Math.PI);
  context.stroke();
}

/* draw grid on canvas */
function initialise() {

  /* generate horizontal lines */
  for (var x = 50; x < 650; x += 100) {
    context.moveTo(x, 50);
    context.lineTo(x, 550);
  }

  /* generate vertical lines */
  for (var y = 50; y < 650; y += 100) {
    context.moveTo(50, y);
    context.lineTo(550, y);
  }

  context.strokeStyle = "#000";
  context.stroke();
  /* default robot position */
  robot = new Robot(0, 0, "NORTH");
  drawRobot(robot);
  context.save();
}

initialise();

document.getElementById("restart").addEventListener('click', function(){
    location.reload();
}, false);