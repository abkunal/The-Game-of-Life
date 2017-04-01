"use strict";

// A single box in the game
var Box = React.createClass({
  displayName: "Box",

  // if box is clicked change its color
  changeLivingState: function changeLivingState() {
    // a function is passed by the parent as a property to change the colour of box stored in the state of Parent
    this.props.toggleState(this.props.index);
  },

  render: function render() {
    return React.createElement("div", { onClick: this.changeLivingState, className: this.props.size + " " + this.props.State.live });
  }
});

// represents the board on which all the boxes are placed
var Board = React.createClass({
  displayName: "Board",

  getInitialState: function getInitialState() {
    // Initializes the Board with 1500 boxes, with 80% boxes being dead and rest as alive
    var arr = [];
    for (var i = 0; i < 1500; i++) {
      if (Math.random() < 0.8) {
        arr.push({ live: "dead", neighbours: 0 });
      } else {
        arr.push({ live: "young", neighbours: 0 });
      }
    }

    return { data: arr, generations: 0, simulationSpeed: 100, boxSize: 1500, size: "smallsize", boxClass: "bigperson", rowSize: 50 };
  },

  countNeighbours: function countNeighbours(i) {
    // Returns the number of alive neighbours of a box
    var size = this.state.boxSize;
    var rowSize = this.state.rowSize;
    var iplus1 = (i + 1) % size;
    var iplus50 = (i + rowSize) % size;
    var iplus51 = (i + rowSize + 1) % size;
    var iplus49 = (i + rowSize - 1) % size;
    var iminus1 = i - 1;
    var iminus50 = i - rowSize;
    var iminus51 = i - rowSize + 1;
    var iminus49 = i - rowSize - 1;
    if (iminus1 < 0) iminus1 = size + iminus1;
    if (iminus50 < 0) iminus50 = size + iminus50;
    if (iminus51 < 0) iminus51 = size + iminus51;
    if (iminus49 < 0) iminus49 = size + iminus49;
    var a = [iplus1, iplus50, iplus49, iplus51, iminus1, iminus50, iminus49, iminus51];
    var count = 0;
    for (var j = 0; j < 8; j++) {
      if (this.state.data[a[j]].live != "dead") {
        count++;
        //console.log(this.state.data[a[j]].live, j);
      }
    }
    //console.log(count, a);
    return count;
  },

  boxAnalysis: function boxAnalysis() {
    // Goes through each box and counts the number of its alive neighbours
    var arr = this.state.data;
    var NumberOfNeighbours = [];
    for (var i = 0; i < arr.length; i++) {
      NumberOfNeighbours.push(this.countNeighbours(i));
    }
    //console.log(NumberOfNeighbours);
    return NumberOfNeighbours;
  },

  runSimulation: function runSimulation() {
    // gets the neighbours information using boxAnalysis
    // Updates boxes as per rules of The Game of Life
    var neigh = this.boxAnalysis();
    var arr = this.state.data;
    var count = 0;
    console.log(arr.length);
    for (var i = 0; i < this.state.boxSize; i++) {
      if (this.state.data[i].live !== "dead" && (neigh[i] <= 1 || neigh[i] >= 4)) {
        arr[i].live = "dead";
      } else if (this.state.data[i].live === "dead" && neigh[i] == 3) {
        arr[i].live = "young";
        count++;
      } else if (this.state.data[i].live === "young") {
        arr[i].live = "old";
      }
    }

    var gens = this.state.generations + 1;
    this.setState({ generations: gens });
    //console.log(arr);
    this.setState({ data: arr });
    if (count === 0) {
      this.clearBoard();
    }
  },
  timer: "", // timer to start and stop the game
  playGame: function playGame(dosomething) {
    // starts the game
    if (this.timer === "") {
      this.timer = setInterval(this.runSimulation, this.state.simulationSpeed);
    }
    console.log("played");
  },

  stopGame: function stopGame() {
    // stops the game
    clearInterval(this.timer);
    this.timer = "";
    console.log("stopped");
  },

  slowSim: function slowSim() {
    // slows down the simulation
    this.setState({ simulationSpeed: 350 });
    this.stopGame();
    setTimeout(this.playGame, 351);
  },

  mediumSim: function mediumSim() {
    // sets simulation speed to medium
    this.setState({ simulationSpeed: 200 });
    this.stopGame();
    setTimeout(this.playGame, 351);
  },

  fastSim: function fastSim() {
    // sets simulation speed to fastest
    this.setState({ simulationSpeed: 100 });
    this.stopGame();
    setTimeout(this.playGame, 351);
  },

  clearBoard: function clearBoard() {
    // resets the board and marks all the boxes as dead
    this.stopGame();
    var arr = this.state.data;
    var obj = { live: "dead", neighbours: 0 };
    for (var i = 0; i < this.state.boxSize; i++) {
      arr[i].live = "dead";
      arr[i].neighbours = 0;
    }
    this.setState({ data: arr, generations: 0 });
    console.log("hello");
  },

  updateSingleBox: function updateSingleBox(i) {
    // updates the properties of a particular box in state data given with index i
    var arr = this.state.data;
    // if box is dead, give it birth
    if (arr[i].live == "dead") {
      arr[i].live = "young";
    } else {
      arr[i].live = "dead";
    }
    this.setState({ data: arr });
  },

  fiftyThirty: function fiftyThirty() {
    var array = [];
    for (var i = 0; i < 1500; i++) {
      array.push({ live: "dead", neighbours: 0 });
    }
    this.clearBoard();
    this.setState({ data: array, size: "smallsize", boxClass: "bigperson", rowSize: 50 });
  },

  seventyFifty: function seventyFifty() {
    var array = [];
    for (var i = 0; i < 3500; i++) {
      array.push({ live: "dead", neighbours: 0 });
    }
    this.clearBoard();
    this.setState({ data: array, size: "mediumsize", boxClass: "mediumperson", rowSize: 70 });
  },

  hundredEighty: function hundredEighty() {
    var array = [];
    for (var i = 0; i < 8000; i++) {
      array.push({ live: "dead", neighbours: 0 });
    }
    this.clearBoard();
    this.setState({ data: array, size: "largesize", boxClass: "smallperson", rowSize: 100 });
  },

  eachBox: function eachBox(data, i) {
    // displays each box on the board
    return React.createElement(Box, { index: i, size: this.state.boxClass, State: data, toggleState: this.updateSingleBox });
  },

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "top-controls" },
        React.createElement(
          "button",
          { onClick: this.playGame, className: "top-button btn" },
          "Start"
        ),
        React.createElement(
          "button",
          { onClick: this.stopGame, className: "top-button btn" },
          "Stop"
        ),
        React.createElement(
          "button",
          { onClick: this.clearBoard, className: "top-button btn" },
          "Clear"
        ),
        React.createElement(
          "span",
          { className: "intext" },
          "Generation: ",
          this.state.generations
        )
      ),
      React.createElement(
        "div",
        { id: "board", className: this.state.size },
        this.state.data.map(this.eachBox)
      ),
      React.createElement(
        "div",
        { id: "boardSize", className: "boardsize-controls" },
        React.createElement(
          "span",
          { className: "intext" },
          "Board Size:"
        ),
        React.createElement(
          "button",
          { onClick: this.fiftyThirty, className: "btn" },
          "50 x 30"
        ),
        React.createElement(
          "button",
          { onClick: this.seventyFifty, className: "btn" },
          "70 x 50"
        ),
        React.createElement(
          "button",
          { onClick: this.hundredEighty, className: "btn" },
          "100 x 80"
        ),
        React.createElement("br", null),
        React.createElement("br", null),
        React.createElement(
          "span",
          { className: "intext" },
          "Sim Speed:"
        ),
        " ",
        React.createElement(
          "button",
          { onClick: this.slowSim, className: "btn slow" },
          "Slow"
        ),
        React.createElement(
          "button",
          { onClick: this.mediumSim, className: "btn medium" },
          "Medium"
        ),
        React.createElement(
          "button",
          { onClick: this.fastSim, className: "btn fast" },
          "Fast"
        ),
        React.createElement(
          "div",
          null,
          React.createElement("br", null),
          React.createElement(
            "span",
            { className: "intext" },
            "Add as many cells you want. The cells in yellow are younger and red are older. Have Fun!"
          )
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(Board, null), document.getElementById("root"));