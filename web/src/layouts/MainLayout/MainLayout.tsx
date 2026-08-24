// web/src/layouts/MainLayout/MainLayout.tsx
import React, { useState } from 'react'
import { Link, navigate, routes, useLocation } from '@redwoodjs/router'
import { useAuth } from 'src/contexts/AuthContexts'
import { useCart } from 'src/components/CartContext/CartContext'
import { RoleSwitcherBar } from 'src/components/RoleSwitcherBar/RoleSwitcherBar'
import { JoinGroupModal } from 'src/components/JoinGroupModal/JoinGroupModal'
import {
  ShoppingCart,
  User,
  Heart,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  Plus,
  Minus,
  Trash2,
  Users,
  ShoppingBag,
  ChefHat,
  Bike,
  ShieldCheck,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  MessageCircle,
  Home,
  Grid,
  ArrowRight,
  TrendingDown,
} from 'lucide-react'

interface MainLayoutProps {
  children?: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, itemCount, clearCart } = useCart()
  const { user, logOut, isAuthenticated } = useAuth()
  const location = useLocation()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await logOut()
      navigate(routes.home())
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8FD] font-sans antialiased text-[#211F26]">
      {/* 1. Interactive Demo Bar for cross-persona testing */}
      <RoleSwitcherBar />

      <JoinGroupModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      {/* 2. Main Navigation Bar */}
      <header className="sticky top-[37px] z-40 border-b border-[#E9E5EE] bg-white/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to={routes.home()} className="flex items-center gap-1.5 text-2xl sm:text-3xl font-black tracking-tight">
              <span className="text-[#4B2E83]">YUM</span>
              <span className="text-[#FFC928]">ZEE</span>
              <span className="ml-1 rounded-full bg-[#FFC928]/30 px-2 py-0.5 text-[9px] font-black uppercase text-[#4B2E83] border border-[#FFC928]">
                Campus
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-extrabold uppercase tracking-wider text-[#6F6B76]">
              <Link
                to={routes.home()}
                className={`transition hover:text-[#4B2E83] ${
                  location.pathname === '/' ? 'text-[#4B2E83] font-black border-b-2 border-[#4B2E83] pb-1' : ''
                }`}
              >
                Food Menu
              </Link>

              <Link
                to={routes.createGroupOrder()}
                className={`flex items-center gap-1.5 rounded-full bg-[#FFC928]/20 px-3 py-1 text-[#4B2E83] border border-[#FFC928]/60 transition hover:bg-[#FFC928] hover:text-[#4B2E83] ${
                  location.pathname.startsWith('/group') ? 'bg-[#FFC928] text-[#4B2E83]' : ''
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Group Order (Save ?600)</span>
              </Link>

              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="transition hover:text-[#4B2E83]"
              >
                Join with Code
              </button>

              <Link
                to={routes.orders()}
                className={`transition hover:text-[#4B2E83] ${
                  location.pathname === '/orders' ? 'text-[#4B2E83] font-black' : ''
                }`}
              >
                My Orders
              </Link>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Join Group Modal Trigger */}
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="hidden sm:flex items-center gap-1 rounded-xl border border-[#E9E5EE] bg-[#FAF8FD] px-3 py-2 text-xs font-bold text-[#4B2E83] hover:border-[#4B2E83] transition"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Join Group</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 rounded-2xl bg-[#FFC928] px-4 py-2.5 text-xs font-extrabold text-[#4B2E83] shadow-md hover:bg-[#E5B420] transition active:scale-95"
              aria-label="Open food bag"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Bag</span>
              {itemCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4B2E83] text-[11px] font-black text-white">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Auth Link / Avatar */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={routes.dashboard()}
                  className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#F5F1FB] text-xs font-black text-[#4B2E83] border border-[#4B2E83]/20"
                >
                  {user?.displayName ? user.displayName[0] : 'U'}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hidden sm:flex rounded-xl p-2 text-[#6F6B76] hover:bg-gray-100 transition"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to={routes.login()}
                className="hidden sm:flex items-center gap-1.5 rounded-2xl border border-[#E9E5EE] px-4 py-2 text-xs font-bold text-[#211F26] hover:border-[#4B2E83] transition"
              >
                <User className="h-3.5 w-3.5" />
                <span>Student Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-2xl p-2 text-[#211F26] hover:bg-gray-100 lg:hidden transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-[#E9E5EE] bg-white p-4 lg:hidden space-y-3 animate-fadeIn">
            <Link
              to={routes.home()}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-xl p-2.5 text-xs font-bold text-[#211F26] hover:bg-[#FAF8FD]"
            >
              ?? Food Menu
            </Link>
            <Link
              to={routes.createGroupOrder()}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-xl bg-[#FFF9E8] p-2.5 text-xs font-black text-[#4B2E83]"
            >
              ?? Create Group Order (Free Delivery)
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false)
                setIsJoinModalOpen(true)
              }}
              className="w-full text-left rounded-xl p-2.5 text-xs font-bold text-[#211F26] hover:bg-[#FAF8FD]"
            >
              ?? Join Group with Code
            </button>
            <Link
              to={routes.orders()}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-xl p-2.5 text-xs font-bold text-[#211F26] hover:bg-[#FAF8FD]"
            >
              ?? My Orders
            </Link>
            <Link
              to="/seller"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-xl p-2.5 text-xs font-bold text-[#211F26] hover:bg-[#FAF8FD]"
            >
              ????? Kitchen Portal
            </Link>
            <Link
              to="/rider"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-xl p-2.5 text-xs font-bold text-[#211F26] hover:bg-[#FAF8FD]"
            >
              ?? Rider Portal
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-xl p-2.5 text-xs font-bold text-[#211F26] hover:bg-[#FAF8FD]"
            >
              ?? Admin Rules Engine
            </Link>
          </div>
        )}
      </header>

      {/* 3. Slide-over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative flex h-full w-full max-w-md flex-col justify-between bg-white shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#E9E5EE] bg-[#FAF8FD] p-5">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[#4B2E83]" />
                <h3 className="text-lg font-black text-[#211F26]">
                  Your Snack Bag ({itemCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-full p-1.5 text-[#6F6B76] hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="mx-auto h-16 w-16 text-[#6F6B76]/30" />
                  <h4 className="font-extrabold text-base text-[#211F26]">Bag is empty</h4>
                  <p className="text-xs text-[#6F6B76]">Add yummy snacks from the campus menu.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#E9E5EE]">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3.5 gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded-xl border border-[#E9E5EE] object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-[#211F26] truncate">{item.name}</h5>
                        <p className="text-[11px] text-[#6F6B76]">?{item.price.toLocaleString()} each</p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded-lg border border-[#E9E5EE] bg-[#FAF8FD] p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 flex items-center justify-center rounded bg-white text-xs font-bold shadow-sm"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 flex items-center justify-center rounded bg-white text-xs font-bold shadow-sm"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-[#4B2E83] min-w-[60px] text-right">
                        ?{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            {cart.length > 0 && (
              <div className="border-t border-[#E9E5EE] bg-[#FAF8FD] p-5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-[#6F6B76] uppercase">Food Subtotal</span>
                  <span className="text-xl font-black text-[#4B2E83]">?{totalPrice.toLocaleString()}</span>
                </div>

                {/* Dual Order Action Buttons */}
                <div className="space-y-2">
                  {/* Single Order Checkout */}
                  <button
                    onClick={() => {
                      setIsCartOpen(false)
                      navigate('/checkout')
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#4B2E83] py-3.5 text-xs font-black text-white hover:bg-[#371F62] transition shadow"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Single Checkout (Order Alone)</span>
                  </button>

                  {/* Group Order Button */}
                  <button
                    onClick={() => {
                      setIsCartOpen(false)
                      navigate(routes.createGroupOrder())
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FFC928] py-3.5 text-xs font-black text-[#4B2E83] hover:bg-[#E5B420] transition shadow-md"
                  >
                    <Users className="h-4 w-4" />
                    <span>Create Group Order (Save ?600)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Page Content */}
      <main className="flex-1">{children}</main>

      {/* 5. Footer */}
      <footer className="border-t border-[#E9E5EE] bg-[#211F26] py-12 text-white">
        <div className="container mx-auto px-4 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-2xl font-black">
                <span className="text-white">YUM</span>
                <span className="text-[#FFC928]">ZEE</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Campus food & snack delivery tailored for university students. Order individually or combine with hostel friends for free delivery.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-[#FFC928]">Quick Links</h4>
              <ul className="space-y-1.5 text-white/70">
                <li><Link to={routes.home()} className="hover:text-white">Food Menu</Link></li>
                <li><Link to={routes.createGroupOrder()} className="hover:text-white">Create Group Order</Link></li>
                <li><Link to={routes.orders()} className="hover:text-white">My Orders</Link></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-[#FFC928]">Operations Portals</h4>
              <ul className="space-y-1.5 text-white/70">
                <li><Link to="/seller" className="hover:text-white">????? Kitchen / Seller Portal</Link></li>
                <li><Link to="/rider" className="hover:text-white">?? Campus Dispatch Rider</Link></li>
                <li><Link to="/admin" className="hover:text-white">?? Admin Rules Engine</Link></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs text-white/70">
              <h4 className="font-extrabold uppercase tracking-wider text-[#FFC928]">Campus Support</h4>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#FFC928]" /> 080-YUMZEE-CAMPUS
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#FFC928]" /> support@yumzee.edu.ng
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center text-xs text-white/40">
            ? {new Date().getFullYear()} YumZee Nigeria. Student-First Campus Food Ordering.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
