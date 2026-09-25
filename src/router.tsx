import { createBrowserRouter, Navigate } from "react-router";
import { GuestRoute } from "./auth/GuestRoute";
import { AuthLayout } from "./layouts/AuthLayout";

const dashboardPage = () => import("./pages/app/DashboardPage").then((m) => ({ Component: m.DashboardPage }));

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/app" replace /> },
  {
    Component: GuestRoute,
    children: [
      {
        Component: AuthLayout,
        children: [
          {
            path: "login",
            lazy: () => import("./pages/auth/LoginPage").then((m) => ({ Component: m.LoginPage })),
          },
          {
            path: "login/mfa",
            lazy: () => import("./pages/auth/MfaPage").then((m) => ({ Component: m.MfaPage })),
          },
          {
            path: "signup",
            lazy: () => import("./pages/auth/SignupPage").then((m) => ({ Component: m.SignupPage })),
          },
          {
            path: "verify-email",
            lazy: () => import("./pages/auth/VerifyEmailPage").then((m) => ({ Component: m.VerifyEmailPage })),
          },
          {
            path: "forgot-password",
            lazy: () => import("./pages/auth/ForgotPasswordPage").then((m) => ({ Component: m.ForgotPasswordPage })),
          },
          {
            path: "forgot-password/verify",
            lazy: () =>
              import("./pages/auth/VerifyResetCodePage").then((m) => ({ Component: m.VerifyResetCodePage })),
          },
          {
            path: "reset-password",
            lazy: () => import("./pages/auth/ResetPasswordPage").then((m) => ({ Component: m.ResetPasswordPage })),
          },
          {
            path: "oauth/callback",
            lazy: () => import("./pages/auth/OAuthCallbackPage").then((m) => ({ Component: m.OAuthCallbackPage })),
          },
        ],
      },
    ],
  },
  {
    // Public for now so the dashboard UI can be reviewed without the backend. Move under ProtectedRoute later.
    lazy: () => import("./layouts/MainLayout").then((m) => ({ Component: m.MainLayout })),
    children: [
      { path: "app", lazy: dashboardPage },
      { path: "app/shared", lazy: dashboardPage },
      { path: "app/starred", lazy: dashboardPage },
      { path: "app/templates", lazy: dashboardPage },
      { path: "app/trash", lazy: dashboardPage },
      { path: "app/folders/:folderId", lazy: dashboardPage },
    ],
  },
]);
