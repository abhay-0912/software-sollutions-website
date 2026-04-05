"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function BlogNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-white/10 bg-[#0D0F1A]/75 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          abaay
          <span className="text-[#3B82F6]">.tech</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => {
            const isActive = item.href === "/blog";
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition ${
                  isActive ? "text-[#8AB4FF]" : "text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="rounded-full border border-[#3B82F6]/80 bg-[#3B82F6]/15 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.35)] transition hover:-translate-y-0.5 hover:bg-[#3B82F6]/25"
          >
            Get a Free Quote
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md border border-white/20 p-2 text-slate-200 lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/10 bg-[#0D0F1A]/95 px-6 py-4 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium ${
                  item.href === "/blog" ? "text-[#8AB4FF]" : "text-slate-200"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex w-fit rounded-full border border-[#3B82F6]/80 bg-[#3B82F6]/20 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Get a Free Quote
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function BlogFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0C1120]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-10">
        <div>
          <Link href="/" className="text-2xl font-bold text-white">
            abaay<span className="text-[#3B82F6]">.tech</span>
          </Link>
          <p className="mt-3 max-w-sm text-slate-300">Building tomorrow&apos;s software, today.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Company</h3>
          {navLinks.map((item) => (
            <Link key={item.label} href={item.href} className="text-slate-200 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Connect</h3>
          <div className="flex items-center gap-3">
            <Link
              href="https://linkedin.com/company/abaay-tech"
              className="rounded-full border border-white/15 p-2 text-slate-300 transition hover:border-[#3B82F6]/60 hover:text-white"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/abaay-tech"
              className="rounded-full border border-white/15 p-2 text-slate-300 transition hover:border-[#3B82F6]/60 hover:text-white"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="h-4 w-4" />
            </Link>
            <Link
              href="https://twitter.com/abaaytech"
              className="rounded-full border border-white/15 p-2 text-slate-300 transition hover:border-[#3B82F6]/60 hover:text-white"
              aria-label="X"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaXTwitter className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-slate-400">
        © 2026 Abaay Tech. All rights reserved.
      </div>
    </footer>
  );
}
