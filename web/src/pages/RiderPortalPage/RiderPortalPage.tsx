// web/src/pages/RiderPortalPage/RiderPortalPage.tsx
import React, { useState, useEffect } from 'react'
import { Link } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import {
  OrderStore,
  SingleOrder,
  GroupOrder,
  OrderStatus,
} from 'src/lib/orderStore'
import {
  Truck,
  Package,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Navigation,
} from 'lucide-react'

const RiderPortalPage = () => {
  const [singleOrders, setSingleOrders] = useState<SingleOrder[]>([])
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([])

  const reloadData = () => {
    setSingleOrders(OrderStore.getSingleOrders())
    setGroupOrders(OrderStore.getGroupOrders())
  }

  useEffect(() => {
    reloadData()
    const handleUpdate = () => reloadData()
    window.addEventListener('yumzee_store_update', handleUpdate)
    return () => window.removeEventListener('yumzee_store_update', handleUpdate)
  }, [])

  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    OrderStore.updateOrderStatus(id, newStatus, {
      name: 'Ibrahim Musa (You)',
      phone: '08022334455',
      vehicle: 'Bajaj Boxer Motorcycle (AGL-492-LG)',
    })
  }

  // Active rider orders
  const allOrders = [
    ...groupOrders.map((g) => ({ ...g, isGroupOrder: true as const })),
    ...singleOrders.map((s) => ({ ...s, isGroupOrder: false as const })),
  ].filter((o) => o.status !== 'created' && o.status !== 'cancelled')

  return (
    <div className="min-h-screen bg-[#FAF8FD] py-8">
      <Metadata
        title="Campus Dispatch Rider Portal ? YumZee"
        description="Dispatch dashboard for campus deliveries and shared group drops."
      />

      <div className="container mx-auto max-w-5xl px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4B2E83] text-white shadow-md">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-black uppercase text-emerald-800">
                  Rider Online: Ibrahim Musa
                </span>
                <span className="text-xs text-[#6F6B76]">Bajaj Boxer (AGL-492-LG)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#211F26]">
                Campus Delivery Dashboard
              </h1>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {allOrders.length === 0 ? (
            <div className="rounded-3xl border border-[#E9E5EE] bg-white p-12 text-center shadow-sm">
              <Truck className="mx-auto h-16 w-16 text-[#6F6B76]/40 mb-3" />
              <h3 className="text-lg font-bold text-[#211F26]">No active dispatch jobs</h3>
              <p className="text-xs text-[#6F6B76] mt-1">
                When campus kitchens mark orders ready, delivery requests will appear here.
              </p>
            </div>
          ) : (
            allOrders.map((order) => {
              const isGroup = order.isGroupOrder
              const groupData = isGroup ? (order as GroupOrder) : null
              const singleData = !isGroup ? (order as SingleOrder) : null
              const studentCount = isGroup ? groupData?.participants.length || 0 : 1

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-3xl border border-[#E9E5EE] bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E9E5EE] bg-[#FAF8FD] p-5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-xl px-3 py-1 text-xs font-black uppercase tracking-wider ${
                          isGroup
                            ? 'bg-[#FFC928] text-[#4B2E83]'
                            : 'bg-[#4B2E83] text-white'
                        }`}
                      >
                        {isGroup ? `?? Group Route #${groupData?.groupCode}` : `Single Drop #${singleData?.id}`}
                      </span>

                      <div className="flex items-center gap-1 text-xs font-bold text-[#4B2E83]">
                        <Users className="h-3.5 w-3.5" />
                        <span>{studentCount} Student{studentCount > 1 ? 's' : ''} Combined</span>
                      </div>
                    </div>

                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-[#4B2E83] capitalize">
                      Status: {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Route & Package Details */}
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Pickup Info */}
                      <div className="rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-4 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6B76] block">
                          1. Pickup Location
                        </span>
                        <p className="font-extrabold text-sm text-[#211F26]">
                          Campus Central Kitchen / Bakery Hub
                        </p>
                        <p className="text-xs text-[#6F6B76]">
                          Packages: <b>{studentCount} Sealed Bag{studentCount > 1 ? 's' : ''}</b>
                        </p>
                      </div>

                      {/* Drop-off Info */}
                      <div className="rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-4 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6B76] block">
                          2. Destination Drop-off
                        </span>
                        <p className="font-extrabold text-sm text-[#211F26] flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-[#4B2E83]" />
                          {order.hostelAddress}
                        </p>
                        <p className="text-xs text-[#6F6B76]">
                          Contact: <b>{isGroup ? groupData?.hostName : singleData?.customerName}</b> (
                          {isGroup ? groupData?.hostPhone : singleData?.customerPhone})
                        </p>
                      </div>
                    </div>

                    {/* Delivery Instructions */}
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                      <b>Instructions: </b>
                      {isGroup
                        ? groupData?.deliveryNote || 'Deliver to hostel reception for group pickup'
                        : singleData?.deliveryInstructions || 'Call on arrival'}
                    </div>

                    {/* Rider Step-by-Step Actions */}
                    <div className="border-t border-[#E9E5EE] pt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-bold text-[#6F6B76]">Rider Actions:</span>

                      <div className="flex flex-wrap items-center gap-2">
                        {order.status !== 'picked_up' && order.status !== 'on_the_way' && order.status !== 'delivered' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'picked_up')}
                            className="flex items-center gap-1.5 rounded-xl bg-[#4B2E83] px-4 py-2.5 text-xs font-black text-white hover:bg-[#371F62] transition shadow"
                          >
                            <Package className="h-3.5 w-3.5" />
                            <span>Confirm Bags Picked Up</span>
                          </button>
                        )}

                        {order.status === 'picked_up' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'on_the_way')}
                            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-black text-white hover:bg-amber-600 transition shadow"
                          >
                            <Navigation className="h-3.5 w-3.5" />
                            <span>Start Route (On The Way)</span>
                          </button>
                        )}

                        {order.status === 'on_the_way' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'delivered')}
                            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-700 transition shadow"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Confirm Delivered to Students</span>
                          </button>
                        )}

                        {order.status === 'delivered' && (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="h-4 w-4" /> Delivered & Completed
                          </span>
                        )}

                        <Link
                          to={`/track/${isGroup ? groupData?.groupCode : singleData?.id}`}
                          className="text-xs font-bold text-[#4B2E83] hover:underline ml-2"
                        >
                          View Tracker ?
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default RiderPortalPage
