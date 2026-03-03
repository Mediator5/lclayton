"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Navigation Data ──────────────────────────────────────────────────────────

const NAV_ITEMS = [
    { label: "Home", href: "/" },
    {
        label: "About",
        href: "/about",
        submenu: [
            { label: "Our Story", href: "/about/our-story" },
            { label: "Mission & Vision", href: "/about/mission" },
            { label: "Leadership Team", href: "/about/team" },
            { label: "Careers", href: "/about/careers" },
        ],
    },
    {
        label: "Services",
        href: "/services",
        submenu: [
            { label: "Financial Planning", href: "/services/financial-planning" },
            { label: "Investment Advisory", href: "/services/investment-advisory" },
            { label: "Tax Strategies", href: "/services/tax-strategies" },
            { label: "Risk Management", href: "/services/risk-management" },
        ],
    },
    {
        label: "Resources",
        href: "/resources",
        submenu: [
            { label: "Blog & Insights", href: "/resources/blog" },
            { label: "Case Studies", href: "/resources/case-studies" },
            { label: "Whitepapers", href: "/resources/whitepapers" },
            { label: "FAQs", href: "/resources/faqs" },
        ],
    },
    { label: "Contact", href: "/contact" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const FacebookIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const TwitterIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
        <path d="M4 4l16 16M4 20L20 4" />
    </svg>
);

const LinkedInIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const InstagramIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MailIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const ChevronDown = ({ open }) => (
    <svg
        className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// ─── Dropdown ─────────────────────────────────────────────────────────────────

function Dropdown({ items, isOpen }) {
    return (
        <div
            className={`
        absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56
        bg-white rounded-xl shadow-2xl border border-slate-100
        overflow-hidden transition-all duration-200 origin-top z-50
        ${isOpen
                    ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
                }
      `}
        >
            {/* Arrow pip */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-slate-100 rotate-45 z-10" />

            <ul className="relative z-20 py-2">
                {items.map((item) => (
                    <li key={item.label}>
                        <Link
                            href={item.href}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-slate-600
                         hover:text-navy hover:bg-slate-50 transition-colors duration-150 group/item"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-gold opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0" />
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
    const [openMenu, setOpenMenu] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`font-body w-full sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-lg" : ""
                }`}
        >

            {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
            <div className="bg-navy text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-10 text-xs">

                        {/* Social icons */}
                        <div className="flex items-center gap-1">
                            {[
                                { Icon: FacebookIcon, label: "Facebook" },
                                { Icon: TwitterIcon, label: "Twitter" },
                                { Icon: LinkedInIcon, label: "LinkedIn" },
                                { Icon: InstagramIcon, label: "Instagram" },
                            ].map(({ Icon, label }) => (
                                <a
                                    key={label}
                                    href="#"
                                    aria-label={label}
                                    className="w-7 h-7 flex items-center justify-center rounded-full
                             text-slate-300 hover:text-white hover:bg-white/10
                             transition-all duration-200"
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>

                        {/* Contact + login */}
                        <div className="flex items-center gap-5">
                            <a
                                href="tel:+18001234567"
                                className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors duration-150"
                            >
                                <PhoneIcon />
                                <span className="font-medium tracking-wide">+1 (800) 123-4567</span>
                            </a>

                            <span className="hidden sm:block w-px h-4 bg-white/20" />

                            <a
                                href="mailto:info@lclaytonservices.com"
                                className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors duration-150"
                            >
                                <MailIcon />
                                <span className="font-medium tracking-wide">info@lclaytonservices.com</span>
                            </a>

                            <span className="hidden sm:block w-px h-4 bg-white/20" />

                            <a
                                href="#"
                                className="flex items-center gap-1.5 bg-gold hover:bg-gold-muted
                           text-navy-deep font-semibold text-xs uppercase tracking-widest
                           px-4 py-1.5 rounded-full transition-all duration-200 hover:shadow-md"
                            >
                                Client Login
                            </a>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── MAIN NAV ─────────────────────────────────────────────────────── */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 shrink-0">
                            <Image
                                className="dark:invert"
                                src="/L CLAYTON.jpeg"
                                alt="Next.js logo"
                                width={80}
                                height={80}
                                priority
                            />
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {NAV_ITEMS.map((item) => (
                                <div
                                    key={item.label}
                                    className="relative group"
                                    onMouseEnter={() => item.submenu && setOpenMenu(item.label)}
                                    onMouseLeave={() => setOpenMenu(null)}
                                >
                                    <Link
                                        href={item.href}
                                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${openMenu === item.label
                                            ? "text-navy bg-slate-50"
                                            : "text-slate-600 hover:text-navy hover:bg-slate-50"
                                            }`}
                                    >
                                        {item.label}
                                        {item.submenu && <ChevronDown open={openMenu === item.label} />}
                                    </Link>

                                    {/* Active underline */}
                                    <span
                                        className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gold rounded-full transition-all duration-200 ${openMenu === item.label ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                            }`}
                                    />

                                    {item.submenu && (
                                        <Dropdown items={item.submenu} isOpen={openMenu === item.label} />
                                    )}
                                </div>
                            ))}

                            <Link
                                href="/contact"
                                className="ml-4 px-5 py-2.5 bg-navy hover:bg-navy-dark text-white
                           font-heading text-sm font-semibold rounded-lg
                           transition-all duration-200 hover:shadow-lg hover:-translate-y-px"
                            >
                                Get Started
                            </Link>
                        </nav>

                        {/* Mobile hamburger */}
                        <button
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-navy hover:bg-slate-100 transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>

                    </div>
                </div>

                {/* ── MOBILE MENU ──────────────────────────────────────────────── */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-screen border-t border-slate-100" : "max-h-0"
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-4 pb-4 pt-2 space-y-1">

                        {/* Contact strip */}
                        <div className="flex flex-col gap-2 py-3 border-b border-slate-100 mb-2">
                            <a href="tel:+18001234567" className="flex items-center gap-2 text-sm text-slate-500">
                                <PhoneIcon /> +1 (800) 123-4567
                            </a>
                            <a href="mailto:info@lclaytonservices.com" className="flex items-center gap-2 text-sm text-slate-500">
                                <MailIcon /> info@lclaytonservices.com
                            </a>
                        </div>

                        {/* Nav items */}
                        {NAV_ITEMS.map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={item.href}
                                        className="flex-1 py-2.5 px-3 text-sm font-medium text-slate-700
                               hover:text-navy rounded-lg hover:bg-slate-50 transition-colors"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {item.label}
                                    </Link>

                                    {item.submenu && (
                                        <button
                                            className="p-2 text-slate-400 hover:text-navy transition-colors"
                                            onClick={() =>
                                                setMobileExpanded(mobileExpanded === item.label ? null : item.label)
                                            }
                                            aria-label={`Expand ${item.label}`}
                                        >
                                            <ChevronDown open={mobileExpanded === item.label} />
                                        </button>
                                    )}
                                </div>

                                {item.submenu && (
                                    <div
                                        className={`overflow-hidden transition-all duration-200 ${mobileExpanded === item.label ? "max-h-60" : "max-h-0"
                                            }`}
                                    >
                                        <ul className="ml-4 pl-4 border-l-2 border-gold/30 py-1 space-y-1">
                                            {item.submenu.map((sub) => (
                                                <li key={sub.label}>
                                                    <Link
                                                        href={sub.href}
                                                        className="block py-2 px-2 text-sm text-slate-500
                                       hover:text-navy hover:bg-slate-50 rounded-lg transition-colors"
                                                        onClick={() => setMobileOpen(false)}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Mobile CTA */}
                        <div className="pt-2">
                            <Link
                                href="/contact"
                                className="block text-center py-3 bg-navy hover:bg-navy-dark
                           text-white font-heading text-sm font-semibold rounded-lg transition-colors"
                                onClick={() => setMobileOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

        </header>
    );
}