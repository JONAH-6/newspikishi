// src/pages/ContactPage/ContactPage.tsx
import { useState } from 'react'

import { Phone, MapPin, Clipboard, Check, Mail } from 'lucide-react'

import { Metadata } from '@redwoodjs/web'

const ContactPage = () => {
  const phoneNumbers = ['+234 7013639093', '+234 7077014207']
  const [copied, setCopied] = useState('')

  const copyToClipboard = (number: string) => {
    navigator.clipboard.writeText(number)
    setCopied(number)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <>
      <Metadata
        title="Contact Us"
        description="Get in touch with the YumZee campus team"
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4B2E83] via-[#3A2366] to-[#251543] py-20 text-white">
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Contact <span className="text-[#FFC928]">YumZee</span>
          </h1>

          <p className="text-lg opacity-90">
            Have questions, catering requests, or need instant food drop
            assistance on your campus?
          </p>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="min-h-screen bg-[#FBF9FE] py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="rounded-3xl border border-[#E9E5EE] bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-extrabold text-[#211F26]">
                Get in Touch
              </h2>

              <div className="space-y-6">
                {/* Phone Section */}
                <div className="flex items-start">
                  <div className="mr-4 rounded-2xl bg-[#F5F1FB] p-3 text-[#4B2E83]">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#211F26]">
                      Direct Hotline & WhatsApp
                    </h3>

                    {phoneNumbers.map((number) => (
                      <div
                        key={number}
                        className="mt-2 flex items-center space-x-2"
                      >
                        <p className="font-medium text-[#6F6B76]">{number}</p>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(number)}
                          className="rounded-lg bg-[#F5F1FB] p-1.5 text-[#4B2E83] transition hover:bg-[#E9E5EE]"
                          title="Copy to clipboard"
                        >
                          <Clipboard className="h-3.5 w-3.5" />
                        </button>

                        {copied === number && (
                          <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                            <Check className="h-3 w-3" /> Copied!
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Section */}
                <div className="flex items-start">
                  <div className="mr-4 rounded-2xl bg-[#F5F1FB] p-3 text-[#4B2E83]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#211F26]">Email Support</h3>
                    <p className="mt-1 font-medium text-[#6F6B76]">
                      support@yumzee.com
                    </p>
                  </div>
                </div>

                {/* Location Section */}
                <div className="flex items-start">
                  <div className="mr-4 rounded-2xl bg-[#F5F1FB] p-3 text-[#4B2E83]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#211F26]">
                      Campus Hub Location
                    </h3>
                    <p className="mt-1 font-medium text-[#6F6B76]">
                      Shomolu / Akoka, Lagos State, Nigeria
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-10 border-t border-[#E9E5EE] pt-6">
                <h3 className="mb-4 text-lg font-bold text-[#211F26]">
                  Kitchen Operating Hours
                </h3>

                <div className="space-y-2 text-sm text-[#6F6B76]">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold text-[#211F26]">
                      7:00 AM - 11:00 PM
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold text-[#211F26]">
                      8:00 AM - 11:00 PM
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold text-[#211F26]">
                      8:00 AM - 11:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-3xl border border-[#E9E5EE] bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-extrabold text-[#211F26]">
                Send us a Message
              </h2>

              <form
                action="https://formspree.io/f/mnjvegkl"
                method="POST"
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#211F26]"
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] px-4 py-3 text-sm text-[#211F26] placeholder-[#6F6B76]/50 focus:border-[#4B2E83] focus:outline-none"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#211F26]"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] px-4 py-3 text-sm text-[#211F26] placeholder-[#6F6B76]/50 focus:border-[#4B2E83] focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#211F26]"
                  >
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] px-4 py-3 text-sm text-[#211F26] placeholder-[#6F6B76]/50 focus:border-[#4B2E83] focus:outline-none"
                    placeholder="+234 800 000 0000"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#211F26]"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    className="w-full rounded-2xl border border-[#E9E5EE] bg-[#FAF8FD] px-4 py-3 text-sm text-[#211F26] placeholder-[#6F6B76]/50 focus:border-[#4B2E83] focus:outline-none"
                    placeholder="Your message here..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#FFC928] px-8 py-3.5 text-base font-bold text-[#4B2E83] shadow-md transition hover:bg-[#E5B420] active:scale-95"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactPage
