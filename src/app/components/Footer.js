"use client";

import { useState } from "react";
import Link from "next/link";

const OFFICES = [
    {
        name: "Silver Spring Office",
        address: ["8403 Colesville Road", "Suite 1100", "Silver Spring, MD 20910"],
        phone: "301-563-9700",
    },
    {
        name: "Virginia Beach Office",
        address: ["780 Lynnhaven Parkway", "Suite 400", "Virginia Beach, VA 23452"],
        phone: "757-828-1099",
    },
];

const QUICK_LINKS = [
    {
        heading: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Our Philosophy", href: "/about/philosophy" },
            { label: "Our Process", href: "/about/process" },
            { label: "Meet the Team", href: "/about/team" },
        ],
    },
    {
        heading: "Services",
        links: [
            { label: "Federal Employees", href: "/services/federal-employees" },
            { label: "Retirement Planning", href: "/services/pre-retirees" },
            { label: "Tax Strategy", href: "/services/tax-strategy" },
            { label: "Estate Planning", href: "/services/estate-planning" },
            { label: "Wealth Management", href: "/services/wealth-management" },
        ],
    },
    {
        heading: "Resources",
        links: [
            { label: "Blog & Insights", href: "/resources/blog" },
            { label: "Case Studies", href: "/resources/case-studies" },
            { label: "Whitepapers", href: "/resources/whitepapers" },
            { label: "FAQs", href: "/resources/faqs" },
        ],
    },
];

const PhoneIcon = () => (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MapPinIcon = () => (
    <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    </svg>
);

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

export default function Footer() {
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.email) e.email = "Email is required";
        if (!form.subject) e.subject = "Subject is required";
        if (!form.message) e.message = "Message is required";
        return e;
    };

    const handleSubmit = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setErrors({});
        setSubmitted(true);
    };

    const inputClass = (field) =>
        `w-full font-body text-sm bg-white/5 border ${errors[field] ? "border-red-400/60" : "border-white/10 focus:border-gold/50"
        } rounded-lg px-4 py-3 text-white placeholder-white/30
     outline-none transition-colors duration-200 focus:bg-white/8`;

    return (
        <>
            <style>{`
        .footer-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 50% at 100% 0%, color-mix(in srgb, var(--color-navy) 60%, transparent) 0%, transparent 55%),
            radial-gradient(ellipse 40% 60% at 0% 100%, color-mix(in srgb, var(--color-gold) 5%, transparent) 0%, transparent 50%);
        }
      `}</style>

            <footer className="font-body footer-bg text-white">

                {/* ── GET IN TOUCH + LINKS STRIP ─────────────────────────── */}
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* LEFT — contact form */}
                        <div>
                            <div className="inline-flex items-center gap-3 mb-4">
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Get In Touch</span>
                            </div>
                            <h2 className="font-heading text-white text-3xl font-bold mb-2 leading-tight">
                                Let&apos;s Start a<br />
                                <em className="not-italic text-gold">Conversation</em>
                            </h2>
                            <p className="font-body text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                                Ready to take control of your financial future? Reach out today and let&apos;s talk about your goals.
                            </p>

                            {submitted ? (
                                <div className="bg-gold/10 border border-gold/20 rounded-2xl p-6 text-center">
                                    <div className="font-heading text-gold text-xl font-bold mb-1">Thank You!</div>
                                    <p className="font-body text-slate-300 text-sm">We&apos;ll be in touch shortly.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                value={form.firstName}
                                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                                className={inputClass("firstName")}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                value={form.lastName}
                                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                                className={inputClass("lastName")}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Your Email *"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className={inputClass("email")}
                                        />
                                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Subject *"
                                            value={form.subject}
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            className={inputClass("subject")}
                                        />
                                        {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                                    </div>

                                    <div>
                                        <textarea
                                            rows={4}
                                            placeholder="Your Message *"
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            className={`${inputClass("message")} resize-none`}
                                        />
                                        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        className="w-full py-4 rounded-xl font-heading text-navy-deep text-sm font-bold
                               uppercase tracking-wider bg-gradient-to-r from-gold to-gold-light
                               hover:from-gold-light hover:to-gold
                               transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                               hover:-translate-y-0.5"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* RIGHT — offices + quick links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

                            {/* Offices */}
                            <div className="sm:col-span-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 pb-10 border-b border-white/10">
                                    {OFFICES.map((office) => (
                                        <div key={office.name}>
                                            <h4 className="font-heading text-white text-sm font-bold mb-3">{office.name}</h4>
                                            <address className="not-italic">
                                                <div className="flex items-start gap-2 text-slate-400 text-sm mb-2">
                                                    <span className="text-gold mt-0.5"><MapPinIcon /></span>
                                                    <div className="leading-relaxed">
                                                        {office.address.map((line) => (
                                                            <div key={line}>{line}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <a
                                                    href={`tel:${office.phone.replace(/-/g, "")}`}
                                                    className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                                                >
                                                    <span className="text-gold"><PhoneIcon /></span>
                                                    P: {office.phone}
                                                </a>
                                            </address>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick links */}
                            {QUICK_LINKS.map((col) => (
                                <div key={col.heading}>
                                    <h4 className="font-heading text-white text-xs font-bold uppercase tracking-widest mb-4">
                                        {col.heading}
                                    </h4>
                                    <ul className="space-y-2">
                                        {col.links.map((link) => (
                                            <li key={link.label}>
                                                <Link
                                                    href={link.href}
                                                    className="font-body text-slate-400 hover:text-gold text-sm transition-colors duration-200"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>

                {/* ── BOTTOM BAR ─────────────────────────────────────────── */}
                <div className="border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-6">

                        {/* Legal disclosure */}
                        <p className="font-body text-slate-500 text-[11px] leading-relaxed mb-5 max-w-4xl">
                            Jeffrey Settle is a Registered Representative with securities and advisory services offered through
                            LPL Financial, a Registered Investment Advisor, Member{" "}
                            <a href="https://finra.org" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 underline underline-offset-2 transition-colors">FINRA</a>
                            /
                            <a href="https://sipc.org" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 underline underline-offset-2 transition-colors">SIPC</a>.
                            {" "}The LPL Financial registered representative(s) associated with this website may discuss and/or
                            transact business only with residents of the states in which they are properly registered or licensed.
                            No offers may be made or accepted from any resident of any other state.{" "}
                            <a href="#" className="hover:text-slate-300 underline underline-offset-2 transition-colors">LPL Financial Form CRS</a>
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                            {/* Copyright */}
                            <p className="font-body text-slate-500 text-xs">
                                © {new Date().getFullYear()} L. Clayton Services Inc. All rights reserved.
                            </p>

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
                                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500
                               hover:text-white hover:bg-white/10 transition-all duration-200"
                                    >
                                        <Icon />
                                    </a>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

            </footer>
        </>
    );
}