export const adminLinks = [
  {
    label: "Dashboard",
    icon: "dashboard",
    to: "/dashboard",
  },
  {
    label: "Tenants",
    icon: "tenants",
    to: "/dashboard/tenants",
  },
  {
    label: "Landlords",
    icon: "landlords",
    to: "/dashboard/landlords",
  },
  {
    label: "Managers",
    icon: "managers",
    to: "/dashboard/managers",
  },
  {
    label: "Maintenance",
    icon: "maintenance",
    to: "/dashboard/maintenance",
  },
  {
    label: "Appointments",
    icon: "appointments",
    to: "/dashboard/appointments",
  },
  {
    label: "Support",
    icon: "support",
    to: "/dashboard/support",
  },
  {
    label: "Settings",
    icon: "settings",
    submenu: [
      {
        to: "/dashboard/settings/account",
        icon: "account",
        label: "Account",
      },
      {
        to: "/dashboard/settings/changePassword",
        icon: "changePassword",
        label: "Change Password",
      },
      { to: "/dashboard/settings/about-us", icon: "arrow", label: "About us" },
      {
        to: "/dashboard/settings/terms",
        icon: "arrow",
        label: "Terms & Conditions",
      },
      {
        to: "/dashboard/settings/faq",
        icon: "faq",
        label: "FAQ",
      },
    ],
  },
];
