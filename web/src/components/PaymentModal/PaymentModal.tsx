// web/src/components/PaymentModal/PaymentModal.tsx
import React, { useState } from 'react'
import { X, CreditCard, Building2, Wallet, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Loader2 } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  amount: number
  orderTitle?: string
  description?: string
  studentName?: string
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  orderTitle = 'YumZee Food Order',
  description = 'Direct campus snack payment',
  studentName,
}) => {
  const [method, setMethod] = useState<'transfer' | 'card' | 'wallet'>('transfer')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [cardNumber, setCardNumber] = useState('5399 ???? ???? 8492')
  const [cardExpiry, setCardExpiry] = useState('08/28')
  const [cardCvv, setCardCvv] = useState('382')

  if (!isOpen) return null

  const handlePay = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
      setTimeout(() => {
        setIsComplete(false)
        onSuccess()
      }, 1200)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#E9E5EE]">
        {/* Header */}
        <div className="bg-[#4B2E83] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFC928]">
                Secure Campus Checkout
              </span>
              <h3 className="text-xl font-extrabold">{orderTitle}</h3>
              {studentName && <p className="text-xs text-white/80">Paying for: {studentName}</p>}
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-baseline justify-between rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <span className="text-xs text-white/80">Total to Pay</span>
            <span className="text-2xl font-black text-[#FFC928]">
              ?{amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {isComplete ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h4 className="text-xl font-extrabold text-[#211F26]">Payment Confirmed!</h4>
              <p className="text-xs text-[#6F6B76]">Your receipt has been issued and order dispatched.</p>
            </div>
          ) : (
            <>
              {/* Payment Method Switcher */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('transfer')}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                    method === 'transfer'
                      ? 'border-[#4B2E83] bg-[#F5F1FB] text-[#4B2E83] shadow-sm'
                      : 'border-[#E9E5EE] bg-white text-[#6F6B76] hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  <span>Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                    method === 'card'
                      ? 'border-[#4B2E83] bg-[#F5F1FB] text-[#4B2E83] shadow-sm'
                      : 'border-[#E9E5EE] bg-white text-[#6F6B76] hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('wallet')}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                    method === 'wallet'
                      ? 'border-[#4B2E83] bg-[#F5F1FB] text-[#4B2E83] shadow-sm'
                      : 'border-[#E9E5EE] bg-white text-[#6F6B76] hover:bg-gray-50'
                  }`}
                >
                  <Wallet className="h-4 w-4" />
                  <span>YumZee Wallet</span>
                </button>
              </div>

              {/* Method Details */}
              {method === 'transfer' && (
                <div className="rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F6B76]">Bank Name:</span>
                    <span className="font-bold text-[#211F26]">Moniepoint MFB / YumZee</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F6B76]">Account Number:</span>
                    <span className="font-mono text-base font-black text-[#4B2E83] tracking-wider">
                      812 900 1122
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F6B76]">Beneficiary:</span>
                    <span className="font-bold text-[#211F26]">YumZee Student Orders</span>
                  </div>
                  <p className="text-[11px] text-[#6F6B76] border-t border-[#E9E5EE] pt-2">
                    ? Transfer exactly <b>?{amount.toLocaleString()}</b>. Payment verifies automatically within 5 seconds.
                  </p>
                </div>
              )}

              {method === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#6F6B76]">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E9E5EE] px-3.5 py-2.5 text-sm font-semibold text-[#211F26]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#6F6B76]">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#E9E5EE] px-3.5 py-2.5 text-sm font-semibold text-[#211F26]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#6F6B76]">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#E9E5EE] px-3.5 py-2.5 text-sm font-semibold text-[#211F26]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === 'wallet' && (
                <div className="rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] p-4 space-y-2 text-center">
                  <span className="text-xs text-[#6F6B76]">Available YumZee Wallet Balance</span>
                  <div className="text-2xl font-black text-emerald-600">?15,400</div>
                  <p className="text-[11px] text-[#6F6B76]">
                    Instant student checkout with 0 transaction fees.
                  </p>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FFC928] py-4 text-base font-extrabold text-[#4B2E83] shadow-lg transition hover:bg-[#E5B420] active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Verifying Payment...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    <span>Confirm & Pay ?{amount.toLocaleString()}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-[#6F6B76]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>256-Bit Encrypted Campus Escrow Guarantee</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
