// web/src/pages/CreateGroupOrderPage/CreateGroupOrderPage.tsx - minimal
import React, { useState } from 'react'
import { navigate } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useCart } from 'src/components/CartContext/CartContext'
import { OrderStore } from 'src/lib/orderStore'
import { Users, Clock, Copy, Check, ArrowRight, MessageCircle } from 'lucide-react'

const CreateGroupOrderPage = () => {
  const { cart, clearCart } = useCart()
  const rules = OrderStore.getRules()
  const locations = rules.eligibleLocations.filter((l) => l.active)

  const [title, setTitle] = useState('Moremi Hall Block B Chow')
  const [hostName, setHostName] = useState('Chiamaka Eze')
  const [hostPhone, setHostPhone] = useState('08123456780')
  const [hostelAddress, setHostelAddress] = useState(locations[0]?.name || 'Moremi Hall')
  const [deliveryNote, setDeliveryNote] = useState('Drop at security entrance')
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
      hostName: hostName.trim() || 'Host',
      hostPhone: hostPhone.trim() || '08000000000',
      hostelAddress,
      deliveryNote,
      deadlineMinutes,
      hostInitialItems,
    })
    if (includeCartItems) clearCart()
    setCreatedGroup(group)
  }

  const groupUrl = typeof window !== 'undefined' && createdGroup ? `${window.location.origin}/group/${createdGroup.groupCode}` : ''
  const whatsappMessage = createdGroup
    ? encodeURIComponent(`Join my YumZee Group Order to ${createdGroup.hostelAddress}. Link: ${groupUrl} Code: ${createdGroup.groupCode}`)
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
    <div className="min-h-screen bg-[#FAF8FD] py-6">
      <Metadata title="Create Group Order — YumZee" description="Start a group order and share delivery." />
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-3">
        {createdGroup ? (
          <div className="overflow-hidden rounded-2xl border border-[#E9E5EE] bg-white shadow-sm">
            <div className="bg-[#4B2E83] p-4 text-center text-white">
              <h2 className="text-lg font-black">Group Order Created</h2>
              <p className="text-xs text-white/80 mt-1">Share with others in {createdGroup.hostelAddress}.</p>
            </div>
            <div className="p-4 space-y-4">
              <div className="rounded-2xl border border-[#FFC928] bg-[#FFF9E8] p-4 text-center space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F6B76]">Group Code</span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-xl font-black tracking-widest text-[#4B2E83]">{createdGroup.groupCode}</span>
                  <button onClick={handleCopyCode} className="flex items-center gap-1 rounded-lg bg-white border border-amber-300 px-2.5 py-1 text-xs font-bold text-[#4B2E83]">
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <a href={`https://wa.me/?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition">
                  <MessageCircle className="h-4 w-4" /> Share on WhatsApp
                </a>
                <div className="flex gap-2">
                  <button onClick={handleCopyLink} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#E9E5EE] bg-[#FAF8FD] py-3 text-xs font-bold text-[#211F26] hover:bg-gray-100 transition">
                    {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                  <button onClick={() => navigate(`/group/${createdGroup.groupCode}`)} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#4B2E83] py-3 text-xs font-bold text-white hover:bg-[#371F62] transition">
                    <span>Enter Room</span> <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-xs text-[#6F6B76] space-y-1">
                <div className="flex justify-between"><span>Host:</span><span className="font-bold text-[#211F26]">{createdGroup.hostName}</span></div>
                <div className="flex justify-between"><span>Location:</span><span className="font-bold text-[#211F26]">{createdGroup.hostelAddress}</span></div>
                <div className="flex justify-between"><span>Closes in:</span><span className="font-bold text-amber-700">{deadlineMinutes} minutes</span></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E9E5EE] bg-white p-3 shadow-sm space-y-4">
            <div>
              <h1 className="text-xl font-black text-[#211F26]">Create Group Order</h1>
              <p className="mt-1 text-xs text-[#6F6B76]">Share delivery with others. Free with 4+.</p>
            </div>

            <div className="rounded-xl border border-[#E9E5EE] bg-[#FAF8FD] p-3">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-xl border bg-white p-2"><span className="block font-bold text-gray-500">1</span><span className="font-black">₦600</span></div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-2"><span className="block font-bold text-amber-800">2</span><span className="font-black">₦300</span></div>
                <div className="rounded-xl border border-purple-200 bg-purple-50 p-2"><span className="block font-bold text-[#4B2E83]">3</span><span className="font-black">₦120</span></div>
                <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-2"><span className="block font-black text-emerald-800">4+</span><span className="font-black text-emerald-600">Free</span></div>
              </div>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">Group Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none" placeholder="e.g. Block B Lunch" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">Your Name</label>
                  <input type="text" required value={hostName} onChange={(e) => setHostName(e.target.value)} className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none" placeholder="Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">Phone</label>
                  <input type="tel" required value={hostPhone} onChange={(e) => setHostPhone(e.target.value)} className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none" placeholder="08123456789" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">Delivery Location</label>
                <select value={hostelAddress} onChange={(e) => setHostelAddress(e.target.value)} className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none">
                  {locations.map((loc) => <option key={loc.id} value={loc.name}>{loc.name} ({loc.zone})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">Delivery Note</label>
                <input type="text" value={deliveryNote} onChange={(e) => setDeliveryNote(e.target.value)} className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none" placeholder="Leave with porter" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-2">Deadline</label>
                <div className="grid grid-cols-4 gap-2">
                  {[15,30,45,60].map((mins) => (
                    <button key={mins} type="button" onClick={() => setDeadlineMinutes(mins)} className={`rounded-2xl border p-3 text-xs font-bold transition ${deadlineMinutes===mins ? 'border-[#4B2E83] bg-[#4B2E83] text-white' : 'border-[#E9E5EE] bg-[#FAF8FD] text-[#6F6B76] hover:bg-gray-100'}`}>
                      <Clock className="h-4 w-4 mx-auto mb-1" />{mins} min
                    </button>
                  ))}
                </div>
              </div>
              {cart.length>0 && (
                <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <input type="checkbox" id="includeCart" checked={includeCartItems} onChange={(e)=>setIncludeCartItems(e.target.checked)} className="h-4 w-4 rounded" />
                  <label htmlFor="includeCart" className="text-xs font-bold text-[#211F26] cursor-pointer">Include {cart.length} items in bag as host order.</label>
                </div>
              )}
              <button type="submit" className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#FFC928] py-3 text-sm font-bold text-[#4B2E83] hover:bg-[#E5B420] transition">
                <Users className="h-4 w-4" /> Create Group & Get Link
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateGroupOrderPage
