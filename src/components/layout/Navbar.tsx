import { Link } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/partner", label: "Partner" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-6">
      <nav aria-label="Primary" className="relative flex items-center justify-center">
        {/* Desktop: segmented pill navbar */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* Logo pill */}
          <Link
            to="/"
            aria-label="Synkra home"
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#0f0f12] text-[0.7rem] font-bold tracking-tight text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-transform duration-150 hover:scale-105"
          >
            SYN
          </Link>

          {/* Nav links pill */}
          <div className="flex h-[52px] items-center rounded-full bg-[#0f0f12] px-2 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <div className="flex items-center text-[13px] font-medium text-white/60">
              {NAV_LINKS.map((item, index) => (
                <Fragment key={item.to}>
                  <Link
                    to={item.to}
                    className="px-4 py-2 transition-colors duration-200 hover:text-white"
                    activeProps={{ className: "text-white" }}
                  >
                    {item.label}
                  </Link>
                  {index < NAV_LINKS.length - 1 && (
                    <span className="h-[14px] w-[1px] bg-white/15" />
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          {/* CTA pill */}
          <Link
            to="/contact"
            className="flex h-[52px] items-center justify-center rounded-full bg-[#56d722] px-6 text-[13px] font-semibold text-[#0a0a0a] shadow-[0_0_20px_rgba(86,215,34,0.35)] transition-transform duration-150 hover:scale-105 active:scale-95"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/"
            aria-label="Synkra home"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f0f12] text-[0.7rem] font-bold tracking-tight text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
          >
            SYN
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f0f12] text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 top-0 z-40 flex flex-col bg-[#0a0a0a]/98 px-6 pb-10 pt-28 lg:hidden">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-lg font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto">
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#56d722] px-6 py-3.5 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
