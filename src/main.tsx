import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, theme } from "@chakra-ui/react";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
);
