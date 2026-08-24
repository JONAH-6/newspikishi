// web/src/components/JoinGroupModal/JoinGroupModal.tsx
import React, { useState, useEffect } from 'react'
import { navigate, routes } from '@redwoodjs/router'
import { OrderStore, GroupOrder } from 'src/lib/orderStore'
import { X, Users, ArrowRight, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react'

interface JoinGroupModalProps {
  isOpen: boolean
  onClose: () => void
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [activeGroups, setActiveGroups] = useState<GroupOrder[]>([])

  useEffect(() => {
    if (isOpen) {
      const groups = OrderStore.getGroupOrders().filter(
        (g) => !g.isLocked && new Date(g.deadline).getTime() > Date.now()
      )
      setActiveGroups(groups)
      setError('')
      setCode('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCode = code.trim().toUpperCase()
    if (!cleanCode) {
      setError('Please enter a valid Group Code')
      return
    }

    const group = OrderStore.getGroupOrderByCode(cleanCode)
    if (!group) {
      setError(`No active group found with code "${cleanCode}". Please check and try again.`)
      return
    }

    if (group.isLocked || new Date(group.deadline).getTime() < Date.now()) {
      setError('This group order has already closed.')
      return
    }

    onClose()
    navigate(`/group/${group.groupCode}`)
  }

  const handleSelectGroup = (groupCode: string) => {
    onClose()
    navigate(`/group/${groupCode}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#E9E5EE]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#4B2E83] to-[#371F62] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFC928] text-[#4B2E83] font-bold">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Join a Group Order</h3>
                <p className="text-xs text-white/80">Order together, share delivery, and unlock discounts!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Code Input Form */}
          <form onSubmit={handleJoinByCode} className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6B76]">
              Enter 6-Character Group Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. YUM-7842"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase())
                  setError('')
                }}
                className="flex-1 rounded-2xl border-2 border-[#E9E5EE] px-4 py-3 text-base font-bold uppercase tracking-widest text-[#211F26] placeholder-[#A09BA8] focus:border-[#4B2E83] focus:outline-none focus:ring-2 focus:ring-[#4B2E83]/20"
                maxLength={10}
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC928] px-6 py-3 font-bold text-[#4B2E83] shadow-md transition hover:bg-[#E5B420] active:scale-95"
              >
                <span>Join</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {error && (
              <p className="text-xs font-semibold text-rose-600 animate-shake">{error}</p>
            )}
          </form>

          {/* Active Campus Groups */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6F6B76]">
                Or Join Open Campus Drops ({activeGroups.length})
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <Sparkles className="h-3 w-3" /> Live Now
              </span>
            </div>

            {activeGroups.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E9E5EE] bg-[#FAF8FD] p-6 text-center">
                <p className="text-sm font-semibold text-[#6F6B76]">No other open groups at the moment.</p>
                <p className="mt-1 text-xs text-[#A09BA8]">Be the host! Start one and invite your hostel friends.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {activeGroups.map((group) => {
                  const minutesLeft = Math.max(
                    0,
                    Math.round((new Date(group.deadline).getTime() - Date.now()) / 60000)
                  )
                  return (
                    <div
                      key={group.id}
                      onClick={() => handleSelectGroup(group.groupCode)}
                      className="group flex cursor-pointer items-center justify-between rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-3.5 transition duration-150 hover:border-[#4B2E83] hover:bg-[#F5F1FB] hover:shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-[#4B2E83] px-2 py-0.5 text-[11px] font-bold text-white">
                            {group.groupCode}
                          </span>
                          <h4 className="text-sm font-bold text-[#211F26] group-hover:text-[#4B2E83]">
                            {group.title}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6F6B76]">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#4B2E83]" />
                            {group.hostelAddress}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-[#E5B420]" />
                            {group.participants.length} joined
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-amber-700">
                            <Clock className="h-3 w-3" />
                            {minutesLeft}m left
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4B2E83] group-hover:translate-x-1 transition">
                          Join <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#E9E5EE] bg-[#FAF8FD] px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-[#6F6B76]">Want to start your own hostel order?</span>
          <button
            onClick={() => {
              onClose()
              navigate(routes.createGroupOrder())
            }}
            className="rounded-xl bg-[#4B2E83] px-4 py-2 text-xs font-bold text-white hover:bg-[#371F62] transition"
          >
            Create New Group
          </button>
        </div>
      </div>
    </div>
  )
}

export default JoinGroupModal
