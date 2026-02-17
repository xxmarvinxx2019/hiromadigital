import {
  LayoutDashboard,
  Users,
  KeyRound,
  Boxes,
  GitBranch,
  Coins,
  Wallet,
  Settings,
  UserPlus,
  List,
} from "lucide-react";

export const navConfig = [
  /* ================= DASHBOARD ================= */
  {
    type: "item",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "admin",
      "regional_distributor",
      "provincial_distributor",
      "city_distributor",
      "reseller",
    ],
  },

  /* ================= ADMIN ================= */
  /*{
    type: "item",
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["admin"],
  },*/
  {
  type: "item",
  label: "Distributors",
  href: "/dashboard/distributors",
  icon: Users,
  roles: ["admin"],
},
  {
    type: "item",
    label: "PIN Codes",
    href: "/dashboard/pin-codes",
    icon: KeyRound,
    roles: ["admin"],
  },
  {
    type: "item",
    label: "Withdrawals",
    href: "/dashboard/admin/withdrawals",
    icon: Wallet,
    roles: ["admin"],
  },

  /* ================= DISTRIBUTOR ================= */
  {
    type: "item",
    label: "PIN Codes",
    href: "/dashboard/pin",
    icon: KeyRound,
    roles: [
      "regional_distributor",
      "provincial_distributor",
      "city_distributor",
    ],
  },
  {
    type: "item",
    label: "Register Reseller",
    href: "/dashboard/resellers/register",
    icon: UserPlus,
    roles: [
      "regional_distributor",
      "provincial_distributor",
      "city_distributor",
    ],
  },
  {
    type: "item",
    label: "Reseller List",
    href: "/dashboard/resellers",
    icon: List,
    roles: [
      "regional_distributor",
      "provincial_distributor",
      "city_distributor",
    ],
  },
  {
    type: "item",
    label: "Withdrawals",
    href: "/dashboard/withdrawals",
    icon: Wallet,
    roles: [
      "regional_distributor",
      "provincial_distributor",
      "city_distributor",
    ],
  },

  /* ================= RESELLER MLM ================= */
  {
    type: "group",
    label: "My Network",
    roles: ["reseller"],
    items: [
      {
        label: "Binary Tree",
        href: "/dashboard/network/tree",
        icon: GitBranch,
      },
      {
        label: "My Referrals",
        href: "/dashboard/network/referrals",
        icon: Users,
      },
    ],
  },

  {
    type: "group",
    label: "Earnings",
    roles: ["reseller"],
    items: [
      {
        label: "Wallet",
        href: "/dashboard/wallet",
        icon: Wallet,
      },
      {
        label: "Points & Pairing",
        href: "/dashboard/earnings/points",
        icon: Coins,
      },
      {
        label: "Withdrawals",
        href: "/dashboard/withdrawals",
        icon: Wallet,
      },
    ],
  },

  /* ================= INVENTORY ================= */
  {
    type: "group",
    label: "Inventory",
    roles: [
      "admin",
      "regional_distributor",
      "provincial_distributor",
      "city_distributor",
      "reseller",
    ],
    items: [
      {
        label: "Overview Products",
        href: "/dashboard/inventory/products",
        icon: Boxes,
        roles: ["admin"],
      },
      {
        label: "My Inventory",
        href: "/dashboard/inventory",
        icon: Boxes,
        roles: [
          "regional_distributor",
          "provincial_distributor",
          "city_distributor",
          "reseller",
        ],
      },
      /*{
        label: "Products",
        href: "/dashboard/inventory/products",
        icon: Boxes,
        roles: ["admin"],
      },*/
      /*{
        label: "Transactions",
        href: "/dashboard/inventory-transactions",
        icon: Boxes,
        roles: ["admin"],
      },*/
      {
        label: "Request Stock",
        href: "/dashboard/inventory/request",
        icon: Boxes,
        roles: [
          "regional_distributor",
          "provincial_distributor",
          "city_distributor",
          "reseller",
        ],
      },
    ],
  },

  /* ================= SETTINGS ================= */
  {
    type: "item",
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: [
      "admin",
      "regional_distributor",
      "provincial_distributor",
      "city_distributor",
      "reseller",
    ],
  },
];
