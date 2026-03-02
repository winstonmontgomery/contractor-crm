"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    content: "123 Congress Ave, Suite 500\nAustin, TX 78701",
  },
  {
    icon: Phone,
    title: "Phone",
    content: "(512) 555-1234",
    href: "tel:+15125551234",
  },
  {
    icon: Mail,
    title: "Email",
    content: "hello@contractorverified.com",
    href: "mailto:hello@contractorverified.com",
  },
  {
    icon: Clock,
    title: "Hours",
    content: "Monday - Friday\n8:00 AM - 6:00 PM CT",
  },
]

const subjects = [
  { value: "general", label: "General Inquiry" },
  { value: "homeowner", label: "I'm a Homeowner" },
  { value: "contractor", label: "I'm a Contractor" },
  { value: "support", label: "Technical Support" },
  { value: "partnership", label: "Partnership Opportunity" },
  { value: "press", label: "Press/Media" },
]

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-navy py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions? We&apos;re here to help. Reach out to our team.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-navy mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-navy/10">
                        <info.icon className="h-6 w-6 text-navy" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">{info.title}</h3>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-gray-600 hover:text-navy whitespace-pre-line"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Link */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">Need Quick Answers?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Check out our FAQ section for common questions about our platform.
                </p>
                <Button variant="outline" asChild>
                  <a href="/how-it-works#faq">View FAQs</a>
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-navy mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Thank you for reaching out. We&apos;ll get back to you within 1-2 business days.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSubmitted(false)
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            subject: "",
                            message: "",
                          })
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-navy mb-6">
                        Send Us a Message
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              required
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              required
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone">Phone (optional)</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="(512) 555-1234"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="subject">Subject *</Label>
                            <Select
                              value={formData.subject}
                              onValueChange={(value) =>
                                setFormData({ ...formData, subject: value })
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select a topic" />
                              </SelectTrigger>
                              <SelectContent>
                                {subjects.map((subject) => (
                                  <SelectItem key={subject.value} value={subject.value}>
                                    {subject.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            placeholder="How can we help you?"
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({ ...formData, message: e.target.value })
                            }
                            required
                            className="mt-1"
                            rows={6}
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-navy hover:bg-navy-light"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Map integration would go here
              <br />
              <span className="text-sm">(Google Maps / Mapbox)</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
