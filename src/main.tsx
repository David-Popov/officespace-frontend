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
import Users from "./pages/users/Users.tsx";
import RoomDetailsPage from "./pages/room-details/RoomDetails.tsx";
import { AuthProvider } from "./contexts/UserContext.tsx";
<<<<<<< Updated upstream
=======
import EditUser from "./pages/edit-user/EditUser.tsx";
import UserProfile from "./pages/user-profile/UserProfile.tsx";
>>>>>>> Stashed changes

// Create a root layout component that includes the sidebar
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
        path: "/room-details/:id",
        element: <RoomDetailsPage />,
      },
<<<<<<< Updated upstream
=======
      {
        path: "/users/edit/:id",
        element: <EditUser />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
>>>>>>> Stashed changes
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
