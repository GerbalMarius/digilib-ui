"use client";

import Image from "next/image";
import { Variant } from "../lib/page-utils";

interface MenuButtonProps {
  active: boolean;
  label: string;
  iconSrc: string;
  onClick: () => void;
  variant?: Variant;
}

const MENU_VARIANTS: Record<
  Variant,
  { base: string; active: string }
> = {
  admin: {
    active: "bg-slate-800 text-slate-50 shadow-sm",
    base: "text-slate-200 hover:bg-slate-800/70 hover:text-white",
  },
  user: {
    // darker, less “white” accents
    active:
      "bg-amber-100 text-amber-900 shadow-sm border border-amber-200",
    base:
      "text-amber-900/80 hover:bg-amber-50 hover:text-amber-950",
  },
};

const MenuButton = ({
  active,
  label,
  iconSrc,
  onClick,
  variant = "admin",
}: MenuButtonProps) => {
  const v = MENU_VARIANTS[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
        active ? v.active : v.base
      }`}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center">
        <Image src={iconSrc} alt={label} width={18} height={18} />
      </span>
      <span>{label}</span>
    </button>
  );
};

export default MenuButton;
