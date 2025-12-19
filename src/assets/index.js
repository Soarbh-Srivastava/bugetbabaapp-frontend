import logo from "./logo.png";
import login_bg from "./login-bg.jpg";
import hero from "./hero.png";
import { Home, Wallet, TrendingDown, Tags, Filter } from "lucide-react"; // Import icons

export const assets = {
  logo,
  login_bg,
  hero,
};

// Sidebar navigation data
export const SIDE_BAR_DATA = [
  {
    id: 1,
    label: "Home",
    icon: Home,
    path: "/home",
  },
  {
    id: 2,
    label: "Income",
    icon: Wallet,
    path: "/income",
  },
  {
    id: 3,
    label: "Expense",
    icon: TrendingDown,
    path: "/expense",
  },
  {
    id: 4,
    label: "Category",
    icon: Tags,
    path: "/category",
  },
  {
    id: 5,
    label: "Filter",
    icon: Filter,
    path: "/filter",
  },
];
