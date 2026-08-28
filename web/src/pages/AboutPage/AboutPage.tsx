// web/src/pages/AboutPage/AboutPage.tsx - Brand story, not generic template
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { Sparkles, GraduationCap, Heart, Flame, Clock, ShieldCheck, MapPin, ArrowRight } from 'lucide-react'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF8FD]">
      <Metadata title="About YumZee" description="YumZee — fresh snacks, simple ordering for everyone." />

      {/* Hero - warm, not corporate */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4B2E83] via-[#3B226B] to-[#251448] py-14 text-white">
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#FFC928]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFC928]/40 bg-[#FFC928]/15 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#FFC928]">
            <Heart className="h-3.5 w-3.5" /> Fresh snacks, made simple
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
            Snack cravings, <span className="text-[#FFC928]">solved simply.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            YumZee is a simple snack ordering platform for anyone — no groups, no hassle. Browse tasty treats,
            add to your bag and get fresh snacks delivered fast to your doorstep. Affordable, reliable, and easy for everyone.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={routes.home()} className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC928] px-6 py-3 text-sm font-extrabold text-[#4B2E83] hover:bg-[#E5B420] transition">
              Explore Menu <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to={routes.contact()} className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/15 transition">
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      {/* How we're different - 3 cards */}
      <section className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC928] text-[#4B2E83]"><Flame className="h-5 w-5" /></div>
            <h3 className="mt-4 text-sm font-extrabold text-[#211F26]">Made fresh to order</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#6F6B76]">Every snack is prepared fresh by trusted local kitchens, sealed and handed to you warm. No stale packs.</p>
          </div>
          <div className="rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4B2E83] text-white"><Clock className="h-5 w-5" /></div>
            <h3 className="mt-4 text-sm font-extrabold text-[#211F26]">Fast delivery</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#6F6B76]">Order in seconds and track it live. Most snacks arrive hot in 15-20 minutes.</p>
          </div>
          <div className="rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200"><ShieldCheck className="h-5 w-5" /></div>
            <h3 className="mt-4 text-sm font-extrabold text-[#211F26]">Simple & affordable</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#6F6B76]">Snacks from ₦250. No hidden fees. Simple menu, clear prices — easy for anyone to order.</p>
          </div>
        </div>

        {/* Story strip */}
        <div className="mt-10 rounded-3xl bg-white border border-[#E9E5EE] p-6 sm:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#4B2E83]"><Sparkles className="h-3.5 w-3.5 text-[#FFC928]" /> Simple by design</div>
            <p className="text-sm font-bold text-[#211F26]">No complications — just great snacks.</p>
            <p className="text-xs text-[#6F6B76] max-w-xl">YumZee keeps ordering simple for everyone: browse, add to bag, and checkout. No groups or extra steps.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6F6B76] shrink-0">
            <MapPin className="h-4 w-4 text-[#4B2E83]" /> Lagos • Delivery across the city
          </div>
        </div>

        {/* Values */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="flex gap-3 rounded-2xl bg-[#4B2E83] p-5 text-white">
            <Heart className="h-5 w-5 text-[#FFC928] shrink-0 mt-0.5" />
            <div><h4 className="text-sm font-bold">Made with care</h4><p className="text-xs text-white/70 mt-1">Every snack is packed fresh and handled with care.</p></div>
          </div>
          <div className="flex gap-3 rounded-2xl bg-[#FFC928] p-5 text-[#4B2E83]">
            <Clock className="h-5 w-5 shrink-0 mt-0.5" />
            <div><h4 className="text-sm font-bold">For everyone</h4><p className="text-xs text-[#4B2E83]/70 mt-1">Whether at home, work or school — YumZee is for anyone who loves snacks.</p></div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-[#A09BA8]">YumZee © {new Date().getFullYear()} — Fresh snacks, simple ordering.</p>
      </section>
    </div>
  )
}

export default AboutPage
