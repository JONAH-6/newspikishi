// web/src/pages/TrackOrderPage/TrackOrderPage.tsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import {
  OrderStore,
  SingleOrder,
  GroupOrder,
  OrderStatus,
} from 'src/lib/orderStore'
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Phone,
  MessageCircle,
  Users,
  ChefHat,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react'

const ORDER_STAGES: { key: OrderStatus; label: string; description: string; icon: any }[] = [
  { key: 'created', label: 'Order Created', description: 'Order initiated on campus', icon: Package },
  { key: 'payment_confirmed', label: 'Payment Confirmed', description: 'Campus payment verified', icon: ShieldCheck },
  { key: 'sent_to_sellers', label: 'Sent to Kitchen', description: 'Vendor kitchen alerted', icon: ChefHat },
  { key: 'preparing', label: 'Preparing Fresh', description: 'Kitchen is packing your snacks', icon: UtensilsIcon },
  { key: 'ready_for_pickup', label: 'Ready for Pickup', description: 'Bag sealed & ready', icon: ShoppingBag },
  { key: 'rider_assigned', label: 'Rider Assigned', description: 'Campus rider dispatched', icon: BikeIcon },
  { key: 'picked_up', label: 'Picked Up', description: 'Rider collected the package', icon: Truck },
  { key: 'on_the_way', label: 'On The Way', description: 'Rider is heading to your hostel', icon: Truck },
  { key: 'delivered', label: 'Delivered', description: 'Handed over at hostel gate', icon: CheckCircle2 },
]

function UtensilsIcon(props: any) {
  return <ChefHat {...props} />
}
function BikeIcon(props: any) {
  return <Truck {...props} />
}

