import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className = "square" + (props.highlight ? " winning" : "")
  return (
    <button 
      className = {className}
      onClick = {props.onClick}
    >
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key = {i}
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
        highlight = {this.props.winLine && this.props.winLine.includes(i)}
      />
    );
  }
  
  render() {
    const size = 3;
    let squares = [];

    for(let i = 0; i < size; ++i) {
      let row = [];

      for(let j = 0; j < size; ++j) {
        row.push(this.renderSquare(i*size + j));
      }

      squares.push(<div key = {i} className = "board-row"> {row} </div>)
    }

    return (
      <div> {squares} </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for(let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];

    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
      };
    }
  }

  return {
    winner: null,
    line: null,
  };
}

class Game extends React.Component {
  constructor(props) {
    super (props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if(calculateWinner(squares).winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        lastMove: i,
      }]),

      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const win = calculateWinner(current.squares);
    const winner = win.winner;  

    const moves = history.map((step, move) => {
      const row = Math.floor(step.lastMove / 3);
      const col = step.lastMove % 3;

      const desc = move ?
        'Go to move #' + move + ": " + ((move % 2) !== 0 ? 'X' : 'O') + " at (" + row + ", " + col + ")":
        'Go to move #0: Game start';
      return (
        <li key = {move}>
          <button className = "button" onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b> {desc} </b> : desc}
          </button>
        </li>
      );
    });

    let status;

    if(winner) {
      status = 'Winner: ' + winner;
    } else if (!current.squares.includes(null)) {
      status = "Draw";
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className = "game">
        <div className = "game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)} 
            winLine = {win.line}
          />
        </div>
        <div className = "game-info">
          <div> {status} </div>
          <ol> {moves} </ol>
        </div>
      </div>
    );
  }
}
  
// ========================================
  
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  