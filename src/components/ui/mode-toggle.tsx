import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="flex items-center justify-between w-32 px-2 py-1 space-x-2">
          <Sun
            className={` ${theme === 'light' ? 'text-yellow-500' : 'text-gray-500'}`}
          />
          <Moon
            className={`${theme === 'dark' ? 'text-blue-500' : 'text-gray-500'}`}
          />
          <Laptop
            className={`${theme === 'system' ? 'text-green-500' : 'text-gray-500'}`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg ml-8">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
        >
          <Sun className={`${theme === 'light' ? 'text-yellow-500' : 'text-gray-500'} h-[1.2rem] w-[1.2rem]`} />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
        >
          <Moon className={`${theme === 'dark' ? 'text-blue-500' : 'text-gray-500'} h-[1.2rem] w-[1.2rem]`} />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
        >
          <Laptop className={`${theme === 'system' ? 'text-green-500' : 'text-gray-500'} h-[1.2rem] w-[1.2rem]`} />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
