/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Mail, Phone, MapPin, Send, Plus, Minus, Clock, ShieldCheck, CheckCircle2, ChevronDown, Check, HelpCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  key?: React.Key;
}

function FAQAccordionItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-stone-200 dark:border-stone-800 py-4 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left font-display font-bold text-sm md:text-base text-stone-900 dark:text-stone-100 py-2 cursor-pointer transition-colors hover:text-luxury-gold"
      >
        <span>{question}</span>
        {isOpen ? <Minus className="w-4 h-4 shrink-0" /> : <Plus className="w-4 h-4 shrink-0" />}
      </button>
      {isOpen && (
        <div className="mt-2 text-xs md:text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed animate-slide-up">
          {answer}
        </div>
      )}
    </div>
  );
}

export function FAQView() {
  const faqs: FAQItemProps[] = [
    {
      question: "How long does shipping take across India?",
      answer: "We offer express processing on all orders. Deliveries to metropolitan areas usually arrive within 3 to 5 business days, while tier-2 and tier-3 cities take between 5 to 7 business days."
    },
    {
      question: "Can I cancel or modify my order after placement?",
      answer: "Because our system routes orders directly to fulfilment partners in real-time, you must request modifications or cancellations within 2 hours of checkout by emailing care@apnaadda.store."
    },
    {
      question: "What is your return and exchange framework?",
      answer: "We offer a 7-day hassle-free return window for products in original, unboxing conditions. Fragile items such as ceramic vases must be verified with an unboxing video to prevent transit damage disputes."
    },
    {
      question: "Is cash on delivery available?",
      answer: "Currently, we only support secure UPI, credit cards, debit cards, and digital wallets via our Shopify gateway to maintain a fast, contactless dropshipping system."
    },
    {
      question: "Are Apna Adda products backed by a warranty?",
      answer: "Selected electronic objects (like the Aura Soundbar) carry a 1-year product warranty. Stoneware and lifestyle apparel are covered under 7-day manufacturer-defect exchanges."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <div className="text-center mb-12">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Help Desk</span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 uppercase font-display">Frequently Asked Questions</h1>
      </div>
      <div className="border border-stone-200 dark:border-stone-800 p-6 md:p-10 bg-white dark:bg-stone-900">
        {faqs.map((faq, idx) => (
          <FAQAccordionItem key={idx} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}

export function ContactView() {
  const { addToast } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    subject: 'Order Support',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.phone && !/^[0-9+\s-]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide more details (at least 10 characters)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please correct the validation errors', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addToast('Message transmitted successfully!', 'success');
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 1200);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      orderNumber: '',
      subject: 'Order Support',
      message: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  const contactFaqs = [
    {
      question: "How long does delivery take?",
      answer: "We offer express shipping across India. Standard transit takes 3 to 5 business days for major metro areas and 5 to 7 business days for tier-2 and tier-3 regions."
    },
    {
      question: "How do I track my order?",
      answer: "You can easily track your order using our 'Track Order' tool in the navigation bar. Simply input your Order ID and billing email or phone to get real-time tracking information."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day hassle-free return window for products in original, unboxing conditions. Unboxing videos are mandatory for fragile items like ceramic vases to verify transit damage."
    },
    {
      question: "Can I cancel my order?",
      answer: "Orders can be canceled or modified within 2 hours of placement. Since our system processes orders in real-time, we cannot halt shipments once they are processed or handed to our shipping partners."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can write to support@apnaadda.store or call us at +91-9322872930 from Monday to Saturday, 10:00 AM – 7:00 PM (IST). Alternatively, you can submit the contact form on this page."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-16 animate-slide-up">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold dark:text-luxury-gold-dark font-mono">Connect</span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase font-display text-stone-900 dark:text-white">Get in Touch</h1>
        <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
          Need help with an order, product, return, or anything else? Our customer support team is here to assist you. We usually respond within 24 hours.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="border border-stone-200 dark:border-stone-800 p-6 md:p-8 bg-white dark:bg-stone-900 space-y-6 shadow-sm">
            <h3 className="font-display font-bold text-base uppercase tracking-wider text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-800">
              Support Directory
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-900 dark:text-white shrink-0 bg-stone-50 dark:bg-stone-950">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">Customer Support</h4>
                  <a href="mailto:support@apnaadda.store" className="text-sm font-semibold text-stone-900 dark:text-stone-100 hover:text-luxury-gold transition-colors mt-0.5 block font-mono">support@apnaadda.store</a>
                  <p className="text-[11px] text-stone-400 mt-0.5">For order queries and help desk issues.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-900 dark:text-white shrink-0 bg-stone-50 dark:bg-stone-950">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">Business Email</h4>
                  <a href="mailto:business@apnaadda.store" className="text-sm font-semibold text-stone-900 dark:text-stone-100 hover:text-luxury-gold transition-colors mt-0.5 block font-mono">business@apnaadda.store</a>
                  <p className="text-[11px] text-stone-400 mt-0.5">For B2B proposals and brand collaborations.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-900 dark:text-white shrink-0 bg-stone-50 dark:bg-stone-950">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">Phone Support</h4>
                  <a href="tel:+919322872930" className="text-sm font-semibold text-stone-900 dark:text-stone-100 hover:text-luxury-gold transition-colors mt-0.5 block font-mono">+91-9322872930</a>
                  <p className="text-[11px] text-stone-400 mt-0.5">Call our helpline for prompt resolutions.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-900 dark:text-white shrink-0 bg-stone-50 dark:bg-stone-950">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">Business Hours</h4>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-0.5">Monday – Saturday</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">10:00 AM – 7:00 PM (IST)</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-900 dark:text-white shrink-0 bg-stone-50 dark:bg-stone-950">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">Location</h4>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-0.5">Ahmedabad, Gujarat, India</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                    Apna Adda is an online-first ecommerce business serving customers and shipping directly across the entire length of India.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Section */}
          <div className="border border-stone-200 dark:border-stone-800 p-6 bg-stone-100/60 dark:bg-stone-950/40 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 font-mono">Our Support Guarantee</h4>
            
            <div className="space-y-3.5">
              <div className="flex gap-3 items-center">
                <CheckCircle2 className="w-4.5 h-4.5 text-luxury-gold shrink-0 animate-pulse" />
                <div>
                  <h5 className="text-xs font-bold text-stone-900 dark:text-white">Average Response Time</h5>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Within 24 Hours</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <CheckCircle2 className="w-4.5 h-4.5 text-luxury-gold shrink-0 animate-pulse" />
                <div>
                  <h5 className="text-xs font-bold text-stone-900 dark:text-white">Customer Support</h5>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Monday–Saturday Operational Helpdesk</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <CheckCircle2 className="w-4.5 h-4.5 text-luxury-gold shrink-0 animate-pulse" />
                <div>
                  <h5 className="text-xs font-bold text-stone-900 dark:text-white">Secure Communication</h5>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Your information remains completely private.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="border border-stone-200 dark:border-stone-800 p-6 md:p-10 bg-white dark:bg-stone-900 shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-16 h-16 rounded-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-center mx-auto text-luxury-gold shadow-sm">
                  <Check className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-2xl uppercase tracking-wider text-stone-900 dark:text-white">Message Transmitted</h3>
                  <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-stone-800 dark:text-stone-200">{formData.name}</span>. We have logged your request under <strong>{formData.subject}</strong>. One of our support representatives will contact you at <strong>{formData.email}</strong> within 24 hours.
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="btn-premium-primary text-xs uppercase px-6 py-2.5 cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg uppercase tracking-wider text-stone-900 dark:text-white">Send us a Message</h3>
                  <p className="text-[10px] text-stone-400 font-mono">Fields marked with (*) are mandatory</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">Full Name *</label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g. Arjun Sharma"
                      className={`input-premium text-xs ${errors.name ? 'border-red-500 focus:border-red-500 dark:border-red-500' : ''}`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <p className="text-[10px] text-red-500 font-mono">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="e.g. arjun@outlook.com"
                      className={`input-premium text-xs ${errors.email ? 'border-red-500 focus:border-red-500 dark:border-red-500' : ''}`}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 font-mono">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">Phone Number (Optional)</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="e.g. +91 93228 72930"
                      className={`input-premium text-xs ${errors.phone ? 'border-red-500 focus:border-red-500 dark:border-red-500' : ''}`}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 font-mono">{errors.phone}</p>}
                  </div>

                  {/* Order Number */}
                  <div className="space-y-1.5">
                    <label htmlFor="orderNumber" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">Order Number (Optional)</label>
                    <input
                      id="orderNumber"
                      type="text"
                      placeholder="e.g. #ORD-1049"
                      className="input-premium text-xs"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">Subject</label>
                  <div className="relative">
                    <select
                      id="subject"
                      className="input-premium text-xs appearance-none pr-10 cursor-pointer bg-transparent"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="Order Support">Order Support</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Returns & Refunds">Returns & Refunds</option>
                      <option value="Shipping & Delivery">Shipping & Delivery</option>
                      <option value="Payment Issue">Payment Issue</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Bulk Orders">Bulk Orders</option>
                      <option value="General Question">General Question</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">Message *</label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    placeholder="Tell us how we can help you..."
                    className={`input-premium py-3 text-xs resize-none ${errors.message ? 'border-red-500 focus:border-red-500 dark:border-red-500' : ''}`}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                  {errors.message ? (
                    <p className="text-[10px] text-red-500 font-mono">{errors.message}</p>
                  ) : (
                    <p className="text-[10px] text-stone-400 font-mono text-right">Minimum 10 characters required</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-premium-primary w-full flex items-center justify-center gap-3 py-3 cursor-pointer"
                >
                  {isSubmitting ? 'Transmitting...' : 'Send Message'}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Google Maps Placeholder */}
      <div className="border border-stone-200 dark:border-stone-800 p-6 md:p-8 bg-white dark:bg-stone-900 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-luxury-gold" />
              Corporate Headquarters Placeholder
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Ahmedabad, Gujarat, India. Our physical office serves as administration; all customer shipments originate from distribution hubs.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-stone-50 dark:bg-stone-950 px-2.5 py-1 uppercase tracking-widest text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800/80 rounded">
            Live Connection Pending
          </span>
        </div>

        {/* Beautiful visual map wireframe */}
        <div className="relative h-64 md:h-80 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-900/60 overflow-hidden flex items-center justify-center">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1c1917_1px,transparent_1px),linear-gradient(to_bottom,#1c1917_1px,transparent_1px)] bg-[size:24px_24px] opacity-70"></div>
          
          {/* Abstract landmass vector/circles for a curated mapping tech vibe */}
          <div className="absolute w-48 h-48 rounded-full bg-stone-100 dark:bg-stone-900/30 blur-2xl top-10 left-10"></div>
          <div className="absolute w-72 h-72 rounded-full bg-stone-100 dark:bg-stone-900/20 blur-3xl bottom-4 right-12 animate-pulse" style={{ animationDuration: '6s' }}></div>

          {/* Aesthetic map lines simulating highways/roads */}
          <svg className="absolute inset-0 w-full h-full stroke-stone-200 dark:stroke-stone-800/60 stroke-1 fill-none" xmlns="http://www.w3.org/2000/svg">
            <path d="M -50 150 Q 200 80 400 180 T 900 120 T 1500 240" strokeWidth="2" />
            <path d="M 120 -50 L 320 400" />
            <path d="M 600 -50 L 520 400" strokeWidth="1.5" />
            <path d="M -50 250 L 1200 50" />
          </svg>

          {/* Pin center point */}
          <div className="relative flex flex-col items-center z-10 space-y-2 animate-bounce">
            <div className="w-4 h-4 rounded-full bg-luxury-gold flex items-center justify-center shadow-lg relative">
              <div className="absolute inset-0 rounded-full bg-luxury-gold animate-ping opacity-75"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-stone-950 dark:bg-white"></div>
            </div>
            <div className="bg-stone-900 text-white dark:bg-white dark:text-stone-950 text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 uppercase border border-stone-800 dark:border-stone-200 shadow-md">
              Apna Adda HQ (Ahmedabad)
            </div>
          </div>

          {/* Coordinate details overlay */}
          <div className="absolute bottom-3 right-3 bg-stone-900/90 text-white dark:bg-white/90 dark:text-stone-950 px-2 py-1 text-[8px] font-mono uppercase tracking-widest border border-stone-800/50 dark:border-stone-200/50">
            23.0225° N, 72.5714° E • Ahmedabad, Gujarat
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Section */}
      <div className="space-y-6 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <HelpCircle className="w-5 h-5 mx-auto text-luxury-gold" />
          <h3 className="font-display font-bold text-lg uppercase tracking-wider text-stone-900 dark:text-white">Help & FAQs</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Quick responses to common logistical inquiries.
          </p>
        </div>

        <div className="border border-stone-200 dark:border-stone-800 p-6 md:p-8 bg-white dark:bg-stone-900 max-w-4xl mx-auto divide-y divide-stone-100 dark:divide-stone-800/80 shadow-sm">
          {contactFaqs.map((faq, idx) => (
            <FAQAccordionItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AboutView() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-16">
      <div className="text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Our Story</span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 uppercase font-display leading-none">AESTHETIC ESSENTIALS<br />FOR MODERN DAILY DWELLING</h1>
      </div>

      <div className="aspect-video w-full border border-stone-200 dark:border-stone-800 overflow-hidden relative group">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
          alt="Minimal luxury living room decor setup"
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-stone-950/20 mix-blend-multiply pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        <div className="md:col-span-5 font-display font-bold text-stone-900 dark:text-stone-100 text-lg uppercase leading-tight">
          WE BELIEVE THAT BEAUTIFUL LIVING OBJECTS TRANSLATE TO COMPOSURE OF MIND.
        </div>
        <div className="md:col-span-7 space-y-6">
          <p>
            Apna Adda was founded in 2026 to dismantle the clutter of mass-produced, uninspiring consumer commodities. We bridge the gap between high-end international architectural engineering and accessible, design-led lifestyle accessories.
          </p>
          <p>
            By working with premium manufacturers and leveraging headless Shopify technology, we dropship high-performance homeware, acoustics, and personal carry objects straight to design enthusiasts without middleman inflation. Every piece in our limited catalog must meet rigorous standards of physical balance, clean geometry, and texture honesty.
          </p>
        </div>
      </div>
    </div>
  );
}

interface PolicyProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

function PolicyTemplate({ title, lastUpdated, children }: PolicyProps) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Apna Adda Legal Policy</span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 uppercase font-display">{title}</h1>
        <p className="text-xs font-mono text-stone-500 mt-2">Last updated: {lastUpdated}</p>
      </div>
      <div className="prose prose-stone dark:prose-invert max-w-none text-stone-600 dark:text-stone-400 text-sm leading-relaxed space-y-6">
        {children}
      </div>
    </div>
  );
}

export function PrivacyPolicyView() {
  return (
    <PolicyTemplate title="Privacy Policy" lastUpdated="July 05, 2026">
      <h3 className="text-base font-bold text-stone-900 dark:text-white uppercase font-display">1. Information We Collect</h3>
      <p>
        When you complete an order on Apna Adda, we collect information necessary to fulfill your dropshipping package, including your name, shipping address, billing address, phone number, and email. All financial credentials are processed securely using Shopify Core and do not sit on our databases.
      </p>
      <h3 className="text-base font-bold text-stone-900 dark:text-white uppercase font-display">2. Cookies & Personalization</h3>
      <p>
        We utilize subtle cookies to retain your shopping bag preferences, store session metrics, and deliver relevant marketing recommendations. No user tracking is shared with third parties without direct visual consent.
      </p>
    </PolicyTemplate>
  );
}

export function RefundPolicyView() {
  return (
    <PolicyTemplate title="Refund & Returns" lastUpdated="July 05, 2026">
      <h3 className="text-base font-bold text-stone-900 dark:text-white uppercase font-display">7-Day Return Guarantee</h3>
      <p>
        We want you to be completely satisfied with your design objects. If you find any physical defects or if the item doesn't align with your expectation, we accept returns within 7 calendar days of verified postal delivery.
      </p>
      <p>
        To file a return, email care@apnaadda.store with your order number and unedited unboxing proof (mandatory for fragile ceramics).
      </p>
      <h3 className="text-base font-bold text-stone-900 dark:text-white uppercase font-display">Exceptions</h3>
      <p>
        Items purchased under absolute clearance promotional campaigns, or customized leather coordinates carrying custom debossed markings, are not eligible for refunds.
      </p>
    </PolicyTemplate>
  );
}

export function ShippingPolicyView() {
  return (
    <PolicyTemplate title="Shipping Policy" lastUpdated="July 05, 2026">
      <h3 className="text-base font-bold text-stone-900 dark:text-white uppercase font-display">Fulfillment Metrics</h3>
      <p>
        We ship our collections directly from premium international manufacturing partners to provide premium craftsmanship at accessible prices. This model guarantees strict quality oversight prior to parcel sealing.
      </p>
      <h3 className="text-base font-bold text-stone-900 dark:text-white uppercase font-display">Tracking & Ingress</h3>
      <p>
        Our standard processing time is 2 business days. Express shipping across India is completely free on orders exceeding ₹5,000. Under normal conditions, transit times average 4 to 8 calendar days. All shipments are trackable via Delhivery, Blue Dart, or India Post.
      </p>
    </PolicyTemplate>
  );
}

export function TermsView() {
  return (
    <PolicyTemplate title="Terms of Service" lastUpdated="July 05, 2026">
      <h3 className="text-base font-bold text-stone-900 dark:text-white uppercase font-display">1. Agreement to Terms</h3>
      <p>
        By utilizing the Apna Adda store, you represent and warrant that you are of legal age and agree to abide by these terms of use. Our platform is hosted on Shopify, which supplies the transactional ecommerce systems.
      </p>
      <h3 className="text-base font-bold text-stone-900 dark:text-white uppercase font-display">2. Dropshipping Disclosures</h3>
      <p>
        We source our architectural objects globally. Images on our website are highly styled and calibrated under physical lighting conditions. Minor variances in organic stonewares and leather finishes are expected characteristics of artisanal manufacturing.
      </p>
    </PolicyTemplate>
  );
}
