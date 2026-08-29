// web/src/pages/DashboardPage/DashboardPage.tsx - minimal, portable
import { useState } from 'react'
import { Package, ShoppingBag, Heart, MapPin, ArrowRight, Check, Plus, User, Coffee } from 'lucide-react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useAuth } from 'src/contexts/AuthContexts'
import { useCart } from 'src/contexts/CartContext'

interface QuickSnack {
  id: number
  name: string
  price: number
  image: string
  category: string
}

const quickSnacksData: QuickSnack[] = [
  { id: 1, name: 'Ultimate Meat Pie', price: 700, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop', category: 'Savory' },
  { id: 6, name: 'Chicken Sandwich', price: 1200, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop', category: 'Pastries' },
  { id: 10, name: 'Pepperoni Pizza Slice', price: 1200, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', category: 'Fast Food' },
  { id: 2, name: 'Shrimply Fish Pie', price: 900, image: 'https://images.unsplash.com/photo-1627046505961-e46b9df158be?w=400&h=300&fit=crop', category: 'Savory' },
]

const DashboardPage = () => {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [addedItemIds, setAddedItemIds] = useState<number[]>([])

  const getFirstName = () => {
    if (!user) return 'there'
    const name = user.displayName || user.email?.split('@')[0] || 'there'
    return name.split(' ')[0]
  }
  const handleQuickAdd = (snack: QuickSnack) => {
    addToCart({ id: snack.id, name: snack.name, price: snack.price, image: snack.image, category: snack.category })
    setAddedItemIds((prev) => [...prev, snack.id])
    setTimeout(() => setAddedItemIds((prev) => prev.filter((id) => id !== snack.id)), 1500)
  }

  return (
    <div className="min-h-screen bg-[#FBF9FE] py-6">
      <Metadata title="Dashboard — YumZee" description="Your YumZee dashboard" />
      <div className="container mx-auto max-w-6xl space-y-6 px-4">
        {/* Welcome */}
        <div className="rounded-3xl bg-[#4B2E83] p-6 text-white">
          <h1 className="text-2xl font-black">Welcome back, <span className="text-[#FFC928]">{getFirstName()}</span></h1>
          <p className="mt-1 text-sm text-white/80">Fresh snacks for everyone — quick ordering, fast delivery.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to={routes.home()} className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC928] px-6 py-3 text-sm font-bold text-[#4B2E83] hover:bg-[#E5B420] transition"><ShoppingBag className="h-4 w-4" /> Order Now</Link>
            <Link to={routes.orders()} className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 transition"><Package className="h-4 w-4" /> My Orders</Link>
          </div>
        </div>

        {/* Current order - minimal */}
        <div className="rounded-3xl border border-[#E9E5EE] bg-white p-4">
          <div className="flex items-center justify-between border-b border-[#E9E5EE] pb-3">
            <h2 className="text-sm font-black text-[#211F26]">Recent order</h2>
            <Link to={routes.orders()} className="text-xs font-bold text-[#4B2E83]">View all →</Link>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <div>
              <p className="font-bold text-[#211F26]">Order #YZ-84920 — On the way</p>
              <p className="text-xs text-[#6F6B76] flex items-center gap-1"><MapPin className="h-3 w-3" /> Delivery to your address • 10-15 min</p>
            </div>
            <div className="text-xs text-[#6F6B76] text-right"><p>2× Meat Pie, 1× Coke</p><p className="font-bold text-[#4B2E83]">₦1,800</p></div>
          </div>
        </div>

        {/* Quick add */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-[#211F26]">Quick add</h2>
            <Link to={routes.home()} className="flex items-center gap-1 text-xs font-bold text-[#4B2E83]">Full Menu <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickSnacksData.map((snack) => {
              const isAdded = addedItemIds.includes(snack.id)
              return (
                <div key={snack.id} className="overflow-hidden rounded-2xl border border-[#E9E5EE] bg-white">
                  <div className="h-36 bg-gray-100"><img src={snack.image} alt={snack.name} className="h-full w-full object-cover" /></div>
                  <div className="p-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#6F6B76]">{snack.category}</div>
                    <h3 className="text-sm font-bold text-[#211F26]">{snack.name}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-black text-[#4B2E83]">₦{snack.price.toLocaleString()}</span>
                      <button onClick={() => handleQuickAdd(snack)} className={`rounded-xl px-3 py-2 text-xs font-bold ${isAdded ? 'bg-emerald-600 text-white' : 'bg-[#FFC928] text-[#4B2E83] hover:bg-[#E5B420]'}`}>
                        {isAdded ? <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Added</span> : <span className="flex items-center gap-1"><Plus className="h-3 w-3" /> Add</span>}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link to={routes.favorites()} className="rounded-3xl border border-[#E9E5EE] bg-white p-4 hover:border-[#4B2E83]/20 transition">
            <Heart className="h-5 w-5 text-pink-600" /><h3 className="mt-2 text-sm font-bold text-[#211F26]">Favorites</h3><p className="text-xs text-[#6F6B76]">Your saved snacks.</p>
          </Link>
          <Link to={routes.profile()} className="rounded-3xl border border-[#E9E5EE] bg-white p-4 hover:border-[#4B2E83]/20 transition">
            <User className="h-5 w-5 text-[#4B2E83]" /><h3 className="mt-2 text-sm font-bold text-[#211F26]">Delivery details</h3><p className="text-xs text-[#6F6B76]">Address and contact.</p>
          </Link>
          <Link to={routes.contact()} className="rounded-3xl border border-[#E9E5EE] bg-white p-4 hover:border-[#4B2E83]/20 transition">
            <Coffee className="h-5 w-5 text-amber-600" /><h3 className="mt-2 text-sm font-bold text-[#211F26]">Support</h3><p className="text-xs text-[#6F6B76]">Need help? Contact us.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
