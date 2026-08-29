// web/src/pages/AdminPortalPage/AdminPortalPage.tsx
import React, { useState, useEffect } from 'react'
import { Link } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import {
  OrderStore,
  SingleOrder,
  GroupOrder,
  GroupOrderRules,
  DEFAULT_GROUP_RULES,
  OrderStatus,
} from 'src/lib/orderStore'
import {
  ShieldCheck,
  Settings,
  Users,
  TrendingDown,
  MapPin,
  Truck,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
} from 'lucide-react'

const AdminPortalPage = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'rules' | 'locations' | 'analytics'>('orders')
  const [singleOrders, setSingleOrders] = useState<SingleOrder[]>([])
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([])
  const [rules, setRules] = useState<GroupOrderRules>(DEFAULT_GROUP_RULES)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Location form state
  const [newLocName, setNewLocName] = useState('')
  const [newLocZone, setNewLocZone] = useState('Hostel Zone')

  const reloadData = () => {
    setSingleOrders(OrderStore.getSingleOrders())
    setGroupOrders(OrderStore.getGroupOrders())
    setRules(OrderStore.getRules())
  }

  useEffect(() => {
    reloadData()
    const handleUpdate = () => reloadData()
    window.addEventListener('yumzee_store_update', handleUpdate)
    return () => window.removeEventListener('yumzee_store_update', handleUpdate)
  }, [])

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault()
    OrderStore.saveRules(rules)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  const handleToggleLocation = (locId: string) => {
    const updatedLocs = rules.eligibleLocations.map((l) =>
      l.id === locId ? { ...l, active: !l.active } : l
    )
    const newRules = { ...rules, eligibleLocations: updatedLocs }
    setRules(newRules)
    OrderStore.saveRules(newRules)
  }

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLocName.trim()) return

    const newLoc = {
      id: `loc-${Date.now()}`,
      name: newLocName.trim(),
      zone: newLocZone,
      active: true,
    }

    const newRules = {
      ...rules,
      eligibleLocations: [...rules.eligibleLocations, newLoc],
    }

    setRules(newRules)
    OrderStore.saveRules(newRules)
    setNewLocName('')
  }

  const handleCancelOrder = (orderId: string) => {
    if (confirm(`Are you sure you want to cancel Order #${orderId}?`)) {
      OrderStore.updateOrderStatus(orderId, 'cancelled')
    }
  }

  // Analytics calculation
  const totalRevenue =
    singleOrders.reduce((sum, s) => sum + s.totalAmount, 0) +
    groupOrders.reduce((sum, g) => sum + g.grandTotal, 0)

  const totalDeliverySavings = groupOrders.reduce((sum, g) => {
    const originalDelivery = g.baseDeliveryFee * g.participants.length
    const actualDelivery = g.finalDeliveryFee
    return sum + Math.max(0, originalDelivery - actualDelivery)
  }, 0)

  return (
    <div className="min-h-screen bg-[#FAF8FD] py-6">
      <Metadata title="Admin — YumZee" description="Manage orders and rules." />

      <div className="w-full max-w-6xl mx-auto px-2 sm:px-3 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4B2E83] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-black text-[#211F26]">Admin</h1>
          </div>

          {/* Tabs */}
          <div className="flex rounded-2xl border border-[#E9E5EE] bg-white p-1 shadow-sm overflow-x-auto">
            {[
              { key: 'orders', label: 'Orders', icon: Package },
              { key: 'rules', label: 'Rules', icon: Settings },
              { key: 'locations', label: 'Locations', icon: MapPin },
              { key: 'analytics', label: 'Analytics', icon: TrendingDown },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition ${
                  activeTab === tab.key
                    ? 'bg-[#4B2E83] text-white shadow'
                    : 'text-[#6F6B76] hover:text-[#211F26]'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Group Orders */}
            <div className="rounded-2xl border border-[#E9E5EE] bg-white p-3 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E9E5EE] pb-3">
                <Users className="h-4 w-4 text-[#4B2E83]" />
                <h3 className="font-bold text-sm text-[#211F26]">Group Orders ({groupOrders.length})</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#E9E5EE] bg-[#FAF8FD] text-[#6F6B76] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Group Code</th>
                      <th className="p-3">Title & Host</th>
                      <th className="p-3">Hostel Drop</th>
                      <th className="p-3">Students</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E5EE]">
                    {groupOrders.map((grp) => (
                      <tr key={grp.id} className="hover:bg-[#FAF8FD]/80">
                        <td className="p-3 font-mono font-bold text-[#4B2E83]">{grp.groupCode}</td>
                        <td className="p-3">
                          <p className="font-bold text-[#211F26]">{grp.title}</p>
                          <p className="text-[11px] text-[#6F6B76]">Host: {grp.hostName}</p>
                        </td>
                        <td className="p-3 text-[#6F6B76]">{grp.hostelAddress}</td>
                        <td className="p-3 font-bold text-[#211F26]">
                          {grp.participants.length} students
                        </td>
                        <td className="p-3 font-black text-[#4B2E83]">?{grp.grandTotal.toLocaleString()}</td>
                        <td className="p-3">
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            {grp.discountPercent}% Off
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-black text-[#4B2E83] capitalize">
                            {grp.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <Link
                            to={`/group/${grp.groupCode}`}
                            className="rounded-lg bg-[#FAF8FD] border border-[#E9E5EE] px-2.5 py-1 text-[11px] font-bold text-[#4B2E83] hover:bg-gray-100"
                          >
                            Room
                          </Link>
                          {grp.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelOrder(grp.id)}
                              className="rounded-lg bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Single Orders */}
            <div className="rounded-2xl border border-[#E9E5EE] bg-white p-3 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E9E5EE] pb-3">
                <Package className="h-4 w-4 text-[#4B2E83]" />
                <h3 className="font-bold text-sm text-[#211F26]">Single Orders ({singleOrders.length})</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#E9E5EE] bg-[#FAF8FD] text-[#6F6B76] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Location / Room</th>
                      <th className="p-3">Items Count</th>
                      <th className="p-3">Total Paid</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E5EE]">
                    {singleOrders.map((sgl) => (
                      <tr key={sgl.id} className="hover:bg-[#FAF8FD]/80">
                        <td className="p-3 font-mono font-bold text-[#4B2E83]">#{sgl.id}</td>
                        <td className="p-3">
                          <p className="font-bold text-[#211F26]">{sgl.customerName}</p>
                          <p className="text-[11px] text-[#6F6B76]">{sgl.customerPhone}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-[#211F26]">{sgl.hostelAddress}</p>
                          <p className="text-[11px] text-[#6F6B76]">{sgl.roomNumber}</p>
                        </td>
                        <td className="p-3 font-bold text-[#211F26]">{sgl.items.length} items</td>
                        <td className="p-3 font-black text-[#4B2E83]">?{sgl.totalAmount.toLocaleString()}</td>
                        <td className="p-3">
                          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-black text-[#4B2E83] capitalize">
                            {sgl.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <Link
                            to={`/track/${sgl.id}`}
                            className="rounded-lg bg-[#FAF8FD] border border-[#E9E5EE] px-2.5 py-1 text-[11px] font-bold text-[#4B2E83] hover:bg-gray-100"
                          >
                            Track
                          </Link>
                          {sgl.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelOrder(sgl.id)}
                              className="rounded-lg bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RULES */}
        {activeTab === 'rules' && (
          <form onSubmit={handleSaveRules} className="space-y-6">
            <div className="rounded-2xl border border-[#E9E5EE] bg-white p-3 shadow-sm space-y-4">
              <div className="border-b border-[#E9E5EE] pb-3">
                <h3 className="font-bold text-sm text-[#211F26]">Pricing & Discounts</h3>
                <p className="text-xs text-[#6F6B76] mt-1">Changes apply to open groups.</p>
              </div>

              {/* Base Fees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">
                    Standard Single Delivery Fee (?)
                  </label>
                  <input
                    type="number"
                    value={rules.baseDeliveryFee}
                    onChange={(e) => setRules({ ...rules, baseDeliveryFee: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-bold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">
                    Campus Service & Packaging Fee (?)
                  </label>
                  <input
                    type="number"
                    value={rules.serviceFee}
                    onChange={(e) => setRules({ ...rules, serviceFee: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-bold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76] mb-1">
                    Default Deadline Duration (Mins)
                  </label>
                  <input
                    type="number"
                    value={rules.defaultDeadlineMinutes}
                    onChange={(e) => setRules({ ...rules, defaultDeadlineMinutes: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-bold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tiered Discount Rules */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76]">
                  Tiered Student Discount Levels
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {rules.discountTiers.map((tier, idx) => (
                    <div key={idx} className="rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-4 space-y-2">
                      <span className="text-xs font-bold text-[#4B2E83]">
                        Tier {idx + 1}: {tier.minStudents}+ Student{tier.minStudents > 1 ? 's' : ''}
                      </span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tier.discountPercent}
                          onChange={(e) => {
                            const val = Number(e.target.value)
                            const newTiers = [...rules.discountTiers]
                            newTiers[idx] = { ...tier, discountPercent: val }
                            setRules({ ...rules, discountTiers: newTiers })
                          }}
                          className="w-20 rounded-xl border border-[#E9E5EE] bg-white p-2 text-center text-sm font-black text-[#211F26]"
                        />
                        <span className="text-xs font-bold text-[#6F6B76]">% Off</span>
                      </div>
                      <p className="text-[10px] text-[#A09BA8]">{tier.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save */}
              <div className="flex items-center justify-between border-t border-[#E9E5EE] pt-4">
                {savedSuccess ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"><CheckCircle2 className="h-4 w-4" /> Saved</span>
                ) : (
                  <span className="text-xs text-[#6F6B76]">Commit changes.</span>
                )}
                <button type="submit" className="rounded-2xl bg-[#FFC928] px-6 py-3 text-sm font-bold text-[#4B2E83]">Save Rules</button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: LOCATIONS */}
        {activeTab === 'locations' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E9E5EE] bg-white p-3 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-[#211F26]">Add Location</h3>
              <form onSubmit={handleAddLocation} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. King Jaja Hall ? Gate 2"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="flex-1 rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-semibold text-[#211F26] focus:border-[#4B2E83] focus:outline-none"
                />
                <select
                  value={newLocZone}
                  onChange={(e) => setNewLocZone(e.target.value)}
                  className="rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3 text-sm font-semibold text-[#211F26]"
                >
                  <option value="Female Hostel Zone">Female Hostel Zone</option>
                  <option value="Male Hostel Zone">Male Hostel Zone</option>
                  <option value="Hostel Complex">Hostel Complex</option>
                  <option value="Academic Zone">Academic Zone</option>
                </select>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#4B2E83] px-6 py-3 text-xs font-black text-white hover:bg-[#371F62] transition shadow"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Location</span>
                </button>
              </form>
            </div>

            {/* Locations List */}
            <div className="rounded-2xl border border-[#E9E5EE] bg-white p-3 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-[#211F26]">Locations ({rules.eligibleLocations.length})</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rules.eligibleLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className="flex items-center justify-between rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-4"
                  >
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-[#211F26]">{loc.name}</h4>
                      <span className="text-xs text-[#6F6B76]">{loc.zone}</span>
                    </div>

                    <button
                      onClick={() => handleToggleLocation(loc.id)}
                      className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
                        loc.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {loc.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[#E9E5EE] bg-white p-3 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6F6B76]">Revenue</span>
              <div className="text-xl font-bold text-[#4B2E83]">₦{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-[#6F6B76]">Combined orders.</p>
            </div>
            <div className="rounded-2xl border border-emerald-500 bg-emerald-50 p-3 shadow-sm">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">Delivery Savings</span>
              <div className="text-xl font-bold text-emerald-700">₦{totalDeliverySavings.toLocaleString()}</div>
              <p className="text-xs text-emerald-800">Saved via group orders.</p>
            </div>
            <div className="rounded-2xl border border-[#E9E5EE] bg-white p-3 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6F6B76]">Routes</span>
              <div className="text-xl font-bold text-[#211F26]">{singleOrders.length + groupOrders.length}</div>
              <p className="text-xs text-[#6F6B76]">Total orders.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPortalPage
