// web/src/pages/HomePage/HomePage.tsx - portable, minimal, professional
import React, { useState } from 'react'
import { Metadata } from '@redwoodjs/web'
import { useCart } from 'src/components/CartContext/CartContext'
import { INITIAL_PRODUCTS, Product } from 'src/lib/orderStore'
import { Utensils, ShoppingBag, Plus, Minus, Check, Search } from 'lucide-react'

const categories = [
  'All Items',
  'Pastries',
  'Savory Snacks',
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
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }))
  }
  const handleAddToCart = (product: Product) => {
    const qty = getQuantity(product.id)
    addToCart(product, qty)
    setAddedIds((prev) => [...prev, product.id])
    setTimeout(() => setAddedIds((prev) => prev.filter((i) => i !== product.id)), 1300)
  }

  const [productNumberInput, setProductNumberInput] = useState('')
  const [productNumberPreview, setProductNumberPreview] = useState<{ product: Product; qty: number }[] | null>(null)
  const [productNumberError, setProductNumberError] = useState('')

  const parseProductNumberList = (input: string): { id: number; qty: number }[] | null => {
    const s = input.trim()
    if (!s) return null
    const parts = s.split(',').map(p => p.trim()).filter(Boolean)
    if (parts.length === 0) return null
    const res: { id: number; qty: number }[] = []
    for (const part of parts) {
      const m = part.replace(/×/g, 'x').toLowerCase().match(/^(\d+)\s*(?:x\s*(\d+))?$/)
      if (!m) return null
      const id = parseInt(m[1], 10); const qty = m[2] ? parseInt(m[2], 10) : 1
      if (id < 1 || id > 50 || qty < 1 || qty > 99) return null
      const ex = res.find(r => r.id === id)
      if (ex) ex.qty += qty
      else res.push({ id, qty })
    }
    return res
  }
  const handleProductNumberLoad = () => {
    const parsedList = parseProductNumberList(productNumberInput)
    if (!parsedList) { setProductNumberError('Enter 1-20, e.g., 5 or 5x2 or 3x2,7x1,12x3'); setProductNumberPreview(null); return }
    const found: { product: Product; qty: number }[] = []
    for (const p of parsedList) {
      const prod = INITIAL_PRODUCTS.find(x => x.id === p.id)
      if (!prod) { setProductNumberError(`No product #${p.id}`); setProductNumberPreview(null); return }
      found.push({ product: prod, qty: p.qty })
      setQuantities((prev) => ({ ...prev, [prod.id]: p.qty }))
    }
    setProductNumberPreview(found)
    setProductNumberError('')
  }

  const filteredProducts = INITIAL_PRODUCTS.filter((p) => {
    const catOk = selectedCategory === 'All Items' || p.category === selectedCategory
    const q = searchQuery.trim().toLowerCase()
    if (!q) return catOk
    // if query is product number like "5" or "5x2", also match by id
    const parsed = parseProductNumber(q)
    if (parsed && p.id === parsed.id) return catOk
    return catOk && `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-screen bg-[#FAF8FD]">
      <Metadata title="YumZee — Snacks" description="Simple snack ordering." />

      {/* HERO - minimal */}
      <section className="bg-gradient-to-br from-[#4B2E83] via-[#3B226B] to-[#251448] py-14 text-white">
        <div className="w-full mx-auto px-2 sm:px-3">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              Cravings Delivered to Your <span className="text-[#FFC928]">Doorstep.</span>
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC928] px-7 py-3.5 text-sm font-extrabold text-[#4B2E83] hover:bg-[#E5B420] transition"
              >
                <ShoppingBag className="h-4 w-4" /> Browse Menu
              </button>
              <button
                onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/15 transition"
              >
                <Utensils className="h-4 w-4" /> Explore
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu-section" className="py-10">
        <div className="w-full mx-auto px-2 sm:px-3 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-[#211F26]">Menu</h2>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A09BA8]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search snacks..."
                className="w-full rounded-2xl border border-[#E9E5EE] bg-white py-2.5 pl-10 pr-4 text-sm placeholder-[#A09BA8] focus:border-[#4B2E83] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-2xl px-5 py-2.5 text-xs font-bold border transition ${
                  selectedCategory === cat
                    ? 'bg-[#4B2E83] text-white border-[#4B2E83]'
                    : 'bg-white text-[#6F6B76] border-[#E9E5EE] hover:border-[#4B2E83]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Number → Auto Load (e.g., 5 → Puff Puff, 5x2 → qty 2) */}
          <div className="rounded-2xl border border-[#E9E5EE] bg-white p-3 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#211F26]">Have product number? (1-20)</span>
              <span className="text-[11px] text-[#6F6B76]">e.g., 5 → Puff Puff, 12×3 → Suya ×3</span>
            </div>
            <div className="flex gap-2">
              <input
                value={productNumberInput}
                onChange={(e) => { setProductNumberInput(e.target.value); setProductNumberError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleProductNumberLoad()}
                placeholder="Enter 5 or 5x2"
                className="flex-1 rounded-xl border border-[#E9E5EE] bg-[#FAF8FD] px-3 py-2.5 text-sm font-mono font-bold text-center focus:border-[#4B2E83] focus:outline-none"
              />
              <button onClick={handleProductNumberLoad} className="rounded-xl bg-[#4B2E83] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#371F62]">Load</button>
              <button onClick={() => { const s = productNumberInput.trim(); if (s) navigator.clipboard.writeText(s) }} className="rounded-xl border border-[#E9E5EE] bg-white px-3 py-2.5 text-xs font-bold hover:bg-gray-50">Share</button>
            </div>
            {productNumberError && <p className="text-xs font-bold text-red-600">{productNumberError}</p>}
            {productNumberPreview && (
              <div className="space-y-2">
                {productNumberPreview.map(({ product, qty }) => (
                  <div key={product.id} className="flex items-center gap-3 rounded-xl border border-[#4B2E83]/20 bg-[#F5F1FB] p-3">
                    <img src={product.image} alt={product.name} className="h-12 w-12 rounded-xl object-cover border" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-[#4B2E83]">#{product.id} • {product.category}</div>
                      <div className="text-sm font-bold truncate">{product.name} — ₦{product.price.toLocaleString()}</div>
                      <div className="text-xs text-[#6F6B76]">Qty {qty} → ₦{(product.price * qty).toLocaleString()}</div>
                    </div>
                    <span className="text-xs font-bold">×{qty}</span>
                  </div>
                ))}
                <button
                  onClick={() => {
                    productNumberPreview.forEach(({ product, qty }) => {
                      setQuantities((prev) => ({ ...prev, [product.id]: qty }))
                      // use addToCart with qty
                      addToCart(product, qty)
                    })
                    setTimeout(() => setProductNumberPreview(null), 800)
                  }}
                  className="w-full rounded-xl bg-[#FFC928] py-2.5 text-xs font-bold text-[#4B2E83]"
                >
                  Add All {productNumberPreview.length} to Bag
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const qty = getQuantity(product.id)
              const added = addedIds.includes(product.id)
              return (
                <div key={product.id} className="flex flex-col overflow-hidden rounded-2xl border border-[#E9E5EE] bg-white">
                  <div className="relative h-44 bg-gray-100">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-[#4B2E83] px-2.5 py-1 text-[10px] font-black text-white">#{product.id}</span>
                    {product.isPopular && (
                      <span className="absolute left-12 top-3 rounded-full bg-[#FFC928] px-3 py-1 text-[10px] font-black uppercase text-[#4B2E83]">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4 space-y-3">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#4B2E83]">#{product.id} • {product.category}</div>
                      <h3 className="mt-1 text-sm font-bold text-[#211F26]">{product.name}</h3>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#F5F1FB]">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-[#211F26]">₦{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-[#A09BA8] line-through">₦{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-full border border-[#E9E5EE] bg-[#FAF8FD] p-0.5">
                          <button onClick={() => handleQtyChange(product.id, -1)} className="h-7 w-7 rounded-full bg-white flex items-center justify-center hover:bg-gray-50">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold">{qty}</span>
                          <button onClick={() => handleQtyChange(product.id, 1)} className="h-7 w-7 rounded-full bg-white flex items-center justify-center hover:bg-gray-50">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`rounded-full px-4 py-2 text-xs font-bold transition ${added ? 'bg-emerald-600 text-white' : 'bg-[#FFC928] text-[#4B2E83] hover:bg-[#E5B420]'}`}
                        >
                          {added ? <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Added</span> : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-[#E9E5EE] bg-white p-10 text-center">
              <p className="text-sm font-bold text-[#211F26]">No items found</p>
              <p className="text-xs text-[#6F6B76] mt-1">Try another category or search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage
