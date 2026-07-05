/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { customerService } from '../services/customerService';
import { PRODUCTS } from '../data/products';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Lock,
  User,
  Plus,
  Trash2,
  MapPin,
  ClipboardList,
  LogOut,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Info,
  Gift,
  Search,
  Sparkles,
  Heart,
  Percent,
  Bell,
  HelpCircle,
  Edit3,
  Camera,
  Calendar,
  Phone,
  Map,
  Truck,
  ChevronDown,
  Download,
  RefreshCw,
  MessageSquare,
  Eye,
  EyeOff,
  ShieldCheck,
  Award,
  Globe,
  PlusCircle,
  ShoppingBag,
  Clock,
  ExternalLink,
  ChevronUp
} from 'lucide-react';
import { Product, CustomerAddress, Order, Coupon, Notification, Reward, Customer } from '../types';

// ==========================================
// 1. HELPERS & SKELETON LOADERS
// ==========================================

function SkeletonRow() {
  return (
    <div className="animate-pulse flex space-x-4 py-4 border-b border-stone-100 dark:border-stone-900">
      <div className="rounded-full bg-stone-200 dark:bg-stone-800 h-10 w-10"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4"></div>
        <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/2"></div>
      </div>
    </div>
  );
}

// Password Strength Indicator Helper
function PasswordStrength({ val }: { val: string }) {
  if (!val) return null;
  const len = val.length;
  let strength = 'Weak';
  let color = 'bg-rose-500';
  if (len >= 6 && len < 10) {
    strength = 'Fair';
    color = 'bg-amber-500';
  } else if (len >= 10) {
    strength = 'Strong & Secure';
    color = 'bg-emerald-500';
  }
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-stone-400 font-mono">
        <span>Security Strength:</span>
        <span className={len >= 10 ? 'text-emerald-500 font-bold' : len >= 6 ? 'text-amber-500 font-bold' : 'text-rose-500 font-bold'}>{strength}</span>
      </div>
      <div className="h-1 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-300`} style={{ width: len >= 10 ? '100%' : len >= 6 ? '60%' : '30%' }}></div>
      </div>
    </div>
  );
}

// ==========================================
// 2. AUTHENTICATION VIEWS
// ==========================================

