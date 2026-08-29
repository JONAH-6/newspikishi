// web/src/pages/SettingsPage/SettingsPage.tsx
import { useState } from 'react'

import { Bell, Shield, LogOut, Check } from 'lucide-react'

import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/contexts/AuthContexts'

const SettingsPage = () => {
  const { logOut, user } = useAuth()
  const [orderAlerts, setOrderAlerts] = useState(true)
  const [promoAlerts, setPromoAlerts] = useState(true)
  const [whatsappReceipts, setWhatsappReceipts] = useState(true)
  const [savedToast, setSavedToast] = useState(false)

  const handleLogout = async () => {
    await logOut()
    navigate(routes.home())
  }

  const handleToggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prev) => !prev)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#FBF9FE] py-6">
      <Metadata title="Settings — YumZee" description="Manage your preferences" />

      <div className="container mx-auto max-w-3xl space-y-6 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#211F26]">Settings</h1>
            <p className="mt-1 text-xs text-[#6F6B76]">Notifications and account.</p>
          </div>

          {savedToast && (
            <span className="animate-in fade-in inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <Check className="h-3.5 w-3.5" /> Preferences updated
            </span>
          )}
        </div>

        {/* Notifications Card */}
        <div className="space-y-4 rounded-3xl border border-[#E9E5EE] bg-white p-4 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-black text-[#211F26]">
            <Bell className="h-4 w-4 text-[#4B2E83]" /> Notifications
          </h2>

          <div className="space-y-4 divide-y divide-[#E9E5EE]">
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-sm font-bold text-[#211F26]">Order updates</p>
                <p className="text-xs text-[#6F6B76]">Get updates when your order moves.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setOrderAlerts)}
                className={`flex h-6 w-12 items-center rounded-full p-1 transition duration-200 ${
                  orderAlerts ? 'bg-[#4B2E83]' : 'bg-gray-300'
                }`}
                aria-label="Toggle order alerts"
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ${
                    orderAlerts ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-sm font-bold text-[#211F26]">WhatsApp receipts</p>
                <p className="text-xs text-[#6F6B76]">Get confirmations on WhatsApp.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setWhatsappReceipts)}
                className={`flex h-6 w-12 items-center rounded-full p-1 transition duration-200 ${
                  whatsappReceipts ? 'bg-[#4B2E83]' : 'bg-gray-300'
                }`}
                aria-label="Toggle whatsapp receipts"
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ${
                    whatsappReceipts ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-sm font-bold text-[#211F26]">Deals & discounts</p>
                <p className="text-xs text-[#6F6B76]">Get combo and discount alerts.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setPromoAlerts)}
                className={`flex h-6 w-12 items-center rounded-full p-1 transition duration-200 ${
                  promoAlerts ? 'bg-[#4B2E83]' : 'bg-gray-300'
                }`}
                aria-label="Toggle promo alerts"
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ${
                    promoAlerts ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security & Account Card */}
        <div className="space-y-4 rounded-3xl border border-[#E9E5EE] bg-white p-4 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-black text-[#211F26]">
            <Shield className="h-4 w-4 text-[#4B2E83]" /> Account
          </h2>

          <div className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold text-[#211F26]">Logged in as</p>
              <p className="text-xs text-[#6F6B76]">
                {user?.email || 'Student Account'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 self-start rounded-xl bg-red-50 px-5 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 sm:self-auto"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out of YumZee</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
