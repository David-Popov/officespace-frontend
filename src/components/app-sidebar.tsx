import { Calendar, Home, LogIn, UserPlus, DoorOpen, Users, LogOut, LogOutIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ModeToggle } from "./ui/mode-toggle";
import { useAuth } from "@/contexts/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const baseItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Rooms",
    url: "/rooms",
    icon: DoorOpen,
  },
];

const authItems = [
  {
    title: "SignUp",
    url: "/signup",
    icon: UserPlus,
  },
  {
    title: "Login",
    url: "/login",
    icon: LogIn,
  },
];

const adminItems = [
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
];

export function AppSidebar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const getMenuItems = () => {
    let items = [...baseItems];

    if (!user) {
      items = [...items, ...authItems];
    }

    if (isAdmin) {
      items = [...items, ...adminItems];
    }

    return items;
  };

  const menuItems = getMenuItems();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel>OfficeSpace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user && (
                <SidebarMenuItem key={"logout"}>
                  <SidebarMenuButton asChild onClick={handleLogout}>
                    <a href="#">
                      <LogOut />
                      <span>Logout</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <a href="/profile" className="w-full">
                      <Avatar className="flex items-center justify-start">
                        <AvatarImage
                          className="w-8 h-8 rounded-full"
                          src="https://github.com/shadcn.png"
                        />
                        <span className="ml-3 text-sm truncate">
                          {user ? user.email : "randomemail@gmail.com"}
                        </span>
                      </Avatar>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <div className="px-3">
                    <ModeToggle />
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
