import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Bell, Users, BarChart3, ArrowRight,
  Check, Menu, X, Mail, Phone, MapPin,
} from "lucide-react";

const FEATURES = [
  { icon: BookOpen, title: "Smart Catalog", desc: "Organize your entire collection with cover images, genres, and real-time availability tracking.", bg: "bg-orange-50", iconColor: "text-orange-500" },
  { icon: Bell, title: "Auto Reminders", desc: "Scheduled email alerts fire automatically for due and overdue books. Zero manual follow-up.", bg: "bg-amber-50", iconColor: "text-amber-500" },
  { icon: Users, title: "Member Management", desc: "Role-based access for admins and members with OTP-verified, JWT-secured accounts.", bg: "bg-stone-100", iconColor: "text-stone-600" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Return rates, borrow trends, and overdue stats in one clean, real-time view.", bg: "bg-orange-50", iconColor: "text-orange-500" },
];

const PLANS = [
  { name: "Starter", price: "Free", period: "forever", desc: "For small personal libraries.", features: ["Up to 100 books", "10 members", "Email reminders", "Basic dashboard"], cta: "Get started", featured: false },
  { name: "Pro", price: "₹99", period: "/month", desc: "For school and community libraries.", features: ["Unlimited books", "Unlimited members", "Auto overdue alerts", "Analytics dashboard", "AI recommendations"], cta: "Start free trial", featured: true },
  { name: "Enterprise", price: "Custom", period: "", desc: "For institutions and library chains.", features: ["Everything in Pro", "Custom integrations", "Dedicated support", "SLA guarantee"], cta: "Contact us", featured: false },
];

const TESTIMONIALS = [
  { initials: "RS", name: "Riya Sharma", role: "School Librarian", text: "Overdue reminders alone saved me hours every week. The automation is a complete game changer." },
  { initials: "AK", name: "Arjun Kumar", role: "Library Manager", text: "Setup took under 5 minutes. The dashboard is incredibly clean and easy for anyone to use." },
  { initials: "PD", name: "Priya Desai", role: "College Librarian", text: "Finally a library tool that feels modern. Our members love the OTP-based registration flow." },
];

const FAQS = [
  { q: "Is ShelfSync free to get started?", a: "Yes — our Starter plan is completely free with no credit card required. Upgrade anytime when you need more." },
  { q: "How does the overdue reminder automation work?", a: "ShelfSync runs a scheduled job every 30 minutes. Any book due within 24 hours triggers an automatic email to the borrower." },
  { q: "Can I import my existing library data?", a: "Yes. You can add books manually or bulk-import them. Member data can also be migrated on Enterprise plans." },
  { q: "Is my data secure?", a: "All accounts use OTP-verified email, JWT authentication, and bcrypt-hashed passwords. Data is never sold or shared." },
];

const NAV = ["Features", "How it works", "Pricing", "Testimonials"];

const SOCIAL_ICONS = [
  { label: "Facebook", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
  { label: "Instagram", d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" },
  { label: "LinkedIn", d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { label: "Twitter", path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
  { label: "YouTube", path: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" },
];

function SocialIcon({ label, path, d }) {
  return (
    <a href="#" aria-label={label}
      className="w-8 h-8 rounded-full bg-white/5 hover:bg-orange-500 flex items-center justify-center transition-all duration-200 group">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className="w-3.5 h-3.5 text-gray-500 group-hover:text-white">
        {path && <path d={path} />}
        {d && d.split(" M").map((seg, i) => (
          <path key={i} d={i === 0 ? seg : "M" + seg} />
        ))}
      </svg>
    </a>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#f5f3ee] font-sans antialiased">

      {/* ── NAVBAR ── full width, no max-w constraint on the bar itself */}
      <nav className="sticky top-0 z-50 bg-[#f5f3ee]/95 backdrop-blur-md border-b border-black/[0.06]">
        <div className="w-full px-6 md:px-10 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-[16px] font-serif text-gray-900 tracking-tight">ShelfSync</span>
          </div>

          {/* Nav links — centered */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {NAV.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                className="text-[11px] uppercase tracking-[0.14em] text-gray-400 hover:text-gray-900 transition-colors font-semibold whitespace-nowrap">
                {l}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Link to="/login"
              className="text-[11px] uppercase tracking-[0.16em] font-bold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full transition-colors">
              Sign in
            </Link>
            <Link to="/register"
              className="text-[11px] uppercase tracking-[0.16em] font-bold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-black transition-all shadow-sm">
              Get started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4">
            {NAV.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setMenuOpen(false)}
                className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-semibold">{l}</a>
            ))}
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <Link to="/login" className="flex-1 text-center text-[11px] uppercase tracking-wider font-bold border border-gray-200 py-2.5 rounded-full">Sign in</Link>
              <Link to="/register" className="flex-1 text-center text-[11px] uppercase tracking-wider font-bold bg-gray-900 text-white py-2.5 rounded-full">Register</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 md:px-10">
        {/* Blobs */}
        <div className="absolute top-[-80px] right-[-60px] w-[400px] h-[400px] rounded-full bg-orange-300 opacity-[0.18] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[60px] left-[-40px] w-[280px] h-[280px] rounded-full bg-amber-200 opacity-[0.15] blur-[90px] pointer-events-none" />
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: `linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)`, backgroundSize: "48px 48px" }} />

        <div className="relative max-w-5xl mx-auto">
          {/* Text block — tighter vertical rhythm */}
          <div className="text-center pt-10 pb-8">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-orange-600 bg-orange-50 border border-orange-200 px-4 py-1.5 rounded-full font-bold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Now with AI book recommendations
            </div>

            <h1 className="text-5xl md:text-[68px] font-serif text-gray-900 leading-[1.05] tracking-tight mb-4">
              Your library,<br />
              <span className="text-orange-500">running itself.</span>
            </h1>

            <p className="text-base md:text-[17px] text-gray-500 max-w-xl mx-auto leading-relaxed mb-7">
              ShelfSync handles borrowing, overdue reminders, member management, and reporting — so you focus on connecting readers with books.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link to="/register"
                className="group flex items-center gap-2 bg-gray-900 hover:bg-black text-white text-[11px] uppercase tracking-[0.2em] font-bold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-black/10">
                Start for free <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a href="#features"
                className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-8 py-3.5 rounded-full transition-all">
                See features
              </a>
            </div>

            {/* Stats bar */}
            <div className="inline-grid grid-cols-3 divide-x divide-gray-200 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-8">
              {[["2,400+", "Books managed"], ["98%", "On-time returns"], ["5 min", "Setup time"]].map(([v, l]) => (
                <div key={l} className="px-8 py-3.5 text-center">
                  <div className="text-xl font-serif text-gray-900">{v}</div>
                  <div className="text-[9px] uppercase tracking-[0.18em] text-gray-400 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard mockup — flush to hero bottom, no gap */}
          <div className="relative mx-auto rounded-t-2xl overflow-hidden border border-gray-200 border-b-0 shadow-2xl shadow-black/12 bg-white">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-3 flex-1 bg-gray-100 rounded-md h-5 text-[10px] text-gray-400 flex items-center px-3">
                localhost:5173/admin/dashboard
              </div>
            </div>
            {/* Mockup content */}
            <div className="flex h-72 md:h-96">
              {/* Sidebar */}
              <div className="w-44 bg-[#1a1612] p-4 flex flex-col gap-1 shrink-0">
                <div className="flex items-center gap-2 mb-5 px-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-white text-[12px] font-semibold tracking-wide">ShelfSync</span>
                </div>
                <p className="text-[8px] uppercase tracking-[0.22em] text-[#c4a882] px-2 mb-1">Core</p>
                {[["Dashboard", true], ["Catalog", false], ["AI Picks", false]].map(([item, active]) => (
                  <div key={item} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${active ? "bg-[#fff7ed]" : "hover:bg-white/5"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-orange-500" : "bg-[#c4a882]"}`} />
                    <span className={`text-[11px] font-medium ${active ? "text-[#2d1f0e]" : "text-[#a89070]"}`}>{item}</span>
                  </div>
                ))}
                <p className="text-[8px] uppercase tracking-[0.22em] text-[#c4a882] px-2 mt-3 mb-1">Control</p>
                {[["Inventory", false], ["User Base", false]].map(([item]) => (
                  <div key={item} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c4a882]" />
                    <span className="text-[11px] font-medium text-[#a89070]">{item}</span>
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-5 bg-[#faf6f0] overflow-hidden flex flex-col gap-4">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.24em] text-orange-500 font-bold mb-0.5">Admin Panel</p>
                    <span className="text-[15px] font-serif font-semibold text-[#2d1f0e]">Dashboard Overview</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e8ddd0] rounded-xl">
                    <div className="w-5 h-5 rounded-md bg-orange-500 flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">V</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-[#2d1f0e] leading-none">Vandana</p>
                      <p className="text-[7px] text-[#a89070]">Administrator</p>
                    </div>
                  </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["1", "Total Users", "Members", "#eef2ff", "#6366f1"],
                    ["2", "Total Admins", "Staff", "#fff7ed", "#f97316"],
                    ["13", "Total Books", "Catalog", "#f5ede0", "#2d1f0e"],
                  ].map(([v, label, tag, bg, color]) => (
                    <div key={label} className="bg-white rounded-2xl p-3 border border-[#e8ddd0]">
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                          <div className="w-3 h-3 rounded-sm" style={{ background: color, opacity: 0.7 }} />
                        </div>
                        <span className="text-[7px] uppercase tracking-wider text-[#c4a882] font-bold">{tag}</span>
                      </div>
                      <p className="text-2xl font-serif font-black text-[#2d1f0e] leading-none mb-0.5">{v}</p>
                      <p className="text-[8px] text-[#a89070] font-semibold">{label}</p>
                      <div className="mt-2 h-0.5 bg-[#f5ede0] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${parseInt(v) * 8}%`, background: color }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {/* Quote card */}
                  <div className="bg-[#1a1612] rounded-2xl p-4 flex flex-col justify-between">
                    <p className="text-[22px] text-orange-500 font-serif leading-none opacity-60">"</p>
                    <p className="text-[10px] text-white/85 font-serif leading-relaxed">
                      Embarking on the journey of reading fosters personal growth.
                    </p>
                    <p className="text-[8px] text-orange-500 font-bold tracking-wider">— ShelfSync Team</p>
                  </div>
                  {/* Borrow activity */}
                  <div className="bg-[#f5ede0] rounded-2xl p-4 border border-dashed border-orange-200">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-1">Circulation</p>
                    <p className="text-[11px] font-serif font-bold text-[#2d1f0e] mb-3">Borrow Activity</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#1a1612] rounded-xl p-2">
                        <p className="text-[7px] text-[#888] uppercase tracking-wider mb-1">Out</p>
                        <p className="text-lg font-serif font-black text-white">6</p>
                      </div>
                      <div className="bg-[#fff7ed] border border-orange-100 rounded-xl p-2">
                        <p className="text-[7px] text-orange-500 uppercase tracking-wider mb-1">Back</p>
                        <p className="text-lg font-serif font-black text-orange-500">5</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 px-6 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-3">Features</p>
            <h2 className="text-4xl font-serif text-gray-900 mb-3">Everything your library needs</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">One platform. All the tools. Nothing you don't need.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, bg, iconColor }) => (
              <div key={title} className="group bg-[#fafaf9] border border-gray-100 rounded-3xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 ${bg}`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-[13px] text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              ["🔐", "Secure by default", "OTP verification, JWT tokens, and bcrypt hashing protect every account."],
              ["🤖", "AI Recommendations", "Powered by Groq — members get smart book suggestions based on history."],
              ["📱", "Fully responsive", "Works on every device. Desktop, tablet, or mobile — always pixel-perfect."],
            ].map(([emoji, title, desc]) => (
              <div key={title} className="flex gap-4 items-start bg-gray-900 text-white rounded-3xl p-6">
                <span className="text-2xl mt-0.5">{emoji}</span>
                <div>
                  <div className="text-[14px] font-semibold mb-1">{title}</div>
                  <div className="text-[12px] text-gray-400 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 px-6 md:px-10 bg-[#f5f3ee]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-3">How it works</p>
            <h2 className="text-4xl font-serif text-gray-900">Up and running in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["01", "Create your library", "Sign up free, add your book catalog manually or import it. No tech skills needed."],
              ["02", "Add your members", "Invite readers via email. They verify with OTP and get instant access to the catalog."],
              ["03", "Let ShelfSync run", "Issue books, track returns, and let automated reminders do the follow-up for you."],
            ].map(([num, title, desc]) => (
              <div key={num} className="relative bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-md transition-all duration-300">
                <div className="text-[72px] font-serif text-gray-100 leading-none mb-2 select-none">{num}</div>
                <div className="w-8 h-0.5 bg-orange-400 mb-4" />
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-[13px] text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 px-6 md:px-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-3">Pricing</p>
            <h2 className="text-4xl font-serif text-gray-900 mb-3">Simple, honest pricing</h2>
            <p className="text-gray-400 text-sm">No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {PLANS.map(({ name, price, period, desc, features, cta, featured }) => (
              <div key={name} className={`rounded-3xl p-7 flex flex-col ${featured ? "bg-gray-900 text-white shadow-2xl shadow-black/20 md:scale-[1.04] border-2 border-gray-900" : "bg-[#fafaf9] border border-gray-100"}`}>
                {featured && <div className="inline-block text-[9px] uppercase tracking-[0.2em] font-bold bg-orange-500 text-white px-3 py-1.5 rounded-full mb-4 self-start">Most popular</div>}
                <div className="text-[11px] uppercase tracking-[0.18em] font-bold mb-2 text-gray-400">{name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-4xl font-serif ${featured ? "text-white" : "text-gray-900"}`}>{price}</span>
                  <span className="text-[12px] text-gray-400">{period}</span>
                </div>
                <p className="text-[12px] mb-6 text-gray-400">{desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-[13px]">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${featured ? "bg-orange-500" : "bg-orange-100"}`}>
                        <Check className={`w-2.5 h-2.5 ${featured ? "text-white" : "text-orange-600"}`} />
                      </div>
                      <span className={featured ? "text-gray-300" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`text-center text-[11px] uppercase tracking-[0.2em] font-bold py-3.5 rounded-full transition-all ${featured ? "bg-orange-500 hover:bg-orange-400 text-white" : "bg-gray-900 hover:bg-black text-white"}`}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-20 px-6 md:px-10 bg-[#f5f3ee]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-3">Testimonials</p>
            <h2 className="text-4xl font-serif text-gray-900">What librarians say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ initials, name, role, text }) => (
              <div key={name} className="bg-white border border-gray-100 rounded-3xl p-7 hover:shadow-md transition-all duration-300">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-orange-400 text-sm">★</span>)}
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-6 italic">"{text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0">{initials}</div>
                  <div>
                    <div className="text-[13px] font-semibold text-gray-900">{name}</div>
                    <div className="text-[11px] text-gray-400">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6 md:px-10 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-3">FAQ</p>
            <h2 className="text-4xl font-serif text-gray-900">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="text-[14px] font-semibold text-gray-800">{q}</span>
                  <span className={`text-gray-400 text-lg transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-[13px] text-gray-500 leading-relaxed border-t border-gray-50 pt-4">{a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-6 md:px-10 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-orange-600 opacity-10 blur-[100px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif text-white mb-4">Ready to modernize your library?</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">Join hundreds of libraries already saving time with ShelfSync. Start free — no credit card required.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="group inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-[11px] uppercase tracking-[0.2em] font-bold px-8 py-4 rounded-full transition-all">
              Start for free today <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center text-[11px] uppercase tracking-[0.2em] font-bold text-gray-300 hover:text-white border border-white/20 hover:border-white/40 px-8 py-4 rounded-full transition-all">
              Sign in instead
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-[17px] font-serif text-white">ShelfSync</span>
            </div>
            <p className="text-gray-500 text-[12px] leading-relaxed mb-6">
              A modern library management system built for schools, colleges, and community libraries.
            </p>
            <div className="flex gap-3">
              {SOCIAL_ICONS.map((icon) => <SocialIcon key={icon.label} {...icon} />)}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-5">Important Links</h4>
            <ul className="space-y-3">
              {["Home", "Features", "How it works", "Pricing", "FAQ"].map(l => (
                <li key={l}><a href="#" className="text-[13px] text-gray-400 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-5">Other Links</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Use", "Refund Policy", "Cookie Policy", "About Us"].map(l => (
                <li key={l}><a href="#" className="text-[13px] text-gray-400 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-gray-400">vandananidz@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-gray-400">+91 81029 70894</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-gray-400">Imphal, Manipur, India</span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-[11px] text-gray-500 mb-3 uppercase tracking-wider font-semibold">Stay updated</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-[12px] text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors min-w-0" />
                <button className="bg-orange-500 hover:bg-orange-400 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors flex-shrink-0">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.05] px-6 md:px-10 py-5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-gray-600 uppercase tracking-widest">© 2026 ShelfSync Systems. All Rights Reserved.</p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Cookies"].map(l => (
                <a key={l} href="#" className="text-[11px] text-gray-600 hover:text-gray-400 uppercase tracking-wider transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}