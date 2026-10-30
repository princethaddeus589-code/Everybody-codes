import { useEffect, useState, useCallback } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: "⌂" },
  { name: "My Portfolios", path: "/my-portfolios", icon: "▤" },
  { name: "Templates", path: "/templates", icon: "▦" },
  { name: "Settings", path: "/settings", icon: "⚙" },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "";

  const applyAppearance = useCallback((appearance) => {
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const isDark =
      appearance === "dark" ||
      (appearance === "system" && systemDark);

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark
      ? "dark"
      : "light";

    document.body.style.backgroundColor = isDark ? "#000000" : "#f7f7f7";
    document.body.style.color = isDark ? "#ffffff" : "#171717";
  }, []);

  useEffect(() => {
    const loadAppearance = () => {
      const saved = localStorage.getItem("appearance") || "light";
      applyAppearance(saved);
    };

    const handleAppearanceChange = (event) => {
      const appearance =
        event.detail || localStorage.getItem("appearance") || "light";
      applyAppearance(appearance);
    };

    const handleStorage = (event) => {
      if (event.key === "appearance") {
        applyAppearance(event.newValue || "light");
      }
    };

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = () => {
      if (localStorage.getItem("appearance") === "system") {
        applyAppearance("system");
      }
    };

    loadAppearance();

    window.addEventListener("appearance-change", handleAppearanceChange);
    window.addEventListener("storage", handleStorage);
    media.addEventListener("change", handleSystemChange);

    return () => {
      window.removeEventListener("appearance-change", handleAppearanceChange);
      window.removeEventListener("storage", handleStorage);
      media.removeEventListener("change", handleSystemChange);
    };
  }, [applyAppearance]);

  function handleLogout() {
    sessionStorage.removeItem("auth_token");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#171717] transition-colors dark:bg-black dark:text-white md:flex">
      {/* Sidebar */}
      <aside className="w-full border-b border-gray-200 bg-white p-4 dark:border-[#262626] dark:bg-[#0a0a0a] md:flex md:w-64 md:flex-col md:border-b-0 md:border-r md:p-5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold tracking-tight">A.</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">
              Portfolio Generator
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm md:hidden dark:border-[#333]"
            onClick={() => setMobileMenu((v) => !v)}
          >
            {mobileMenu ? "Close" : "Menu"}
          </button>
        </div>

        <nav
          className={`${
            mobileMenu ? "flex" : "hidden"
          } flex-col gap-1 md:flex`}
        >
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenu(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#1a1a1a]"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto hidden pt-8 md:block">
          <div className="rounded-xl border border-gray-200 p-3 dark:border-[#292929]">
            <p className="truncate text-sm font-semibold">{userName}</p>
            <p className="truncate text-xs text-gray-500">{userEmail}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full rounded-lg border border-gray-200 py-2 text-xs font-semibold transition hover:bg-gray-50 dark:border-[#333] dark:hover:bg-[#1a1a1a]"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 md:hidden dark:border-[#262626]">
          <div>
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold dark:border-[#333]"
          >
            Sign out
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
