// web/src/pages/TrackOrderPage/TrackOrderPage.tsx - minimal
import React, { useState, useEffect } from 'react'
import { useParams, Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { OrderStore, SingleOrder, GroupOrder, OrderStatus } from 'src/lib/orderStore'
import { Package, Clock, CheckCircle2, Truck, MapPin, Phone, MessageCircle, ChefHat, ShoppingBag, ShieldCheck } from 'lucide-react'

const ORDER_STAGES: { key: OrderStatus; label: string; icon: any }[] = [
  { key: 'created', label: 'Placed', icon: Package },
  { key: 'payment_confirmed', label: 'Paid', icon: ShieldCheck },
  { key: 'sent_to_sellers', label: 'Sent to kitchen', icon: ChefHat },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'ready_for_pickup', label: 'Ready', icon: ShoppingBag },
  { key: 'rider_assigned', label: 'Rider assigned', icon: Truck },
  { key: 'picked_up', label: 'Picked up', icon: Truck },
  { key: 'on_the_way', label: 'On the way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
]

const TrackOrderPage = () => {
  const params = useParams()
  const orderId = params.orderId || 'grp-102'
  const [singleOrder, setSingleOrder] = useState<SingleOrder | null>(null)
  const [groupOrder, setGroupOrder] = useState<GroupOrder | null>(null)

  const reloadData = () => {
    const singles = OrderStore.getSingleOrders()
    const foundSingle = singles.find((s) => s.id === orderId)
    if (foundSingle) { setSingleOrder(foundSingle); setGroupOrder(null); return }
    const groups = OrderStore.getGroupOrders()
    const foundGroup = groups.find((g) => g.id === orderId || g.groupCode.toUpperCase() === orderId.toUpperCase())
    if (foundGroup) { setGroupOrder(foundGroup); setSingleOrder(null); return }
    if (groups.length > 0) setGroupOrder(groups[0])
    else if (singles.length > 0) setSingleOrder(singles[0])
  }
  useEffect(() => {
    reloadData()
    const handleUpdate = () => reloadData()
    window.addEventListener('yumzee_store_update', handleUpdate)
    return () => window.removeEventListener('yumzee_store_update', handleUpdate)
  }, [orderId])

  const order = singleOrder || groupOrder
  const isGroup = !!groupOrder

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF8FD] flex items-center justify-center p-4">
        <div className="rounded-2xl border border-[#E9E5EE] bg-white p-6 text-center max-w-md shadow-sm space-y-3">
          <Package className="mx-auto h-10 w-10 text-[#6F6B76]/40" />
          <h2 className="text-sm font-bold text-[#211F26]">Order Not Found</h2>
          <p className="text-xs text-[#6F6B76]">Could not find #{orderId}.</p>
          <Link to={routes.orders()} className="inline-flex rounded-xl bg-[#FFC928] px-6 py-3 text-xs font-bold text-[#4B2E83]">View Orders</Link>
        </div>
      </div>
    )
  }

  const stageKeys: OrderStatus[] = ['created','payment_confirmed','sent_to_sellers','preparing','ready_for_pickup','rider_assigned','picked_up','on_the_way','delivered']
  let currentStageIndex = stageKeys.indexOf(order.status)
  if (currentStageIndex === -1) currentStageIndex = 3

  const handleAdvanceStatus = () => {
    const nextIndex = (currentStageIndex + 1) % stageKeys.length
    OrderStore.updateOrderStatus(order.id, stageKeys[nextIndex], { name: 'Ibrahim Musa', phone: '08022334455', vehicle: 'Bajaj Boxer (AGL-492-LG)' })
  }

  return (
    <div className="min-h-screen bg-[#FAF8FD] py-6">
      <Metadata title={`Track #${order.id} — YumZee`} description="Track your delivery." />
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-3 space-y-6">
        <div className="overflow-hidden rounded-2xl border border-[#E9E5EE] bg-white shadow-sm">
          <div className="bg-[#4B2E83] p-4 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#FFC928] px-2 py-0.5 text-[11px] font-black uppercase text-[#4B2E83]">{isGroup ? 'Group' : 'Single'} — Track</span>
                  <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded">#{order.id}</span>
                </div>
                <h1 className="mt-1 text-lg font-black">{isGroup ? groupOrder?.title : 'Delivery'}</h1>
                <p className="text-xs text-white/80 flex items-center gap-1"><MapPin className="h-3 w-3 text-[#FFC928]" /> {order.hostelAddress}</p>
              </div>
              <button onClick={handleAdvanceStatus} className="rounded-xl bg-[#FFC928] px-4 py-2.5 text-xs font-bold text-[#4B2E83]">Advance Status</button>
            </div>
          </div>

          <div className="p-4 bg-[#FAF8FD] space-y-4">
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {ORDER_STAGES.map((stage, idx) => {
                const isCompleted = idx <= currentStageIndex
                const isCurrent = idx === currentStageIndex
                return (
                  <div key={stage.key} className="flex flex-col items-center text-center space-y-1">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl border text-xs ${isCurrent ? 'border-[#FFC928] bg-[#4B2E83] text-[#FFC928]' : isCompleted ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-200 bg-white text-gray-400'}`}>
                      <stage.icon className="h-3.5 w-3.5" />
                    </div>
                    <span className={`text-[10px] font-bold ${isCurrent ? 'text-[#4B2E83]' : isCompleted ? 'text-[#211F26]' : 'text-gray-400'}`}>{stage.label}</span>
                  </div>
                )
              })}
            </div>
            <div className="rounded-xl border bg-white p-3 flex items-center justify-between text-xs">
              <span className="font-bold text-[#211F26]">{ORDER_STAGES[currentStageIndex]?.label}</span>
              <span className="font-mono font-bold text-[#4B2E83]">{order.status === 'delivered' ? 'Delivered' : '10-15 min'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#E9E5EE] bg-white p-4 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#6F6B76]">Rider</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4B2E83] text-white font-black text-sm">R</div>
                <div><h4 className="text-sm font-bold text-[#211F26]">{order.assignedRider?.name || 'Ibrahim Musa'}</h4><p className="text-xs text-[#6F6B76]">{order.assignedRider?.vehicle || 'Bajaj Boxer (AGL-492-LG)'}</p></div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${order.assignedRider?.phone || '08022334455'}`} className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Phone className="h-3.5 w-3.5" /></a>
                <a href={`https://wa.me/2348022334455`} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F5F1FB] text-[#4B2E83]"><MessageCircle className="h-3.5 w-3.5" /></a>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E9E5EE] bg-white p-4 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#6F6B76]">Drop-off</h3>
            <p className="text-sm font-bold text-[#211F26] flex items-center gap-1"><MapPin className="h-4 w-4 text-[#4B2E83]" />{order.hostelAddress}</p>
            <p className="text-xs text-[#6F6B76]">Note: <span className="font-semibold text-[#211F26]">{isGroup ? groupOrder?.deliveryNote || 'At entrance' : singleOrder?.deliveryInstructions || 'Call on arrival'}</span></p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E9E5EE] bg-white p-4 space-y-3">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-bold text-[#211F26]">{isGroup ? 'Group items' : 'Items'}</h3>
            <span className="text-xs font-bold text-[#4B2E83]">{isGroup ? `${groupOrder?.participants.length} bags` : `${singleOrder?.items.length} items`}</span>
          </div>
          {isGroup ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {groupOrder?.participants.map((p, idx) => (
                <div key={p.id} className="rounded-xl border bg-[#FAF8FD] p-3">
                  <div className="flex justify-between border-b pb-2 mb-2"><span className="text-xs font-bold">#{idx+1} {p.name}</span><span className="text-xs font-bold text-[#4B2E83]">₦{p.totalAmount.toLocaleString()}</span></div>
                  <div className="space-y-1">{p.items.map((item)=><div key={item.productId} className="flex justify-between text-xs"><span>{item.quantity}× {item.name}</span><span className="font-semibold">₦{(item.price*item.quantity).toLocaleString()}</span></div>)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {singleOrder?.items.map((item)=>(
                <div key={item.productId} className="flex items-center justify-between py-2 gap-3">
                  <img src={item.image} alt={item.name} className="h-10 w-10 rounded-xl border object-cover" />
                  <div className="flex-1"><p className="text-xs font-bold">{item.name}</p><p className="text-xs text-[#6F6B76]">×{item.quantity} — ₦{item.price.toLocaleString()}</p></div>
                  <span className="text-xs font-black text-[#4B2E83]">₦{(item.price*item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
          <div className="border-t pt-3 flex justify-between items-center"><span className="text-xs text-[#6F6B76]">Total</span><span className="text-lg font-black text-[#4B2E83]">₦{(isGroup ? groupOrder?.grandTotal : singleOrder?.totalAmount)?.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrderPage
