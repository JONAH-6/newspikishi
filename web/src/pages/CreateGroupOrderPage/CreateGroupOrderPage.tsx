// web/src/pages/CreateGroupOrderPage/CreateGroupOrderPage.tsx
import React, { useState } from 'react'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useCart } from 'src/components/CartContext/CartContext'
import { OrderStore, DEFAULT_GROUP_RULES } from 'src/lib/orderStore'
import {
  Users,
  Clock,
  MapPin,
  Share2,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Plus,
  TrendingDown,
  Info,
} from 'lucide-react'

const CreateGroupOrderPage = () => {
  const { cart, clearCart } = useCart()
  const rules = OrderStore.getRules()
  const locations = rules.eligibleLocations.filter((l) => l.active)

  const [title, setTitle] = useState('Moremi Hall Block B Chow')
  const [hostName, setHostName] = useState('Chiamaka Eze')
  const [hostPhone, setHostPhone] = useState('08123456780')
  const [hostelAddress, setHostelAddress] = useState(locations[0]?.name || 'Moremi Hall ? Main Gate')
  const [deliveryNote, setDeliveryNote] = useState('Drop at security entrance for group collection')
  const [deadlineMinutes, setDeadlineMinutes] = useState(30)
  const [includeCartItems, setIncludeCartItems] = useState(cart.length > 0)
  const [createdGroup, setCreatedGroup] = useState<any | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault()

    const hostInitialItems = includeCartItems
      ? cart.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }))
      : []

    const group = OrderStore.createGroupOrder({
      title: title.trim() || `${hostelAddress} Group Order`,
      hostName: hostName.trim() || 'Host Student',
      hostPhone: hostPhone.trim() || '08000000000',
      hostelAddress,
      deliveryNote,
      deadlineMinutes,
      hostInitialItems,
    })

    if (includeCartItems) {
      clearCart()
    }

    setCreatedGroup(group)
  }

  const groupUrl = typeof window !== 'undefined' && createdGroup
    ? `${window.location.origin}/group/${createdGroup.groupCode}`
    : ''

  const whatsappMessage = createdGroup
    ? encodeURIComponent(
        `?? Hey everyone! I just started a *YumZee Group Order* to *${createdGroup.hostelAddress}*.\n\n` +
          `Order your own snacks so we can get *FREE DELIVERY* together!\n\n` +
          `?? Join here: ${groupUrl}\n` +
          `?? Group Code: *${createdGroup.groupCode}*\n` +
          `? Closes in: ${deadlineMinutes} minutes.`
      )
    : ''

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(groupUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && createdGroup) {
      navigator.clipboard.writeText(createdGroup.groupCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8FD] py-10">
      <Metadata
        title="Create a Group Order ? YumZee"
        description="Start a hostel group order and share delivery costs with fellow students."
      />

      <div className="container mx-auto max-w-3xl px-4">
        {createdGroup ? (
          /* SUCCESS / SHARE SCREEN */
          <div className="overflow-hidden rounded-3xl border border-[#E9E5EE] bg-white shadow-xl animate-fadeIn">
            <div className="bg-gradient-to-r from-[#4B2E83] to-[#371F62] p-8 text-center text-white space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFC928] text-[#4B2E83] font-black shadow-lg">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">Group Order Created!</h2>
              <p className="text-sm text-white/85 max-w-md mx-auto">
                Share this link or code with friends in <b>{createdGroup.hostelAddress}</b>. As more friends join, delivery drops to <b>?0</b>!
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Group Code Showcase Card */}
              <div className="rounded-3xl border-2 border-[#FFC928] bg-[#FFF9E8] p-6 text-center space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6F6B76]">
                  Your Unique Group Order Code
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-[#4B2E83]">
                    {createdGroup.groupCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 rounded-xl bg-white border border-amber-300 px-3 py-1.5 text-xs font-bold text-[#4B2E83] shadow-sm hover:bg-amber-50"
                  >
                    {copiedCode ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-[#6F6B76]">
                  Friends can enter this code in the &quot;Join Group&quot; popup.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-base font-extrabold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition active:scale-95"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Share on WhatsApp Hostel Group</span>
                </a>

                <div className="flex gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-[#E9E5EE] bg-[#FAF8FD] py-3.5 text-sm font-bold text-[#211F26] hover:bg-gray-100 transition"
                  >
                    {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Link'}</span>
                  </button>

                  <button
                    onClick={() => navigate(`/group/${createdGroup.groupCode}`)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#4B2E83] py-3.5 text-sm font-extrabold text-white hover:bg-[#371F62] transition shadow"
                  >
                    <span>Enter Group Room</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Summary details */}
              <div className="rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-4 text-xs text-[#6F6B76] space-y-2">
                <div className="flex justify-between">
                  <span>Host:</span>
                  <span className="font-bold text-[#211F26]">{createdGroup.hostName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Drop Location:</span>
                  <span className="font-bold text-[#211F26]">{createdGroup.hostelAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deadline:</span>
                  <span className="font-bold text-amber-700">Closes in {deadlineMinutes} minutes</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* FORM TO CREATE GROUP ORDER */
          <div className="rounded-3xl border border-[#E9E5EE] bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#FFC928] px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-[#4B2E83]">
                  Option 2
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#211F26]">
                  Create a Hostel Group Order
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-[#6F6B76]">
                One combined delivery route to your hostel. Free delivery unlocked at 4+ students!
              </p>
            </div>

            {/* Discount Tiers Visual */}
            <div className="rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#4B2E83]">
                  Shared Delivery Discount Engine
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <TrendingDown className="h-3.5 w-3.5" /> Automated Savings
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-xl border border-gray-200 bg-white p-2.5">
                  <span className="block font-bold text-gray-500">1 Student</span>
                  <span className="font-black text-[#211F26]">?600 each</span>
                  <span className="text-[10px] text-gray-400 block">Full Delivery</span>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5">
                  <span className="block font-bold text-amber-800">2 Students</span>
                  <span className="font-black text-[#4B2E83]">?180 each</span>
                  <span className="text-[10px] text-amber-700 block">40% Off</span>
                </div>
                <div className="rounded-xl border border-purple-200 bg-purple-50 p-2.5">
                  <span className="block font-bold text-[#4B2E83]">3 Students</span>
                  <span className="font-black text-[#4B2E83]">?80 each</span>
                  <span className="text-[10px] text-purple-700 block">60% Off</span>
                </div>
                <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-2.5 shadow-sm">
                  <span className="block font-black text-emerald-800">4+ Students</span>
                  <span className="font-black text-emerald-600">?0 (FREE!)</span>
                  <span className="text-[10px] font-bold text-emerald-700 block">100% Slashed</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-5">
              {/* Group Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">
                  Group Order Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-bold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                  placeholder="e.g. Jaja Hall Midnight Chow, Moremi Block B Lunch"
                />
              </div>

              {/* Host Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">
                    Your Name (Host / Coordinator)
                  </label>
                  <input
                    type="text"
                    required
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                    placeholder="e.g. Chiamaka Eze"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">
                    Host Phone Number (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    required
                    value={hostPhone}
                    onChange={(e) => setHostPhone(e.target.value)}
                    className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                    placeholder="08123456789"
                  />
                </div>
              </div>

              {/* Shared Delivery Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">
                  Shared Delivery Drop-off Point
                </label>
                <select
                  value={hostelAddress}
                  onChange={(e) => setHostelAddress(e.target.value)}
                  className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-bold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} ? ({loc.zone})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-[#A09BA8]">
                  All participating students in this group will collect their labelled bags at this single location.
                </p>
              </div>

              {/* Delivery Note */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">
                  Delivery Notes / Instructions for Rider
                </label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                  placeholder="e.g. Leave with porter or call host on arrival"
                />
              </div>

              {/* Deadline Duration */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-2">
                  Group Order Deadline (Time to join & pay)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDeadlineMinutes(mins)}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-3 font-bold transition ${
                        deadlineMinutes === mins
                          ? 'border-[#4B2E83] bg-[#4B2E83] text-white shadow-md'
                          : 'border-[#E9E5EE] bg-[#FAF8FD] text-[#6F6B76] hover:bg-gray-100'
                      }`}
                    >
                      <Clock className="h-4 w-4 mb-1" />
                      <span className="text-xs">{mins} Mins</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional: Add current cart items to host bag */}
              {cart.length > 0 && (
                <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <input
                    type="checkbox"
                    id="includeCart"
                    checked={includeCartItems}
                    onChange={(e) => setIncludeCartItems(e.target.checked)}
                    className="h-4 w-4 rounded text-[#4B2E83] focus:ring-[#4B2E83]"
                  />
                  <label htmlFor="includeCart" className="text-xs font-bold text-[#211F26] cursor-pointer">
                    Include the {cart.length} items currently in my bag as my host order items.
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FFC928] py-4 text-base font-black text-[#4B2E83] shadow-lg shadow-[#FFC928]/30 transition hover:bg-[#E5B420] active:scale-95"
              >
                <Users className="h-5 w-5" />
                <span>Create Group & Get Shareable Link</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateGroupOrderPage
