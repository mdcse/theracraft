"use client";

import { useState, useEffect } from "react";
import "@/styles/navbar.css";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(null); // null until we read it on the client

  // On mount, figure out the active theme (stored choice, else system).
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial =
      stored ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next; // CSS reacts to this
    localStorage.setItem("theme", next); // remember the choice
  };

  const Logo = (
    <a href="#home" className="logo" onClick={() => setMenuOpen(false)}>
      <span className="logo-chip">
        {/* light badge in light mode, dark icon in dark mode (CSS swaps them) */}
        <img src="/logo-light.png" alt="TheraCraft logo" className="logo-img light" />
        <img src="/logo-dark.jpg" alt="" aria-hidden="true" className="logo-img dark" />
      </span>
      <span className="logo-text">
        <span className="logo-name">
          <span className="lg-thera">Thera</span><span className="lg-craft">Craft</span>
        </span>
        <span className="logo-sub">Rehab &amp; Physiotherapy</span>
      </span>
    </a>
  );

  const ThemeToggle = (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
      {theme === "dark" ? (
        // sun icon → click to go light
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        // moon icon → click to go dark
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        {Logo}

        {/* Desktop links */}
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        {/* Desktop buttons + theme toggle */}
        <div className="nav-buttons">
          {ThemeToggle}
          <a
            href="https://wa.me/917204688546"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            WhatsApp
          </a>
          <a href="#book" className="btn btn-teal">
            Book Appointment
          </a>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="mobile-actions">
          {ThemeToggle}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger"
            aria-label="Toggle menu"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown (only when menuOpen is true) */}
      {menuOpen && (
        <div className="mobile-menu">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-buttons">
            <a
              href="https://wa.me/917204688546"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              WhatsApp
            </a>
            <a href="#book" onClick={() => setMenuOpen(false)} className="btn btn-teal">
              Book Appointment
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
