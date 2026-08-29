// web/src/pages/OrdersPage/OrdersPage.tsx
import React, { useState, useEffect } from 'react'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useCart } from 'src/components/CartContext/CartContext'
import {
  OrderStore,
  SingleOrder,
  GroupOrder,
  OrderStatus,
} from 'src/lib/orderStore'
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  MapPin,
  Repeat,
  ArrowRight,
  Users,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

const OrdersPage = () => {
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState<'all' | 'single' | 'group'>('all')
  const [singleOrders, setSingleOrders] = useState<SingleOrder[]>([])
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([])
  const [reorderedId, setReorderedId] = useState<string | null>(null)

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

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'on_the_way':
      case 'picked_up':
      case 'rider_assigned':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4B2E83]/20 bg-[#4B2E83]/10 px-2.5 py-1 text-xs font-bold text-[#4B2E83]">
            <Truck className="h-3.5 w-3.5" /> On the way
          </span>
        )
      case 'preparing':
      case 'ready_for_pickup':
      case 'sent_to_sellers':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
            <Clock className="h-3.5 w-3.5" /> Preparing
          </span>
        )
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" /> Delivered
          </span>
        )
      case 'created':
      case 'payment_confirmed':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">
            <Package className="h-3.5 w-3.5" /> Placed
          </span>
        )
    }
  }

  const handleReorderSingle = (order: SingleOrder) => {
    order.items.forEach((item) => {
      addToCart({
        id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
      }, item.quantity)
    })
    setReorderedId(order.id)
    setTimeout(() => setReorderedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#FAF8FD] py-6">
      <Metadata title="Orders — YumZee" description="Track your orders." />

      <div className="container mx-auto max-w-4xl space-y-6 px-4">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-bold text-[#211F26]">Orders</h1>
            <p className="mt-1 text-xs text-[#6F6B76]">Your orders and group orders.</p>
          </div>

          <div className="flex rounded-2xl border border-[#E9E5EE] bg-white p-1 shadow-sm">
            {(['all', 'single', 'group'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition ${
                  activeTab === tab
                    ? 'bg-[#4B2E83] text-white shadow'
                    : 'text-[#6F6B76] hover:text-[#211F26]'
                }`}
              >
                {tab === 'all' ? 'All Orders' : tab === 'single' ? 'Single Orders' : 'Group Orders'}
              </button>
            ))}
          </div>
        </div>

        {/* GROUP ORDERS SECTION */}
        {(activeTab === 'all' || activeTab === 'group') && groupOrders.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#4B2E83]" />
              <h2 className="text-sm font-black text-[#211F26]">Group Orders</h2>
            </div>

            <div className="space-y-4">
              {groupOrders.map((grp) => (
                <div
                  key={grp.id}
                  className="rounded-2xl border border-[#E9E5EE] bg-white p-3 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E9E5EE] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-[#FFC928] p-2.5 text-[#4B2E83] font-bold">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-black text-[#211F26]">{grp.title}</p>
                          <span className="font-mono text-[11px] font-black bg-[#4B2E83] text-white px-2 py-0.5 rounded">
                            {grp.groupCode}
                          </span>
                        </div>
                        <p className="text-xs text-[#6F6B76]">
                          Host: {grp.hostName} ? {grp.participants.length} Students Joined
                        </p>
                      </div>
                    </div>

                    <div>{getStatusBadge(grp.status)}</div>
                  </div>

                  {/* Summary & Destination */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                    <div className="flex items-center gap-2 text-xs text-[#6F6B76]">
                      <MapPin className="h-4 w-4 text-[#4B2E83] shrink-0" />
                      <span>{grp.hostelAddress}</span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <span className="block text-[11px] text-[#6F6B76]">Group Total</span>
                        <span className="text-base font-black text-[#4B2E83]">
                          ?{grp.grandTotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/group/${grp.groupCode}`}
                          className="rounded-xl bg-[#FAF8FD] border border-[#E9E5EE] px-4 py-2 text-xs font-bold text-[#4B2E83] hover:bg-gray-100 transition"
                        >
                          Group Room
                        </Link>
                        <Link
                          to={`/track/${grp.groupCode}`}
                          className="rounded-xl bg-[#4B2E83] px-4 py-2 text-xs font-bold text-white hover:bg-[#371F62] transition shadow"
                        >
                          Track Delivery
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SINGLE ORDERS SECTION */}
        {(activeTab === 'all' || activeTab === 'single') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[#4B2E83]" />
              <h2 className="text-sm font-black text-[#211F26]">Single Orders</h2>
            </div>

            {singleOrders.length === 0 ? (
              <div className="rounded-2xl border border-[#E9E5EE] bg-white p-6 text-center shadow-sm">
                <ShoppingBag className="mx-auto h-10 w-10 text-[#6F6B76]/40 mb-2" />
                <h3 className="text-sm font-bold text-[#211F26]">No orders yet</h3>
                <p className="text-xs text-[#6F6B76] mt-1">Browse snacks to place an order.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {singleOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-[#E9E5EE] bg-white p-3 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E9E5EE] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-[#F5F1FB] p-2.5 text-[#4B2E83]">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-extrabold text-[#211F26]">Order #{order.id}</p>
                          <p className="text-xs text-[#6F6B76]">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div>{getStatusBadge(order.status)}</div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 py-4">
                      {order.items.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#211F26]">
                            {item.quantity}? {item.name}
                          </span>
                          <span className="font-semibold text-[#4B2E83]">
                            ?{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#E9E5EE] pt-4">
                      <div className="flex items-center gap-2 text-xs text-[#6F6B76]">
                        <MapPin className="h-4 w-4 text-[#4B2E83] shrink-0" />
                        <span>{order.hostelAddress}</span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <span className="block text-[11px] text-[#6F6B76]">Total</span>
                          <span className="text-lg font-black text-[#4B2E83]">
                            ?{order.totalAmount.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReorderSingle(order)}
                            className="flex items-center gap-1 rounded-xl bg-[#FFC928] px-4 py-2 text-xs font-bold text-[#4B2E83] hover:bg-[#E5B420] transition"
                          >
                            <Repeat className="h-3.5 w-3.5" />
                            <span>{reorderedId === order.id ? 'Added!' : 'Re-Order'}</span>
                          </button>
                          <Link
                            to={`/track/${order.id}`}
                            className="rounded-xl bg-[#4B2E83] px-4 py-2 text-xs font-bold text-white hover:bg-[#371F62] transition shadow"
                          >
                            Track Live
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
