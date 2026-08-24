// web/src/pages/GroupOrderRoomPage/GroupOrderRoomPage.tsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import {
  OrderStore,
  GroupOrder,
  GroupParticipant,
  INITIAL_PRODUCTS,
  Product,
} from 'src/lib/orderStore'
import { PaymentModal } from 'src/components/PaymentModal/PaymentModal'
import {
  Users,
  Clock,
  MapPin,
  Share2,
  Copy,
  Check,
  Plus,
  Minus,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  TrendingDown,
  Lock,
  Flame,
  UserPlus,
  Trash2,
} from 'lucide-react'

const GroupOrderRoomPage = () => {
  const params = useParams()
  const code = params.code || 'YUM-7842'

  const [group, setGroup] = useState<GroupOrder | null>(null)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number; isExpired: boolean }>({
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })

  // Join as new student state
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentPhone, setNewStudentPhone] = useState('')
  const [newStudentRoom, setNewStudentRoom] = useState('')
  const [isJoining, setIsJoining] = useState(false)

  // Payment Modal state
  const [payingParticipant, setPayingParticipant] = useState<GroupParticipant | null>(null)

  // Add Item Drawer for a specific student
  const [activeStudentForAdd, setActiveStudentForAdd] = useState<string | null>(null)

  // Reload group data
  const reloadData = () => {
    const found = OrderStore.getGroupOrderByCode(code)
    if (found) {
      setGroup(found)
    }
  }

  useEffect(() => {
    reloadData()
    const handleUpdate = () => reloadData()
    window.addEventListener('yumzee_store_update', handleUpdate)
    return () => window.removeEventListener('yumzee_store_update', handleUpdate)
  }, [code])

  // Countdown timer effect
  useEffect(() => {
    if (!group) return

    const updateTimer = () => {
      const deadline = new Date(group.deadline).getTime()
      const now = Date.now()
      const diff = deadline - now

      if (diff <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0, isExpired: true })
      } else {
        const minutes = Math.floor((diff / 1000 / 60) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        setTimeLeft({ minutes, seconds, isExpired: false })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [group?.deadline])

  if (!group) {
    return (
      <div className="min-h-screen bg-[#FAF8FD] flex items-center justify-center p-4">
        <div className="rounded-3xl border border-[#E9E5EE] bg-white p-10 text-center max-w-md shadow-lg space-y-4">
          <Users className="mx-auto h-16 w-16 text-[#6F6B76]/40" />
          <h2 className="text-xl font-bold text-[#211F26]">Group Order Not Found</h2>
          <p className="text-xs text-[#6F6B76]">
            No group order was found matching code <b>{code}</b>. It may have expired or been removed.
          </p>
          <Link
            to={routes.home()}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC928] px-6 py-2.5 text-xs font-bold text-[#4B2E83] shadow hover:bg-[#E5B420]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStudentName.trim() || !newStudentPhone.trim()) return

    const updated = OrderStore.joinGroupOrder(group.groupCode, {
      name: newStudentName.trim(),
      phone: newStudentPhone.trim(),
      roomOrHostel: newStudentRoom.trim() || 'Campus Hostel',
      items: [
        // Default sample snack for quick onboarding
        {
          productId: INITIAL_PRODUCTS[1].id,
          name: INITIAL_PRODUCTS[1].name,
          price: INITIAL_PRODUCTS[1].price,
          quantity: 1,
          image: INITIAL_PRODUCTS[1].image,
        },
      ],
    })

    if (updated) {
      setGroup(updated)
      setIsJoining(false)
      setNewStudentName('')
      setNewStudentPhone('')
      setNewStudentRoom('')
    }
  }

  const handleAddItemToParticipant = (participantId: string, product: Product) => {
    const participant = group.participants.find((p) => p.id === participantId)
    if (!participant) return

    const existingItem = participant.items.find((i) => i.productId === product.id)
    let newItems = []
    if (existingItem) {
      newItems = participant.items.map((i) =>
        i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
      )
    } else {
      newItems = [
        ...participant.items,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ]
    }

    const updated = OrderStore.updateParticipantItems(group.groupCode, participantId, newItems)
    if (updated) setGroup(updated)
  }

  const handleRemoveItem = (participantId: string, productId: number) => {
    const participant = group.participants.find((p) => p.id === participantId)
    if (!participant) return

    const newItems = participant.items
      .map((i) => (i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i))
      .filter((i) => i.quantity > 0)

    const updated = OrderStore.updateParticipantItems(group.groupCode, participantId, newItems)
    if (updated) setGroup(updated)
  }

  const handleLockAndSubmit = () => {
    const updated = OrderStore.lockAndSubmitGroupOrder(group.groupCode)
    if (updated) {
      setGroup(updated)
      navigate(`/track/${group.groupCode}`)
    }
  }

  const handlePaymentSuccess = () => {
    if (!payingParticipant) return
    const updated = OrderStore.payParticipantShare(group.groupCode, payingParticipant.id)
    if (updated) {
      setGroup(updated)
      setPayingParticipant(null)
    }
  }

  const totalParticipants = group.participants.length
  const allPaid = totalParticipants > 0 && group.participants.every((p) => p.isPaid)
  const isSubmitted = group.status !== 'created' && group.status !== 'payment_confirmed'

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const whatsappShareText = encodeURIComponent(
    `?? Join our YumZee Group Order to *${group.hostelAddress}*!\n\n` +
      `We have *${totalParticipants} students* already. Join in so we get *FREE DELIVERY*!\n\n` +
      `?? Link: ${shareUrl}\n` +
      `?? Group Code: *${group.groupCode}*`
  )

  return (
    <div className="min-h-screen bg-[#FAF8FD] py-8">
      <Metadata
        title={`${group.title} (${group.groupCode}) ? YumZee Group Room`}
        description="Collaborative student food order with shared delivery discounts."
      />

      {payingParticipant && (
        <PaymentModal
          isOpen={!!payingParticipant}
          onClose={() => setPayingParticipant(null)}
          onSuccess={handlePaymentSuccess}
          amount={payingParticipant.totalAmount}
          orderTitle={`Pay Share: ${group.title}`}
          studentName={payingParticipant.name}
        />
      )}

      <div className="container mx-auto max-w-5xl px-4 space-y-6">
        {/* ROOM TOP HEADER */}
        <div className="overflow-hidden rounded-3xl border border-[#E9E5EE] bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#4B2E83] via-[#3B226B] to-[#251448] p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#FFC928] px-2.5 py-0.5 text-xs font-black uppercase text-[#4B2E83]">
                    Group Order Room
                  </span>
                  <span className="font-mono text-xs font-bold text-white/80 bg-white/10 px-2 py-0.5 rounded">
                    Code: {group.groupCode}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{group.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/80 pt-1">
                  <span className="flex items-center gap-1 font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-[#FFC928]" />
                    {group.hostelAddress}
                  </span>
                  <span>?</span>
                  <span>Host: <b>{group.hostName}</b></span>
                </div>
              </div>

              {/* Deadline & Share Buttons */}
              <div className="flex flex-col sm:items-end gap-2.5">
                {/* Live Countdown Clock */}
                <div
                  className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 backdrop-blur-md border ${
                    timeLeft.isExpired
                      ? 'bg-rose-500/30 border-rose-400 text-rose-200'
                      : timeLeft.minutes < 5
                      ? 'bg-amber-500/30 border-amber-400 text-amber-200 animate-pulse'
                      : 'bg-white/15 border-white/20 text-white'
                  }`}
                >
                  <Clock className="h-5 w-5 text-[#FFC928]" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/70 block">
                      {timeLeft.isExpired ? 'Order Closed' : 'Deadline Countdown'}
                    </span>
                    <span className="font-mono text-lg font-black tracking-wider">
                      {timeLeft.isExpired
                        ? '00:00 (Locked)'
                        : `${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
                    </span>
                  </div>
                </div>

                {/* Share Shortcuts */}
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/?text=${whatsappShareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/30 transition"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC DISCOUNT PROGRESS ENGINE BAR */}
          <div className="border-t border-[#E9E5EE] bg-[#FAF8FD] p-5 sm:p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-extrabold text-[#211F26]">
                  Shared Delivery Savings Progress:
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-700">
                  {group.discountPercent}% OFF (?{group.finalDeliveryFee} Total Delivery)
                </span>
              </div>

              <div className="text-xs font-bold text-[#4B2E83]">
                {totalParticipants >= 4 ? (
                  <span className="text-emerald-700 font-extrabold">?? 100% FREE DELIVERY UNLOCKED!</span>
                ) : (
                  <span>
                    ? <b>{4 - totalParticipants} more student{4 - totalParticipants > 1 ? 's' : ''}</b> needed for <b>100% FREE DELIVERY</b>!
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar Tiers */}
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-[#FFC928] via-purple-600 to-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (totalParticipants / 4) * 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-4 text-center text-[11px] font-bold text-[#6F6B76] pt-1">
              <div>1 Student (?600)</div>
              <div className={totalParticipants >= 2 ? 'text-[#4B2E83] font-black' : ''}>2 (40% Off)</div>
              <div className={totalParticipants >= 3 ? 'text-[#4B2E83] font-black' : ''}>3 (60% Off)</div>
              <div className={totalParticipants >= 4 ? 'text-emerald-700 font-black' : ''}>4+ (FREE!)</div>
            </div>
          </div>
        </div>

        {/* MAIN BODY: Participants List & Menu Drawer */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 7 Columns: Participants & Individual Bags */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#4B2E83]" />
                <h3 className="text-xl font-black text-[#211F26]">
                  Participating Students ({totalParticipants})
                </h3>
              </div>

              {!isSubmitted && (
                <button
                  onClick={() => setIsJoining(true)}
                  className="flex items-center gap-1.5 rounded-2xl bg-[#4B2E83] px-4 py-2 text-xs font-bold text-white hover:bg-[#371F62] transition shadow-sm"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Join this Group</span>
                </button>
              )}
            </div>

            {/* Join as Student Modal / Expandable Card */}
            {isJoining && (
              <div className="rounded-3xl border-2 border-[#4B2E83] bg-white p-6 shadow-md space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#E9E5EE] pb-2">
                  <h4 className="font-black text-sm text-[#4B2E83]">Add Yourself to this Group Order</h4>
                  <button
                    onClick={() => setIsJoining(false)}
                    className="text-xs font-bold text-[#6F6B76] hover:text-[#211F26]"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleJoinSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#6F6B76] mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder="e.g. David Adeleke"
                        className="w-full rounded-xl border border-[#E9E5EE] p-2.5 text-xs font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#6F6B76] mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={newStudentPhone}
                        onChange={(e) => setNewStudentPhone(e.target.value)}
                        placeholder="08012345678"
                        className="w-full rounded-xl border border-[#E9E5EE] p-2.5 text-xs font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#6F6B76] mb-1">Room Number (Optional)</label>
                    <input
                      type="text"
                      value={newStudentRoom}
                      onChange={(e) => setNewStudentRoom(e.target.value)}
                      placeholder="e.g. Room B212"
                      className="w-full rounded-xl border border-[#E9E5EE] p-2.5 text-xs font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-[#FFC928] py-3 text-xs font-extrabold text-[#4B2E83] hover:bg-[#E5B420] transition shadow"
                  >
                    Confirm Join & Pick Snacks
                  </button>
                </form>
              </div>
            )}

            {/* Individual Participant Cards */}
            <div className="space-y-4">
              {group.participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="overflow-hidden rounded-3xl border border-[#E9E5EE] bg-white shadow-sm"
                >
                  {/* Participant Header */}
                  <div className="flex items-center justify-between border-b border-[#E9E5EE] bg-[#FAF8FD] p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#4B2E83] font-black text-sm text-white">
                        {participant.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#211F26]">{participant.name}</h4>
                          {participant.isHost && (
                            <span className="rounded-full bg-[#FFC928] px-2 py-0.2 text-[10px] font-black text-[#4B2E83]">
                              Host
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#6F6B76]">
                          {participant.roomOrHostel || 'Hostel Resident'} ? {participant.phone}
                        </p>
                      </div>
                    </div>

                    {/* Payment Status Badge */}
                    <div>
                      {participant.isPaid ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Paid</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Participant Items List */}
                  <div className="p-4 space-y-3">
                    {participant.items.length === 0 ? (
                      <p className="text-xs text-[#A09BA8] italic py-2">
                        No snacks added to this student bag yet.
                      </p>
                    ) : (
                      <div className="divide-y divide-[#E9E5EE]">
                        {participant.items.map((item) => (
                          <div key={item.productId} className="flex items-center justify-between py-2 gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-10 w-10 rounded-xl border border-[#E9E5EE] object-cover"
                            />
                            <div className="flex-1">
                              <p className="text-xs font-bold text-[#211F26] line-clamp-1">{item.name}</p>
                              <p className="text-[11px] text-[#6F6B76]">
                                ?{item.price.toLocaleString()} ? {item.quantity}
                              </p>
                            </div>

                            {!group.isLocked && (
                              <div className="flex items-center rounded-lg border border-[#E9E5EE] bg-[#FAF8FD] p-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(participant.id, item.productId)}
                                  className="h-5 w-5 flex items-center justify-center rounded bg-white text-xs font-bold shadow-sm"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const prod = INITIAL_PRODUCTS.find((p) => p.id === item.productId)
                                    if (prod) handleAddItemToParticipant(participant.id, prod)
                                  }}
                                  className="h-5 w-5 flex items-center justify-center rounded bg-white text-xs font-bold shadow-sm"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            )}

                            <span className="text-xs font-bold text-[#4B2E83] min-w-[60px] text-right">
                              ?{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Add Snack Trigger for this participant */}
                    {!group.isLocked && (
                      <button
                        onClick={() =>
                          setActiveStudentForAdd(
                            activeStudentForAdd === participant.id ? null : participant.id
                          )
                        }
                        className="w-full rounded-xl border border-dashed border-[#4B2E83]/40 bg-[#F5F1FB]/60 py-2 text-xs font-bold text-[#4B2E83] hover:bg-[#F5F1FB] transition"
                      >
                        {activeStudentForAdd === participant.id
                          ? '? Close Snack Picker'
                          : `+ Add Food to ${participant.name.split(' ')[0]}'s Bag`}
                      </button>
                    )}

                    {/* Expandable Snack Picker for this student */}
                    {activeStudentForAdd === participant.id && !group.isLocked && (
                      <div className="rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 space-y-2 max-h-52 overflow-y-auto">
                        <span className="text-[11px] font-bold uppercase text-[#6F6B76] block">
                          Tap snack to add to bag:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {INITIAL_PRODUCTS.map((prod) => (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => handleAddItemToParticipant(participant.id, prod)}
                              className="flex items-center gap-2 rounded-xl border border-[#E9E5EE] bg-white p-2 text-left hover:border-[#4B2E83] hover:bg-[#F5F1FB] transition"
                            >
                              <img src={prod.image} alt={prod.name} className="h-8 w-8 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#211F26] truncate">{prod.name}</p>
                                <p className="text-[10px] text-[#4B2E83] font-bold">?{prod.price.toLocaleString()}</p>
                              </div>
                              <Plus className="h-4 w-4 text-[#4B2E83]" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Participant Pricing Split & Pay CTA */}
                    <div className="border-t border-[#E9E5EE] pt-3 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-[#6F6B76]">Food: ?{participant.subtotal.toLocaleString()}</span>
                        <span className="text-[#6F6B76] ml-2">
                          + Delivery Share: <b className="text-emerald-600">?{participant.deliveryShare}</b>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-[#6F6B76] block uppercase font-bold">Total Share</span>
                          <span className="text-sm font-black text-[#4B2E83]">
                            ?{participant.totalAmount.toLocaleString()}
                          </span>
                        </div>

                        {!participant.isPaid && !group.isLocked && (
                          <button
                            onClick={() => setPayingParticipant(participant)}
                            className="rounded-xl bg-[#FFC928] px-3.5 py-2 text-xs font-extrabold text-[#4B2E83] shadow hover:bg-[#E5B420] transition active:scale-95"
                          >
                            Pay My ?{participant.totalAmount.toLocaleString()}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 5 Columns: Group Summary & Host Dispatch Control */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm space-y-5 sticky top-20">
              <div className="flex items-center justify-between border-b border-[#E9E5EE] pb-3">
                <h3 className="font-extrabold text-base text-[#211F26]">
                  Combined Group Summary
                </h3>
                <span className="rounded-md bg-[#4B2E83] px-2 py-0.5 text-xs font-bold text-white">
                  {totalParticipants} Bags Combined
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#6F6B76]">
                  <span>Total Group Food Amount</span>
                  <span className="font-bold text-[#211F26]">?{group.foodTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-[#6F6B76]">
                  <span>Original Delivery Cost</span>
                  <span className="line-through text-[#A09BA8]">?{group.baseDeliveryFee.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Group Discount ({group.discountPercent}% Off)</span>
                  <span>-?{(group.baseDeliveryFee - group.finalDeliveryFee).toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-[#6F6B76]">
                  <span>Final Combined Delivery Fee</span>
                  <span className="font-bold text-[#211F26]">
                    {group.finalDeliveryFee === 0 ? '?0 (FREE!)' : `?${group.finalDeliveryFee.toLocaleString()}`}
                  </span>
                </div>

                <div className="border-t border-[#E9E5EE] pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-extrabold text-[#211F26] block">
                      Grand Total
                    </span>
                    <span className="text-[11px] text-[#6F6B76]">
                      Fairly split across all {totalParticipants} students
                    </span>
                  </div>
                  <span className="text-2xl font-black text-[#4B2E83]">
                    ?{group.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status & Next Step */}
              {isSubmitted ? (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 font-black text-emerald-800 text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Order Dispatched to Sellers!</span>
                    </div>
                    <p className="text-xs text-emerald-700">
                      Kitchen is preparing all {totalParticipants} student packages.
                    </p>
                  </div>

                  <Link
                    to={`/track/${group.groupCode}`}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#4B2E83] py-3.5 text-sm font-extrabold text-white shadow-lg hover:bg-[#371F62] transition"
                  >
                    <Truck className="h-4 w-4" />
                    <span>Track Combined Delivery Live ?</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleLockAndSubmit}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FFC928] py-4 text-sm font-black text-[#4B2E83] shadow-lg shadow-[#FFC928]/30 hover:bg-[#E5B420] transition active:scale-95"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Lock Group & Submit to Kitchen</span>
                  </button>

                  <p className="text-[11px] text-[#6F6B76] text-center">
                    Once locked, no new students can join and preparation begins immediately.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupOrderRoomPage
