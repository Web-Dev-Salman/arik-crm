import {
  LayoutDashboard, FolderOpen, Calculator, Users, SquareCheckBig,
  CalendarDays, Mail, Library, MessagesSquare, BarChart3, Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const portalNav: NavItem[] = [
  { label: "Dashboard",   href: "/dashboard",   icon: LayoutDashboard },
  { label: "Cases",       href: "/cases",       icon: FolderOpen },
  { label: "Eligibility", href: "/eligibility", icon: Calculator },
  { label: "Contacts",    href: "/contacts",    icon: Users },
  { label: "Tasks",       href: "/tasks",       icon: SquareCheckBig },
  { label: "Calendar",    href: "/calendar",    icon: CalendarDays },
  { label: "Email",       href: "/email",       icon: Mail },
  { label: "Library",     href: "/library",     icon: Library },
  { label: "Messages",    href: "/messages",    icon: MessagesSquare },
  { label: "Reports",     href: "/reports",     icon: BarChart3 },
  { label: "Settings",    href: "/settings",    icon: Settings },
];