// import React, { StrictMode } from "react";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MoralisProvider } from "react-moralis";
import "./index.css";
import QuickStart from "components/Home";

/** Get your free Moralis Account https://moralis.io/ */
// const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
// const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;
const APP_ID="imAomu1AxniYv9w4fYeC11nOkoHwZuAGOmbxCImB";
const SERVER_URL="https://npp1xps7vlrl.usemoralis.com:2053/server";

const Application = () => {
  const isServerInfo = APP_ID && SERVER_URL ? true : false;
  //Validate
  if (!APP_ID || !SERVER_URL) {
    throw new Error(
      "Missing Moralis Application ID or Server URL. Make sure to set your .env file."
    );
  }

  return isServerInfo ? (
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
      <App />
    </MoralisProvider>
  ) : (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <QuickStart />
    </div>
  );
};

ReactDOM.render(
  // <StrictMode>
    <Application />,
  // </StrictMode>,
  document.getElementById("root")
);
