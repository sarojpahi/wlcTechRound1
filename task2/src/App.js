import React from "react";
import "./App.css";
import { useState } from "react";
import { ReactOneDriveFilePicker } from "react-onedrive-filepicker";
export default function App() {
  const [file, setFile] = useState();
  return (
    <div className="App">
      <ReactOneDriveFilePicker
        clientID="c3e71009-3dd7-4fc8-9127-2de5ac14c89f"
        action="share"
        multiSelect={false}
        onSuccess={(result) => {
          console.log(result.value[0]);
          setFile(result.value[0]);
        }}
        onCancel={(result) => {
          alert(JSON.stringify(result));
        }}
      >
        <button>Picker</button>
      </ReactOneDriveFilePicker>
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
          <div style={{ marginTop: "10px" }}>
            <a
              target={"_blank"}
              rel="noreferrer"
              href={file["@microsoft.graph.downloadUrl"]}
              style={{ color: "blue" }}
            >
              Download
            </a>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
