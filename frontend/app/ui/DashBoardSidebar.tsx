"use client";

import { Variant } from "../lib/page-utils";
import MenuButton from "./MenuButton";

 type SidebarLink = {
  id: string;
  label: string;
  iconSrc: string;
  active: boolean;
  onClick: () => void;
};


interface DashboardSidebarProps {
  variant: Variant;
  title: string;
  subtitle: string;
  avatarText: string;
  links: SidebarLink[];
  onLogout: () => void | Promise<void>;
  logoutLabel?: string;
}

const VARIANT_CLASSES: Record<
  Variant,
  {
    wrapper: string;
    subtitle: string;
    logoutBtn: string;
  }
> = {
  admin: {
    wrapper: "bg-slate-900 text-slate-50",
    subtitle: "text-slate-400",
    logoutBtn:
      "bg-slate-800 text-slate-50 hover:bg-slate-700",
  },
  user: {
    wrapper:
      "bg-linear-to-b from-amber-200 via-amber-300 to-amber-400 text-slate-900",
    subtitle: "text-amber-900/80",
    logoutBtn:
      "bg-amber-800 text-white hover:bg-amber-700",
  },
};

const DashBoardSidebar = ({
  variant,
  title,
  subtitle,
  avatarText,
  links,
  onLogout,
  logoutLabel = "Log out",
}: DashboardSidebarProps) => {
  const v = VARIANT_CLASSES[variant];

  return (
    <aside
      className={`hidden md:flex md:w-64 lg:w-72 ${v.wrapper} flex-col py-6 px-4 shadow-xl`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="h-10 w-10 rounded-2xl bg-white/90 flex items-center justify-center shadow-md">
          <span className="font-bold text-xl text-amber-700">
            {avatarText}
          </span>
        </div>
        <div>
          <p className={`text-sm font-semibold tracking-wide uppercase ${variant === 'admin' ? "text-slate-200" : "text-amber-800"}`}>
            {title}
          </p>
          <p className={`text-xs ${v.subtitle}`}>{subtitle}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-2 flex-1">
        {links.map((link) => (
          <MenuButton
            key={link.id}
            active={link.active}
            label={link.label}
            iconSrc={link.iconSrc}
            onClick={link.onClick}
            variant={variant}
          />
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold px-4 py-2 shadow-md transition ${v.logoutBtn}`}
      >
        <span>{logoutLabel}</span>
      </button>
    </aside>
  );
};

export default DashBoardSidebar;
