// web/src/pages/AboutPage/AboutPage.tsx - minimal, portable
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { Heart, Flame, Clock, ShieldCheck, MapPin, ArrowRight } from 'lucide-react'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF8FD]">
      <Metadata title="About YumZee" description="YumZee — fresh snacks, simple ordering for everyone." />

      <section className="bg-gradient-to-br from-[#4B2E83] via-[#3B226B] to-[#251448] py-10 text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Snack cravings, <span className="text-[#FFC928]">solved simply.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
            Fresh snacks for everyone — browse, add to bag, and get fast delivery.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to={routes.home()} className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC928] px-6 py-3 text-sm font-extrabold text-[#4B2E83] hover:bg-[#E5B420] transition">
              Explore Menu <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to={routes.contact()} className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/15 transition">
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-[#E9E5EE] bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC928] text-[#4B2E83]"><Flame className="h-5 w-5" /></div>
            <h3 className="mt-3 text-sm font-extrabold text-[#211F26]">Made fresh to order</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#6F6B76]">Prepared fresh and sealed warm.</p>
          </div>
          <div className="rounded-3xl border border-[#E9E5EE] bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4B2E83] text-white"><Clock className="h-5 w-5" /></div>
            <h3 className="mt-3 text-sm font-extrabold text-[#211F26]">Fast delivery</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#6F6B76]">Track live. Hot in 15-20 minutes.</p>
          </div>
          <div className="rounded-3xl border border-[#E9E5EE] bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200"><ShieldCheck className="h-5 w-5" /></div>
            <h3 className="mt-3 text-sm font-extrabold text-[#211F26]">Simple & affordable</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#6F6B76]">From ₦250. Clear prices, no hidden fees.</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white border border-[#E9E5EE] p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-[#211F26]">No complications — just great snacks.</p>
            <p className="text-xs text-[#6F6B76]">Browse, add to bag, and checkout.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6F6B76] shrink-0">
            <MapPin className="h-4 w-4 text-[#4B2E83]" /> Lagos • Delivery across the city
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex gap-3 rounded-2xl bg-[#4B2E83] p-4 text-white">
            <Heart className="h-5 w-5 text-[#FFC928] shrink-0 mt-0.5" />
            <div><h4 className="text-sm font-bold">Made with care</h4><p className="text-xs text-white/70 mt-1">Packed fresh and handled with care.</p></div>
          </div>
          <div className="flex gap-3 rounded-2xl bg-[#FFC928] p-4 text-[#4B2E83]">
            <Clock className="h-5 w-5 shrink-0 mt-0.5" />
            <div><h4 className="text-sm font-bold">For everyone</h4><p className="text-xs text-[#4B2E83]/70 mt-1">At home, work or school — snacks for anyone.</p></div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[#A09BA8]">YumZee © {new Date().getFullYear()} — Fresh snacks, simple ordering.</p>
      </section>
    </div>
  )
}

export default AboutPage