export function LoginView() {
  const { login, navigateTo, addToast } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please input both registry email and password credentials', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigateTo('account');
      } else {
        addToast('Invalid login credentials. Please try again.', 'error');
      }
    } catch (err) {
      addToast('Internal authentication error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = (provider: 'Google' | 'Apple') => {
    addToast(`${provider} Single Sign-On link initialized (Mocking Shopify Plus Flow)`, 'info');
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="border border-stone-200 dark:border-stone-800 p-8 bg-white dark:bg-stone-900 shadow-2xl relative rounded-sm overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-luxury-gold via-stone-900 to-luxury-gold dark:from-luxury-gold-dark dark:via-stone-100 dark:to-luxury-gold-dark" />
        
        <div className="text-center space-y-1 mb-8">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 bg-stone-50 dark:bg-stone-950 px-2 py-0.5 border border-stone-100 dark:border-stone-800 rounded-full">Secure Registry Access</span>
          <h1 className="text-2xl md:text-3xl font-bold uppercase mt-3 font-display tracking-tight text-stone-900 dark:text-stone-50">Member Login</h1>
          <p className="text-xs text-stone-500">Access Apna Adda lounge, trackings, and points.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="login-email"
                type="email"
                required
                className="input-premium pl-10 h-11"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Password</label>
              <button
                type="button"
                onClick={() => navigateTo('forgot-password')}
                className="text-[10px] text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 uppercase font-mono tracking-wider hover:underline"
              >
                Forgot key?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                className="input-premium pl-10 pr-10 h-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded-sm accent-luxury-gold cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-xs text-stone-500">Remember this secure device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-premium-primary w-full h-11 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Keys...
              </>
            ) : (
              <>
                Continue Access <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100 dark:border-stone-800"></div></div>
          <span className="relative bg-white dark:bg-stone-900 px-3 text-[9px] font-mono uppercase tracking-widest text-stone-400">Or Connect Via</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOAuth('Google')}
            className="btn-premium-secondary h-10 text-[10px] tracking-wider uppercase flex items-center justify-center gap-2 border-stone-200 dark:border-stone-800 hover:border-stone-400"
          >
            <Globe className="w-3.5 h-3.5 text-stone-500" /> Google
          </button>
          <button
            onClick={() => handleOAuth('Apple')}
            className="btn-premium-secondary h-10 text-[10px] tracking-wider uppercase flex items-center justify-center gap-2 border-stone-200 dark:border-stone-800 hover:border-stone-400"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-stone-500" /> Apple ID
          </button>
        </div>

        <div className="text-center pt-6 mt-6 border-t border-stone-100 dark:border-stone-800/50">
          <p className="text-xs text-stone-500">
            First time at Apna Adda?{' '}
            <button
              onClick={() => navigateTo('register')}
              className="text-stone-950 dark:text-stone-50 hover:underline font-bold"
            >
              Request Account Activation
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function RegisterView() {
  const { register, navigateTo, addToast } = useAppStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      addToast('Please complete all mandatory criteria fields', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Secret passwords do not align. Verify spelling.', 'error');
      return;
    }
    if (!termsAccepted) {
      addToast('You must consent to our brand policy guidelines.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await register(firstName, lastName, email);
      if (success) {
        setIsRegisteredSuccess(true);
        addToast('Lounge Registry Approved!', 'success');
        setTimeout(() => {
          navigateTo('account');
        }, 2200);
      } else {
        addToast('Registry failed. Email might already be bound.', 'error');
      }
    } catch (err) {
      addToast('Internal registry failure', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRegisteredSuccess) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 md:py-24 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="border border-stone-200 dark:border-stone-800 p-10 bg-white dark:bg-stone-900 shadow-2xl space-y-6"
        >
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900 animate-bounce">
            <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold uppercase font-display tracking-tight text-stone-900 dark:text-stone-50">Lounge Activated</h1>
            <p className="text-xs text-stone-500 leading-relaxed">
              Congratulations, {firstName}! Your Apna Adda membership credentials have been locked into our database. Redirecting to your personal console...
            </p>
          </div>
          <div className="h-1 w-24 bg-luxury-gold dark:bg-luxury-gold-dark mx-auto rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-stone-900 dark:bg-white animate-[shimmer_1.5s_infinite]" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-stone-200 dark:border-stone-800 p-8 bg-white dark:bg-stone-900 shadow-2xl relative rounded-sm"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-luxury-gold via-stone-900 to-luxury-gold dark:from-luxury-gold-dark dark:via-stone-100 dark:to-luxury-gold-dark" />

        <div className="text-center space-y-1 mb-8">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 bg-stone-50 dark:bg-stone-950 px-2 py-0.5 border border-stone-100 dark:border-stone-800 rounded-full">New Account Invitation</span>
          <h1 className="text-2xl md:text-3xl font-bold uppercase mt-3 font-display tracking-tight text-stone-900 dark:text-stone-50">Create Account</h1>
          <p className="text-xs text-stone-500 font-sans">Claim your ₹1,000 activation reward points instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">First Name</label>
              <input
                id="reg-first-name"
                type="text"
                required
                className="input-premium h-11"
                placeholder="Arjun"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Last Name</label>
              <input
                id="reg-last-name"
                type="text"
                required
                className="input-premium h-11"
                placeholder="Sharma"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="reg-email"
                type="email"
                required
                className="input-premium pl-10 h-11"
                placeholder="arjun@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Mobile Number (WhatsApp Trackings)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="reg-phone"
                type="tel"
                className="input-premium pl-10 h-11"
                placeholder="+91 93228 72930"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Secure Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="input-premium pl-10 h-11"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrength val={password} />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="reg-confirm"
                type="password"
                required
                className="input-premium pl-10 h-11"
                placeholder="Confirm secure key"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4.5 h-4.5 rounded-sm accent-luxury-gold cursor-pointer mt-0.5"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span className="text-xs text-stone-500 leading-normal">
                I authorize registration and consent to Apna Adda's public{' '}
                <button type="button" onClick={() => navigateTo('terms')} className="underline text-stone-900 dark:text-stone-100 hover:text-luxury-gold">Terms of Use</button>{' '}
                and{' '}
                <button type="button" onClick={() => navigateTo('privacy')} className="underline text-stone-900 dark:text-stone-100 hover:text-luxury-gold">Privacy Directives</button>.
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4.5 h-4.5 rounded-sm accent-luxury-gold cursor-pointer"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
              />
              <span className="text-xs text-stone-500">Subscribe to Adda Circle VIP newsletters & flash drop passes</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-premium-primary w-full h-11 text-xs font-bold uppercase tracking-widest mt-3 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Transmitting Registry...
              </>
            ) : (
              'Initialize Membership'
            )}
          </button>
        </form>

        <div className="text-center pt-6 mt-6 border-t border-stone-100 dark:border-stone-800/50">
          <p className="text-xs text-stone-500">
            Already have keys registered?{' '}
            <button
              onClick={() => navigateTo('login')}
              className="text-stone-950 dark:text-stone-50 hover:underline font-bold"
            >
              Log In Instead
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function ForgotPasswordView() {
  const { navigateTo, addToast } = useAppStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      addToast('Reset credentials link transmitted successfully!', 'success');
    } catch {
      addToast('Transmit failed. Server slow.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-stone-200 dark:border-stone-800 p-8 bg-white dark:bg-stone-900 shadow-2xl relative rounded-sm"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-luxury-gold via-stone-900 to-luxury-gold dark:from-luxury-gold-dark dark:via-stone-100 dark:to-luxury-gold-dark" />

        <div className="text-center space-y-1 mb-8">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 bg-stone-50 dark:bg-stone-950 px-2 py-0.5 border border-stone-100 dark:border-stone-800 rounded-full">Credential Recover</span>
          <h1 className="text-2xl md:text-3xl font-bold uppercase mt-3 font-display tracking-tight text-stone-900 dark:text-stone-50">Forgot Password</h1>
          <p className="text-xs text-stone-500">Secure cryptographic key will be dispatched to your registry email.</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="forgot-email"
                  type="email"
                  required
                  className="input-premium pl-10 h-11"
                  placeholder="arjun@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-premium-primary w-full h-11 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> dispatching Link...
                </>
              ) : (
                'Transmit Reset Key'
              )}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs text-center space-y-4 leading-relaxed"
          >
            <p className="font-medium text-emerald-900 dark:text-emerald-200">Reset Credentials Handed Off</p>
            <p>We have successfully routed the credentials link to <span className="font-mono font-bold">{email}</span>. Kindly inspect spam filters if not received within 120 seconds.</p>
            <button
              onClick={() => navigateTo('login')}
              className="text-stone-950 dark:text-white font-bold underline cursor-pointer hover:text-luxury-gold block w-full text-center"
            >
              Back to Secure Login
            </button>
          </motion.div>
        )}

        <div className="text-center pt-6 mt-6 border-t border-stone-100 dark:border-stone-800/50">
          <button
            onClick={() => navigateTo('login')}
            className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 inline-flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function ResetPasswordView() {
  const { navigateTo, addToast } = useAppStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast('Passwords must align precisely', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsDone(true);
      addToast('Passkey altered successfully!', 'success');
    } catch {
      addToast('Transmit error. Please retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-stone-200 dark:border-stone-800 p-8 bg-white dark:bg-stone-900 shadow-2xl relative rounded-sm"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-luxury-gold via-stone-900 to-luxury-gold dark:from-luxury-gold-dark dark:via-stone-100 dark:to-luxury-gold-dark" />

        <div className="text-center space-y-1 mb-8">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 bg-stone-50 dark:bg-stone-950 px-2 py-0.5 border border-stone-100 dark:border-stone-800 rounded-full">Passkey Reset Terminal</span>
          <h1 className="text-2xl md:text-3xl font-bold uppercase mt-3 font-display tracking-tight text-stone-900 dark:text-stone-50">Set New Password</h1>
          <p className="text-xs text-stone-500">Provide your updated secure lounge entry passkey.</p>
        </div>

        {!isDone ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="input-premium h-11"
                placeholder="New secure passkey"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordStrength val={password} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Confirm New Password</label>
              <input
                type="password"
                required
                className="input-premium h-11"
                placeholder="Verify spelling alignment"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-premium-primary w-full h-11 text-xs font-bold uppercase tracking-widest mt-3 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Modifying...' : 'Set New Passkey'}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs text-center space-y-4"
          >
            <p className="font-bold">Passkey Configured!</p>
            <p>Your registry credentials have been modified securely. You can now login with your brand new key.</p>
            <button
              onClick={() => navigateTo('login')}
              className="btn-premium-primary w-full py-2.5 text-[10px] uppercase font-bold"
            >
              Sign In Now
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export function VerifyEmailView() {
  const { navigateTo, addToast } = useAppStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
      addToast('Secure Email Address Verified!', 'success');
    }, 2000);
    return () => clearTimeout(timer);
  }, [addToast]);

  return (
    <div className="max-w-md mx-auto px-6 py-12 md:py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-stone-200 dark:border-stone-800 p-10 bg-white dark:bg-stone-900 shadow-2xl space-y-6"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-luxury-gold via-stone-900 to-luxury-gold dark:from-luxury-gold-dark dark:via-stone-100 dark:to-luxury-gold-dark" />

        {isVerifying ? (
          <div className="space-y-4">
            <RefreshCw className="w-12 h-12 text-luxury-gold animate-spin mx-auto" />
            <h1 className="text-xl font-bold uppercase font-display text-stone-900 dark:text-stone-50">Validating Token</h1>
            <p className="text-xs text-stone-500">Connecting securely to Apna Adda core database servers...</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900">
              <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold uppercase font-display text-stone-900 dark:text-stone-50">Registry Verified</h1>
              <p className="text-xs text-stone-500 leading-relaxed">
                Thank you! Your email address was securely cataloged in our registry system. All tracking dispatch events will now broadcast to your inbox without delay.
              </p>
            </div>
            <button
              onClick={() => navigateTo('account')}
              className="btn-premium-primary w-full py-3 text-xs uppercase tracking-widest font-bold"
            >
              Go to Account Lounge
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}


// ==========================================
// 3. INTEGRATED CUSTOMER ACCOUNT DASHBOARD (SHOPIFY PLUS INTERFACE)
// ==========================================

export function AccountDashboardView() {
  const { customer, logout, navigateTo, addToast, addToCart, cart, wishlist, toggleWishlist } = useAppStore();
  
  // Dashboard Sub-tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'order-detail' | 'wishlist' | 'addresses' | 'profile' | 'settings' | 'coupons' | 'notifications' | 'support' | 'track-order'>('dashboard');
  
  // Sub-tab States loaded dynamically from customerService
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Customer | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [rewards, setRewards] = useState<Reward | null>(null);
  const [trackingDetails, setTrackingDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Address edit state
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Support / Tickets state
  const [tickets, setTickets] = useState<{ id: string; subject: string; category: string; message: string; priority: string; status: string; date: string }[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Return / Refund');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState('Normal');

  // Load profile / orders dynamically
  const fetchCustomerData = async () => {
    setIsLoading(true);
    try {
      const data = await customerService.getCustomer();
      setProfileData(data);
      const couponList = await customerService.getCoupons();
      setCoupons(couponList);
      const notifList = await customerService.getNotifications();
      setNotifications(notifList);
      const rewardData = await customerService.getRewards();
      setRewards(rewardData);
    } catch {
      addToast('Failed to pull registry stats', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!customer) {
      navigateTo('login');
      return;
    }
    fetchCustomerData();
  }, [customer]);

  if (!customer || !profileData) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center space-y-4">
        <RefreshCw className="w-10 h-10 animate-spin text-luxury-gold mx-auto" />
        <p className="text-xs text-stone-500 font-mono">Synchronizing Secure Lounge Profile...</p>
      </div>
    );
  }

  // Address Operations
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address1 || !city || !province || !zip) {
      addToast('Please input mandatory street criteria fields', 'error');
      return;
    }

    try {
      if (editingAddressId) {
        await customerService.updateAddress(editingAddressId, {
          address1, address2, city, province, zip, country, phone, isDefault
        });
        addToast('Delivery address updated successfully', 'success');
      } else {
        await customerService.addAddress({
          address1, address2, city, province, zip, country, phone, isDefault
        });
        addToast('New delivery address cataloged', 'success');
      }
      // Reset
      setAddress1(''); setAddress2(''); setCity(''); setProvince(''); setZip(''); setPhone(''); setIsDefault(false);
      setEditingAddressId(null);
      setShowAddressForm(false);
      fetchCustomerData();
    } catch {
      addToast('Failed to commit address update', 'error');
    }
  };

  const startEditAddress = (addr: CustomerAddress) => {
    setEditingAddressId(addr.id);
    setAddress1(addr.address1);
    setAddress2(addr.address2 || '');
    setCity(addr.city);
    setProvince(addr.province);
    setZip(addr.zip);
    setPhone(addr.phone || '');
    setIsDefault(addr.isDefault);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm('Verify: Permanently purge this delivery address?')) {
      try {
        await customerService.deleteAddress(id);
        addToast('Address purged from directory', 'info');
        fetchCustomerData();
      } catch {
        addToast('Failed to purge address', 'error');
      }
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await customerService.setAddressDefault(id);
      addToast('Default delivery dispatch updated', 'success');
      fetchCustomerData();
    } catch {
      addToast('Failed to set default address', 'error');
    }
  };

  // Reorder Item helper
  const handleReorder = (order: Order) => {
    order.lineItems.forEach((item) => {
      // Find matches in actual active product catalogue to pull accurate structural metadata
      const matchedProduct = PRODUCTS.find((p) => p.title.toLowerCase() === item.title.toLowerCase()) || PRODUCTS[0];
      addToCart(
        matchedProduct,
        {
          id: item.variant.id,
          title: item.variant.title,
          price: item.variant.price,
          availableForSale: true,
          selectedOptions: [],
        } as any,
        item.quantity
      );
    });
    addToast(`Reordered ${order.lineItems.length} items to your shopping cart`, 'success');
    navigateTo('cart');
  };

  // Raise ticket
  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    const newTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      category: ticketCategory,
      message: ticketMessage,
      priority: ticketPriority,
      status: 'OPEN',
      date: new Date().toLocaleDateString(),
    };

    setTickets([newTicket, ...tickets]);
    setTicketSubject('');
    setTicketMessage('');
    addToast('Support ticket raised. Team will respond in 2-4 hours.', 'success');
  };

  // Mark all notifications read
  const handleMarkNotificationsRead = async () => {
    try {
      await customerService.markNotificationRead();
      addToast('All notifications marked as read', 'info');
      fetchCustomerData();
    } catch {
      addToast('Operation failed', 'error');
    }
  };

  // Navigation tabs list
  const tabItems = [
    { id: 'dashboard' as const, label: 'Lounge Home', icon: User },
    { id: 'orders' as const, label: 'My Orders', icon: ClipboardList },
    { id: 'wishlist' as const, label: 'Wishlist', icon: Heart },
    { id: 'addresses' as const, label: 'Addresses', icon: MapPin },
    { id: 'coupons' as const, label: 'Coupons VIP', icon: Percent },
    { id: 'notifications' as const, label: 'Alerts', icon: Bell, badge: notifications.filter((n) => !n.read).length },
    { id: 'profile' as const, label: 'My Profile', icon: Edit3 },
    { id: 'settings' as const, label: 'Security', icon: ShieldCheck },
    { id: 'support' as const, label: 'Support Center', icon: HelpCircle },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      
      {/* HEADER BANNER */}
      <div className="border border-stone-200 dark:border-stone-800 p-6 md:p-8 bg-white dark:bg-stone-900 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 rounded-sm mb-10">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={profileData.avatarUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full border border-stone-200 dark:border-stone-800 object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => {
                const url = prompt('Enter image URL for avatar:', profileData.avatarUrl);
                if (url) {
                  customerService.updateProfile({ avatarUrl: url }).then((updated) => {
                    setProfileData(updated);
                    addToast('Avatar updated', 'success');
                  });
                }
              }}
              className="absolute bottom-0 right-0 p-1 bg-stone-950 text-white rounded-full border border-stone-800 hover:bg-luxury-gold transition-colors"
              aria-label="Change avatar"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold uppercase font-display tracking-tight text-stone-900 dark:text-stone-50">{profileData.firstName} {profileData.lastName}</h1>
              <span className="bg-luxury-gold text-stone-950 text-[8px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                {rewards?.membershipLevel} VIP
              </span>
            </div>
            <p className="text-xs text-stone-400 font-mono mt-1">{profileData.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-4 py-2 text-center rounded-sm">
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-stone-400 block">Reward Balance</span>
            <span className="text-sm font-mono font-bold text-luxury-gold">{rewards?.points} PTS</span>
          </div>
          <button
            onClick={logout}
            className="btn-premium-secondary px-5 text-[10px] uppercase font-mono tracking-wider flex items-center gap-2 border-stone-200 dark:border-stone-800 hover:border-stone-950 hover:bg-stone-100"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* SIDEBAR NAVIGATION - DESKTOP & MOBILE WRAPPER */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-sm">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 block px-3 mb-3">Lounge Directory</span>
            <nav className="space-y-1">
              {tabItems.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id || (tab.id === 'orders' && activeTab === 'order-detail');
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === 'notifications') {
                        handleMarkNotificationsRead();
                      }
                    }}
                    className={`w-full text-left px-3 py-3 text-xs uppercase tracking-wider font-bold flex items-center justify-between rounded-sm transition-all ${
                      isSelected
                        ? 'bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-950 hover:text-stone-900'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4" /> {tab.label}
                    </span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className="bg-rose-500 text-white text-[8px] font-mono px-1.5 py-0.5 rounded-full font-black animate-pulse">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border border-stone-200 dark:border-stone-800 p-4 bg-stone-950 text-white rounded-sm text-center space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-luxury-gold/5 rounded-full -mr-10 -mt-10" />
            <Gift className="w-8 h-8 text-luxury-gold mx-auto" />
            <h4 className="font-display font-bold text-xs uppercase tracking-wider">Level: {rewards?.membershipLevel} VIP</h4>
            <p className="text-[10px] text-stone-400 leading-normal">
              Accumulate only <span className="text-white font-bold">{rewards?.pointsToNextTier} more points</span> to attain the coveted elite tier upgrade.
            </p>
            <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
              <div className="h-full bg-luxury-gold" style={{ width: `${(rewards?.points || 0) / 1500 * 100}%` }} />
            </div>
          </div>
        </div>

        {/* COMPONENT CONTENT BODY AREA */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 md:p-8 rounded-sm min-h-[500px]"
            >
              
              {/* ==========================================
                  TAB: DASHBOARD HOME
                 ========================================== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                    <span className="text-[9px] font-mono uppercase text-luxury-gold tracking-widest font-black">Membership Overview</span>
                    <h2 className="text-xl md:text-2xl font-bold uppercase font-display mt-1 text-stone-900 dark:text-stone-100">Welcome to Your Lounge, {profileData.firstName}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-stone-100 dark:border-stone-800 p-4 rounded-sm space-y-2">
                      <ShoppingBag className="w-5 h-5 text-luxury-gold" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 block">Total Order Transactions</span>
                      <span className="text-lg font-mono font-bold block">{profileData.orders.length} Logged</span>
                      <button onClick={() => setActiveTab('orders')} className="text-[9px] uppercase tracking-wider text-stone-900 dark:text-white font-bold hover:underline">Inspect Order Logs →</button>
                    </div>
                    <div className="border border-stone-100 dark:border-stone-800 p-4 rounded-sm space-y-2">
                      <Heart className="w-5 h-5 text-rose-500" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 block">Wishlisted Treasures</span>
                      <span className="text-lg font-mono font-bold block">{wishlist.length} Objects</span>
                      <button onClick={() => setActiveTab('wishlist')} className="text-[9px] uppercase tracking-wider text-stone-900 dark:text-white font-bold hover:underline">View Wishlist Grid →</button>
                    </div>
                    <div className="border border-stone-100 dark:border-stone-800 p-4 rounded-sm space-y-2">
                      <Percent className="w-5 h-5 text-emerald-500" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 block">Unused Active Coupons</span>
                      <span className="text-lg font-mono font-bold block">{coupons.filter(c => c.status === 'ACTIVE').length} Vouchers</span>
                      <button onClick={() => setActiveTab('coupons')} className="text-[9px] uppercase tracking-wider text-stone-900 dark:text-white font-bold hover:underline">Grab Coupon Codes →</button>
                    </div>
                  </div>

                  {/* Recent Order Preview Block */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-2">
                      <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300">Recent Order Activity</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-[10px] uppercase tracking-wider font-bold text-stone-500 hover:text-stone-950 hover:underline">View All</button>
                    </div>

                    {profileData.orders.length === 0 ? (
                      <p className="text-xs text-stone-400 text-center py-6 border border-dashed border-stone-100 dark:border-stone-800">No order logs found.</p>
                    ) : (
                      <div className="border border-stone-100 dark:border-stone-800 rounded-sm divide-y divide-stone-100 dark:divide-stone-800">
                        {profileData.orders.slice(0, 2).map((order) => (
                          <div key={order.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                            <div>
                              <p className="font-mono font-bold">{order.orderNumber}</p>
                              <p className="text-stone-400 text-[10px] mt-0.5">{new Date(order.processedAt).toLocaleDateString()} — {order.lineItems.length} objects</p>
                            </div>
                            <span className={`px-2.5 py-0.5 text-[8px] font-mono uppercase tracking-widest font-black rounded-full ${
                              order.fulfillmentStatus === 'FULFILLED' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                            }`}>
                              {order.fulfillmentStatus}
                            </span>
                            <div className="text-right">
                              <p className="font-mono font-bold">₹{parseFloat(order.totalPrice).toLocaleString('en-IN')}</p>
                              <button
                                onClick={() => {
                                  setActiveOrderId(order.id);
                                  setActiveTab('order-detail');
                                }}
                                className="text-[9px] font-mono uppercase text-luxury-gold underline hover:text-stone-950 block mt-0.5"
                              >
                                View Order
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Notifications Highlights */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-2">
                      <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300">Lounge Broadcast Notifications</h3>
                      <button onClick={() => setActiveTab('notifications')} className="text-[10px] uppercase tracking-wider font-bold text-stone-500 hover:text-stone-950 hover:underline">Clear / View</button>
                    </div>

                    <div className="space-y-2">
                      {notifications.slice(0, 2).map((n) => (
                        <div key={n.id} className="p-3.5 border border-stone-100 dark:border-stone-800/80 rounded-sm flex items-start gap-3">
                          <Bell className={`w-4 h-4 mt-0.5 ${n.read ? 'text-stone-400' : 'text-luxury-gold animate-bounce'}`} />
                          <div>
                            <p className="text-xs font-bold">{n.title}</p>
                            <p className="text-[10px] text-stone-500 mt-1 leading-normal">{n.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB: ORDERS LIST
                 ========================================== */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                    <span className="text-[9px] font-mono uppercase text-stone-400 tracking-widest block">Audit History Logs</span>
                    <h2 className="text-xl md:text-2xl font-bold uppercase font-display mt-1 text-stone-900 dark:text-stone-100">My Orders</h2>
                  </div>

                  {profileData.orders.length === 0 ? (
                    <div className="text-center py-16 space-y-4 border border-dashed border-stone-100 dark:border-stone-800 rounded-sm">
                      <ClipboardList className="w-10 h-10 text-stone-300 mx-auto" />
                      <p className="text-xs text-stone-400">No transaction records logged on this account profile.</p>
                      <button onClick={() => navigateTo('shop')} className="btn-premium-primary px-6 py-2.5 text-[10px]">Explore Products</button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {profileData.orders.map((order) => (
                        <div key={order.id} className="border border-stone-200 dark:border-stone-800 p-5 rounded-sm relative bg-stone-50/50 dark:bg-stone-950/20 hover:border-stone-300 dark:hover:border-stone-700 transition-all">
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                            <div>
                              <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-stone-400 block">Order ID Code</span>
                              <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100">{order.orderNumber}</span>
                            </div>
                            <div>
                              <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-stone-400 block">Processed Date</span>
                              <span className="text-xs font-mono">{new Date(order.processedAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-stone-400 block">Logistics Status</span>
                              <span className={`inline-block px-2 py-0.5 text-[8px] font-mono font-black uppercase tracking-wider rounded-full ${
                                order.fulfillmentStatus === 'FULFILLED' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20'
                              }`}>
                                {order.fulfillmentStatus}
                              </span>
                            </div>
                            <div>
                              <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-stone-400 block">Total Value Paid</span>
                              <span className="text-xs font-mono font-bold">₹{parseFloat(order.totalPrice).toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          <div className="py-4 space-y-2.5">
                            {order.lineItems.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="font-medium text-stone-600 dark:text-stone-300">
                                  {item.title} <span className="text-[10px] font-mono text-stone-400 font-bold">x{item.quantity}</span>
                                </span>
                                <span className="font-mono text-stone-500">₹{parseFloat(item.variant.price).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap justify-between items-center gap-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setActiveOrderId(order.id);
                                  setActiveTab('order-detail');
                                }}
                                className="btn-premium-secondary py-2 px-4 text-[9px] uppercase tracking-wider font-bold border-stone-200 dark:border-stone-800"
                              >
                                Detail Invoice
                              </button>
                              <button
                                onClick={() => {
                                  setTrackingDetails(order.id);
                                  setActiveTab('track-order');
                                }}
                                className="btn-premium-secondary py-2 px-4 text-[9px] uppercase tracking-wider font-bold border-stone-200 dark:border-stone-800 hover:text-luxury-gold"
                              >
                                Track Dispatch
                              </button>
                            </div>
                            <button
                              onClick={() => handleReorder(order)}
                              className="text-[10px] uppercase font-mono tracking-widest font-bold text-stone-900 dark:text-white hover:text-luxury-gold inline-flex items-center gap-1 hover:underline"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> Quick Reorder
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ==========================================
                  TAB: ORDER DETAILS & INVOICE
                 ========================================== */}
              {activeTab === 'order-detail' && (
                <div className="space-y-8">
                  {(() => {
                    const orderId = activeOrderId || profileData.orders[0]?.id;
                    const order = profileData.orders.find((o) => o.id === orderId);

                    if (!order) {
                      return <p className="text-xs text-stone-400">Order record not isolated. Returning home...</p>;
                    }

                    return (
                      <>
                        <div className="flex flex-wrap justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-4 gap-4">
                          <div>
                            <button
                              onClick={() => setActiveTab('orders')}
                              className="text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 text-[10px] font-mono uppercase tracking-wider inline-flex items-center gap-1.5 mb-1"
                            >
                              <ArrowLeft className="w-3 h-3" /> Back to History
                            </button>
                            <h2 className="text-xl font-bold uppercase font-display text-stone-900 dark:text-stone-50">Invoice: {order.orderNumber}</h2>
                          </div>
                          
                          <button
                            onClick={() => {
                              addToast('Generating encrypted PDF invoice dispatch (Apna Adda Storefront)', 'info');
                              window.print();
                            }}
                            className="btn-premium-secondary py-2 px-4 text-[9px] uppercase tracking-wider font-bold border-stone-200 dark:border-stone-800 inline-flex items-center gap-2"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Invoice
                          </button>
                        </div>

                        {/* Order timeline */}
                        <div className="border border-stone-100 dark:border-stone-800 p-6 rounded-sm bg-stone-50/20 dark:bg-stone-950/20 space-y-4">
                          <h4 className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold">Transit Milestones Pipeline</h4>
                          <div className="grid grid-cols-5 text-center relative pt-4">
                            <div className="absolute top-1.5 left-1/10 right-1/10 h-0.5 bg-stone-200 dark:bg-stone-800 -z-1" />
                            
                            {[
                              { label: 'Ordered', done: true },
                              { label: 'Packed', done: true },
                              { label: 'Shipped', done: order.fulfillmentStatus === 'FULFILLED' },
                              { label: 'Out for Delivery', done: false },
                              { label: 'Delivered', done: false }
                            ].map((step, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className={`w-4 h-4 rounded-full mx-auto flex items-center justify-center border ${
                                  step.done
                                    ? 'bg-luxury-gold border-luxury-gold text-stone-950 font-black'
                                    : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700'
                                }`}>
                                  {step.done && <Check className="w-2.5 h-2.5" />}
                                </div>
                                <span className={`text-[9px] uppercase tracking-wider font-mono block ${step.done ? 'text-stone-900 dark:text-stone-50 font-bold' : 'text-stone-400'}`}>
                                  {step.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Shipping address & payment info */}
                          <div className="border border-stone-100 dark:border-stone-800 p-5 rounded-sm space-y-4">
                            <h4 className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold border-b border-stone-100 dark:border-stone-800 pb-2">Logistics Delivery Profile</h4>
                            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                              <span className="font-bold text-stone-900 dark:text-stone-100">{profileData.firstName} {profileData.lastName}</span>
                              <br />
                              {order.shippingAddress.address1}
                              {order.shippingAddress.address2 && <>, {order.shippingAddress.address2}</>}
                              <br />
                              {order.shippingAddress.city}, {order.shippingAddress.province} - {order.shippingAddress.zip}
                              <br />
                              {order.shippingAddress.country}
                              <br />
                              Tel: {order.shippingAddress.phone || profileData.phone}
                            </p>
                          </div>

                          <div className="border border-stone-100 dark:border-stone-800 p-5 rounded-sm space-y-4">
                            <h4 className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold border-b border-stone-100 dark:border-stone-800 pb-2">Settlement Summary</h4>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between text-stone-500"><span>Payment Channel</span><span className="font-mono">UPI / Digital Settlement (Paid)</span></div>
                              <div className="flex justify-between text-stone-500"><span>Item Subtotal</span><span className="font-mono">₹{parseFloat(order.subtotalPrice).toLocaleString('en-IN')}</span></div>
                              <div className="flex justify-between text-stone-500"><span>Integrated GST (18%)</span><span className="font-mono">₹{parseFloat(order.totalTax).toLocaleString('en-IN')}</span></div>
                              <div className="flex justify-between text-stone-500"><span>Dispatch Courier Delivery</span><span className="font-mono">₹0.00 (Zero-Cost Free)</span></div>
                              <div className="flex justify-between font-bold border-t border-stone-100 dark:border-stone-800 pt-2 text-stone-900 dark:text-stone-50">
                                <span>Grand Total Price</span>
                                <span className="font-mono">₹{parseFloat(order.totalPrice).toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Line items list */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold">Line Items Checklist</h4>
                          <div className="border border-stone-200 dark:border-stone-800 rounded-sm divide-y divide-stone-100 dark:divide-stone-800">
                            {order.lineItems.map((item, idx) => (
                              <div key={idx} className="p-4 flex flex-wrap justify-between items-center gap-4 text-xs">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-stone-100 dark:bg-stone-950 rounded-sm border border-stone-200 dark:border-stone-800 flex items-center justify-center font-mono font-bold text-stone-400 uppercase text-[10px]">
                                    AA OBJ
                                  </div>
                                  <div>
                                    <p className="font-bold text-stone-900 dark:text-stone-100">{item.title}</p>
                                    <p className="text-[10px] text-stone-500 font-mono mt-0.5">{item.variant.title}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-mono font-bold">₹{parseFloat(item.variant.price).toLocaleString('en-IN')}</p>
                                  <p className="text-[10px] text-stone-400 font-mono font-bold mt-0.5">Quantity: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-stone-100 dark:border-stone-800">
                          <button
                            onClick={() => handleReorder(order)}
                            className="btn-premium-primary py-3 px-6 text-xs uppercase tracking-widest font-bold flex items-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" /> Reorder Complete Cart
                          </button>
                          
                          <button
                            onClick={() => setActiveTab('support')}
                            className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-50 font-mono underline"
                          >
                            Need Support Assistance?
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* ==========================================
                  TAB: TRACK ORDER VIEW
                 ========================================== */}
              {activeTab === 'track-order' && (
                <div className="space-y-8">
                  {(() => {
                    const mockTracker = {
                      carrier: 'Delhivery Express Logistics',
                      trackingNo: 'DEL9322872930',
                      eta: 'Wednesday, July 8, 2026',
                      current: 'In Transit between Hubs (Mumbai Sorting Facility)',
                      events: [
                        { text: 'In Transit between Hubs', loc: 'Mumbai Sorting Facility', time: 'July 5, 08:30 AM', done: true },
                        { text: 'Inbound Dispatched to Mumbai Terminal', loc: 'Ahmedabad Fulfillment Hub', time: 'July 4, 05:15 PM', done: true },
                        { text: 'Order Verified & Sealed', loc: 'Ahmedabad Warehouse', time: 'July 4, 11:30 AM', done: true },
                        { text: 'Out for Local Delivery', loc: 'Mumbai West Delivery Station', time: 'Pending', done: false },
                        { text: 'Delivered Securely with OTP validation', loc: 'Nariman Point Residence', time: 'Pending', done: false }
                      ]
                    };

                    return (
                      <>
                        <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                          <span className="text-[9px] font-mono uppercase text-stone-400 tracking-widest block">Live Dispatch Satellite Tracking</span>
                          <h2 className="text-xl md:text-2xl font-bold uppercase font-display mt-1 text-stone-900 dark:text-stone-100">Package Logistics Tracking</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="border border-stone-100 dark:border-stone-800 p-4 rounded-sm">
                            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-stone-400 block">Assigned Courier</span>
                            <span className="text-xs font-bold mt-1 block">{mockTracker.carrier}</span>
                          </div>
                          <div className="border border-stone-100 dark:border-stone-800 p-4 rounded-sm">
                            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-stone-400 block">Tracking Waybill Number</span>
                            <span className="text-xs font-mono font-bold mt-1 block text-luxury-gold">{mockTracker.trackingNo}</span>
                          </div>
                          <div className="border border-stone-100 dark:border-stone-800 p-4 rounded-sm">
                            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-stone-400 block">Estimated Arrival (ETA)</span>
                            <span className="text-xs font-bold mt-1 block text-stone-900 dark:text-stone-50">{mockTracker.eta}</span>
                          </div>
                        </div>

                        {/* Map placeholder */}
                        <div className="border border-stone-200 dark:border-stone-800 h-44 rounded-sm relative overflow-hidden bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                          <div className="text-center space-y-2 z-1">
                            <Map className="w-8 h-8 text-luxury-gold mx-auto animate-pulse" />
                            <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500">Live Satellite Route Trace: Ahmedabad → Mumbai Lane</p>
                          </div>
                        </div>

                        {/* Events Pipeline list */}
                        <div className="space-y-5">
                          <h4 className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold">Logistics Milestone Pipeline</h4>
                          <div className="space-y-6 relative pl-6">
                            <div className="absolute left-2 top-2 bottom-2 w-[1px] bg-stone-200 dark:bg-stone-800" />
                            
                            {mockTracker.events.map((event, idx) => (
                              <div key={idx} className="relative text-xs">
                                <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                  event.done ? 'bg-luxury-gold border-luxury-gold text-stone-950 font-bold' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                                }`}>
                                  {event.done && <Check className="w-2.5 h-2.5" />}
                                </div>
                                <div>
                                  <div className="flex justify-between">
                                    <span className={`font-bold ${event.done ? 'text-stone-900 dark:text-stone-50' : 'text-stone-400'}`}>{event.text}</span>
                                    <span className="text-[10px] font-mono text-stone-400 font-bold">{event.time}</span>
                                  </div>
                                  <p className="text-[10px] text-stone-400 mt-0.5">{event.loc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* ==========================================
                  TAB: WISHLIST VIEW
                 ========================================== */}
              {activeTab === 'wishlist' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4 flex justify-between items-end">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-stone-400 tracking-widest block">Curated Object Registry</span>
                      <h2 className="text-xl md:text-2xl font-bold uppercase font-display mt-1 text-stone-900 dark:text-stone-100">Saved Wishlist</h2>
                    </div>
                    {wishlist.length > 0 && (
                      <button
                        onClick={() => {
                          if (confirm('Wipe entire wishlist selection?')) {
                            wishlist.forEach(id => toggleWishlist(id));
                          }
                        }}
                        className="text-[10px] font-mono text-stone-400 hover:text-rose-500 underline"
                      >
                        Purge Wishlist
                      </button>
                    )}
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-16 space-y-4 border border-dashed border-stone-100 dark:border-stone-800 rounded-sm">
                      <Heart className="w-10 h-10 text-stone-300 mx-auto" />
                      <p className="text-xs text-stone-400">Your wishlist selection is empty.</p>
                      <button onClick={() => navigateTo('shop')} className="btn-premium-primary px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest">Browse Designer Objects</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {PRODUCTS.filter((p) => wishlist.includes(p.id)).map((product) => (
                        <div key={product.id} className="border border-stone-200 dark:border-stone-800 p-4 rounded-sm space-y-4 relative bg-white dark:bg-stone-900 group">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="absolute top-2 right-2 p-1.5 bg-white dark:bg-stone-900 rounded-full border border-stone-100 dark:border-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-500 transition-colors"
                            aria-label="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="h-44 bg-stone-100 dark:bg-stone-950 overflow-hidden rounded-sm">
                            <img
                              src={product.images[0].url}
                              alt={product.images[0].altText}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-stone-400">{product.tags[0]}</span>
                            <h4 className="font-bold text-xs truncate text-stone-900 dark:text-stone-100">{product.title}</h4>
                            <p className="font-mono text-xs font-bold text-stone-900 dark:text-stone-50">₹{parseFloat(product.variants[0].price).toLocaleString('en-IN')}</p>
                          </div>

                          <button
                            onClick={() => {
                              addToCart(product, product.variants[0], 1);
                              toggleWishlist(product.id);
                            }}
                            className="btn-premium-primary w-full py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5"
                          >
                            Move to Bag
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ==========================================
                  TAB: SAVED ADDRESSES
                 ========================================== */}
              {activeTab === 'addresses' && (
                <div className="space-y-8">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4 flex justify-between items-end">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-stone-400 tracking-widest block">Saved Delivery Sites</span>
                      <h2 className="text-xl md:text-2xl font-bold uppercase font-display mt-1 text-stone-900 dark:text-stone-100">Addresses Directory</h2>
                    </div>
                    {!showAddressForm && (
                      <button
                        onClick={() => {
                          setEditingAddressId(null);
                          setAddress1(''); setAddress2(''); setCity(''); setProvince(''); setZip(''); setPhone(''); setIsDefault(false);
                          setShowAddressForm(true);
                        }}
                        className="text-xs text-stone-950 dark:text-stone-50 font-bold uppercase tracking-wider inline-flex items-center gap-1 hover:underline"
                      >
                        <Plus className="w-4 h-4" /> Add Address
                      </button>
                    )}
                  </div>

                  {showAddressForm && (
                    <motion.form
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleSaveAddress}
                      className="border border-stone-200 dark:border-stone-800 p-6 rounded-sm bg-stone-50/40 dark:bg-stone-950/20 space-y-4"
                    >
                      <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">{editingAddressId ? 'Alter Delivery Site' : 'Add Residence Site'}</h4>
                        <button type="button" onClick={() => setShowAddressForm(false)} className="text-xs text-stone-400 hover:text-stone-950 font-bold uppercase tracking-widest">Cancel</button>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-stone-400">Street Address Line 1 *</label>
                        <input
                          type="text"
                          required
                          placeholder="Flat No, Block, House Name"
                          className="input-premium py-2 h-10"
                          value={address1}
                          onChange={(e) => setAddress1(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-stone-400">Street Address Line 2 (Optional)</label>
                        <input
                          type="text"
                          placeholder="Locality, Landmark"
                          className="input-premium py-2 h-10"
                          value={address2}
                          onChange={(e) => setAddress2(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase text-stone-400">City / District *</label>
                          <input
                            type="text"
                            required
                            placeholder="Mumbai"
                            className="input-premium py-2 h-10"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase text-stone-400">State / Province *</label>
                          <input
                            type="text"
                            required
                            placeholder="Maharashtra"
                            className="input-premium py-2 h-10"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase text-stone-400">Postal Pin Code *</label>
                          <input
                            type="text"
                            required
                            placeholder="400001"
                            className="input-premium py-2 h-10"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase text-stone-400">Contact Number *</label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 99999 99999"
                            className="input-premium py-2 h-10"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-luxury-gold cursor-pointer"
                          checked={isDefault}
                          onChange={(e) => setIsDefault(e.target.checked)}
                        />
                        <span className="text-xs text-stone-500">Designate as my default delivery address</span>
                      </label>

                      <button type="submit" className="btn-premium-primary w-full h-11 text-xs font-bold uppercase tracking-widest">
                        Commit Address Settings
                      </button>
                    </motion.form>
                  )}

                  <div className="space-y-4">
                    {profileData.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="border border-stone-200 dark:border-stone-800 p-5 rounded-sm bg-stone-50/10 dark:bg-stone-950/10 flex justify-between items-start gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">{addr.city} Location</span>
                            {addr.isDefault && (
                              <span className="bg-stone-950 text-white dark:bg-stone-50 dark:text-stone-950 text-[7px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-stone-200 dark:border-stone-800">
                                Default Site
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                            {addr.address1}
                            {addr.address2 && <>, {addr.address2}</>}
                            <br />
                            {addr.city}, {addr.province} - {addr.zip}
                            <br />
                            {addr.country}
                            {addr.phone && <><br />Tel: {addr.phone}</>}
                          </p>

                          <div className="flex gap-4 pt-2">
                            <button onClick={() => startEditAddress(addr)} className="text-[10px] font-mono text-stone-400 hover:text-stone-950 underline">Modify Details</button>
                            {!addr.isDefault && (
                              <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-[10px] font-mono text-stone-400 hover:text-stone-950 underline">Mark Default</button>
                            )}
                          </div>
                        </div>

                        {!addr.isDefault && (
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-stone-300 hover:text-rose-500 transition-colors p-1"
                            aria-label="Delete address"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB: MY PROFILE
                 ========================================== */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                    <span className="text-[9px] font-mono uppercase text-stone-400 tracking-widest block">Identity Portfolio</span>
                    <h2 className="text-xl md:text-2xl font-bold uppercase font-display mt-1 text-stone-900 dark:text-stone-100">My Profile</h2>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const form = e.currentTarget;
                        const data = {
                          firstName: (form.elements.namedItem('p-first-name') as HTMLInputElement).value,
                          lastName: (form.elements.namedItem('p-last-name') as HTMLInputElement).value,
                          phone: (form.elements.namedItem('p-phone') as HTMLInputElement).value,
                          birthday: (form.elements.namedItem('p-bday') as HTMLInputElement).value,
                          gender: (form.elements.namedItem('p-gender') as HTMLSelectElement).value,
                          language: (form.elements.namedItem('p-lang') as HTMLSelectElement).value,
                        };
                        const updated = await customerService.updateProfile(data);
                        setProfileData(updated);
                        addToast('Profile records updated successfully', 'success');
                      } catch {
                        addToast('Profile commit failed', 'error');
                      }
                    }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-stone-400">First Name</label>
                        <input
                          id="p-first-name"
                          type="text"
                          required
                          className="input-premium h-11"
                          defaultValue={profileData.firstName}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-stone-400">Last Name</label>
                        <input
                          id="p-last-name"
                          type="text"
                          required
                          className="input-premium h-11"
                          defaultValue={profileData.lastName}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-stone-400">Email Address (Registry bound)</label>
                        <input
                          type="email"
                          disabled
                          className="input-premium h-11 opacity-60 bg-stone-50 cursor-not-allowed"
                          defaultValue={profileData.email}
                        />
                        <span className="text-[9px] font-mono text-stone-400">To alter your registered email, contact business concierge.</span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-stone-400">Mobile Phone</label>
                        <input
                          id="p-phone"
                          type="tel"
                          className="input-premium h-11"
                          defaultValue={profileData.phone}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-stone-400">Date of Birth</label>
                        <div className="relative">
                          <input
                            id="p-bday"
                            type="date"
                            className="input-premium h-11 text-xs"
                            defaultValue={profileData.birthday}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-stone-400">Gender Pronoun</label>
                        <select id="p-gender" className="input-premium h-11 text-xs" defaultValue={profileData.gender}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-Binary">Non-Binary</option>
                          <option value="Prefer Not To Say">Prefer Not To Say</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-stone-400">Preferred Language</label>
                        <select id="p-lang" className="input-premium h-11 text-xs" defaultValue={profileData.language}>
                          <option value="English">English (IN)</option>
                          <option value="Hindi">Hindi (हिंदी)</option>
                          <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="btn-premium-primary w-full h-11 text-xs font-bold uppercase tracking-widest mt-4">
                      Commit Profile Updates
                    </button>
                  </form>
                </div>
              )}

              {/* ==========================================
                  TAB: ACCOUNT SETTINGS / SECURITY
                 ========================================== */}
              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                    <span className="text-[9px] font-mono uppercase text-stone-400 tracking-widest block">Lounge Lock Settings</span>
                    <h2 className="text-xl md:text-2xl font-bold uppercase font-display mt-1 text-stone-900 dark:text-stone-100">Account Security</h2>
                  </div>

                  {/* Change password */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const cur = (form.elements.namedItem('curr-pass') as HTMLInputElement).value;
                      const nxt = (form.elements.namedItem('new-pass') as HTMLInputElement).value;
                      const conf = (form.elements.namedItem('conf-pass') as HTMLInputElement).value;
                      if (nxt !== conf) {
                        addToast('New passwords do not align', 'error');
                        return;
                      }
                      addToast('Secret passkey updated securely', 'success');
                      form.reset();
                    }}
                    className="space-y-4"
                  >
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider border-b border-stone-100 dark:border-stone-800 pb-2">Change Passkey</h3>
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase text-stone-400">Current Password</label>
                      <input id="curr-pass" type="password" required className="input-premium h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase text-stone-400">New Password</label>
                      <input id="new-pass" type="password" required className="input-premium h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase text-stone-400">Confirm New Password</label>
                      <input id="conf-pass" type="password" required className="input-premium h-10" />
                    </div>

                    <button type="submit" className="btn-premium-primary py-3 px-6 text-[10px] uppercase font-bold tracking-widest">
                      Commit New Passkey
                    </button>
                  </form>

                  {/* Deactivate account */}
                  <div className="border border-rose-100 dark:border-rose-950/50 bg-rose-50/10 p-5 rounded-sm space-y-3">
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider text-rose-600 inline-flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Danger Zone Action
                    </h3>
                    <p className="text-xs text-stone-500 leading-normal">
                      Permanently purge your Apna Adda secure account record. This will erase all your past trackings and purge accumulated reward loyalty points.
                    </p>
                    <button
                      onClick={() => {
                        if (confirm('CRITICAL ACTION: Do you wish to permanently delete your account lounge profile? This is irreversible.')) {
                          logout();
                        }
                      }}
                      className="text-[10px] font-mono text-rose-600 hover:text-rose-800 uppercase tracking-wider font-bold border border-rose-200 dark:border-rose-900 px-4 py-2 hover:bg-rose-50"
                    >
                      Request Deactivation
                    </button>
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB: VIP COUPONS
                 ========================================== */}
              {activeTab === 'coupons' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                    <span className="text-[9px] font-mono uppercase text-stone-400 tracking-widest block">VIP Voucher Ledger</span>
                    <h2 className="text-xl md:text-2xl font-bold uppercase font-display mt-1 text-stone-900 dark:text-stone-100">VIP Coupons</h2>
                  </div>

                  {/* Apply Coupon code manually */}
                  <div className="border border-stone-200 dark:border-stone-800 p-5 rounded-sm bg-stone-50/30 dark:bg-stone-950/10 space-y-3">
                    <label className="block text-[10px] font-mono font-bold uppercase text-stone-400">Check Code Eligibility</label>
                    <div className="flex gap-2">
                      <input
                        id="check-coupon"
                        type="text"
                        placeholder="e.g. WELCOME10"
                        className="input-premium h-10 uppercase font-mono tracking-widest pl-4"
                      />
                      <button
                        onClick={async () => {
                          const code = (document.getElementById('check-coupon') as HTMLInputElement).value;
                          if (!code) return;
                          const found = await customerService.applyCoupon(code);
                          if (found) {
                            addToast(`Coupon approved! ${found.discountPercent}% off ready for checkout.`, 'success');
                          } else {
                            addToast('Voucher not active or bound to another registry', 'error');
                          }
                        }}
                        className="btn-premium-primary px-5 text-[10px] uppercase font-bold tracking-widest"
                      >
                        Verify Code
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className={`border p-5 rounded-sm relative overflow-hidden flex justify-between items-center ${
                          coupon.status === 'ACTIVE'
                            ? 'border-emerald-200 bg-emerald-50/5 dark:border-emerald-900'
                            : 'border-stone-200 bg-stone-50/5 dark:border-stone-800/60 opacity-60'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm uppercase tracking-widest text-stone-900 dark:text-stone-100">{coupon.code}</span>
                            <span className={`text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ${
                              coupon.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950' : 'bg-stone-100 text-stone-600'
                            }`}>
                              {coupon.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 leading-normal">{coupon.description}</p>
                          <span className="text-[9px] font-mono text-stone-400 block">Expires: {coupon.expiryDate}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-xl font-mono font-black text-luxury-gold">{coupon.discountPercent}%</span>
                          <span className="text-[8px] font-mono uppercase tracking-widest text-stone-400 block">OFF BAG</span>
                          {coupon.status === 'ACTIVE' && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(coupon.code);
                                addToast(`Code "${coupon.code}" copied to clipboard`, 'success');
                              }}
                              className="text-[9px] font-mono uppercase text-stone-900 dark:text-white underline block mt-2"
                            >
                              Copy Code
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB: ALERTS / NOTIFICATIONS
                 ========================================== */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4 flex justify-between items-end">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-stone-400 tracking-widest block">Broadcast Audit Logs</span>
                      <h2 className="text-xl md:text-2xl font-bold uppercase font-display mt-1 text-stone-900 dark:text-stone-100">Inbox Alerts</h2>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={async () => {
                          await customerService.markNotificationRead();
                          addToast('All notifications cleared', 'info');
                          fetchCustomerData();
                        }}
                        className="text-[10px] font-mono text-stone-400 hover:text-stone-900 underline"
                      >
                        Clear Read Indicators
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 border rounded-sm flex items-start gap-3 transition-all ${
                          n.read
                            ? 'border-stone-200 bg-stone-50/20 dark:border-stone-800 dark:bg-stone-950/20'
                            : 'border-luxury-gold/50 bg-luxury-gold/2 dark:border-luxury-gold-dark/40'
                        }`}
                      >
                        <Bell className={`w-4 h-4 mt-0.5 flex-shrink-0 ${n.read ? 'text-stone-400' : 'text-luxury-gold animate-pulse'}`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-xs font-bold text-stone-900 dark:text-stone-50">{n.title}</p>
                            <span className="text-[9px] font-mono text-stone-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[11px] text-stone-500 leading-normal mt-1">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB: HELP & SUPPORT DESK
                 ========================================== */}
              {activeTab === 'support' && (
                <div className="space-y-8">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                    <span className="text-[9px] font-mono uppercase text-stone-400 tracking-widest block">Concierge Desk Terminal</span>
                    <h2 className="text-xl md:text-2xl font-bold uppercase font-display mt-1 text-stone-900 dark:text-stone-100">Lounge Support</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Raise ticket form */}
                    <form onSubmit={handleRaiseTicket} className="space-y-4 border border-stone-200 dark:border-stone-800 p-5 rounded-sm">
                      <h3 className="font-display font-bold text-xs uppercase tracking-wider border-b border-stone-100 dark:border-stone-800 pb-2">Raise Support Ticket</h3>
                      
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-stone-400">Subject Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Broken Ceramic on Transit"
                          className="input-premium h-10"
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase text-stone-400">Category Classification</label>
                          <select
                            className="input-premium h-10 text-xs"
                            value={ticketCategory}
                            onChange={(e) => setTicketCategory(e.target.value)}
                          >
                            <option>Return / Refund</option>
                            <option>Transit Breakage</option>
                            <option>Payment Gateway Error</option>
                            <option>Customs Duty</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase text-stone-400">Dispatch Priority</label>
                          <select
                            className="input-premium h-10 text-xs"
                            value={ticketPriority}
                            onChange={(e) => setTicketPriority(e.target.value)}
                          >
                            <option>Normal</option>
                            <option>High Priority</option>
                            <option>Critical (Conceirge VIP)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-stone-400">Full Description Details</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Describe the issue in exact details. Unboxing video proof required for damaged ceramics."
                          className="input-premium py-2 text-xs"
                          value={ticketMessage}
                          onChange={(e) => setTicketMessage(e.target.value)}
                        />
                      </div>

                      <button type="submit" className="btn-premium-primary w-full h-11 text-xs font-bold uppercase tracking-widest">
                        Submit Support Ticket
                      </button>
                    </form>

                    {/* Support Tickets Logs */}
                    <div className="space-y-4">
                      <h3 className="font-display font-bold text-xs uppercase tracking-wider border-b border-stone-100 dark:border-stone-800 pb-2">Support Ticket Logs ({tickets.length})</h3>
                      
                      {tickets.length === 0 ? (
                        <div className="p-8 text-center text-xs text-stone-400 border border-dashed border-stone-100 dark:border-stone-800 rounded-sm">
                          No open support tickets logged under this account.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {tickets.map((t) => (
                            <div key={t.id} className="border border-stone-200 dark:border-stone-800 p-4 rounded-sm bg-stone-50/10 text-xs">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-mono text-[9px] font-bold text-stone-400">{t.id}</span>
                                <span className="bg-amber-100 text-amber-800 text-[8px] font-mono px-2 py-0.5 rounded-full font-bold">{t.status}</span>
                              </div>
                              <p className="font-bold text-stone-900 dark:text-stone-100">{t.subject}</p>
                              <p className="text-stone-400 text-[10px] mt-0.5">{t.category} — Priority: {t.priority}</p>
                              <p className="text-stone-500 text-[10px] mt-2 italic leading-normal border-t border-stone-100 dark:border-stone-800 pt-2">"{t.message}"</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Live chat placeholder */}
                      <div className="border border-stone-100 dark:border-stone-800 p-5 rounded-sm bg-stone-950 text-white text-center space-y-3">
                        <MessageSquare className="w-8 h-8 text-luxury-gold mx-auto animate-pulse" />
                        <h4 className="font-display font-bold text-xs uppercase tracking-wider">Live Concierge WhatsApp Chat</h4>
                        <p className="text-[10px] text-stone-400">Available Monday-Saturday, 10:00 AM - 7:00 PM IST.</p>
                        <a
                          href="https://wa.me/919322872930"
                          target="_blank"
                          rel="noreferrer"
                          className="btn-premium-primary inline-flex py-2 px-5 text-[9px] uppercase font-bold tracking-widest bg-white text-stone-950 hover:bg-luxury-gold hover:text-stone-950 mx-auto"
                        >
                          Launch WhatsApp Support
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
