import { Calendar, Home, Inbox, Search, Settings, LogIn, UserPlus } from "lucide-react";

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

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "SignUp",
    url: "/register",
    icon: UserPlus,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="/profile">
                    <Avatar className="flex items-center justify-start">
                      <AvatarImage
                        className="w-8 h-8 rounded-full"
                        src="https://github.com/shadcn.png"
                      />
                      {/* <AvatarFallback className="absolute">CN</AvatarFallback> */}
                      <span className="ml-3">randomemail@gmail.com</span>
                    </Avatar>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <ModeToggle />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
