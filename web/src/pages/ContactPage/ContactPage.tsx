// src/pages/ContactPage/ContactPage.tsx
import { Phone, MapPin, Clipboard } from 'lucide-react'
import { useState } from 'react'

interface ContactPageProps {
  cartState?: any
}

const ContactPage = ({ cartState }: ContactPageProps) => {
  const phoneNumbers = ['+234 7013639093', '+234 7077014207']
  const [copied, setCopied] = useState('')

  const copyToClipboard = (number: string) => {
    navigator.clipboard.writeText(number)
    setCopied(number)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section
        className="relative pt-24 pb-32 bg-center bg-cover"
        style={{ backgroundImage: "url('/contact.jpg')" }}
      >
        {/* Dark sweet overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative text-center max-w-3xl mx-auto text-white px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg">
            Contact Us
          </h1>

          <p className="text-xl opacity-95 drop-shadow">
            Get in touch with us for orders, questions, or custom requests
          </p>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="min-h-screen bg-gradient-to-b from-[#8B0000] to-[#600000] py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">
                Get in Touch
              </h2>

              <div className="space-y-6">
                {/* Phone Section */}
                <div className="flex items-start">
                  <Phone className="w-6 h-6 mr-4 mt-1 text-[#FFD700]" />
                  <div>
                    <h3 className="font-bold text-white">Phone</h3>

                    {phoneNumbers.map((number) => (
                      <div
                        key={number}
                        className="flex items-center space-x-2 mt-1"
                      >
                        <p className="text-white opacity-90">{number}</p>

                        <button
                          onClick={() => copyToClipboard(number)}
                          className="p-1 bg-white/20 rounded hover:bg-white/30 transition"
                          title="Copy to clipboard"
                        >
                          <Clipboard className="w-4 h-4 text-white" />
                        </button>

                        {copied === number && (
                          <span className="text-green-400 text-sm">
                            Copied!
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Section */}
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 mt-1 text-[#FFD700]" />
                  <div>
                    <h3 className="font-bold text-white">Location</h3>
                    <p className="text-white opacity-90">Shomolu</p>
                    <p className="text-white opacity-90">Lagos</p>
                    <p className="text-white opacity-90">Nigeria</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-4">
                  Business Hours
                </h3>

                <div className="space-y-2 text-white">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">7:00 AM - 11:00 PM</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">7:00 AM - 11:00 PM</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">7:00 AM - 11:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">
                Send us a Message
              </h2>

              <form
                action="https://formspree.io/f/mnjvegkl"
                method="POST"
                className="space-y-6"
              >
                <div>
                  <label className="block mb-2 font-medium text-white">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700]"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-white">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700]"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-white">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700]"
                    placeholder="+234 800 000 0000"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-white">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700]"
                    placeholder="Your message here..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FFD700] text-[#8B0000] px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#FFC107] transition"
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
