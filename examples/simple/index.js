class X extends React.Component {
  state = {s: 0};

  render() {
    if (this.state.s === 0) {
      return (
        <div>
          <span>0</span>
        </div>
      );
    } else {
      return <div>1</div>;
    }
  }

  go = () => {
    this.setState({s: 1});
    this.setState({s: 0});
    this.setState({s: 1});
  };
}

class Y extends React.Component {
  render() {
    return (
      <div>
        <Z />
      </div>
    );
  }
}

class Z extends React.Component {
  render() {
    return <div />;
  }

  UNSAFE_componentWillUpdate() {
    x.go();
  }
}


const x = ReactDOM.render(<X />, document.querySelector('#root'));
const y = ReactDOM.render(<Y />, document.querySelector('#root1'));


console.log(ReactDOM.findDOMNode(x).textContent)
// .toBe('0');

y.forceUpdate();
console.log(ReactDOM.findDOMNode(x).textContent)
// .toBe('1');