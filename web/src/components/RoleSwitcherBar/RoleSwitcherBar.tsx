// web/src/components/RoleSwitcherBar/RoleSwitcherBar.tsx
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from '@redwoodjs/router'
import { routes } from '@redwoodjs/router'

import { OrderStore, GroupOrder, SingleOrder } from 'src/lib/orderStore'
import { Users, ChefHat, Bike, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react'

export const RoleSwitcherBar: React.FC = () => {
  const location = useLocation()
  const [activeGroups, setActiveGroups] = useState<GroupOrder[]>([])
  const [singleOrders, setSingleOrders] = useState<SingleOrder[]>([])

  const reloadData = () => {
    const groups = OrderStore.getGroupOrders()
    const singles = OrderStore.getSingleOrders()
    setActiveGroups(groups.filter((g) => g.status !== 'delivered' && g.status !== 'cancelled'))
    setSingleOrders(singles.filter((s) => s.status !== 'delivered' && s.status !== 'cancelled'))
  }

  useEffect(() => {
    reloadData()
    const handleUpdate = () => reloadData()
    window.addEventListener('yumzee_store_update', handleUpdate)
    return () => window.removeEventListener('yumzee_store_update', handleUpdate)
  }, [])

  const sampleGroup = activeGroups[0] || OrderStore.getGroupOrders()[0]

  return (
    <div className="border-b border-[#371F62] bg-[#2A154D] text-white text-xs py-2 px-3 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-extrabold text-[#FFC928] uppercase tracking-wider bg-[#FFC928]/20 px-2 py-0.5 rounded-md border border-[#FFC928]/40">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Demo Bar
          </span>
          <span className="hidden sm:inline text-white/70">Test full ecosystem:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Student / Storefront */}
          <Link
            to={routes.home()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${location.pathname === '/' || location.pathname === '/checkout'
              ? 'bg-[#FFC928] text-[#4B2E83] shadow'
              : 'bg-white/10 hover:bg-white/20 text-white/90'
              }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Student Store</span>
          </Link>

          {/* Group Order Room */}
          <Link
            to={sampleGroup ? `/group/${sampleGroup.groupCode}` : routes.createGroupOrder()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${location.pathname.startsWith('/group')
              ? 'bg-[#FFC928] text-[#4B2E83] shadow'
              : 'bg-white/10 hover:bg-white/20 text-white/90'
              }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Group Room</span>
            {activeGroups.length > 0 && (
              <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {activeGroups.length} Active
              </span>
            )}
          </Link>

          {/* Seller Portal */}
          <Link
            to="/seller"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${location.pathname === '/seller'
              ? 'bg-[#FFC928] text-[#4B2E83] shadow'
              : 'bg-white/10 hover:bg-white/20 text-white/90'
              }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Seller Kitchen</span>
          </Link>

          {/* Rider Portal */}
          <Link
            to="/rider"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${location.pathname === '/rider'
              ? 'bg-[#FFC928] text-[#4B2E83] shadow'
              : 'bg-white/10 hover:bg-white/20 text-white/90'
              }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Rider Dispatch</span>
          </Link>

          {/* Admin Control Center */}
          <Link
            to="/admin"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${location.pathname === '/admin'
              ? 'bg-[#FFC928] text-[#4B2E83] shadow'
              : 'bg-white/10 hover:bg-white/20 text-white/90'
              }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Rules</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RoleSwitcherBar
