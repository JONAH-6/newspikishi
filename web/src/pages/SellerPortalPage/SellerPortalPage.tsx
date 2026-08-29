// web/src/pages/SellerPortalPage/SellerPortalPage.tsx
import React, { useState, useEffect } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import {
  OrderStore,
  SingleOrder,
  GroupOrder,
  OrderStatus,
} from 'src/lib/orderStore'
import {
  ChefHat,
  Package,
  Clock,
  CheckCircle2,
  Users,
  Utensils,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Tag,
} from 'lucide-react'

const SellerPortalPage = () => {
  const [singleOrders, setSingleOrders] = useState<SingleOrder[]>([])
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all')

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
    OrderStore.updateOrderStatus(id, newStatus)
  }

  // Combine all orders for queue
  const allOrders = [
    ...groupOrders.map((g) => ({ ...g, isGroupOrder: true as const })),
    ...singleOrders.map((s) => ({ ...s, isGroupOrder: false as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const filteredOrders = allOrders.filter((order) => {
    if (filter === 'pending') return order.status === 'created' || order.status === 'payment_confirmed' || order.status === 'sent_to_sellers'
    if (filter === 'preparing') return order.status === 'preparing'
    if (filter === 'ready') return order.status === 'ready_for_pickup' || order.status === 'rider_assigned' || order.status === 'picked_up'
    return true
  })

  // Helper to aggregate items for group orders
  const getAggregatedGroupItems = (group: GroupOrder) => {
    const map: Record<string, { name: string; quantity: number; image: string }> = {}
    group.participants.forEach((p) => {
      p.items.forEach((item) => {
        if (!map[item.name]) {
          map[item.name] = { name: item.name, quantity: 0, image: item.image }
        }
        map[item.name].quantity += item.quantity
      })
    })
    return Object.values(map)
  }

  return (
    <div className="min-h-screen bg-[#FAF8FD] py-6">
      <Metadata title="Kitchen — YumZee" description="Prepare orders." />

      <div className="w-full max-w-6xl mx-auto px-2 sm:px-3 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4B2E83] text-white">
              <ChefHat className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-black text-[#211F26]">Kitchen</h1>
          </div>

          {/* Filter */}
          <div className="flex rounded-2xl border border-[#E9E5EE] bg-white p-1 shadow-sm">
            {(['all', 'pending', 'preparing', 'ready'] as const).map((tab) => (
              <button key={tab} onClick={() => setFilter(tab)} className={`rounded-xl px-4 py-2 text-xs font-bold capitalize ${filter===tab ? 'bg-[#4B2E83] text-white' : 'text-[#6F6B76]'}`}>{tab}</button>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-[#E9E5EE] bg-white p-6 text-center shadow-sm">
              <Utensils className="mx-auto h-10 w-10 text-[#6F6B76]/40 mb-2" />
              <h3 className="text-sm font-bold text-[#211F26]">No orders</h3>
              <p className="text-xs text-[#6F6B76] mt-1">New orders will appear here.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isGroup = order.isGroupOrder
              const groupData = isGroup ? (order as GroupOrder) : null
              const singleData = !isGroup ? (order as SingleOrder) : null
              const aggregatedItems = isGroup && groupData ? getAggregatedGroupItems(groupData) : []

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-[#E9E5EE] bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E9E5EE] bg-[#FAF8FD] p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-xl px-3 py-1 text-xs font-black uppercase tracking-wider ${
                          isGroup
                            ? 'bg-[#4B2E83] text-[#FFC928]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isGroup ? `GROUP ORDER #${groupData?.groupCode}` : `SINGLE ORDER #${singleData?.id}`}
                      </span>

                      <div className="flex items-center gap-2 text-xs text-[#6F6B76]">
                        <MapPin className="h-3.5 w-3.5 text-[#4B2E83]" />
                        <span className="font-semibold text-[#211F26]">{order.hostelAddress}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#6F6B76]">Status:</span>
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-[#4B2E83] capitalize">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-4 space-y-4">
                    {isGroup && groupData ? (
                      /* GROUP ORDER PREP MATRIX */
                      <div className="space-y-4">
                        {/* Prep List */}
                        <div className="rounded-xl border border-[#E9E5EE] bg-[#FAF8FD] p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#4B2E83]">Prep list — {aggregatedItems.length} items</span>
                            <span className="text-xs font-bold text-[#4B2E83]">{groupData.participants.length} bags</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {aggregatedItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="rounded-xl border border-[#E9E5EE] bg-white p-3 shadow-sm flex items-center gap-3"
                              >
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4B2E83] text-white font-black text-sm">
                                  {item.quantity}?
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-[#211F26] line-clamp-1">{item.name}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bag Labels */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-[#6F6B76]">Bag labels:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {groupData.participants.map((p, idx) => (
                              <div
                                key={p.id}
                                className="rounded-xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-xs space-y-1.5"
                              >
                                <div className="flex justify-between font-bold text-[#211F26] border-b border-[#E9E5EE] pb-1">
                                  <span>Bag #{idx + 1}: {p.name}</span>
                                  <span className="text-[#4B2E83]">{p.roomOrHostel || 'Drop'}</span>
                                </div>
                                <div className="space-y-0.5 text-[#6F6B76]">
                                  {p.items.map((i) => (
                                    <div key={i.productId} className="flex justify-between">
                                      <span>{i.quantity}? {i.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* SINGLE ORDER PREP */
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#6F6B76]">
                          <span>Customer: <b>{singleData?.customerName}</b> ({singleData?.customerPhone})</span>
                          <span>Room: <b>{singleData?.roomNumber || 'Gate Drop'}</b></span>
                        </div>

                        <div className="divide-y divide-[#E9E5EE] border-t border-[#E9E5EE] pt-2">
                          {singleData?.items.map((item) => (
                            <div key={item.productId} className="flex items-center justify-between py-2 text-xs">
                              <span className="font-bold text-[#211F26]">{item.quantity}? {item.name}</span>
                              <span className="text-[#4B2E83] font-semibold">?{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Workflow Buttons */}
                    <div className="border-t border-[#E9E5EE] pt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-[#6F6B76]">Kitchen Workflow Controls:</span>

                      <div className="flex flex-wrap items-center gap-2">
                        {order.status !== 'preparing' && order.status !== 'ready_for_pickup' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'preparing')}
                            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-white hover:bg-amber-600 transition shadow-sm"
                          >
                            <Clock className="h-3.5 w-3.5" />
                            <span>Start Preparing</span>
                          </button>
                        )}

                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'ready_for_pickup')}
                            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700 transition shadow-sm"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Mark All Ready for Pickup</span>
                          </button>
                        )}

                        <Link
                          to={`/track/${isGroup ? groupData?.groupCode : singleData?.id}`}
                          className="flex items-center gap-1 text-xs font-bold text-[#4B2E83] hover:underline"
                        >
                          <span>View Live Tracker</span>
                          <ArrowRight className="h-3.5 w-3.5" />
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

export default SellerPortalPage
