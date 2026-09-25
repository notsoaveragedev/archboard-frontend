import { StyleProvider, px2remTransformer } from "@ant-design/cssinjs";
import { App as AntApp, ConfigProvider } from "antd";
import { StrictMode } from "react";
import { IconContext } from "react-icons";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./auth/AuthProvider";
import { router } from "./router";
import { antdTheme } from "./theme/antdTheme";
import "./index.css";

// antd tokens are written in px; this converts antd's generated CSS to rem (1rem = 16px).
const px2rem = px2remTransformer({ rootValue: 16 });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyleProvider layer transformers={[px2rem]}>
      <ConfigProvider theme={antdTheme} modal={{ centered: true }}>
        <AntApp notification={{ placement: "bottomRight", maxCount: 3, stack: { threshold: 3 } }}>
          <IconContext value={{ attr: { strokeWidth: "1.5" } }}>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </IconContext>
        </AntApp>
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>,
);
