// web/src/pages/HomePage/HomePage.tsx
import React, { useState, useEffect } from 'react'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useCart } from 'src/components/CartContext/CartContext'
import {
  INITIAL_PRODUCTS,
  OrderStore,
  GroupOrder,
  Product,
} from 'src/lib/orderStore'
import { JoinGroupModal } from 'src/components/JoinGroupModal/JoinGroupModal'
import {
  Utensils,
  Users,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Check,
  Clock,
  MapPin,
  Flame,
  ShieldCheck,
  Search,
  Star,
  Zap,
  Award,
  ChevronRight,
  TrendingDown,
  Info,
} from 'lucide-react'

const categories = [
  'All Items',
  'Savory Snacks',
  'Pastries',
  'Fast Food',
  'Cakes & Treats',
  'Beverages',
]

const HomePage = () => {
  const { addToCart, cart, itemCount } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('All Items')
  const [searchQuery, setSearchQuery] = useState('')
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [addedIds, setAddedIds] = useState<number[]>([])
  const [activeGroups, setActiveGroups] = useState<GroupOrder[]>([])
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null)

  const reloadGroups = () => {
    const groups = OrderStore.getGroupOrders().filter(
      (g) => !g.isLocked && new Date(g.deadline).getTime() > Date.now()
    )
    setActiveGroups(groups)
  }

  useEffect(() => {
    reloadGroups()
    const handleUpdate = () => reloadGroups()
    window.addEventListener('yumzee_store_update', handleUpdate)
    return () => window.removeEventListener('yumzee_store_update', handleUpdate)
  }, [])

  const getQuantity = (id: number) => quantities[id] || 1

  const handleQtyChange = (id: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }))
  }

  const handleAddToCart = (product: Product) => {
    const qty = getQuantity(product.id)
    addToCart(product, qty)
    setAddedIds((prev) => [...prev, product.id])
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id))
    }, 1500)
  }

  const filteredProducts = INITIAL_PRODUCTS.filter((prod) => {
    const matchesCat =
      selectedCategory === 'All Items' || prod.category === selectedCategory
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#FAF8FD]">
      <Metadata
        title="YumZee ? Campus Snacks & Group Orders"
        description="Affordable snack and food delivery for university students. Order alone or combine with hostel friends for free delivery."
      />

      <JoinGroupModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      {/* HERO SECTION: Single Order vs Group Order Comparison */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4B2E83] via-[#3B226B] to-[#251448] py-12 lg:py-16 text-white">
        {/* Glow ambient effects */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#FFC928]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-[#FFC928]/10 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FFC928]/40 bg-[#FFC928]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FFC928]">
                <Zap className="h-3.5 w-3.5" /> University Food & Snack Delivery
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Cravings Delivered to Your{' '}
                <span className="text-[#FFC928]">Hostel Gate.</span>
              </h1>

              <p className="max-w-2xl text-base text-white/85 sm:text-lg">
                Enjoy hot snacks, pastries, and campus meals. Order solo or join
                your roommates to <span className="font-bold text-[#FFC928]">slash delivery fees to ?0</span>!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 lg:justify-start">
                <button
                  type="button"
                  onClick={() => {
                    const menu = document.getElementById('menu-section')
                    menu?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-[#FFC928] px-7 py-3.5 text-base font-extrabold text-[#4B2E83] shadow-lg shadow-[#FFC928]/25 transition hover:bg-[#E5B420] active:scale-95"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Order for Myself</span>
                </button>

                <Link
                  to={routes.createGroupOrder()}
                  className="flex items-center gap-2 rounded-2xl border-2 border-white/30 bg-white/10 px-7 py-3.5 text-base font-extrabold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
                >
                  <Users className="h-5 w-5 text-[#FFC928]" />
                  <span>Start Group Order</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(true)}
                  className="flex items-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white/90 hover:text-white transition"
                >
                  <span>Have a Code? Join</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Stats pill */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-white/70 lg:justify-start">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-[#FFC928] text-[#FFC928]" />
                  <span>4.9/5 Student Rating</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#FFC928]" />
                  <span>15-20 Min Fast Campus Drop</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4 text-emerald-400" />
                  <span>Save up to 100% on Shared Routes</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Single vs Group Comparison Card */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-2xl text-white">
                <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                  <h3 className="font-extrabold text-base uppercase tracking-wider text-[#FFC928]">
                    How Would You Like to Order?
                  </h3>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                    2 Options
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Single Order Pill */}
                  <div className="group rounded-2xl border border-white/15 bg-white/5 p-4 transition hover:bg-white/10">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">1</span>
                          <h4 className="font-bold text-base text-white">Single Order</h4>
                        </div>
                        <p className="text-xs text-white/70">
                          Order only for yourself. Standard fast delivery to your room or hostel gate.
                        </p>
                      </div>
                      <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-white/90">
                        ?600 Delivery
                      </span>
                    </div>
                  </div>

                  {/* Group Order Pill */}
                  <div className="group relative overflow-hidden rounded-2xl border-2 border-[#FFC928] bg-gradient-to-br from-[#FFC928]/20 to-[#FFC928]/5 p-4 shadow-md transition hover:border-[#FFC928]">
                    <div className="absolute top-0 right-0 bg-[#FFC928] text-[#4B2E83] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg">
                      Popular & Cheaper
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFC928] text-[#4B2E83] text-xs font-black">2</span>
                          <h4 className="font-extrabold text-base text-[#FFC928]">Group Order</h4>
                        </div>
                        <p className="text-xs text-white/85">
                          Combine orders with hostel roommates. One rider delivers all packages together!
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between rounded-xl bg-black/30 px-3 py-2 text-xs">
                      <span className="text-white/80">4+ Students Joining:</span>
                      <span className="font-black text-emerald-400">100% FREE DELIVERY (?0)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      const el = document.getElementById('menu-section')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="rounded-xl bg-white/20 py-2.5 text-center text-xs font-bold text-white transition hover:bg-white/30"
                  >
                    Browse Snacks
                  </button>
                  <Link
                    to={routes.createGroupOrder()}
                    className="rounded-xl bg-[#FFC928] py-2.5 text-center text-xs font-extrabold text-[#4B2E83] transition hover:bg-[#E5B420]"
                  >
                    Start Group Room ?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE CAMPUS GROUP DROPS TICKER */}
      {activeGroups.length > 0 && (
        <div className="border-b border-[#E9E5EE] bg-[#FFF9E8] py-3">
          <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#4B2E83]">
                ?? {activeGroups.length} Open Group Orders Happening Right Now on Campus:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeGroups.slice(0, 2).map((grp) => (
                <button
                  key={grp.id}
                  onClick={() => navigate(`/group/${grp.groupCode}`)}
                  className="flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-3 py-1 text-xs font-bold text-[#211F26] shadow-sm hover:border-[#4B2E83] transition"
                >
                  <span className="text-[#4B2E83]">{grp.hostelAddress}</span>
                  <span className="rounded-md bg-[#4B2E83] px-1.5 py-0.2 text-[10px] text-white">
                    {grp.participants.length} joined
                  </span>
                  <span className="text-emerald-700 font-bold">Join ?</span>
                </button>
              ))}
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="text-xs font-bold text-[#4B2E83] underline hover:text-[#211F26]"
              >
                View all codes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MENU SECTION */}
      <section id="menu-section" className="py-12">
        <div className="container mx-auto px-4 space-y-8">
          {/* Header and Search */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-6 w-6 fill-[#FFC928] text-[#FFC928]" />
                <h2 className="text-3xl font-black text-[#211F26]">
                  Available Food & Snacks
                </h2>
              </div>
              <p className="mt-1 text-sm text-[#6F6B76]">
                Freshly prepared, student-priced, and packed for campus delivery.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6B76]" />
              <input
                type="text"
                placeholder="Search Kilishi, Pie, Rice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[#E9E5EE] bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-[#211F26] placeholder-[#A09BA8] shadow-sm focus:border-[#4B2E83] focus:outline-none"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-2xl px-5 py-2.5 text-xs font-bold transition duration-150 ${
                  selectedCategory === cat
                    ? 'bg-[#4B2E83] text-white shadow-md'
                    : 'border border-[#E9E5EE] bg-white text-[#6F6B76] hover:border-[#4B2E83]/40 hover:text-[#211F26]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const qty = getQuantity(product.id)
              const isAdded = addedIds.includes(product.id)

              return (
                <div
                  key={product.id}
                  className="flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E9E5EE] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                    {product.isPopular && (
                      <span className="absolute left-3 top-3 rounded-full bg-[#FFC928] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#4B2E83] shadow">
                        ? Student Craving
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                      {product.prepTimeMinutes ? `? ${product.prepTimeMinutes}m prep` : '? Fast Prep'}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#6F6B76]">
                        <span className="font-semibold uppercase tracking-wider text-[#4B2E83]">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 font-bold text-amber-600">
                          <Star className="h-3.5 w-3.5 fill-[#FFC928] text-[#FFC928]" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      <h3 className="mt-1 text-base font-extrabold text-[#211F26] line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#6F6B76] line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Quantity Selector & Price */}
                    <div className="border-t border-[#E9E5EE] pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-[#6F6B76] block">Price</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-[#4B2E83]">
                              ?{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-[#A09BA8] line-through">
                                ?{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-1 shadow-inner">
                          <button
                            type="button"
                            onClick={() => handleQtyChange(product.id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-[#211F26] shadow-sm hover:bg-gray-100 active:scale-95 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-extrabold text-[#211F26]">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(product.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-[#211F26] shadow-sm hover:bg-gray-100 active:scale-95 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-extrabold transition active:scale-95 ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#FFC928] text-[#4B2E83] shadow-md hover:bg-[#E5B420]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="h-4 w-4" />
                              <span>Added {qty} to Bag!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="h-4 w-4" />
                              <span>Add to Bag (?{(product.price * qty).toLocaleString()})</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[#E9E5EE] bg-white p-12 text-center">
              <Utensils className="mx-auto h-12 w-12 text-[#6F6B76]/40 mb-3" />
              <h3 className="text-lg font-bold text-[#211F26]">No items found</h3>
              <p className="text-xs text-[#6F6B76] mt-1">Try another category or search term.</p>
            </div>
          )}
        </div>
      </section>

      {/* GROUP SAVINGS BANNER & EXPLAINER */}
      <section className="bg-[#4B2E83] py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <span className="rounded-full bg-[#FFC928]/20 px-4 py-1 text-xs font-black uppercase text-[#FFC928] border border-[#FFC928]/30">
              Why Pay Delivery Alone?
            </span>
            <h2 className="text-3xl font-black md:text-5xl">
              Order Together ? One Rider ? Free Delivery
            </h2>
            <p className="text-base text-white/85 max-w-2xl mx-auto">
              Instead of sending 5 riders to the same hostel building, YumZee bundles your orders into one swift route.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="rounded-2xl bg-white/10 p-6 border border-white/15 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC928] text-[#4B2E83] font-black text-lg mb-3">
                  1
                </div>
                <h4 className="text-base font-bold text-white mb-1">Create Group Room</h4>
                <p className="text-xs text-white/70">
                  Pick your hostel gate and set a deadline. Share the 6-character code on your hostel WhatsApp group.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 border border-white/15 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC928] text-[#4B2E83] font-black text-lg mb-3">
                  2
                </div>
                <h4 className="text-base font-bold text-white mb-1">Friends Pick Their Own</h4>
                <p className="text-xs text-white/70">
                  Roommates add their own snacks and pay their exact share. No awkward money splitting afterwards!
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 border border-white/15 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC928] text-[#4B2E83] font-black text-lg mb-3">
                  3
                </div>
                <h4 className="text-base font-bold text-white mb-1">Shared Delivery Drop</h4>
                <p className="text-xs text-white/70">
                  One assigned rider delivers every labelled bag to your hostel reception in a single trip.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to={routes.createGroupOrder()}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC928] px-8 py-4 text-base font-black text-[#4B2E83] shadow-xl transition hover:bg-[#E5B420] active:scale-95"
              >
                <Users className="h-5 w-5" />
                <span>Start a Hostel Group Order Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
