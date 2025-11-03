import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, TrendingUpDown } from "lucide-react";
import { Link } from "react-router";

export default function ProfileButton() {
  const { user, logout } = useAuth();

  const getInitials = (name: string = "") =>
    name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-primary transition">
          <Avatar className="h-9 w-9">
            {user?.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : (
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-2">
          <p className="font-medium text-sm">{user?.name || "Guest"}</p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email || "Not signed in"}
          </p>
        </div>
        <DropdownMenuItem className="">
          <Link to={"/analytics"} className="flex items-center justify-center">
            <TrendingUpDown className="mr-2 h-4 w-4" />
            Analytics
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}