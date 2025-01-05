// src/components/AppSidebar.tsx
import {
  Calendar,
  Home,
  LogIn,
  UserPlus,
  DoorOpen,
  Users,
  LogOut,
  LogOutIcon,
  ChevronDown,
  BellIcon,
  CreditCardIcon,
  CircleUserIcon,
} from "lucide-react";
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
import React from "react";
import { UserNotificationDto } from "@/types/users.types";

const publicItems = [
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

const authenticatedItems = [
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

const adminItems = [
  {
    title: "Admin",
    url: "/admin-panel",
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
    title: "Payment History",
    url: "/payments",
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
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const unreadNotificationsCount =
    user?.notifications?.filter((notification: UserNotificationDto) => !notification.read).length ||
    0;

  const NotificationBadge = ({ count }: { count: number }) => {
    if (count === 0) return null;

    return (
      <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center bg-red-500 text-white rounded-full">
        {count > 99 ? "99+" : count}
      </span>
    );
  };

  const getMenuItems = () => {
    if (!isAuthenticated) {
      return [...publicItems];
    }

    let items = [...authenticatedItems];
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
        <span className="block text-sm font-semibold">
          {user ? `${user.firstName} ${user.lastName}` : "Random User"}
        </span>
        <span className="block text-xs text-gray-500 mb-2">
          {user ? user.email : "randomemail@gmail.com"}
        </span>
      </div>
    </Avatar>
  );

  const renderMenuItem = (item: (typeof menuItems)[0]) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <button onClick={() => handleNavigation(item.url)} className="relative w-full">
          <div className="flex items-center w-full gap-2">
            <div className="relative">
              <item.icon className="h-4 w-4" />
              {item.title === "Notifications" && unreadNotificationsCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-[10px] text-white rounded-full h-3 w-3 flex items-center justify-center">
                  {unreadNotificationsCount}
                </div>
              )}
            </div>
            <span>{item.title}</span>
          </div>
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const renderDropdownItems = () => {
    return dropdownItems.map((item, index) => {
      if (item.title === "Logout") {
        return (
          <React.Fragment key={index}>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout(item.url)}>
              <div className="flex items-center gap-2">
                <LogOutIcon className="h-4 w-4" />
                <span>{item.title}</span>
              </div>
            </DropdownMenuItem>
          </React.Fragment>
        );
      }

      if (item.title === "Notifications") {
        return (
          <DropdownMenuItem key={index} onClick={() => handleNavigation(item.url)}>
            <div className="flex items-center w-full gap-2">
              <div className="relative">
                <BellIcon className="h-4 w-4" />
                {unreadNotificationsCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-[10px] text-white rounded-full h-3 w-3 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </div>
                )}
              </div>
              <span>{item.title}</span>
            </div>
          </DropdownMenuItem>
        );
      }

      return (
        <DropdownMenuItem key={index} onClick={() => handleNavigation(item.url)}>
          <div className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </div>
        </DropdownMenuItem>
      );
    });
  };

  const renderFooterContent = () => {
    if (!isAuthenticated) {
      return null;
    }

    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <div className="flex items-center w-full">
                {renderAvatar()}
                <ChevronDown className="ml-auto" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
            {renderAvatar()}
            <DropdownMenuSeparator />
            {renderDropdownItems()}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroupLabel>OfficeSpace</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>{menuItems.map(renderMenuItem)}</SidebarMenu>
        </SidebarGroupContent>
      </SidebarHeader>

      <SidebarContent />

      <SidebarFooter>
        <SidebarGroupContent>
          <SidebarMenu>
            {renderFooterContent()}
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
