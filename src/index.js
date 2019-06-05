import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { thisExpression } from '@babel/types';

function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
        {props.value}
    </button>
  )
}
  
class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square value={this.props.squares[i]}
              onClick = {()=>this.props.onClick(i)} />
               );
  }

  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state={
      history:[{squares:Array(9).fill(null)}],
      stepNumber:0, // 这个值代表我们当前正在查看哪一项历史记录。
      xIsNext:true,
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length-1]
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext?'X':'O';
    this.setState({
      history: history.concat([{squares:squares}]),
      stepNumber:history.length,
      xIsNext: !this.state.xIsNext
      })
  }

  jumpTo(step){
    this.setState({
      stepNumber:step,
      xIsNext:(step%2) === 0, // 状态 stepNumber 是偶数时，我们还要把 xIsNext 设为 true：
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)

    const moves = history.map((squareItem,moveIndex)=>{
      const desc = moveIndex?"Go to move #"+moveIndex:"Go to game start";
      return (
        <li key={moveIndex} onClick={()=>this.jumpTo(moveIndex)}>{desc}</li>
      )
    })

    let status;
    if(winner){
      status = "Winner: "+ winner;
    }else{
      status = "Next player: "+(this.state.xIsNext?'X':'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares}
          onClick={(i)=>this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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

function calculateWinner(squares){
  const lineList = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ]
  for(let i=0;i<lineList.length;i++){ 
    const [a,b,c] = lineList[i];
    if(squares[a] && squares[a]===squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}
  