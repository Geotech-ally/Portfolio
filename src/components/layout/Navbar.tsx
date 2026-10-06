import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import companyLogo from "../../../images/company logo.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="site-header sticky top-0 z-40 border-b border-border-strong">
      <Container className="flex h-[4.5rem] items-center justify-between">
        <NavLink to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/35 bg-white transition-colors group-hover:border-primary/60" aria-hidden="true">
            <img src={companyLogo} alt="" className="h-full w-full object-contain" />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-foreground">Geoffrey Akoo</span>
            <span className="font-mono text-[10px] tracking-[.12em] text-foreground-faint">ENGINEERING · SECURITY</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-surface-soft p-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3 py-2 text-[13px] text-foreground-muted transition-colors duration-150 hover:bg-background-raised hover:text-foreground",
                  isActive && "bg-background text-foreground shadow-sm"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="rounded-full border border-border p-2 text-foreground-muted transition-colors hover:border-border-strong hover:bg-background-raised hover:text-foreground"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <button
          type="button"
          className="rounded-full border border-border p-2 text-foreground transition-colors hover:bg-background-raised md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {open ? (
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          className="border-t border-border-strong bg-surface-raised shadow-lg md:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-4 py-3 text-base text-foreground-muted transition-colors hover:bg-background-raised hover:text-foreground",
                    isActive && "bg-background-raised text-foreground"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm text-foreground-muted">Menu</span>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                className="rounded-md p-2 text-foreground-muted hover:bg-background-raised hover:text-foreground"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
