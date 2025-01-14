import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Signup from "./pages/sign-up/Signup.tsx";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "./components/theme-provider.tsx";
import Login from "./pages/login/Login.tsx";
import RoomListing from "./pages/office-rooms/OfficeRooms.tsx";
import RoomDetailsPage from "./pages/room-details/RoomDetails.tsx";
import { AuthProvider } from "./contexts/UserContext.tsx";
import EditUser from "./pages/edit-user/EditUser.tsx";
import UserProfile from "./pages/user-profile/UserProfile.tsx";
import AdminPanel from "./pages/admin-panel/AdminPanel.tsx";
import { ProtectedRoute } from "./components/protectedRoute/ProtectedRoute.tsx";
import EditCompany from "./pages/edit-company/EditCompany.tsx";
import UserNotifications from "./pages/user-notifications/UserNotifications.tsx";
import PaymentHistory from "./pages/payment-history/PaymentHistory.tsx";
import SuccessPayment from "./pages/payment-status/SuccessPayment.tsx";
import FailurePayment from "./pages/payment-status/FailurePayment.tsx";
import CalendarPage from "@/pages/calendar/CalendarPage.tsx";

const RootLayout = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <Outlet />
      </SidebarProvider>
    </ThemeProvider>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "/", element: <App title="Home" /> },
          { path: "/rooms", element: <RoomListing /> },
          { path: "/room-details/:id", element: <RoomDetailsPage /> },
          { path: "/profile", element: <UserProfile /> },
          { path: "/notifications", element: <UserNotifications /> },
          { path: "/payments", element: <PaymentHistory /> },
          { path: "/payment-success", element: <SuccessPayment /> },
          { path: "/payment-failure", element: <FailurePayment /> },
          {path: "/calendar", element: <CalendarPage />},
        ],
      },

      {
        element: <ProtectedRoute requireAdmin />,
        children: [
          { path: "/users/edit/:id", element: <EditUser /> },
          { path: "/companies/edit/:id", element: <EditCompany /> },
          { path: "/admin-panel", element: <AdminPanel /> },
        ],
      },

      {
        path: "*",
        element: <div>404 - Page Not Found</div>,
      },
    ],
  },
]);

// Main render
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
