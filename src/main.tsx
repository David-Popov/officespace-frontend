import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./pages/sign-up/Signup.tsx";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "./components/theme-provider.tsx";
import Login from "./pages/login/Login.tsx";
import RoomListing from "./pages/office-rooms/OfficeRooms.tsx";
import Users from "./pages/users/Users.tsx";
import ChangePassword from "./pages/change-password/ChangePassword.tsx";
import ReportIssue from "./pages/report-issue/report.tsx";
import RoomDetailsPage from "./pages/room-details/RoomDetails.tsx";
import { AuthProvider } from "./contexts/UserContext.tsx";

const Router = () => {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <RouterProvider router={router} />
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App title="something" />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/rooms",
    element: <RoomListing />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
  {
    path: "/report-issue",
    element: <ReportIssue />,
  },
  {
    path: "/room-details",
    element: <RoomDetailsPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <StrictMode>
      <Router />
    </StrictMode>
  </AuthProvider>
);
