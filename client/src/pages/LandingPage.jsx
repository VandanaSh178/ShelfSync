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
  {
    label: "Facebook",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    label: "Instagram",
    d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z",
  },
  {
    label: "LinkedIn",
    d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  },
  {
    label: "Twitter",
    path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
  },
  {
    label: "YouTube",
    path: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",
  },
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

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-[#f5f3ee]/95 backdrop-blur-md border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-[17px] font-serif text-gray-900 tracking-tight">ShelfSync</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {NAV.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                className="text-[11px] uppercase tracking-[0.15em] text-gray-400 hover:text-gray-900 transition-colors font-semibold">
                {l}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-[11px] uppercase tracking-[0.18em] font-bold text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors">Sign in</Link>
            <Link to="/register" className="text-[11px] uppercase tracking-[0.18em] font-bold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-black transition-all shadow-sm">Get started</Link>
          </div>
          <button className="md:hidden p-2 text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4">
            {NAV.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMenuOpen(false)}
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
      <section className="relative overflow-hidden pt-16 pb-0 px-6">
        <div className="absolute top-[-100px] right-[-80px] w-[480px] h-[480px] rounded-full bg-orange-300 opacity-[0.18] blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[0px] left-[-60px] w-[320px] h-[320px] rounded-full bg-amber-200 opacity-[0.15] blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)`, backgroundSize: "48px 48px" }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center pt-10 pb-12">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-orange-600 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full font-bold mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Now with AI book recommendations
            </div>
            <h1 className="text-5xl md:text-[72px] font-serif text-gray-900 leading-[1.04] tracking-tight mb-5">
              Your library,<br />
              <span className="text-orange-500">running itself.</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-lg mx-auto leading-relaxed mb-9">
              ShelfSync handles borrowing, overdue reminders, member management, and reporting — so you focus on connecting readers with books.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link to="/register" className="group flex items-center gap-2 bg-gray-900 hover:bg-black text-white text-[11px] uppercase tracking-[0.2em] font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-black/10">
                Start for free <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a href="#features" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-8 py-4 rounded-full transition-all">
                See features
              </a>
            </div>

            {/* Stats */}
            <div className="inline-grid grid-cols-3 divide-x divide-gray-200 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-14">
              {[["2,400+","Books managed"],["98%","On-time returns"],["5 min","Setup time"]].map(([v,l])=>(
                <div key={l} className="px-8 py-4 text-center">
                  <div className="text-xl font-serif text-gray-900">{v}</div>
                  <div className="text-[9px] uppercase tracking-[0.18em] text-gray-400 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative mx-auto max-w-4xl rounded-t-2xl overflow-hidden border border-gray-200 border-b-0 shadow-2xl shadow-black/10 bg-white">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-3 flex-1 bg-gray-100 rounded-md h-5 text-[10px] text-gray-400 flex items-center px-3">localhost:4000/dashboard</div>
            </div>
            <div className="flex h-64 md:h-80">
              <div className="w-48 bg-gray-900 p-4 flex flex-col gap-1 shrink-0">
                <div className="flex items-center gap-2 mb-5 px-2">
                  <BookOpen className="w-4 h-4 text-orange-400" />
                  <span className="text-white text-[12px] font-semibold">ShelfSync</span>
                </div>
                {[["Dashboard","bg-orange-500"],["Books",""],["Members",""],["Analytics",""],["Settings",""]].map(([item, active])=>(
                  <div key={item} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${active ? "bg-orange-500" : "hover:bg-white/5"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-white" : "bg-gray-600"}`} />
                    <span className={`text-[11px] font-medium ${active ? "text-white" : "text-gray-400"}`}>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 p-5 bg-[#fafaf9] overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[13px] font-semibold text-gray-800">Dashboard Overview</span>
                  <span className="text-[10px] text-gray-400 bg-white border border-gray-100 px-3 py-1 rounded-full">Apr 2026</span>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[["34","Total Borrowed","text-gray-900"],["3","Overdue","text-red-500"],["8","Returned Today","text-green-600"],["91%","Return Rate","text-orange-500"]].map(([v,l,c])=>(
                    <div key={l} className="bg-white rounded-xl p-3 border border-gray-100">
                      <div className={`text-lg font-serif font-medium ${c}`}>{v}</div>
                      <div className="text-[9px] uppercase tracking-wider text-gray-400 mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-gray-50 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-700">Recent Borrows</span>
                    <span className="text-[9px] text-orange-500 font-bold uppercase tracking-wider">View all</span>
                  </div>
                  {[["The Midnight Library","Riya Sharma","Due Apr 22","due"],["Atomic Habits","Arjun Mehta","Due May 3","active"],["Deep Work","Priya Singh","Due Apr 10","overdue"]].map(([book,member,due,status])=>(
                    <div key={book} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${status==="active"?"bg-green-400":status==="overdue"?"bg-red-400":"bg-amber-400"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-gray-800 truncate">{book}</div>
                        <div className="text-[10px] text-gray-400">{member}</div>
                      </div>
                      <div className={`text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${status==="active"?"bg-green-50 text-green-600":status==="overdue"?"bg-red-50 text-red-600":"bg-amber-50 text-amber-600"}`}>{due}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-3">Features</p>
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Everything your library needs</h2>
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
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              ["🔐","Secure by default","OTP verification, JWT tokens, and bcrypt hashing protect every account."],
              ["🤖","AI Recommendations","Powered by Groq — members get smart book suggestions based on history."],
              ["📱","Fully responsive","Works on every device. Desktop, tablet, or mobile — always pixel-perfect."],
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
      <section id="how-it-works" className="py-24 px-6 bg-[#f5f3ee]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-3">How it works</p>
            <h2 className="text-4xl font-serif text-gray-900">Up and running in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["01","Create your library","Sign up free, add your book catalog manually or import it. No tech skills needed."],
              ["02","Add your members","Invite readers via email. They verify with OTP and get instant access to the catalog."],
              ["03","Let ShelfSync run","Issue books, track returns, and let automated reminders do the follow-up for you."],
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
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-3">Pricing</p>
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Simple, honest pricing</h2>
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
      <section id="testimonials" className="py-24 px-6 bg-[#f5f3ee]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
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
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
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
      <section className="py-20 px-6 bg-gray-900 relative overflow-hidden">
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
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand col */}
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
            {/* Social icons — inline SVG, no lucide dependency */}
            <div className="flex gap-3">
              {SOCIAL_ICONS.map((icon) => (
                <SocialIcon key={icon.label} {...icon} />
              ))}
            </div>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-5">Important Links</h4>
            <ul className="space-y-3">
              {["Home", "Features", "How it works", "Pricing", "FAQ"].map(l => (
                <li key={l}>
                  <a href="#" className="text-[13px] text-gray-400 hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-5">Other Links</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Use", "Refund Policy", "Cookie Policy", "About Us"].map(l => (
                <li key={l}>
                  <a href="#" className="text-[13px] text-gray-400 hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-gray-400">support@shelfsync.in</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-gray-400">+91 98765 43210</span>
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

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] px-6 py-5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-gray-600 uppercase tracking-widest">© 2026 ShelfSync Systems. All Rights Reserved.</p>
            <div className="flex gap-6">
              {["Privacy","Terms","Cookies"].map(l => (
                <a key={l} href="#" className="text-[11px] text-gray-600 hover:text-gray-400 uppercase tracking-wider transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}