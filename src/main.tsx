import { StyleProvider } from "@ant-design/cssinjs";
import { App as AntApp, ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./auth/AuthProvider";
import { router } from "./router";
import { antdTheme } from "./theme/antdTheme";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyleProvider layer>
      <ConfigProvider theme={antdTheme}>
        <AntApp>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </AntApp>
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>,
);
