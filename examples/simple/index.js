const {useEffect, useState} = React;

function App() {
  const [ctn, updateCtn] = useState('');
  

  return (
    <input onChange={({target: {value}}) => {
      updateCtn(value);
    }} value={ctn} />
  );
}

ReactDOM.render(<App />, document.getElementById("root"));