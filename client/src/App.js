import "./App.css";
import launchPicker from "./components/picker";
import { useState } from "react";
function App() {
  const [file, setFile] = useState();
  const Picker = (e) => {
    launchPicker(e).then(() => {
      setFile(JSON.parse(localStorage.getItem("item")));
    });
  };
  console.log(file);
  return (
    <div className="App">
      <button onClick={Picker}>Picker</button>
      {file ? (
        <div>
          <div
            style={{
              margin: "10px 0",
            }}
          >
            Name : {file.name}
          </div>
          <a
            target={"_blank"}
            rel="noreferrer"
            href={file.webUrl}
            style={{ color: "blue" }}
          >
            Link : {file.webUrl}
          </a>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