const TrackOrderPage = () => {
  const params = useParams()
  const orderId = params.orderId || 'grp-102'

  const [singleOrder, setSingleOrder] = useState<SingleOrder | null>(null)
  const [groupOrder, setGroupOrder] = useState<GroupOrder | null>(null)

  const reloadData = () => {
    // Check in single orders
    const singles = OrderStore.getSingleOrders()
    const foundSingle = singles.find((s) => s.id === orderId)
    if (foundSingle) {
      setSingleOrder(foundSingle)
      setGroupOrder(null)
      return
    }

    // Check in group orders
    const groups = OrderStore.getGroupOrders()
    const foundGroup = groups.find((g) => g.id === orderId || g.groupCode.toUpperCase() === orderId.toUpperCase())
    if (foundGroup) {
      setGroupOrder(foundGroup)
      setSingleOrder(null)
      return
    }

    // Fallback: pick first available
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
        <div className="rounded-3xl border border-[#E9E5EE] bg-white p-10 text-center max-w-md shadow-lg space-y-4">
          <Package className="mx-auto h-16 w-16 text-[#6F6B76]/40" />
          <h2 className="text-xl font-bold text-[#211F26]">Order Not Found</h2>
          <p className="text-xs text-[#6F6B76]">Could not locate tracking details for order #{orderId}.</p>
          <Link
            to={routes.orders()}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC928] px-6 py-2.5 text-xs font-bold text-[#4B2E83] shadow hover:bg-[#E5B420]"
          >
            View My Orders
          </Link>
        </div>
      </div>
    )
  }

  // Find current stage index
  const stageKeys: OrderStatus[] = [
    'created',
    'payment_confirmed',
    'sent_to_sellers',
    'preparing',
    'ready_for_pickup',
    'rider_assigned',
    'picked_up',
    'on_the_way',
    'delivered',
  ]

  let currentStageIndex = stageKeys.indexOf(order.status)
  if (currentStageIndex === -1) {
    if (order.status === 'cancelled') currentStageIndex = 0
    else currentStageIndex = 3
  }

  // Fast-Forward status for demo testing
  const handleAdvanceStatus = () => {
    const nextIndex = (currentStageIndex + 1) % stageKeys.length
    const nextStatus = stageKeys[nextIndex]
    OrderStore.updateOrderStatus(order.id, nextStatus, {
      name: 'Ibrahim Musa',
      phone: '08022334455',
      vehicle: 'Bajaj Boxer Motorcycle (AGL-492-LG)',
    })
  }

  return (
    <div className="min-h-screen bg-[#FAF8FD] py-8">
      <Metadata
        title={`Live Order Tracking #${order.id} ? YumZee`}
        description="Track your single or group food delivery in real-time."
      />

      <div className="container mx-auto max-w-4xl px-4 space-y-6">
        {/* Top Header Card */}
        <div className="overflow-hidden rounded-3xl border border-[#E9E5EE] bg-white shadow-sm">
          <div className="bg-[#4B2E83] p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#FFC928] px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-[#4B2E83]">
                    {isGroup ? 'Group Order Track' : 'Single Order Track'}
                  </span>
                  <span className="font-mono text-xs text-white/80 bg-white/10 px-2 py-0.5 rounded">
                    ID: #{order.id} {isGroup && `(${groupOrder?.groupCode})`}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black">
                  {isGroup ? groupOrder?.title : 'Individual Student Delivery'}
                </h1>
                <p className="text-xs text-white/80 flex items-center gap-1.5 pt-1">
                  <MapPin className="h-3.5 w-3.5 text-[#FFC928]" />
                  <span>Destination: <b>{order.hostelAddress}</b></span>
                </p>
              </div>

              {/* Fast Forward Demo Control */}
              <div className="flex flex-col sm:items-end gap-2">
                <button
                  onClick={handleAdvanceStatus}
                  className="flex items-center gap-1.5 rounded-2xl bg-[#FFC928] px-4 py-2.5 text-xs font-black text-[#4B2E83] shadow-md hover:bg-[#E5B420] transition active:scale-95"
                >
                  <Zap className="h-4 w-4" />
                  <span>Demo: Advance Status ?</span>
                </button>
                <span className="text-[10px] text-white/70">Click to simulate live progression</span>
              </div>
            </div>
          </div>

          {/* VISUAL 8-STAGE TIMELINE STEPPER */}
          <div className="border-t border-[#E9E5EE] p-6 sm:p-8 bg-[#FAF8FD] space-y-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-[#4B2E83]">
              Live Delivery Pipeline
            </h3>

            {/* Stepper Progress Bar */}
            <div className="relative">
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {ORDER_STAGES.map((stage, idx) => {
                  const isCompleted = idx <= currentStageIndex
                  const isCurrent = idx === currentStageIndex

                  return (
                    <div key={stage.key} className="flex flex-col items-center text-center space-y-1.5">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl border-2 transition-all ${
                          isCurrent
                            ? 'border-[#FFC928] bg-[#4B2E83] text-[#FFC928] shadow-md scale-110 animate-pulse'
                            : isCompleted
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                            : 'border-gray-200 bg-white text-gray-400'
                        }`}
                      >
                        {isCompleted && !isCurrent ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <stage.icon className="h-4 w-4" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-extrabold leading-tight ${
                          isCurrent
                            ? 'text-[#4B2E83]'
                            : isCompleted
                            ? 'text-[#211F26]'
                            : 'text-gray-400'
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Current Stage Highlight Banner */}
            <div className="rounded-2xl border border-amber-200 bg-[#FFF9E8] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4B2E83] text-white">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#211F26]">
                    Current Status: {ORDER_STAGES[currentStageIndex]?.label || order.status}
                  </h4>
                  <p className="text-xs text-[#6F6B76]">
                    {ORDER_STAGES[currentStageIndex]?.description || 'Order is being processed'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#6F6B76] block">Est. Arrival</span>
                <span className="font-mono text-base font-black text-[#4B2E83]">
                  {order.status === 'delivered' ? 'Delivered' : '10-15 Mins'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Rider & Drop-off Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Rider Card */}
          <div className="rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-[#6F6B76]">
              Assigned Campus Dispatch Rider
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4B2E83] text-white font-black text-lg">
                  ??
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#211F26]">
                    {order.assignedRider?.name || 'Ibrahim Musa'}
                  </h4>
                  <p className="text-xs text-[#6F6B76]">
                    {order.assignedRider?.vehicle || 'Bajaj Boxer Motorcycle (AGL-492-LG)'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${order.assignedRider?.phone || '08022334455'}`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                  aria-label="Call rider"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <a
                  href={`https://wa.me/2348022334455`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F1FB] text-[#4B2E83] hover:bg-[#E9E5EE] transition"
                  aria-label="WhatsApp rider"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="border-t border-[#E9E5EE] pt-3 text-xs text-[#6F6B76] flex justify-between">
              <span>Campus Delivery Rating:</span>
              <span className="font-bold text-[#211F26]">? 4.9 (420+ student drops)</span>
            </div>
          </div>

          {/* Delivery Location Card */}
          <div className="rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-[#6F6B76]">
              Hostel Drop-off Details
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#4B2E83] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#211F26] block text-sm">{order.hostelAddress}</span>
                  {!isGroup && singleOrder?.roomNumber && (
                    <span className="text-[#6F6B76]">Room/Block: {singleOrder.roomNumber}</span>
                  )}
                </div>
              </div>

              <div className="border-t border-[#E9E5EE] pt-2 text-[#6F6B76]">
                <span>Special Instructions: </span>
                <span className="font-semibold text-[#211F26]">
                  {isGroup
                    ? groupOrder?.deliveryNote || 'Collect at security entrance'
                    : singleOrder?.deliveryInstructions || 'Call student on arrival'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER ITEMS & PACKAGING MATRIX */}
        <div className="rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#E9E5EE] pb-3">
            <h3 className="font-black text-base text-[#211F26]">
              {isGroup ? 'Group Order Packaging Matrix' : 'Order Items Summary'}
            </h3>
            <span className="text-xs font-bold text-[#4B2E83]">
              {isGroup ? `${groupOrder?.participants.length} Student Bags` : `${singleOrder?.items.length} Items`}
            </span>
          </div>

          {isGroup ? (
            /* GROUP PACKAGING LABELS */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groupOrder?.participants.map((p, idx) => (
                <div key={p.id} className="rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E9E5EE] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#4B2E83] text-white text-xs font-black">
                        #{idx + 1}
                      </span>
                      <h4 className="font-bold text-xs text-[#211F26]">{p.name}</h4>
                    </div>
                    <span className="text-[11px] font-black text-[#4B2E83]">
                      ?{p.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {p.items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-xs text-[#6F6B76]">
                        <span>{item.quantity}? {item.name}</span>
                        <span className="font-semibold text-[#211F26]">
                          ?{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* SINGLE ORDER ITEMS */
            <div className="divide-y divide-[#E9E5EE]">
              {singleOrder?.items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between py-3 gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-xl border border-[#E9E5EE] object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#211F26]">{item.name}</p>
                    <p className="text-xs text-[#6F6B76]">
                      Qty: {item.quantity} ? ?{item.price.toLocaleString()} each
                    </p>
                  </div>
                  <span className="text-sm font-extrabold text-[#4B2E83]">
                    ?{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Pricing Total Bar */}
          <div className="border-t border-[#E9E5EE] pt-4 flex items-center justify-between">
            <span className="text-sm text-[#6F6B76]">Total Amount Paid</span>
            <span className="text-xl font-black text-[#4B2E83]">
              ?{(isGroup ? groupOrder?.grandTotal : singleOrder?.totalAmount)?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrderPage
