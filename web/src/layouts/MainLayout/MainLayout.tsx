// src/layouts/MainLayout/MainLayout.tsx
import { useState, useRef, useEffect } from 'react'

import { ShoppingCart, Home, Phone, LogIn, User, X, LogOut } from 'lucide-react'

import { Link, routes, navigate } from '@redwoodjs/router'

import { useAuth } from 'src/contexts/AuthContexts'

import { useCart } from '../../contexts/CartContext'

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  const { itemCount, cart, removeFromCart, totalPrice } = useCart()
  const { user, logOut } = useAuth()
  const [showCartModal, setShowCartModal] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logOut()
      setShowUserDropdown(false)
      navigate(routes.home())
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const getUserDisplayName = () => {
    if (!user) return 'User'
    if (user.displayName) return user.displayName
    if (user.email) return user.email.split('@')[0]
    return 'User'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B0000] to-[#600000]">
      <header className="sticky top-0 z-50 bg-[#8B0000]/90 text-white shadow-lg backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to={routes.home()} className="h-16 w-16 rounded-full">
              <img
                src="/logo2.jpeg"
                alt="Kilishi Delight Logo"
                className="h-full w-full rounded-full object-cover"
              />
            </Link>

            {/* 4 Icons Only */}
            <div className="flex items-center space-x-6">
              {/* Home Icon */}
              <Link
                to={routes.home()}
                className="p-2 transition-colors hover:text-[#FFD700]"
                title="Home"
              >
                <Home className="h-5 w-5" />
              </Link>

              {/* Contact Icon */}
              <Link
                to={routes.contact()}
                className="p-2 transition-colors hover:text-[#FFD700]"
                title="Contact"
              >
                <Phone className="h-5 w-5" />
              </Link>

              {/* Cart Icon */}
              <div className="relative p-2">
                <button
                  onClick={() => setShowCartModal(true)}
                  className="transition-colors hover:text-[#FFD700]"
                  title="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>

                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD700] text-xs font-bold text-[#8B0000]">
                    {itemCount}
                  </span>
                )}
              </div>

              {/* User/Login Icon with Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                {user ? (
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="p-2 transition-colors hover:text-[#FFD700]"
                    title={`Logged in as ${getUserDisplayName()}`}
                  >
                    <div className="flex flex-col items-center">
                      <User className="h-5 w-5" />
                      <span className="mt-1 max-w-[60px] truncate text-xs">
                        {getUserDisplayName().split(' ')[0]}
                      </span>
                    </div>
                  </button>
                ) : (
                  <Link
                    to={routes.login()}
                    className="p-2 transition-colors hover:text-[#FFD700]"
                    title="Login"
                  >
                    <LogIn className="h-5 w-5" />
                  </Link>
                )}

                {/* User Dropdown Menu */}
                {showUserDropdown && user && (
                  <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                    <div className="py-2">
                      <div className="border-b px-4 py-2">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {getUserDisplayName()}
                        </p>
                        <p className="truncate text-xs text-gray-600">
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>

                    {/* Arrow pointing to user icon */}
                    <div className="absolute -top-2 right-3 h-4 w-4 rotate-45 transform border-l border-t border-gray-200 bg-white"></div>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="min-h-screen">{children}</main>

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Your Order ({itemCount} items)
                </h3>
                <button
                  onClick={() => setShowCartModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center">
                  <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                  <h4 className="mb-2 text-lg font-medium text-gray-900">
                    Your cart is empty
                  </h4>
                  <p className="mb-4 text-gray-600">
                    Add some delicious kilishi to get started!
                  </p>
                  <button
                    onClick={() => setShowCartModal(false)}
                    className="rounded-lg bg-[#8B0000] px-2 py-2 font-bold text-white transition hover:bg-[#600000]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 max-h-[300px] space-y-4 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="flex items-center justify-between border-b pb-4"
                      >
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            ₦{item.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="ml-4 rounded px-3 py-1 text-red-600 transition hover:bg-red-50 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="mb-6 flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span>₦{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowCartModal(false)}
                        className="flex-1 rounded-lg border-2 border-[#8B0000] px-2 py-1 font-bold text-[#8B0000] transition hover:bg-[#8B0000] hover:text-white"
                      >
                        Continue Shopping
                      </button>
                      <button
                        onClick={() => {
                          alert('Proceeding to checkout!')
                          setShowCartModal(false)
                        }}
                        className="flex-1 rounded-lg bg-[#FFD700] px-2 py-2 font-bold text-[#8B0000] transition hover:bg-[#FFC107]"
                      >
                        Checkout Now
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#600000] py-10 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-xl font-bold text-[#FFD700]">
                Contact Us
              </h3>
              <p className="mb-2">Phone: +234 813 930 0740</p>
              <p className="mb-2">Email: order@kilishidelight.com</p>
              <p>Location: Jikwoyi Phase 2, Abuja</p>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold text-[#FFD700]">
                Quick Links
              </h3>
              <div className="space-y-3">
                <Link
                  to={routes.home()}
                  className="flex items-center gap-2 transition hover:text-[#FFD700]"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  to={routes.contact()}
                  className="flex items-center gap-2 transition hover:text-[#FFD700]"
                >
                  <Phone className="h-4 w-4" />
                  Contact
                </Link>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold text-[#FFD700]">
                Our Promise
              </h3>
              <p className="text-white/90">
                Authentic, spicy, and delicious kilishi made with traditional
                recipes and premium beef. 100% natural with no preservatives.
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-white/20 pt-6 text-center">
            <p className="mb-2 text-lg font-semibold text-[#FFD700]">
              Kilishi Delight
            </p>
            <p>
              © {new Date().getFullYear()} Kilishi Delight - Authentic Spiced
              Dried Meat
            </p>
            <p className="mt-2 text-sm text-white/70">
              Traditional Nigerian Kilishi, Modern Experience
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
