import "./App.css";
import { useState } from "react";
import getToken from "./components/auth";
const baseUrl = "https://onedrive.live.com/picker";
const params = {
  sdk: "8.0",
  entry: {
    oneDrive: {
      files: {},
    },
  },
  authentication: {},
  messaging: {
    origin: "http://localhost:3000",
    channelId: "27",
  },
  typesAndSources: {
    mode: "files",
    pivots: {
      oneDrive: true,
      recent: true,
    },
  },
};

let win = null;
let port = null;
function App() {
  const [file, setFile] = useState();
  const Picker = async (e) => {
    e.preventDefault();
    win = window.open("", "Picker", "width=800,height=600");

    const authToken = await getToken();

    const queryString = new URLSearchParams({
      filePicker: JSON.stringify(params),
    });

    const url = `${baseUrl}?${queryString}`;

    const form = win.document.createElement("form");
    form.setAttribute("action", url);
    form.setAttribute("method", "POST");
    win.document.body.append(form);

    const input = win.document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "access_token");
    input.setAttribute("value", authToken);
    form.appendChild(input);

    form.submit();

    window.addEventListener("message", (event) => {
      if (event.source && event.source === win) {
        const message = event.data;

        if (
          message.type === "initialize" &&
          message.channelId === params.messaging.channelId
        ) {
          port = event.ports[0];

          port.addEventListener("message", messageListener);

          port.start();

          port.postMessage({
            type: "activate",
          });
        }
      }
    });
  };

  async function messageListener(message) {
    switch (message.data.type) {
      case "notification":
        console.log(`notification: ${message.data}`);
        break;

      case "command":
        port.postMessage({
          type: "acknowledge",
          id: message.data.id,
        });

        const command = message.data.data;

        switch (command.command) {
          case "authenticate":
            const token = await getToken();

            if (typeof token !== "undefined" && token !== null) {
              port.postMessage({
                type: "result",
                id: message.data.id,
                data: {
                  result: "token",
                  token,
                },
              });
            } else {
              console.error(
                `Could not get auth token for command: ${JSON.stringify(
                  command
                )}`
              );
            }

            break;

          case "close":
            win.close();
            break;

          case "pick":
            port.postMessage({
              type: "result",
              id: message.data.id,
              data: {
                result: "success",
              },
            });

            setFile(command.items[0]);
            win.close();
            break;

          default:
            console.warn(`Unsupported command: ${JSON.stringify(command)}`, 2);

            port.postMessage({
              result: "error",
              error: {
                code: "unsupportedCommand",
                message: command.command,
              },
              isExpected: true,
            });
            break;
        }

        break;
    }
  }

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
