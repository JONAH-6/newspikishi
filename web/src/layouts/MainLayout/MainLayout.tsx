// web/src/layouts/MainLayout/MainLayout.tsx - CLEAN customer-only version
// Removed: Rider Dispatch, Admin Rules, Seller Kitchen, Group Order, Join with Code
import React, { useState } from 'react'
import { Link, navigate, routes, useLocation } from '@redwoodjs/router'
import { useAuth } from 'src/contexts/AuthContexts'
import { useCart } from 'src/components/CartContext/CartContext'
import {
  ShoppingCart,
  User,
  LogOut,
  Menu as MenuIcon,
  X,
  Plus,
  Minus,
  ShoppingBag,
  Phone,
  Mail,
  Home,
  Search,
  Utensils,
} from 'lucide-react'

interface MainLayoutProps {
  children?: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, itemCount } = useCart()
  const { user, logOut, isAuthenticated } = useAuth()
  const location = useLocation()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await logOut()
      navigate(routes.home())
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else navigate(routes.home())
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8FD] font-sans antialiased text-[#211F26] pb-16 lg:pb-0">
      {/* 1. Main Navigation Bar - CLEAN (no RoleSwitcherBar, no Group/Rider/Admin/Seller) */}
      <header className="sticky top-0 z-40 border-b border-[#E9E5EE] bg-white/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to={routes.home()} className="flex items-center gap-1.5 text-2xl sm:text-3xl font-black tracking-tight">
              <span className="text-[#4B2E83]">YUM</span>
              <span className="text-[#FFC928]">ZEE</span>
            </Link>

            {/* Desktop Navigation Links - Home, Discover, Orders, Profile */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-extrabold uppercase tracking-wider text-[#6F6B76]">
              <Link
                to={routes.home()}
                className={`transition hover:text-[#4B2E83] ${isActive('/') ? 'text-[#4B2E83] font-black border-b-2 border-[#4B2E83] pb-1' : ''}`}
              >
                Home
              </Link>

              <Link
                to={routes.discover()}
                className={`transition hover:text-[#4B2E83] ${isActive('/discover') ? 'text-[#4B2E83] font-black border-b-2 border-[#4B2E83] pb-1' : ''}`}
              >
                Discover
              </Link>

              <Link
                to={routes.orders()}
                className={`transition hover:text-[#4B2E83] ${isActive('/orders') ? 'text-[#4B2E83] font-black border-b-2 border-[#4B2E83] pb-1' : ''}`}
              >
                Orders
              </Link>

              <Link
                to={routes.profile()}
                className={`transition hover:text-[#4B2E83] ${isActive('/profile') ? 'text-[#4B2E83] font-black border-b-2 border-[#4B2E83] pb-1' : ''}`}
              >
                Profile
              </Link>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">

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
                <span>Login</span>
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

        {/* Mobile Dropdown Menu - Home, Discover, Orders, Profile */}
        {isMobileMenuOpen && (
          <div className="border-t border-[#E9E5EE] bg-white p-4 lg:hidden space-y-1 animate-fadeIn">
            <Link
              to={routes.home()}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold text-[#211F26] hover:bg-[#FAF8FD]"
            >
              <Home className="h-4 w-4 text-[#4B2E83]" /> Home
            </Link>
            <Link
              to={routes.discover()}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold text-[#211F26] hover:bg-[#FAF8FD]"
            >
              <Search className="h-4 w-4 text-[#4B2E83]" /> Discover
            </Link>
            <Link
              to={routes.orders()}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold text-[#211F26] hover:bg-[#FAF8FD]"
            >
              <ShoppingBag className="h-4 w-4 text-[#4B2E83]" /> Orders
            </Link>
            <Link
              to={routes.profile()}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold text-[#211F26] hover:bg-[#FAF8FD]"
            >
              <User className="h-4 w-4 text-[#4B2E83]" /> Profile
            </Link>
            {!isAuthenticated && (
              <Link
                to={routes.login()}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-[#4B2E83] p-2.5 text-xs font-bold text-white"
              >
                <User className="h-4 w-4" /> Login
              </Link>
            )}
          </div>
        )}
      </header>

      {/* 2. Slide-over Cart Drawer - CLEAN: single checkout only */}
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
                  <p className="text-xs text-[#6F6B76]">Add tasty snacks from the menu.</p>
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
                        <p className="text-[11px] text-[#6F6B76]">₦{item.price.toLocaleString()} each</p>
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
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions - SINGLE CHECKOUT ONLY */}
            {cart.length > 0 && (
              <div className="border-t border-[#E9E5EE] bg-[#FAF8FD] p-5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-[#6F6B76] uppercase">Food Subtotal</span>
                  <span className="text-xl font-black text-[#4B2E83]">₦{totalPrice.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false)
                    navigate('/checkout')
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#4B2E83] py-3.5 text-xs font-black text-white hover:bg-[#371F62] transition shadow"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Checkout — Continue to Delivery</span>
                </button>
                <p className="text-center text-[11px] text-[#6F6B76]">Fast delivery • Pay on delivery or online</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Page Content */}
      <main className="flex-1">{children}</main>

      {/* 4. Footer - CLEAN: no Operations Portals */}
      <footer className="border-t border-[#E9E5EE] bg-[#211F26] py-12 text-white">
        <div className="container mx-auto px-4 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-2xl font-black">
                <span className="text-white">YUM</span>
                <span className="text-[#FFC928]">ZEE</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Fresh snacks & treats delivered fast to your doorstep. Simple, affordable ordering for everyone.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-[#FFC928]">Quick Links</h4>
              <ul className="space-y-1.5 text-white/70">
                <li><Link to={routes.home()} className="hover:text-white">Home</Link></li>
                <li><Link to={routes.discover()} className="hover:text-white">Discover</Link></li>
                <li><Link to={routes.orders()} className="hover:text-white">Orders</Link></li>
                <li><Link to={routes.profile()} className="hover:text-white">Profile</Link></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-[#FFC928]">Explore</h4>
              <ul className="space-y-1.5 text-white/70">
                <li><Link to={routes.home()} className="hover:text-white flex items-center gap-1"><Utensils className="h-3 w-3" /> Food Menu</Link></li>
                <li><Link to={routes.orders()} className="hover:text-white flex items-center gap-1"><ShoppingBag className="h-3 w-3" /> Orders</Link></li>
                <li><Link to={routes.profile()} className="hover:text-white flex items-center gap-1"><User className="h-3 w-3" /> Profile</Link></li>
                <li><Link to={routes.contact()} className="hover:text-white flex items-center gap-1"><Mail className="h-3 w-3" /> Contact</Link></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs text-white/70">
              <h4 className="font-extrabold uppercase tracking-wider text-[#FFC928]">Support</h4>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#FFC928]" /> 080-YUMZEE-HELLO
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#FFC928]" /> support@yumzee.edu.ng
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center text-xs text-white/40">
            © {new Date().getFullYear()} YumZee. Fresh snacks — simple ordering for everyone.
          </div>
        </div>
      </footer>

      {/* 5. Bottom Nav - Home, Discover, Orders, Profile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E9E5EE] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          <Link
            to={routes.home()}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-[10px] font-bold transition ${isActive('/') ? 'text-[#4B2E83] bg-[#F5F1FB]' : 'text-[#6F6B76] hover:text-[#4B2E83]'}`}
          >
            <Home className={`h-5 w-5 ${isActive('/') ? 'fill-[#4B2E83]/15' : ''}`} />
            <span>Home</span>
          </Link>

          <Link
            to={routes.discover()}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-[10px] font-bold transition ${isActive('/discover') ? 'text-[#4B2E83] bg-[#F5F1FB]' : 'text-[#6F6B76] hover:text-[#4B2E83]'}`}
          >
            <Search className={`h-5 w-5 ${isActive('/discover') ? 'text-[#4B2E83]' : ''}`} />
            <span>Discover</span>
          </Link>

          <Link
            to={routes.orders()}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-[10px] font-bold transition ${isActive('/orders') ? 'text-[#4B2E83] bg-[#F5F1FB]' : 'text-[#6F6B76] hover:text-[#4B2E83]'}`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Orders</span>
          </Link>

          <Link
            to={routes.profile()}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-[10px] font-bold transition ${isActive('/profile') ? 'text-[#4B2E83] bg-[#F5F1FB]' : 'text-[#6F6B76] hover:text-[#4B2E83]'}`}
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default MainLayout
