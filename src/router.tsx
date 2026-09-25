import { createBrowserRouter, Navigate } from "react-router";
import { GuestRoute } from "./auth/GuestRoute";
import { LayoutErrorBoundary, RootErrorBoundary } from "./components/errors/RouteErrorBoundary";
import { FullPageLoader } from "./components/ui/FullPageLoader";
import { AuthLayout } from "./layouts/AuthLayout";
import { RootLayout } from "./layouts/RootLayout";
import { lazyPage } from "./lib/lazyPage";
import { InAppNotFoundPage, NotFoundPage } from "./pages/NotFoundPage";
import { RequirePermission } from "./rbac/RequirePermission";

const dashboardPage = lazyPage(() => import("./pages/app/DashboardPage"), "DashboardPage");

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    ErrorBoundary: RootErrorBoundary,
    HydrateFallback: FullPageLoader,
    children: [
      { path: "/", element: <Navigate to="/app" replace /> },
      {
        Component: GuestRoute,
        children: [
          {
            Component: AuthLayout,
            children: [
              {
                ErrorBoundary: LayoutErrorBoundary,
                children: [
                  { path: "login", lazy: lazyPage(() => import("./pages/auth/LoginPage"), "LoginPage") },
                  { path: "login/mfa", lazy: lazyPage(() => import("./pages/auth/MfaPage"), "MfaPage") },
                  { path: "signup", lazy: lazyPage(() => import("./pages/auth/SignupPage"), "SignupPage") },
                  { path: "verify-email", lazy: lazyPage(() => import("./pages/auth/VerifyEmailPage"), "VerifyEmailPage") },
                  {
                    path: "forgot-password",
                    lazy: lazyPage(() => import("./pages/auth/ForgotPasswordPage"), "ForgotPasswordPage"),
                  },
                  {
                    path: "forgot-password/verify",
                    lazy: lazyPage(() => import("./pages/auth/VerifyResetCodePage"), "VerifyResetCodePage"),
                  },
                  {
                    path: "reset-password",
                    lazy: lazyPage(() => import("./pages/auth/ResetPasswordPage"), "ResetPasswordPage"),
                  },
                  {
                    path: "oauth/callback",
                    lazy: lazyPage(() => import("./pages/auth/OAuthCallbackPage"), "OAuthCallbackPage"),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        // Public for now so the dashboard UI can be reviewed without the backend. Move under ProtectedRoute later.
        lazy: lazyPage(() => import("./layouts/AppProviders"), "AppProviders"),
        children: [
          {
            lazy: lazyPage(() => import("./layouts/MainLayout"), "MainLayout"),
            children: [
              {
                ErrorBoundary: LayoutErrorBoundary,
                children: [
                  { path: "app", lazy: dashboardPage },
                  { path: "app/shared", lazy: dashboardPage },
                  { path: "app/starred", lazy: dashboardPage },
                  { path: "app/templates", lazy: dashboardPage },
                  { path: "app/trash", lazy: dashboardPage },
                  { path: "app/folders/:folderId", lazy: dashboardPage },
                  { path: "app/*", Component: InAppNotFoundPage },
                ],
              },
            ],
          },
          {
            path: "app/settings",
            lazy: lazyPage(() => import("./layouts/SettingsLayout"), "SettingsLayout"),
            children: [
              {
                ErrorBoundary: LayoutErrorBoundary,
                children: [
                  { index: true, element: <Navigate to="profile" replace /> },
                  { path: "profile", lazy: lazyPage(() => import("./pages/settings/ProfilePage"), "ProfilePage") },
                  {
                    path: "preferences",
                    lazy: lazyPage(() => import("./pages/settings/PreferencesPage"), "PreferencesPage"),
                  },
                  {
                    path: "notifications",
                    lazy: lazyPage(() => import("./pages/settings/NotificationsPage"), "NotificationsPage"),
                  },
                  { path: "security", lazy: lazyPage(() => import("./pages/settings/SecurityPage"), "SecurityPage") },
                  { path: "account", lazy: lazyPage(() => import("./pages/settings/AccountPage"), "AccountPage") },
                  {
                    path: "workspace/general",
                    lazy: lazyPage(() => import("./pages/settings/WorkspaceGeneralPage"), "WorkspaceGeneralPage"),
                  },
                  {
                    element: <RequirePermission permission="members.view" />,
                    children: [
                      {
                        path: "workspace/members",
                        lazy: lazyPage(() => import("./pages/settings/MembersPage"), "MembersPage"),
                      },
                    ],
                  },
                  {
                    element: <RequirePermission permission="roles.manage" />,
                    children: [
                      { path: "workspace/roles", lazy: lazyPage(() => import("./pages/settings/RolesPage"), "RolesPage") },
                    ],
                  },
                  {
                    element: <RequirePermission permission="security.manage" />,
                    children: [
                      {
                        path: "workspace/security",
                        lazy: lazyPage(() => import("./pages/settings/WorkspaceSecurityPage"), "WorkspaceSecurityPage"),
                      },
                    ],
                  },
                  {
                    element: <RequirePermission permission="auditLog.view" />,
                    children: [
                      {
                        path: "workspace/audit-log",
                        lazy: lazyPage(() => import("./pages/settings/AuditLogPage"), "AuditLogPage"),
                      },
                    ],
                  },
                  {
                    element: <RequirePermission permission="billing.view" />,
                    children: [
                      {
                        path: "workspace/billing",
                        lazy: lazyPage(() => import("./pages/settings/BillingPage"), "BillingPage"),
                      },
                    ],
                  },
                  { path: "*", Component: InAppNotFoundPage },
                ],
              },
            ],
          },
        ],
      },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
