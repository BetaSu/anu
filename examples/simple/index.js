const {useEffect, useState} = React;

function App() {
  // const [ctn, updateCtn] = useState('');
  let len = 3000;

  return (
    <ul>{Array(len).fill(0).map((_, i) => <li key={i}>{i}</li>)}</ul>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));