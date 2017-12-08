import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevValue: '0',
      operator: '',
      step: 'start',
      value: '0'
    }
    // this.onNumButtonClick = this.onNumButtonClick.bind(this)
    // this.onOpButtonClick = this.onOpButtonClick.bind(this)
    // this.onInputChange = this.onInputChange.bind(this)

    this.onAnyChange = this.onAnyChange.bind(this)
  }

  onNumButtonClick(event) {
    this.onAnyChange(this.state, event.target.value[event.target.value.length-1]);
    // let currVal = this.state.value;
    // let addedVal = event.target.value;
    // let newVal = currVal + '' + addedVal;
    // if (currVal === '0' || this.state.newOp) newVal = addedVal;
    // this.setState({value: newVal, newOp: false})
  }
  onOpButtonClick(event) {
    this.onAnyChange(this.state, event.target.value[event.target.value.length-1]);
    // let currVal = this.state.value;
    // let op = event.target.value;
    // switch(op) {
    //   case 'c':
    //     this.setState({value:'0', operator:'', prevValue:''});
    //     break;
    //   case '+':
    //   case '-':
    //   case '/':
    //   case '*':
    //     this.setState({
    //       operator: op,
    //       prevValue: currVal,
    //       newOp: true});
    //     console.log('Previous Value = ' + currVal);
    //     break;
    //   case '=':
    //     let newVal = this.calculate(this.state);
    //     this.setState({
    //       value: newVal,
    //       operator: '',
    //       newOp: true,
    //       prevValue: newVal
    //     })
    //     break;
    //   default:
    //     console.log('in operator button default');
    // }

  }
  onInputChange(event) {
    this.onAnyChange(this.state, event.target.value[event.target.value.length-1]);
    // let currVal = this.state.value;
    // let newChar = event.target.value[event.target.value.length-1];
    // console.log('newChar:' + newChar);
    // let newVal = currVal;
    // if (isNaN(newChar))
    // if (currVal === '0' || this.state.newOp) newVal = newChar;
    // this.setState({value: newVal, newOp: false});
    // console.log(newVal);
  }
  // calculate(state) {
  //   let prevVal = parseInt(state.prevValue, 10);
  //   let val = parseInt(state.value, 10);
  //   let newVal;
  //   switch (this.state.operator) {
  //     case '+':
  //       newVal = prevVal + val;
  //       break;
  //     case '-':
  //       newVal = prevVal - val;
  //       break;
  //     case '/':
  //       newVal = prevVal / val;
  //       break;
  //     case '*':
  //       newVal = prevVal * val;
  //       break;
  //     default:
  //       console.log('in calculate default');
  //   }
  //   return newVal
  // }

  calculate(prevValue, value, operator) {
    let prevVal = parseInt(prevValue, 10);
    let val = parseInt(value, 10);
    let newVal;
    switch (operator) {
      case '+':
        newVal = prevVal + val;
        break;
      case '-':
        newVal = prevVal - val;
        break;
      case '/':
        newVal = prevVal / val;
        break;
      case '*':
        newVal = prevVal * val;
        break;
      default:
        console.log('in calculate default');
    }
    return newVal
  }

  onAnyChange(event) {
    let newChar = event.target.value[event.target.value.length-1];
    let state = this.state;
    let operators = '+-/*';
    if (newChar === 'c') {
      this.setState({value:'0', prevValue: '0', operator: '', step: 'start'});
      console.log('Clear the board!');
      return;
    }
    switch(state.step) {
      case 'start': //start of first value
        if (newChar !== '0' && newChar !== '=') { //drop out and do nothing if the new char is 0 or =
          if (isNaN(newChar) && operators.includes(newChar)){ //if operator, move to secondNumLoop
            this.setState({operator: newChar, step: 'secondNumStart'});
            console.log('Start: We found an operator!');
          } else if (!isNaN(newChar)) { //if a number, move to firstNumLoop
            this.setState({value : newChar, step: 'firstNumLoop'});
            console.log('Start: We found a non-zero number!');
          }
        }
        break;
      case 'firstNumLoop': //looping over first value
        if (!isNaN(newChar)) { //if num 0-9, concat to value
          this.setState({value : state.value + newChar});
          console.log('firstNumLoop: We found a number! Concat to value');
        } else if (operators.includes(newChar)) { //if is an operator, set operator and move to 'secondNumStart'
          this.setState({operator: newChar, step: 'secondNumStart'});
          console.log('firstNumLoop: We found an operator! Move to secondNumStart');
        } else if (newChar === '=') { //if is =, go back to start
          this.setState({step: 'start'});
          console.log('firstNumLoop: We found an =! Go back to start');
        }
        break;
        case 'secondNumStart': //start of next value
          if (!isNaN(newChar)) { //if num 0-9
            if (newChar === '0') {
              this.setState({prevValue : state.value, value: newChar});
              console.log('secondNumStart: We found a non-zero! Concat to value');
            } else {
              this.setState({prevValue : state.value, value: newChar, step: 'secondNumLoop'});
              console.log('secondNumStart: We found a non-zero! start our new value and move to secondNumLoop');
            }
          } else if (operators.includes(newChar)) { //if is an operator, set operator and move to 'secondNumStart'
            this.setState({operator: newChar});
            console.log('secondNumStart: We found another operator! Switch operator');
          } else if (newChar === '=') { //if is =, go back to start
            let nextPrev = parseInt(state.prevValue, 10) !== 0 ? state.prevValue : state.value;
            this.setState({value: this.calculate(nextPrev, state.value, state.operator), prevValue: nextPrev});
            console.log('secondNumStart: We found an =! Go back to start');
          }
          break;
        case 'secondNumLoop': //looping over next value
          if (!isNaN(newChar)) { //if num 0-9
            this.setState({value: state.value + newChar, step: 'secondNumLoop'});
            console.log('secondNumLoop: We found a number! Concat to value');
          } else if (operators.includes(newChar)) { //if is an operator, set operator and move to 'secondNumStart'
            this.setState({value: this.calculate(state.prevValue, state.value, state.operator), operator: newChar, step: 'secondNumStart'});
            console.log('secondNumLoop: We found an operator! Calculate and move to secondNumStart');
          } else if (newChar === '=') { //if is =, go back to start
            this.setState({value: this.calculate(state.prevValue, state.value, state.operator), step: 'secondNumStart', prevValue: state.value});
            console.log('secondNumLoop: We found an =! Calculate and go back to start');
          }
          break;
      default:
    }
    console.log("newChar: " + newChar);
    console.log(state);
  }
  render() {
    return (
      <div className="container">
        <div className="jumbotron">
            {"Avi's Calc"}
        </div>
        <Input value={this.state.value} onInputChange={this.onAnyChange}/>
        <br />
        <Button val='7' onButtonClick={this.onAnyChange}/>
        <Button val='8' onButtonClick={this.onAnyChange}/>
        <Button val='9' onButtonClick={this.onAnyChange}/>
        <Button val='+' onButtonClick={this.onAnyChange}/>
        <br />
        <Button val='4' onButtonClick={this.onAnyChange}/>
        <Button val='5' onButtonClick={this.onAnyChange}/>
        <Button val='6' onButtonClick={this.onAnyChange}/>
        <Button val='-' onButtonClick={this.onAnyChange}/>
        <br />
        <Button val='1' onButtonClick={this.onAnyChange}/>
        <Button val='2' onButtonClick={this.onAnyChange}/>
        <Button val='3' onButtonClick={this.onAnyChange}/>
        <Button val='*' onButtonClick={this.onAnyChange}/>
        <br />
        <Button val='c' onButtonClick={this.onAnyChange}/>
        <Button val='0' onButtonClick={this.onAnyChange}/>
        <Button val='/' onButtonClick={this.onAnyChange}/>
        <Button val='=' onButtonClick={this.onAnyChange}/>
      </div>
    );
  }
}

function Input(props) {
  let textInput=null;
  function handleBlur() {
    textInput.focus();
  }
  return <input className='input'
          ref={(input) => { textInput = input; }}
          value={props.value}
          onChange={props.onInputChange}
          onBlur={handleBlur}
          style={{
              width: '250px'
          }}
          onFocus={function(e) {
            var val = e.target.value;
            e.target.value = '';
            e.target.value = val;
          }}
          autoFocus
          />
}

function Button(props) {
  return <button className='btn btn-default btn-lg'
          onClick={props.onButtonClick}
          value={props.val}
          style={{
            width: '50px',
            margin: '5px'
          }}
        >
          {props.val}
        </button>
}

export default App;
