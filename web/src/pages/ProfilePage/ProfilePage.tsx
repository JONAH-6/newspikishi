// web/src/pages/ProfilePage/ProfilePage.tsx
import { useState } from 'react'

import {
  MapPin,
  Phone,
  Mail,
  School,
  Building,
  Save,
  Check,
  ShieldCheck,
  LogOut,
  AlertTriangle,
} from 'lucide-react'

import { Metadata } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/contexts/AuthContexts'

const ProfilePage = () => {
  const { user, logOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logOut()
      navigate(routes.login())
    } catch (e) {
      console.error('Logout failed', e)
      setIsLoggingOut(false)
    }
  }

  const [campus, setCampus] = useState('University of Lagos (UNILAG)')
  const [hostel, setHostel] = useState('New Hall, Block B, Room 304')
  const [phone, setPhone] = useState('08012345678')
  const [deliveryNotes, setDeliveryNotes] = useState(
    'Please call when you reach the gate security.'
  )
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  const getUserDisplayName = () => {
    if (!user) return 'Student'
    if (user.displayName) return user.displayName
    if (user.email) return user.email.split('@')[0]
    return 'Student'
  }

  return (
    <div className="min-h-screen bg-[#FBF9FE] py-8">
      <Metadata
        title="Student Profile"
        description="Manage your delivery details"
      />

      <div className="container mx-auto max-w-3xl space-y-6 px-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#211F26]">
            Campus Profile & Delivery
          </h1>
          <p className="mt-1 text-sm text-[#6F6B76]">
            Keep your hostel address and contact number up to date for swift
            food delivery.
          </p>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-4 rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Avatar"
              className="h-16 w-16 rounded-full border-2 border-[#4B2E83] object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4B2E83] text-2xl font-bold text-[#FFC928]">
              {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
            </div>
          )}

          <div>
            <h2 className="text-xl font-extrabold text-[#211F26]">
              {getUserDisplayName()}
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#6F6B76]">
              <Mail className="h-3.5 w-3.5 text-[#4B2E83]" />
              {user?.email || 'student@university.edu.ng'}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified Google Account
            </span>
          </div>
        </div>

        {/* Form Details */}
        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-3xl border border-[#E9E5EE] bg-white p-6 shadow-sm md:p-8"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="campus-select"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#211F26]"
              >
                University Campus
              </label>
              <div className="relative">
                <School className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6B76]" />
                <select
                  id="campus-select"
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] py-3 pl-10 pr-4 text-sm font-medium text-[#211F26] focus:outline-none focus:ring-2 focus:ring-[#4B2E83]/20"
                >
                  <option value="University of Lagos (UNILAG)">
                    University of Lagos (UNILAG)
                  </option>
                  <option value="Lagos State University (LASU)">
                    Lagos State University (LASU)
                  </option>
                  <option value="University of Benin (UNIBEN)">
                    University of Benin (UNIBEN)
                  </option>
                  <option value="University of Nigeria (UNN)">
                    University of Nigeria (UNN)
                  </option>
                  <option value="Covenant University">
                    Covenant University
                  </option>
                  <option value="Babcock University">Babcock University</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="hostel-input"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#211F26]"
              >
                Hostel / Hall & Room Number
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6B76]" />
                <input
                  id="hostel-input"
                  type="text"
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  placeholder="e.g. Moremi Hall, Room 212"
                  required
                  className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] py-3 pl-10 pr-4 text-sm font-medium text-[#211F26] focus:outline-none focus:ring-2 focus:ring-[#4B2E83]/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone-input"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#211F26]"
              >
                WhatsApp Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6B76]" />
                <input
                  id="phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 08012345678"
                  required
                  className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] py-3 pl-10 pr-4 text-sm font-medium text-[#211F26] focus:outline-none focus:ring-2 focus:ring-[#4B2E83]/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="notes-input"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#211F26]"
              >
                Delivery Notes (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-[#6F6B76]" />
                <textarea
                  id="notes-input"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  rows={3}
                  placeholder="Special instructions for rider..."
                  className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] py-3 pl-10 pr-4 text-sm font-medium text-[#211F26] focus:outline-none focus:ring-2 focus:ring-[#4B2E83]/20"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#E9E5EE] pt-4 gap-3">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 hover:border-red-300 transition active:scale-95 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? 'Logging out…' : 'Log Out'}</span>
            </button>

            <button
              type="submit"
              className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold shadow-md transition active:scale-95 ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FFC928] text-[#4B2E83] hover:bg-[#E5B420]'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Saved Successfully!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Logout helper - visible even when not editing */}
        <div className="rounded-2xl border border-[#E9E5EE] bg-white p-4 flex items-start gap-3">
          <div className="rounded-xl bg-red-50 p-2 text-red-600 border border-red-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-[#211F26]">Need to switch account?</h4>
            <p className="text-xs text-[#6F6B76] mt-1">Logging out will clear your session and return you to the login screen. Your bag and hostel details stay saved.</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="shrink-0 rounded-xl bg-[#211F26] px-4 py-2 text-xs font-bold text-white hover:bg-black transition disabled:opacity-50"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
