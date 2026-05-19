// ============================================================
// Nav.jsx
// 左固定サイドバーナビゲーション
// ============================================================

import { NavLink } from "react-router-dom";

const links = [
  { to: "/",         label: "掲示板"       },
  { to: "/settings", label: "ユーザー設定" },
  { to: "/rules",    label: "ルール"       },
  { to: "/about",    label: "About"        },
];

export default function Nav() {
  return (
    <nav className="relative z-10 w-full px-5 py-10 flex flex-col gap-8">
      {/* ロゴ */}
      <span className="text-base font-mono text-zinc-200 tracking-widest uppercase leading-relaxed">
        anonymous<br />board
      </span>

      {/* ナビリンク */}
      <div>
        <p className="text-xs font-mono text-zinc-700 uppercase tracking-widest mb-3">Menu</p>
        <ul className="flex flex-col gap-1">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  `block text-base py-1.5 pl-3 border-l-2 transition-colors ${
                    isActive
                      ? "text-cyan-400 font-medium border-cyan-400"
                      : "text-zinc-500 hover:text-zinc-200 border-transparent hover:border-zinc-700"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
