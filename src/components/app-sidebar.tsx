import { Calendar, Home, LogIn, UserPlus, DoorOpen, Users, LogOut, LogOutIcon, ChevronDown, BellIcon, CreditCardIcon, CircleUserIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ModeToggle } from "./ui/mode-toggle";
import { useAuth } from "@/contexts/UserContext";
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
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
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

const dropdownItems = [
  {
    title: "View profile",
    url: "/profile",
    icon: CircleUserIcon,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCardIcon,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: BellIcon,
  },
  {
    title: "Logout",
    url: "/",
    icon: LogOutIcon,
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

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const handleLogout = (url: string) => {
    logout();
    navigate(url);
  };

  const renderAvatar = () => (
    <Avatar className="flex items-center justify-start cursor-pointer select-none">
      <AvatarImage className="w-8 h-8 rounded-full" src="https://github.com/shadcn.png" />
      <div className="ml-3">
        <span className="block text-sm font-semibold">{user ? `${user.firstName} ${user.lastName}` : "Random User"}</span>
        <span className="block text-xs text-gray-500 mb-2">{user ? user.email : "randomemail@gmail.com"}</span>
      </div>
    </Avatar>
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroupLabel>OfficeSpace</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <button onClick={() => handleNavigation(item.url)}>
                    <item.icon />
                    <span>{item.title}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarHeader>

      <SidebarContent ></SidebarContent>

      <SidebarFooter>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton >
                    <button className="flex items-center  w-full">
                      {renderAvatar()}
                      <ChevronDown className="ml-auto" />
                    </button>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                  {renderAvatar()}
                  <DropdownMenuSeparator />
                  {dropdownItems.map((item, index) => {
                    if (item.title === "Logout") {
                      return (
                        <>
                          <DropdownMenuSeparator key="logout-separator" />
                          <DropdownMenuItem key={index} onClick={() => handleLogout("/")}>
                            <LogOutIcon />
                            <span>{item.title}</span>
                          </DropdownMenuItem>
                        </>
                      );
                    } else if (item.title === "Notifications") {
                      return (
                        <>
                          <DropdownMenuItem key={index} onClick={() => handleNavigation(item.url)}>
                            <item.icon />
                            <span>{item.title}</span>
                          </DropdownMenuItem>
                        </>
                      );
                    } else {
                      return (
                        <DropdownMenuItem key={index} onClick={() => handleNavigation(item.url)}>
                          <item.icon />
                          <span>{item.title}</span>
                        </DropdownMenuItem>
                      );
                    }
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <div className="p-2">
                <ModeToggle />
              </div>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  );
}
