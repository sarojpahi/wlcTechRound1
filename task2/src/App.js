import "./App.css";

function App() {
  const upload = async (e) => {
    const access_token = await getToken();
    console.log(access_token);
  };
  return (
    <div className="App">
      <button onClick={upload}>Upload</button>
    </div>
  );
}

export default App;
