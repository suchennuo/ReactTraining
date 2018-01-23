import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import logo from './logo.svg';
import './App.css';




// class Square extends React.Component {
//   // 为组件设置数据状态
//   // constructor(){
//   //   super(); //才能在继承父类的子类中获得类型 this
//   //   this.state = {
//   //     value: null,
//   //   };
//   // }
//
//   render() {
//     return (
//       <button className="square" onClick={this.props.onClick}>
//         {this.props.value}
//       </button>
//     );
//   }
// }


// 函数定义组件
function Square(props){
  if (props.hightLight){
    return(
      <button className="square" onClick={props.onClick} style={{color: 'red'}}>
        {props.value}
      </button>
    )
  }
  return(
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

function calculateWinner(squares){

  const lines = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
  ];

  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]){
      return {winner: squares[a], line: [a, b, c]};
    }
  }
  return {winner: null, line:[]};
}

class Board extends React.Component {
  // constructor(){
  //   super();
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   }
  // }



  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} //handleClick != this.handleClick 切记
        hightLight={this.props.winnerLine.includes(i)}
      />
    );
  }

  render() {
    var rows = [];
    for (let i = 0; i < 3; i++){
      var row = [];
      for (let j = 3 * i; j < 3 * i + 3; j++){
        row.push(this.renderSquare(j));
      }
      rows.push(<div className="board-row" key={i}>{row}</div>);
    }
    return (<div>{rows}</div>);
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      history:[{
        squares: Array(9).fill(null),
        lastStep: 'Game start',
      }],
      xIsNext: true,
      stepNumber: 0,
      sort: false,
    }
  }

  handleClick(i){
    /*
    slice 浅拷贝一个数组
    不可变性的重要性：性能优化。可以判断数据是否发生变化，从而决定是否需要重新渲染。
    */
    // const squares = this.state.squares.slice();

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    // slice 返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素。
    const squares = current.squares.slice();
    //floor() 方法可对一个数进行下舍入

    if (calculateWinner(squares).winner || squares[i]){
      return;
    }
    squares[i] = (this.state.xIsNext ? 'X' : 'O');
    const location = '(' + (Math.floor(i / 3) + 1) + ',' + ((i % 3) + 1) + ')';
    const desc = squares[i] + ' move to ' + location;

    // concat 拼接两个数组
    this.setState({
      history: history.concat([{
        squares: squares,
        lastStep: desc,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length, //history concat 之后 step + 1，也即 history curret length

    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,//
    });
  }

  sort(){
    this.setState({
      sort: !this.state.sort,
    });
  }


  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;
    const winnerLine = calculateWinner(current.squares).line;


    if (this.state.sort){
      history = this.state.history.slice();
      history.reverse();
    }

    //key 必须有
    const moves = history.map((history, step) => {
      const desc = history.lastStep;
      if (step == this.state.stepNumber){
        return (
          <li key={step}>
            <a href="#" onClick={() => this.jumpTo(step)}><strong>{desc}</strong></a>
          </li>
        );
      }
      // jump 之后数据改变，react 会重新绘制
      return (
        <li key={step}>
          <a href="#" onClick={() => this.jumpTo(step)}>{desc}</a>
        </li>
      );
    });


    let status = null;
    if (winner){
      status = 'Winner is ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i)=>this.handleClick(i)}
              winnerLine={winnerLine}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div><button onClick={() => this.sort()}>SORT</button></div>
            <ol>{moves}</ol>
          </div>
        </div>

      </div>
    );
  }
}

/**
TODO:
1. 通过 props 传递数据
在每个格子当中你都能看到一个渲染出来的数字。
2. 给组件添加交互功能
点击任何一个格子，都能够看到 X 出现在格子当中
3. 状态提升
每个格子当中的数据是存储在整个棋盘当中
4. 函数定义组件
5. 轮流落子
6. 判断赢家
7. 保存历史记录
8. 展示每一步历史记录链接
9. 实现时间旅行
10. 坐标方式显示
11. 历史列表中加粗当前选项
12. for 循环绘制棋盘
13. 排序历史列表
14. 当一方获胜时，高亮显示获胜一方棋子
15. 其他

**/


// ========================================

export default App;
