// web/src/pages/CheckoutPage/CheckoutPage.tsx
import React, { useState } from 'react'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useCart } from 'src/components/CartContext/CartContext'
import { OrderStore } from 'src/lib/orderStore'
import { PaymentModal } from 'src/components/PaymentModal/PaymentModal'
import {
  ShoppingBag,
  MapPin,
  Truck,
  Building2,
  Users,
  ArrowRight,
  Plus,
  Minus,
  ShieldCheck,
  Phone,
  User,
  AlertCircle,
} from 'lucide-react'

const CheckoutPage = () => {
  const {
    cart,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
    deliveryType,
    setDeliveryType,
    selectedHostel,
    setSelectedHostel,
  } = useCart()

  const rules = OrderStore.getRules()
  const locations = rules.eligibleLocations.filter((l) => l.active)

  const [customerName, setCustomerName] = useState('Jonah Gabriel')
  const [customerPhone, setCustomerPhone] = useState('08129001122')
  const [roomNumber, setRoomNumber] = useState('Room B24')
  const [deliveryNotes, setDeliveryNotes] = useState('Please call when at the gate')
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [error, setError] = useState('')

  const deliveryFee = deliveryType === 'delivery' ? rules.baseDeliveryFee : 0
  const serviceFee = rules.serviceFee
  const grandTotal = totalPrice + deliveryFee + serviceFee

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) {
      setError('Your bag is empty. Please add items to checkout.')
      return
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setError('Please provide your name and phone number for delivery updates.')
      return
    }
    setError('')
    setIsPaymentOpen(true)
  }

  const handlePaymentSuccess = () => {
    const created = OrderStore.createSingleOrder({
      customerName,
      customerPhone,
      deliveryType,
      hostelAddress: selectedHostel,
      deliveryAddress: selectedHostel,
      roomNumber,
      deliveryInstructions: deliveryNotes,
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      foodSubtotal: totalPrice,
      foodTotal: totalPrice,
      deliveryFee,
      serviceFee,
      totalAmount: grandTotal,
      grandTotal,
    })

    clearCart()
    navigate(`/track/${created.id}`)
  }

  return (
    <div className="min-h-screen bg-[#FAF8FD] py-8">
      <Metadata title="Single Order Checkout — YumZee" description="Complete your single order checkout." />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        amount={grandTotal}
        orderTitle="Single Order Checkout"
        studentName={customerName}
      />

      <div className="container mx-auto max-w-4xl px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#4B2E83] px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-white">
                Option 1
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#211F26]">
                Single Order Checkout
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#6F6B76]">
              Standard individual order delivered directly to you.
            </p>
          </div>
          <Link
            to={routes.home()}
            className="text-xs sm:text-sm font-bold text-[#4B2E83] hover:text-[#FFC928] transition"
          >
            ← Back to Menu
          </Link>
        </div>

        {/* Group Savings Banner */}
        <div className="rounded-3xl border-2 border-[#FFC928] bg-gradient-to-r from-[#FFF9E8] to-[#FFF3D0] p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFC928] text-[#4B2E83] font-black">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#4B2E83]">
                  Want to Save ₦{rules.baseDeliveryFee.toLocaleString()} on Delivery?
                </h4>
                <p className="text-xs text-[#6F6B76]">
                  Convert your cart into a <b>Hostel Group Order</b>! When 4+ students join, delivery is 100% Free!
                </p>
              </div>
            </div>
            <Link
              to={routes.createGroupOrder()}
              className="whitespace-nowrap rounded-2xl bg-[#4B2E83] px-5 py-2.5 text-xs font-black text-white hover:bg-[#371F62] transition shadow"
            >
              Start Group Order Instead →
            </Link>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-3xl border border-[#E9E5EE] bg-white p-12 text-center shadow-sm">
            <ShoppingBag className="mx-auto h-16 w-16 text-[#6F6B76]/40 mb-3" />
            <h3 className="text-lg font-bold text-[#211F26]">Your bag is empty</h3>
            <p className="text-xs text-[#6F6B76] mt-1 mb-6">
              Browse our snacks and add delicious campus treats to start an order.
            </p>
            <Link
              to={routes.home()}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC928] px-8 py-3 text-sm font-extrabold text-[#4B2E83] shadow transition hover:bg-[#E5B420]"
            >
              Browse Campus Menu
            </Link>
          </div>
        ) : (
          <form onSubmit={handleStartPayment} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery Details */}
              <div className="rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E9E5EE] pb-3">
                  <MapPin className="h-5 w-5 text-[#4B2E83]" />
                  <h3 className="font-extrabold text-base text-[#211F26]">
                    Drop-off Location & Details
                  </h3>
                </div>

                {/* Delivery vs Pickup Toggle */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold transition ${deliveryType === 'delivery'
                      ? 'border-[#4B2E83] bg-[#F5F1FB] text-[#4B2E83] shadow-sm'
                      : 'border-[#E9E5EE] text-[#6F6B76] hover:bg-gray-50'
                      }`}
                  >
                    <Truck className="h-4 w-4" />
                    <span>Rider Delivery (₦{rules.baseDeliveryFee})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold transition ${deliveryType === 'pickup'
                      ? 'border-[#4B2E83] bg-[#F5F1FB] text-[#4B2E83] shadow-sm'
                      : 'border-[#E9E5EE] text-[#6F6B76] hover:bg-gray-50'
                      }`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Kitchen Pickup (Free)</span>
                  </button>
                </div>

                {/* Hostel Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">
                    Campus Hostel / Delivery Spot
                  </label>
                  <select
                    value={selectedHostel}
                    onChange={(e) => setSelectedHostel(e.target.value)}
                    className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name} ({loc.zone})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">
                      Student Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09BA8]" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] py-2.5 pl-10 pr-3 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09BA8]" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] py-2.5 pl-10 pr-3 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                        placeholder="08123456789"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">
                      Room / Block Number
                    </label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-2.5 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                      placeholder="e.g. Block A Room 204"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">
                      Delivery Note for Rider
                    </label>
                    <input
                      type="text"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-2.5 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                      placeholder="e.g. Call when entering gate"
                    />
                  </div>
                </div>
              </div>

              {/* Items in Bag */}
              <div className="rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E9E5EE] pb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#4B2E83]" />
                    <h3 className="font-extrabold text-base text-[#211F26]">
                      Selected Snacks ({cart.length})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-[#E9E5EE]">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3.5 gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 rounded-2xl border border-[#E9E5EE] object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-[#211F26] line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-[#6F6B76]">₦{item.price.toLocaleString()} each</p>
                      </div>

                      <div className="flex items-center rounded-xl border border-[#E9E5EE] bg-[#FAF8FD] p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 flex items-center justify-center rounded-lg bg-white text-xs font-bold shadow-sm"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-black text-[#211F26]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 flex items-center justify-center rounded-lg bg-white text-xs font-bold shadow-sm"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <span className="text-sm font-extrabold text-[#4B2E83]">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm space-y-5 sticky top-20">
                <h3 className="font-extrabold text-lg text-[#211F26] border-b border-[#E9E5EE] pb-3">
                  Payment Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#6F6B76]">
                    <span>Food Subtotal</span>
                    <span className="font-bold text-[#211F26]">₦{totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-[#6F6B76]">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-[#211F26]">
                      {deliveryType === 'pickup' ? 'FREE (Pickup)' : `₦${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#6F6B76]">
                    <span>Campus Service & Packaging</span>
                    <span className="font-bold text-[#211F26]">₦{serviceFee.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-[#E9E5EE] pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="text-base font-extrabold text-[#211F26] block">Final Amount</span>
                      <span className="text-[11px] text-[#6F6B76]">Includes all fees</span>
                    </div>
                    <span className="text-2xl font-black text-[#4B2E83]">
                      ₦{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-3 text-xs font-bold text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FFC928] py-3 text-sm font-bold text-[#4B2E83] shadow-lg shadow-[#FFC928]/30 transition hover:bg-[#E5B420] active:scale-95"
                >
                  <span>Pay & Place Order</span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-[#6F6B76] text-center">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Instant Confirmation & Real-time Rider Tracking</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage
