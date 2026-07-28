"use client";

import { useState } from "react";
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

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        {/* Logo */}
        <a href="#home" className="logo">
          TheraCraft
          <span className="logo-sub">Rehab &amp; Physiotherapy</span>
        </a>

        {/* Desktop links */}
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        {/* Desktop buttons */}
        <div className="nav-buttons">
          <a
            href="https://wa.me/919145974904"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            WhatsApp
          </a>
          <a href="#contact" className="btn btn-teal">
            Book Appointment
          </a>
        </div>

        {/* Hamburger (mobile only) */}
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
              href="https://wa.me/919145974904"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              WhatsApp
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="btn btn-teal">
              Book Appointment
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
