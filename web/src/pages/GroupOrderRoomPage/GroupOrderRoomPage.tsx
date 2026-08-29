// web/src/pages/GroupOrderRoomPage/GroupOrderRoomPage.tsx - minimal
import React, { useState, useEffect } from 'react'
import { useParams, Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { OrderStore, GroupOrder, GroupParticipant, INITIAL_PRODUCTS, Product } from 'src/lib/orderStore'
import { PaymentModal } from 'src/components/PaymentModal/PaymentModal'
import { Users, Clock, MapPin, Copy, Check, Plus, Minus, MessageCircle, CheckCircle2, Truck, Lock, UserPlus } from 'lucide-react'

const GroupOrderRoomPage = () => {
  const params = useParams()
  const code = params.code || 'YUM-7842'
  const [group, setGroup] = useState<GroupOrder | null>(null)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number; isExpired: boolean }>({ minutes: 0, seconds: 0, isExpired: false })
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentPhone, setNewStudentPhone] = useState('')
  const [newStudentRoom, setNewStudentRoom] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [payingParticipant, setPayingParticipant] = useState<GroupParticipant | null>(null)
  const [activeStudentForAdd, setActiveStudentForAdd] = useState<string | null>(null)

  const reloadData = () => {
    const found = OrderStore.getGroupOrderByCode(code)
    if (found) setGroup(found)
  }
  useEffect(() => {
    reloadData()
    const handleUpdate = () => reloadData()
    window.addEventListener('yumzee_store_update', handleUpdate)
    return () => window.removeEventListener('yumzee_store_update', handleUpdate)
  }, [code])

  useEffect(() => {
    if (!group) return
    const updateTimer = () => {
      const diff = new Date(group.deadline).getTime() - Date.now()
      if (diff <= 0) setTimeLeft({ minutes: 0, seconds: 0, isExpired: true })
      else setTimeLeft({ minutes: Math.floor((diff / 1000 / 60) % 60), seconds: Math.floor((diff / 1000) % 60), isExpired: false })
    }
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [group?.deadline])

  if (!group) {
    return (
      <div className="min-h-screen bg-[#FAF8FD] flex items-center justify-center p-4">
        <div className="rounded-2xl border border-[#E9E5EE] bg-white p-6 text-center max-w-md shadow-sm space-y-3">
          <Users className="mx-auto h-10 w-10 text-[#6F6B76]/40" />
          <h2 className="text-base font-bold text-[#211F26]">Group Order Not Found</h2>
          <p className="text-xs text-[#6F6B76]">No group found for code <b>{code}</b>.</p>
          <Link to={routes.home()} className="inline-flex items-center gap-2 rounded-xl bg-[#FFC928] px-6 py-2.5 text-xs font-bold text-[#4B2E83]">Back to Home</Link>
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
      roomOrHostel: newStudentRoom.trim() || '—',
      items: [{ productId: INITIAL_PRODUCTS[1].id, name: INITIAL_PRODUCTS[1].name, price: INITIAL_PRODUCTS[1].price, quantity: 1, image: INITIAL_PRODUCTS[1].image }],
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
    if (existingItem) newItems = participant.items.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)
    else newItems = [...participant.items, { productId: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }]
    const updated = OrderStore.updateParticipantItems(group.groupCode, participantId, newItems)
    if (updated) setGroup(updated)
  }
  const handleRemoveItem = (participantId: string, productId: number) => {
    const participant = group.participants.find((p) => p.id === participantId)
    if (!participant) return
    const newItems = participant.items.map((i) => i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0)
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
    if (updated) { setGroup(updated); setPayingParticipant(null) }
  }

  const totalParticipants = group.participants.length
  const isSubmitted = group.status !== 'created' && group.status !== 'payment_confirmed'
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const whatsappShareText = encodeURIComponent(`Join YumZee Group Order to ${group.hostelAddress}. Link: ${shareUrl} Code: ${group.groupCode}`)

  return (
    <div className="min-h-screen bg-[#FAF8FD] py-6">
      <Metadata title={`${group.title} — YumZee`} description="Group order room." />
      {payingParticipant && (
        <PaymentModal isOpen={!!payingParticipant} onClose={() => setPayingParticipant(null)} onSuccess={handlePaymentSuccess} amount={payingParticipant.totalAmount} orderTitle={`Pay: ${group.title}`} studentName={payingParticipant.name} />
      )}
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-3 space-y-6">
        {/* Header */}
        <div className="overflow-hidden rounded-2xl border border-[#E9E5EE] bg-white shadow-sm">
          <div className="bg-[#4B2E83] p-4 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#FFC928] px-2 py-0.5 text-[11px] font-black uppercase text-[#4B2E83]">Group Order</span>
                  <span className="font-mono text-xs font-bold bg-white/10 px-2 py-0.5 rounded">{group.groupCode}</span>
                </div>
                <h1 className="text-xl font-black">{group.title}</h1>
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <MapPin className="h-3.5 w-3.5 text-[#FFC928]" /> {group.hostelAddress} — Host: {group.hostName}
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold border ${timeLeft.isExpired ? 'bg-rose-500/20 border-rose-400' : 'bg-white/15 border-white/20'}`}>
                  <Clock className="h-4 w-4 text-[#FFC928]" />
                  <span className="font-mono">{timeLeft.isExpired ? 'Closed' : `${String(timeLeft.minutes).padStart(2,'0')}:${String(timeLeft.seconds).padStart(2,'0')}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`https://wa.me/?text=${whatsappShareText}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white"> <MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a>
                  <button onClick={handleCopyLink} className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold text-white">{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}</button>
                </div>
              </div>
            </div>
          </div>
          {/* Progress */}
          <div className="border-t border-[#E9E5EE] bg-[#FAF8FD] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-[#211F26]">Delivery savings: {group.discountPercent}% off</span>
              <span className="font-bold text-[#4B2E83]">{totalParticipants >=4 ? 'Free delivery unlocked' : `${4-totalParticipants} more for free delivery`}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full bg-[#4B2E83] transition-all" style={{ width: `${Math.min(100,(totalParticipants/4)*100)}%` }} />
            </div>
            <div className="grid grid-cols-4 text-center text-[11px] font-bold text-[#6F6B76]">
              <div>1 — ₦600</div><div className={totalParticipants>=2?'text-[#4B2E83]':''}>2 — 40% off</div><div className={totalParticipants>=3?'text-[#4B2E83]':''}>3 — 60% off</div><div className={totalParticipants>=4?'text-emerald-700':''}>4+ — Free</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-black text-[#211F26]"><Users className="h-4 w-4 text-[#4B2E83]" /> Participants ({totalParticipants})</h3>
              {!isSubmitted && (
                <button onClick={() => setIsJoining(true)} className="flex items-center gap-1.5 rounded-xl bg-[#4B2E83] px-4 py-2 text-xs font-bold text-white"><UserPlus className="h-3.5 w-3.5" /> Join</button>
              )}
            </div>

            {isJoining && (
              <div className="rounded-2xl border-2 border-[#4B2E83] bg-white p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E9E5EE] pb-2">
                  <h4 className="font-bold text-xs text-[#4B2E83]">Join this group</h4>
                  <button onClick={() => setIsJoining(false)} className="text-xs font-bold text-[#6F6B76]">Cancel</button>
                </div>
                <form onSubmit={handleJoinSubmit} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><label className="block text-[11px] font-bold text-[#6F6B76] mb-1">Name</label><input type="text" required value={newStudentName} onChange={(e)=>setNewStudentName(e.target.value)} placeholder="Name" className="w-full rounded-xl border border-[#E9E5EE] p-2.5 text-xs font-semibold" /></div>
                    <div><label className="block text-[11px] font-bold text-[#6F6B76] mb-1">Phone</label><input type="tel" required value={newStudentPhone} onChange={(e)=>setNewStudentPhone(e.target.value)} placeholder="Phone" className="w-full rounded-xl border border-[#E9E5EE] p-2.5 text-xs font-semibold" /></div>
                  </div>
                  <div><label className="block text-[11px] font-bold text-[#6F6B76] mb-1">Room (optional)</label><input type="text" value={newStudentRoom} onChange={(e)=>setNewStudentRoom(e.target.value)} placeholder="Room" className="w-full rounded-xl border border-[#E9E5EE] p-2.5 text-xs font-semibold" /></div>
                  <button type="submit" className="w-full rounded-xl bg-[#FFC928] py-3 text-xs font-bold text-[#4B2E83]">Confirm & Join</button>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {group.participants.map((participant) => (
                <div key={participant.id} className="overflow-hidden rounded-2xl border border-[#E9E5EE] bg-white">
                  <div className="flex items-center justify-between border-b border-[#E9E5EE] bg-[#FAF8FD] p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4B2E83] font-black text-xs text-white">{participant.name[0]}</div>
                      <div>
                        <div className="flex items-center gap-2"><h4 className="font-bold text-xs text-[#211F26]">{participant.name}</h4>{participant.isHost && <span className="rounded-full bg-[#FFC928] px-2 py-0.5 text-[10px] font-black text-[#4B2E83]">Host</span>}</div>
                        <p className="text-[11px] text-[#6F6B76]">{participant.phone}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${participant.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                      <CheckCircle2 className="h-3 w-3" />{participant.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    {participant.items.length===0 ? <p className="text-xs text-[#A09BA8]">No items yet.</p> : (
                      <div className="divide-y divide-[#E9E5EE]">
                        {participant.items.map((item)=>(
                          <div key={item.productId} className="flex items-center justify-between py-2 gap-3">
                            <img src={item.image} alt={item.name} className="h-8 w-8 rounded-lg border object-cover" />
                            <div className="flex-1 min-w-0"><p className="text-xs font-bold truncate">{item.name}</p><p className="text-[11px] text-[#6F6B76]">₦{item.price.toLocaleString()} × {item.quantity}</p></div>
                            {!group.isLocked && (<div className="flex items-center rounded-lg border bg-[#FAF8FD] p-0.5">
                              <button onClick={()=>handleRemoveItem(participant.id,item.productId)} className="h-5 w-5 flex items-center justify-center rounded bg-white"><Minus className="h-3 w-3" /></button>
                              <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                              <button onClick={()=>{ const prod=INITIAL_PRODUCTS.find(p=>p.id===item.productId); if(prod) handleAddItemToParticipant(participant.id,prod)}} className="h-5 w-5 flex items-center justify-center rounded bg-white"><Plus className="h-3 w-3" /></button>
                            </div>)}
                            <span className="text-xs font-bold text-[#4B2E83]">₦{(item.price*item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {!group.isLocked && (
                      <button onClick={()=>setActiveStudentForAdd(activeStudentForAdd===participant.id?null:participant.id)} className="w-full rounded-xl border border-dashed border-[#4B2E83]/30 bg-[#F5F1FB]/50 py-2 text-xs font-bold text-[#4B2E83]">
                        {activeStudentForAdd===participant.id ? 'Close' : `+ Add to ${participant.name.split(' ')[0]}'s bag`}
                      </button>
                    )}
                    {activeStudentForAdd===participant.id && !group.isLocked && (
                      <div className="rounded-2xl border bg-[#FAF8FD] p-3 space-y-2 max-h-52 overflow-y-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {INITIAL_PRODUCTS.map((prod)=>(
                            <button key={prod.id} onClick={()=>handleAddItemToParticipant(participant.id,prod)} className="flex items-center gap-2 rounded-xl border bg-white p-2 text-left hover:border-[#4B2E83]">
                              <img src={prod.image} alt={prod.name} className="h-7 w-7 rounded object-cover" /><div className="flex-1 min-w-0"><p className="text-xs font-bold truncate">{prod.name}</p><p className="text-[10px] font-bold text-[#4B2E83]">₦{prod.price.toLocaleString()}</p></div><Plus className="h-3.5 w-3.5 text-[#4B2E83]" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="text-xs text-[#6F6B76]">Delivery share: <b className="text-emerald-600">₦{participant.deliveryShare}</b></span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#4B2E83]">₦{participant.totalAmount.toLocaleString()}</span>
                        {!participant.isPaid && !group.isLocked && (<button onClick={()=>setPayingParticipant(participant)} className="rounded-xl bg-[#FFC928] px-3 py-2 text-xs font-bold text-[#4B2E83]">Pay</button>)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-[#E9E5EE] bg-white p-3 shadow-sm space-y-4 sticky top-20">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-sm text-[#211F26]">Group Summary</h3>
                <span className="rounded-md bg-[#4B2E83] px-2 py-0.5 text-xs font-bold text-white">{totalParticipants} bags</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#6F6B76]"><span>Food total</span><span className="font-bold text-[#211F26]">₦{group.foodTotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-[#6F6B76]"><span>Delivery (was</span><span className="line-through">₦{group.baseDeliveryFee.toLocaleString()})</span></div>
                <div className="flex justify-between font-bold text-emerald-600"><span>Discount ({group.discountPercent}%)</span><span>-₦{(group.baseDeliveryFee - group.finalDeliveryFee).toLocaleString()}</span></div>
                <div className="flex justify-between text-[#6F6B76]"><span>Delivery fee</span><span className="font-bold text-[#211F26]">{group.finalDeliveryFee===0?'Free':`₦${group.finalDeliveryFee.toLocaleString()}`}</span></div>
                <div className="border-t pt-3 flex justify-between items-baseline"><span className="text-sm font-extrabold text-[#211F26]">Total</span><span className="text-xl font-black text-[#4B2E83]">₦{group.grandTotal.toLocaleString()}</span></div>
              </div>
              {isSubmitted ? (
                <div className="space-y-3">
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center"><p className="text-xs font-bold text-emerald-800">Order dispatched</p></div>
                  <Link to={`/track/${group.groupCode}`} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#4B2E83] py-3 text-sm font-bold text-white"><Truck className="h-4 w-4" /> Track delivery</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <button onClick={handleLockAndSubmit} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FFC928] py-3 text-sm font-bold text-[#4B2E83]"><Lock className="h-4 w-4" /> Lock & Submit</button>
                  <p className="text-[11px] text-center text-[#6F6B76]">No new joins after locking.</p>
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
