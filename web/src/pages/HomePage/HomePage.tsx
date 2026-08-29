// web/src/pages/HomePage/HomePage.tsx - CLEAN customer-only version
// Removed: Start Group Order, Have a Code? Join, Group Order sections, Rider/Admin refs, Live ticker, Group comparison card, Group savings banner
import React, { useState } from 'react'
import { Link } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useCart } from 'src/components/CartContext/CartContext'
import {
  INITIAL_PRODUCTS,
  Product,
} from 'src/lib/orderStore'
import {
  Utensils,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Clock,
  Flame,
  Search,
  Star,
  Zap,
  Award,
  TrendingDown,
} from 'lucide-react'

const categories = [
  'All Items',
  'Savory Snacks',
  'Pastries',
  'Fast Food',
  'Cakes & Desserts',
  'Beverages',
  'Healthy Bites',
]

const HomePage = () => {
  const { addToCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('All Items')
  const [searchQuery, setSearchQuery] = useState('')
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [addedIds, setAddedIds] = useState<number[]>([])

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
        title="YumZee — Fresh Snacks & Fast Delivery"
        description="Affordable snack delivery for everyone. Fresh, fast and simple to order."
      />

      {/* HERO SECTION - CLEAN: Single order only, no Group Order */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4B2E83] via-[#3B226B] to-[#251448] py-12 lg:py-16 text-white">
        {/* Glow ambient effects */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#FFC928]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-[#FFC928]/10 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FFC928]/40 bg-[#FFC928]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FFC928]">
                <Zap className="h-3.5 w-3.5" /> Fresh Snack Delivery
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Cravings Delivered to Your{' '}
                <span className="text-[#FFC928]">Doorstep.</span>
              </h1>

              <p className="max-w-2xl text-base text-white/85 sm:text-lg">
                Enjoy hot snacks, pastries and light meals — freshly made, affordable and delivered fast to you.
              </p>

              {/* Action Buttons - CLEAN: only Browse Menu */}
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
                  <span>Browse Menu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const menu = document.getElementById('menu-section')
                    menu?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="flex items-center gap-2 rounded-2xl border-2 border-white/30 bg-white/10 px-7 py-3.5 text-base font-extrabold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
                >
                  <Utensils className="h-5 w-5 text-[#FFC928]" />
                  <span>Explore Categories</span>
                </button>
              </div>

              {/* Stats pill */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-white/70 lg:justify-start">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-[#FFC928] text-[#FFC928]" />
                  <span>4.9/5 Customer Rating</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#FFC928]" />
                  <span>15-20 Min Fast Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span>Affordable Prices</span>
                </div>
              </div>
            </div>

            {/* Right: Simple Value Props Card - CLEAN: no Single vs Group comparison */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-2xl text-white">
                <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                  <h3 className="font-extrabold text-base uppercase tracking-wider text-[#FFC928]">
                    Why Customers Love YumZee
                  </h3>
                  <span className="rounded-full bg-[#FFC928] px-2.5 py-0.5 text-[10px] font-black text-[#4B2E83]">
                    Fast & Fresh
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFC928] text-[#4B2E83]">
                      <Flame className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Hot & Fresh</h4>
                      <p className="text-xs text-white/70">Made fresh to order by trusted kitchens.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">15-20 min delivery</h4>
                      <p className="text-xs text-white/70">Fast delivery straight to your doorstep.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <TrendingDown className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Affordable Prices</h4>
                      <p className="text-xs text-white/70">Tasty snacks starting from ₦250.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => {
                      const el = document.getElementById('menu-section')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full rounded-xl bg-[#FFC928] py-3 text-center text-sm font-extrabold text-[#4B2E83] transition hover:bg-[#E5B420]"
                  >
                    View Today&apos;s Menu →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                Freshly prepared, affordable and packed for quick delivery.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6B76]" />
              <input
                type="text"
                placeholder="Search Jollof, Shawarma, Rice..."
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
                        Popular
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                      {product.prepTimeMinutes ? `${product.prepTimeMinutes}m prep` : 'Fast Prep'}
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
                              ₦{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-[#A09BA8] line-through">
                                ₦{product.originalPrice.toLocaleString()}
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

                      {/* Action Button - single checkout only */}
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
                              <span>Add to Bag (₦{(product.price * qty).toLocaleString()})</span>
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

      {/* WHY YUMZEE BANNER - CLEAN: no group order, single order flow only */}
      <section className="bg-[#4B2E83] py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <span className="rounded-full bg-[#FFC928]/20 px-4 py-1 text-xs font-black uppercase text-[#FFC928] border border-[#FFC928]/30">
              Fast & Fresh
            </span>
            <h2 className="text-3xl font-black md:text-5xl">
              Hot Snacks, Fast Delivery
            </h2>
            <p className="text-base text-white/85 max-w-2xl mx-auto">
              Order your favorite snacks in seconds — we make them fresh and deliver quickly to you.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="rounded-2xl bg-white/10 p-6 border border-white/15 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC928] text-[#4B2E83] font-black text-lg mb-3">
                  1
                </div>
                <h4 className="text-base font-bold text-white mb-1">Browse Menu</h4>
                <p className="text-xs text-white/70">
                  Explore snacks, meals and drinks from trusted kitchens.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 border border-white/15 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC928] text-[#4B2E83] font-black text-lg mb-3">
                  2
                </div>
                <h4 className="text-base font-bold text-white mb-1">Add to Bag</h4>
                <p className="text-xs text-white/70">
                  Pick your quantity and add to bag. Checkout in one tap.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 border border-white/15 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC928] text-[#4B2E83] font-black text-lg mb-3">
                  3
                </div>
                <h4 className="text-base font-bold text-white mb-1">Fast Delivery</h4>
                <p className="text-xs text-white/70">
                  Track your order and get it hot in 15-20 minutes.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  const el = document.getElementById('menu-section')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC928] px-8 py-4 text-base font-black text-[#4B2E83] shadow-xl transition hover:bg-[#E5B420] active:scale-95"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Order Now — Browse Menu</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
