// web/src/pages/DiscoverPage/DiscoverPage.tsx - Real search, Glovo/Facebook grade
import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useCart } from 'src/components/CartContext/CartContext'
import { INITIAL_PRODUCTS, Product } from 'src/lib/orderStore'
import {
  Search,
  X,
  Clock,
  Flame,
  TrendingUp,
  ArrowLeft,
  Plus,
  Minus,
  ShoppingBag,
  Check,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'

const CATEGORIES = ['All', 'Savory Snacks', 'Pastries', 'Fast Food', 'Cakes & Desserts', 'Beverages', 'Healthy Bites'] as const
const POPULAR_SEARCHES = ['Meat pie', 'Suya', 'Shawarma', 'Cake', 'Smoothie', 'Burger', 'Yogurt', 'Chicken']
const STORAGE_KEY = 'yumzee_recent_searches'

const categoryEmoji: Record<string, string> = {
  'Savory Snacks': '🥟',
  Pastries: '🥐',
  'Fast Food': '🍕',
  'Cakes & Desserts': '🍰',
  Beverages: '🥤',
  'Healthy Bites': '🥗',
}

const DiscoverPage = () => {
  const { addToCart } = useCart()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState<string>('All')
  const [recent, setRecent] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      return v ? JSON.parse(v) : []
    } catch {
      return []
    }
  })
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [addedIds, setAddedIds] = useState<number[]>([])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const persistRecent = (term: string) => {
    if (!term.trim() || term.trim().length < 2) return
    setRecent((prev) => {
      const next = [term.trim(), ...prev.filter((p) => p.toLowerCase() !== term.trim().toLowerCase())].slice(0, 8)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const removeRecent = (term: string) => {
    setRecent((prev) => {
      const next = prev.filter((p) => p !== term)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const clearRecent = () => {
    setRecent([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return INITIAL_PRODUCTS.filter((p) => {
      const catOk = selectedCat === 'All' || p.category === selectedCat
      if (!q) return catOk
      const hay = `${p.name} ${p.description} ${p.category} ${p.sellerName ?? ''}`.toLowerCase()
      return catOk && hay.includes(q)
    })
  }, [query, selectedCat])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || q.length < 1) return []
    const names = INITIAL_PRODUCTS.map((p) => p.name)
    const uniq = Array.from(new Set(names))
    return uniq.filter((n) => n.toLowerCase().includes(q)).slice(0, 5)
  }, [query])

  const getQty = (id: number) => quantities[id] || 1
  const changeQty = (id: number, d: number) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + d) }))

  const handleAdd = (product: Product) => {
    const qty = getQty(product.id)
    addToCart(product, qty)
    if (query.trim()) persistRecent(query.trim())
    setAddedIds((prev) => [...prev, product.id])
    setTimeout(() => setAddedIds((prev) => prev.filter((id) => id !== product.id)), 1400)
  }

  const handleSelectSuggestion = (term: string) => {
    setQuery(term)
    persistRecent(term)
  }

  const isSearching = query.trim().length > 0 || selectedCat !== 'All'

  return (
    <div className="min-h-screen bg-[#FAF8FD]">
      <Metadata title="Discover — Search YumZee" description="Search snacks and treats. Simple discovery for everyone." />

      {/* Sticky search header - Glovo style */}
      <div className="sticky top-0 z-30 border-b border-[#E9E5EE] bg-white/95 backdrop-blur-md">
        <div className="container mx-auto max-w-3xl px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(routes.home())}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F1FB] text-[#4B2E83] hover:bg-[#E9E5EE] transition lg:hidden"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A09BA8]" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) persistRecent(query.trim())
              }}
              placeholder="Search Jollof, Shawarma, Suya..."
              className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] py-3 pl-10 pr-10 text-sm font-medium text-[#211F26] placeholder-[#A09BA8] shadow-sm focus:border-[#4B2E83] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4B2E83]/10"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-[#211F26] p-1 text-white hover:bg-black"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => navigate(routes.home())}
            className="hidden sm:inline-flex rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#6F6B76] hover:text-[#211F26]"
          >
            Cancel
          </button>
        </div>

        {/* Category pills - Facebook/Glovo horizontal chips */}
        <div className="container mx-auto max-w-3xl px-4 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 pr-2 text-[#6F6B76]">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Filter</span>
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold border transition ${
                  selectedCat === cat
                    ? 'bg-[#4B2E83] text-white border-[#4B2E83] shadow'
                    : 'bg-white text-[#6F6B76] border-[#E9E5EE] hover:border-[#4B2E83]/30 hover:text-[#211F26]'
                }`}
              >
                <span className="mr-1">{cat === 'All' ? '✨' : categoryEmoji[cat] ?? ''}</span>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Suggestions dropdown - appears while typing */}
        {suggestions.length > 0 && (
          <div className="rounded-2xl border border-[#E9E5EE] bg-white shadow-sm overflow-hidden">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSelectSuggestion(s)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#FAF8FD] transition border-b border-[#F5F1FB] last:border-0"
              >
                <Search className="h-4 w-4 text-[#A09BA8] shrink-0" />
                <span className="text-sm font-medium text-[#211F26]">{s}</span>
                <span className="ml-auto text-xs text-[#A09BA8]">in menu</span>
              </button>
            ))}
          </div>
        )}

        {!isSearching ? (
          <>
            {/* Recent searches - Facebook style */}
            <div className="rounded-3xl border border-[#E9E5EE] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#211F26]">
                  <Clock className="h-4 w-4 text-[#6F6B76]" /> Recent searches
                </h3>
                {recent.length > 0 && (
                  <button onClick={clearRecent} className="text-xs font-bold text-[#4B2E83] hover:text-[#FFC928] flex items-center gap-1">
                    <Trash2 className="h-3.5 w-3.5" /> Clear
                  </button>
                )}
              </div>
              {recent.length === 0 ? (
                <p className="mt-3 text-xs text-[#A09BA8]">No recent searches — try “Suya” or “Jollof”.</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {recent.map((t) => (
                    <div key={t} className="group flex items-center gap-1 rounded-full border border-[#E9E5EE] bg-[#FAF8FD] pl-3 pr-1 py-1 text-xs font-bold text-[#211F26]">
                      <button onClick={() => setQuery(t)} className="hover:text-[#4B2E83]">
                        {t}
                      </button>
                      <button onClick={() => removeRecent(t)} className="rounded-full p-1 text-[#A09BA8] hover:bg-white hover:text-[#211F26]">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Popular searches */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#211F26]">
                <TrendingUp className="h-4 w-4 text-[#FFC928]" /> Popular now
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSelectSuggestion(p)}
                    className="rounded-full bg-white border border-[#E9E5EE] px-4 py-2 text-xs font-bold text-[#211F26] hover:border-[#4B2E83] hover:text-[#4B2E83] shadow-sm transition"
                  >
                    #{p}
                  </button>
                ))}
              </div>
            </div>

            {/* Browse categories - Glovo tiles */}
            <div>
              <h3 className="text-sm font-extrabold text-[#211F26]">Browse categories</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {(['Savory Snacks', 'Pastries', 'Fast Food', 'Cakes & Desserts', 'Beverages', 'Healthy Bites'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className="flex items-center gap-3 rounded-2xl border border-[#E9E5EE] bg-white p-4 text-left shadow-sm hover:border-[#4B2E83]/20 hover:shadow-md transition"
                  >
                    <span className="text-2xl">{categoryEmoji[cat]}</span>
                    <div>
                      <div className="text-sm font-extrabold text-[#211F26]">{cat}</div>
                      <div className="text-xs text-[#6F6B76]">{INITIAL_PRODUCTS.filter((x) => x.category === cat).length} items</div>
                    </div>
                    <span className="ml-auto text-[#A09BA8]">›</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending now */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#211F26]">
                  <Flame className="h-4 w-4 fill-[#FFC928] text-[#FFC928]" /> Trending now
                </h3>
                <span className="text-xs font-bold text-[#A09BA8]">{INITIAL_PRODUCTS.filter((p) => p.isPopular).length} picks</span>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INITIAL_PRODUCTS.filter((p) => p.isPopular)
                  .slice(0, 4)
                  .map((product) => {
                    const qty = getQty(product.id)
                    const added = addedIds.includes(product.id)
                    return (
                      <div key={product.id} className="flex gap-3 rounded-2xl border border-[#E9E5EE] bg-white p-3 shadow-sm">
                        <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-cover border border-[#E9E5EE]" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#4B2E83]">{product.category}</div>
                          <div className="text-sm font-bold text-[#211F26] truncate">{product.name}</div>
                          <div className="text-xs font-bold text-[#211F26]">₦{product.price.toLocaleString()}</div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center rounded-full border border-[#E9E5EE] bg-[#FAF8FD] p-0.5">
                              <button onClick={() => changeQty(product.id, -1)} className="h-6 w-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100">
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold">{qty}</span>
                              <button onClick={() => changeQty(product.id, 1)} className="h-6 w-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100">
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleAdd(product)}
                              className={`flex-1 rounded-full py-1.5 text-xs font-extrabold transition ${added ? 'bg-emerald-600 text-white' : 'bg-[#FFC928] text-[#4B2E83] hover:bg-[#E5B420]'}`}
                            >
                              {added ? <span className="flex items-center justify-center gap-1"><Check className="h-3 w-3" /> Added</span> : 'Add'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Results header */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#211F26]">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} {query ? <>for <span className="text-[#4B2E83]">“{query}”</span></> : null}
                {selectedCat !== 'All' && <span className="text-[#6F6B76]"> in {selectedCat}</span>}
              </h2>
              <button onClick={() => { setQuery(''); setSelectedCat('All') }} className="text-xs font-bold text-[#4B2E83] hover:underline">
                Clear filters
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#E9E5EE] bg-white p-10 text-center">
                <Search className="mx-auto h-10 w-10 text-[#A09BA8]/40" />
                <h3 className="mt-3 text-sm font-bold text-[#211F26]">No results for “{query}”{selectedCat !== 'All' ? ` in ${selectedCat}` : ''}</h3>
                <p className="mt-1 text-xs text-[#6F6B76]">Try “Jollof”, “Suya” or check the category.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {POPULAR_SEARCHES.slice(0, 4).map((p) => (
                    <button key={p} onClick={() => setQuery(p)} className="rounded-full border border-[#E9E5EE] bg-[#FAF8FD] px-3 py-1.5 text-xs font-bold text-[#4B2E83] hover:bg-white">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((product) => {
                  const qty = getQty(product.id)
                  const added = addedIds.includes(product.id)
                  return (
                    <div key={product.id} className="overflow-hidden rounded-3xl border border-[#E9E5EE] bg-white shadow-sm hover:shadow-md transition">
                      <div className="relative h-40 bg-gray-100">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        {product.isPopular && <span className="absolute left-3 top-3 rounded-full bg-[#FFC928] px-2.5 py-1 text-[10px] font-black uppercase text-[#4B2E83]">Popular</span>}
                        <span className="absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-1 text-[11px] font-bold text-white">{product.prepTimeMinutes ?? 10}m</span>
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#4B2E83]">{product.category}</div>
                          <h3 className="mt-1 text-sm font-extrabold text-[#211F26]">{product.name}</h3>
                          <p className="mt-1 line-clamp-2 text-xs text-[#6F6B76]">{product.description}</p>
                          <p className="mt-1 text-[11px] text-[#A09BA8]">{product.sellerName}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-[#F5F1FB] pt-3">
                          <span className="text-base font-black text-[#4B2E83]">₦{product.price.toLocaleString()}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-full border border-[#E9E5EE] bg-[#FAF8FD] p-0.5">
                              <button onClick={() => changeQty(product.id, -1)} className="h-7 w-7 rounded-full bg-white flex items-center justify-center shadow-sm"><Minus className="h-3 w-3" /></button>
                              <span className="w-7 text-center text-xs font-bold">{qty}</span>
                              <button onClick={() => changeQty(product.id, 1)} className="h-7 w-7 rounded-full bg-white flex items-center justify-center shadow-sm"><Plus className="h-3 w-3" /></button>
                            </div>
                            <button onClick={() => handleAdd(product)} className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${added ? 'bg-emerald-600 text-white' : 'bg-[#FFC928] text-[#4B2E83] hover:bg-[#E5B420] shadow'}`}>
                              {added ? <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Added</span> : <span className="flex items-center gap-1"><ShoppingBag className="h-3.5 w-3.5" /> Add</span>}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default DiscoverPage
