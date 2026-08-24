// web/src/pages/DashboardPage/DashboardPage.tsx
import { useState } from 'react'

import {
  Package,
  ShoppingBag,
  Heart,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Truck,
  Flame,
  Plus,
  Check,
  ChevronRight,
  User,
  Coffee,
} from 'lucide-react'

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
  tag?: string
  calories?: string
}

const quickSnacksData: QuickSnack[] = [
  {
    id: 1,
    name: 'Ultimate Meat Pie',
    price: 700,
    image:
      'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop',
    category: 'Savory',
    tag: 'Top Pick',
    calories: '420 Cal',
  },
  {
    id: 6,
    name: 'Chicken Sandwich',
    price: 1200,
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    category: 'Pastries',
    tag: 'Fresh',
    calories: '520 Cal',
  },
  {
    id: 10,
    name: 'Pepperoni Pizza Slice',
    price: 1200,
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'Fast Food',
    tag: 'Popular',
    calories: '580 Cal',
  },
  {
    id: 2,
    name: 'Shrimply Fish Pie',
    price: 900,
    image:
      'https://images.unsplash.com/photo-1627046505961-e46b9df158be?w=400&h=300&fit=crop',
    category: 'Savory',
    calories: '380 Cal',
  },
]

const DashboardPage = () => {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [addedItemIds, setAddedItemIds] = useState<number[]>([])

  const getFirstName = () => {
    if (!user) return 'Student'
    const name = user.displayName || user.email?.split('@')[0] || 'Student'
    return name.split(' ')[0]
  }

  const handleQuickAdd = (snack: QuickSnack) => {
    addToCart({
      id: snack.id,
      name: snack.name,
      price: snack.price,
      image: snack.image,
      category: snack.category,
    })

    setAddedItemIds((prev) => [...prev, snack.id])
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== snack.id))
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#FBF9FE] py-8">
      <Metadata
        title="Student Dashboard"
        description="Your YumZee student hub"
      />

      <div className="container mx-auto max-w-6xl space-y-8 px-4">
        {/* HERO BANNER – "YUMZEE is yours!!" Slogan & Greeting */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4B2E83] via-[#3A2366] to-[#251543] p-8 text-white shadow-xl md:p-12">
          <div className="pointer-events-none absolute right-0 top-0 -mr-10 -mt-10 h-80 w-80 rounded-full bg-[#FFC928]/10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FFC928]/30 bg-[#FFC928]/20 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#FFC928] md:text-sm">
                <Sparkles className="h-4 w-4" />
                <span>YUMZEE is yours!!</span>
              </div>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Welcome back,{' '}
                <span className="text-[#FFC928]">{getFirstName()}</span>!
              </h1>

              <p className="mt-3 max-w-xl text-base font-light text-white/80 md:text-lg">
                Ready for a quick study break bite? Browse today&apos;s freshly
                baked pastries, hot fast food, and cold beverages delivered
                straight to your campus hostel.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to={routes.home()}
                  className="flex items-center gap-2 rounded-2xl bg-[#FFC928] px-6 py-3 text-sm font-bold text-[#4B2E83] shadow-lg transition hover:bg-[#E5B420] hover:shadow-xl active:scale-95"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Order Food Now</span>
                </Link>

                <Link
                  to={routes.orders()}
                  className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <Package className="h-4 w-4 text-[#FFC928]" />
                  <span>View My Orders</span>
                </Link>
              </div>
            </div>

            {/* Student Badge Card */}
            <div className="hidden max-w-[240px] flex-col items-center rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-md lg:flex">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFC928] text-2xl font-extrabold text-[#4B2E83] shadow-md">
                {user?.displayName ? user.displayName[0].toUpperCase() : '⚡'}
              </div>
              <p className="max-w-[180px] truncate text-base font-bold text-white">
                {user?.displayName || 'Campus Foodie'}
              </p>
              <p className="mt-0.5 text-xs font-medium text-[#FFC928]">
                VIP Student Member
              </p>
              <div className="mt-4 flex w-full justify-between border-t border-white/10 pt-3 text-xs text-white/80">
                <span>Status</span>
                <span className="font-semibold text-green-400">● Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK STATS CARDS */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#E9E5EE] bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="mb-3 flex items-center justify-between text-[#6F6B76]">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Orders
              </span>
              <div className="rounded-xl bg-[#F5F1FB] p-2 text-[#4B2E83]">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-[#211F26] md:text-3xl">
              6
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>Campus verified</span>
            </p>
          </div>

          <div className="rounded-2xl border border-[#E9E5EE] bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="mb-3 flex items-center justify-between text-[#6F6B76]">
              <span className="text-xs font-semibold uppercase tracking-wider">
                YumZee Points
              </span>
              <div className="rounded-xl bg-[#FFF9E8] p-2 text-[#E5B420]">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-[#211F26] md:text-3xl">
              480 Pts
            </p>
            <p className="mt-1 text-xs font-medium text-[#6F6B76]">
              ₦1,200 discount credit
            </p>
          </div>

          <div className="rounded-2xl border border-[#E9E5EE] bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="mb-3 flex items-center justify-between text-[#6F6B76]">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Saved Snacks
              </span>
              <div className="rounded-xl bg-pink-50 p-2 text-pink-600">
                <Heart className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-[#211F26] md:text-3xl">
              4 Items
            </p>
            <Link
              to={routes.favorites()}
              className="mt-1 inline-flex items-center gap-0.5 text-xs font-semibold text-[#4B2E83] hover:underline"
            >
              View favorites →
            </Link>
          </div>

          <div className="rounded-2xl border border-[#E9E5EE] bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="mb-3 flex items-center justify-between text-[#6F6B76]">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Delivery Speed
              </span>
              <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-[#211F26] md:text-3xl">
              ~15 Mins
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-blue-600">
              <Truck className="h-3 w-3" />
              <span>Direct to Hostel</span>
            </p>
          </div>
        </div>

        {/* ACTIVE / RECENT ORDER TRACKING */}
        <div className="rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-2 border-b border-[#E9E5EE] pb-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-ping rounded-full bg-emerald-500"></span>
                <h2 className="text-xl font-extrabold text-[#211F26]">
                  Recent Order Status
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-[#6F6B76]">
                Order #YZ-84920 • Placed today
              </p>
            </div>
            <Link
              to={routes.orders()}
              className="inline-flex items-center gap-1 self-start text-xs font-bold text-[#4B2E83] transition hover:text-[#3A2366] sm:self-auto"
            >
              All Order History <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Progress Visual */}
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#211F26]">
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> Order Confirmed
                </span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> Kitchen Preparing
                </span>
                <span className="flex items-center gap-1 text-[#4B2E83]">
                  <Truck className="h-4 w-4 animate-bounce" /> On The Way
                </span>
                <span className="text-[#6F6B76]">Delivered</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E9E5EE]">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#4B2E83] to-[#FFC928] transition-all duration-500"></div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#F5F1FB] p-4">
                <div>
                  <p className="text-xs font-semibold text-[#4B2E83]">
                    Estimated Arrival
                  </p>
                  <p className="text-lg font-extrabold text-[#211F26]">
                    10 - 15 Minutes
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6F6B76]">Drop-off Location</p>
                  <p className="flex items-center gap-1 text-sm font-bold text-[#211F26]">
                    <MapPin className="h-3.5 w-3.5 text-[#4B2E83]" /> Campus
                    Hostel
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#6F6B76]">
                  Items in this order
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between font-medium text-[#211F26]">
                    <span>2x Ultimate Meat Pie</span>
                    <span>₦1,400</span>
                  </li>
                  <li className="flex justify-between font-medium text-[#211F26]">
                    <span>1x Cold Coca Cola 50cl</span>
                    <span>₦400</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#E9E5EE] pt-4">
                <span className="text-xs text-[#6F6B76]">Total Paid</span>
                <span className="text-base font-extrabold text-[#4B2E83]">
                  ₦1,800
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK RE-ORDER / POPULAR STUDENT SNACKS */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 fill-[#FFC928] text-[#FFC928]" />
                <h2 className="text-2xl font-extrabold text-[#211F26]">
                  Quick Re-Order & Cravings
                </h2>
              </div>
              <p className="mt-0.5 text-sm text-[#6F6B76]">
                Add snacks to your bag in one click
              </p>
            </div>
            <Link
              to={routes.home()}
              className="flex items-center gap-1 text-sm font-bold text-[#4B2E83] transition hover:text-[#FFC928]"
            >
              Full Menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickSnacksData.map((snack) => {
              const isAdded = addedItemIds.includes(snack.id)

              return (
                <div
                  key={snack.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E9E5EE] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img
                      src={snack.image}
                      alt={snack.name}
                      className="h-full w-full object-cover"
                    />
                    {snack.tag && (
                      <span className="absolute left-3 top-3 rounded-full bg-[#4B2E83] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                        {snack.tag}
                      </span>
                    )}
                    {snack.calories && (
                      <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                        {snack.calories}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6F6B76]">
                        {snack.category}
                      </span>
                      <h3 className="mt-0.5 line-clamp-1 text-base font-bold text-[#211F26]">
                        {snack.name}
                      </h3>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#E9E5EE] pt-3">
                      <span className="text-lg font-extrabold text-[#4B2E83]">
                        ₦{snack.price.toLocaleString()}
                      </span>

                      <button
                        onClick={() => handleQuickAdd(snack)}
                        className={`flex items-center gap-1 rounded-xl p-2.5 text-xs font-bold transition active:scale-95 ${
                          isAdded
                            ? 'bg-green-600 text-white'
                            : 'bg-[#FFC928] text-[#4B2E83] shadow-sm hover:bg-[#E5B420]'
                        }`}
                        aria-label={`Add ${snack.name} to cart`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* QUICK SHORTCUT CARDS */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Link
            to={routes.favorites()}
            className="group rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm transition hover:border-[#4B2E83]/30 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 transition group-hover:scale-110">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="mb-1 text-lg font-extrabold text-[#211F26]">
              Favorite Snacks
            </h3>
            <p className="text-xs leading-relaxed text-[#6F6B76]">
              Quickly reorder your saved pastries and fast-food treats.
            </p>
          </Link>

          <Link
            to={routes.profile()}
            className="group rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm transition hover:border-[#4B2E83]/30 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F1FB] text-[#4B2E83] transition group-hover:scale-110">
              <User className="h-6 w-6" />
            </div>
            <h3 className="mb-1 text-lg font-extrabold text-[#211F26]">
              Delivery Address & Hostel
            </h3>
            <p className="text-xs leading-relaxed text-[#6F6B76]">
              Set your room number, campus block, and phone contact for instant
              drops.
            </p>
          </Link>

          <Link
            to={routes.contact()}
            className="group rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm transition hover:border-[#4B2E83]/30 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-[#E5B420] transition group-hover:scale-110">
              <Coffee className="h-6 w-6" />
            </div>
            <h3 className="mb-1 text-lg font-extrabold text-[#211F26]">
              Student WhatsApp Support
            </h3>
            <p className="text-xs leading-relaxed text-[#6F6B76]">
              Need custom catering, bulk snacks, or order help? Chat with our
              team.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
