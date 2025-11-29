export type MenuState = "closed" | "opening" | "open" | "closing";

type NavLink = {
    label: string;
    href: string;
};

export interface NavBarProps {
    links: NavLink[];
    orientation?: "horizontal" | "vertical";
    showLogo?: boolean;
    brandName?: string;
    logoSrc?: string;
    showButton?: boolean;
    buttonLabel?: string;
    buttonHref?: string;
}