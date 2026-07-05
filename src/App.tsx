/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams, Link, NavLink } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import SEO from './components/SEO';
import { PRODUCTS } from './data/products';

// Overlays & Sidebags
import SearchDrawer from './components/SearchDrawer';
import CartDrawer from './components/CartDrawer';
import ToastContainer from './components/ToastContainer';
import MarketingPopups from './components/MarketingPopups';

// Keep HomeView statically imported to maximize LCP for initial load
import HomeView from './components/HomeView';

// Skeletons for Lazy Loading Fallbacks
import { PageSkeleton, ProductSkeleton, ShopSkeleton } from './components/SkeletonLoader';

// Lazily Load View Panels
const ShopView = React.lazy(() => import('./components/ShopView'));
const ProductDetailView = React.lazy(() => import('./components/ProductDetailView'));
const CartView = React.lazy(() => import('./components/CartView'));
const WishlistView = React.lazy(() => import('./components/WishlistView'));
const TrackOrderView = React.lazy(() => import('./components/TrackOrderView'));

// Lazily Load Customer view panels
const LoginView = React.lazy(() => import('./components/CustomerViews').then(m => ({ default: m.LoginView })));
const RegisterView = React.lazy(() => import('./components/CustomerViews').then(m => ({ default: m.RegisterView })));
const ForgotPasswordView = React.lazy(() => import('./components/CustomerViews').then(m => ({ default: m.ForgotPasswordView })));
const ResetPasswordView = React.lazy(() => import('./components/CustomerViews').then(m => ({ default: m.ResetPasswordView })));
const VerifyEmailView = React.lazy(() => import('./components/CustomerViews').then(m => ({ default: m.VerifyEmailView })));
const AccountDashboardView = React.lazy(() => import('./components/CustomerViews').then(m => ({ default: m.AccountDashboardView })));

// Lazily Load Policies & Info views
const AboutView = React.lazy(() => import('./components/PolicyViews').then(m => ({ default: m.AboutView })));
const FAQView = React.lazy(() => import('./components/PolicyViews').then(m => ({ default: m.FAQView })));
const ContactView = React.lazy(() => import('./components/PolicyViews').then(m => ({ default: m.ContactView })));
const PrivacyPolicyView = React.lazy(() => import('./components/PolicyViews').then(m => ({ default: m.PrivacyPolicyView })));
const RefundPolicyView = React.lazy(() => import('./components/PolicyViews').then(m => ({ default: m.RefundPolicyView })));
const ShippingPolicyView = React.lazy(() => import('./components/PolicyViews').then(m => ({ default: m.ShippingPolicyView })));
const TermsView = React.lazy(() => import('./components/PolicyViews').then(m => ({ default: m.TermsView })));

// Icons
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react';

function NotFoundView() {
  const { navigateTo } = useAppStore();
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-6">
      <h1 className="text-4xl font-display font-medium tracking-tight">404 — OBJECT NOT FOUND</h1>
      <p className="text-stone-500 max-w-md mx-auto text-sm leading-relaxed">
        The curated design piece or directory you are seeking does not reside in our active collections.
      </p>
      <button onClick={() => navigateTo('shop')} className="btn-premium-primary text-[10px] px-8">
        Back to Gallery
      </button>
    </div>
  );
}

export default function App() {
  const {
    currentView,
    viewParams,
    theme,
    toggleTheme,
    cart,
    wishlist,
    customer,
    setSearchDrawerOpen,
    setCartDrawerOpen,
    navigateTo,
  } = useAppStore();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // 1. Intercept useAppStore's navigateTo function to route cleanly
  useEffect(() => {
    useAppStore.setState({
      navigateTo: (view, params = {}) => {
        let path = '/';
        switch (view) {
          case 'home':
            path = '/';
            break;
          case 'shop':
            if (params.collection) {
              path = `/collections/${params.collection}`;
            } else if (params.query) {
              path = `/shop?q=${encodeURIComponent(params.query)}`;
            } else {
              path = '/shop';
            }
            break;
          case 'product':
            path = `/product/${params.handle}`;
            break;
          case 'cart':
            path = '/cart';
            break;
          case 'wishlist':
            path = '/wishlist';
            break;
          case 'login':
            path = '/account/login';
            break;
          case 'register':
            path = '/account/register';
            break;
          case 'forgot-password':
            path = '/account/forgot-password';
            break;
          case 'reset-password':
            path = '/account/reset-password';
            break;
          case 'verify-email':
            path = '/account/verify-email';
            break;
          case 'account':
            path = '/account';
            break;
          case 'track-order':
            path = '/track-order';
            break;
          case 'about':
            path = '/about';
            break;
          case 'faq':
            path = '/faq';
            break;
          case 'contact':
            path = '/contact';
            break;
          case 'privacy':
            path = '/privacy';
            break;
          case 'refund':
            path = '/returns';
            break;
          case 'shipping':
            path = '/shipping';
            break;
          case 'terms':
            path = '/terms';
            break;
          case 'search':
            if (params.query) {
              path = `/shop?q=${encodeURIComponent(params.query)}`;
            } else {
              path = '/shop';
            }
            break;
          default:
            path = '/';
        }
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  }, [navigate]);

  // 2. Synchronize route back to Zustand store (e.g. for browser navigation buttons: Back, Forward)
  useEffect(() => {
    const pathname = location.pathname;
    let view = 'home';
    let syncedParams: Record<string, any> = {};

    if (pathname === '/') {
      view = 'home';
    } else if (pathname === '/shop' || pathname === '/search') {
      view = 'shop';
      const query = searchParams.get('q');
      const collection = searchParams.get('collection');
      if (query) syncedParams.query = query;
      if (collection) syncedParams.collection = collection;
    } else if (pathname.startsWith('/collections/')) {
      view = 'shop';
      const handle = pathname.split('/').pop() || '';
      syncedParams.collection = handle;
    } else if (pathname.startsWith('/product/')) {
      view = 'product';
      const handle = pathname.split('/').pop() || '';
      syncedParams.handle = handle;
    } else if (pathname === '/cart') {
      view = 'cart';
    } else if (pathname === '/wishlist') {
      view = 'wishlist';
    } else if (pathname === '/account') {
      view = 'account';
    } else if (pathname === '/orders') {
      view = 'account';
      syncedParams.tab = 'orders';
    } else if (pathname === '/track-order') {
      view = 'track-order';
    } else if (pathname === '/about') {
      view = 'about';
    } else if (pathname === '/faq') {
      view = 'faq';
    } else if (pathname === '/contact') {
      view = 'contact';
    } else if (pathname === '/privacy') {
      view = 'privacy';
    } else if (pathname === '/terms') {
      view = 'terms';
    } else if (pathname === '/returns') {
      view = 'refund';
    } else if (pathname === '/shipping') {
      view = 'shipping';
    } else if (pathname === '/account/login') {
      view = 'login';
    } else if (pathname === '/account/register') {
      view = 'register';
    } else if (pathname === '/account/forgot-password') {
      view = 'forgot-password';
    } else if (pathname === '/account/reset-password') {
      view = 'reset-password';
    } else if (pathname === '/account/verify-email') {
      view = 'verify-email';
    } else {
      // 404 view fallback
      view = 'home';
    }

    // Only update state if it is actually different to avoid infinite loop
    const state = useAppStore.getState();
    if (state.currentView !== view || JSON.stringify(state.viewParams) !== JSON.stringify(syncedParams)) {
      useAppStore.setState({ currentView: view as any, viewParams: syncedParams });
    }
  }, [location, searchParams]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Sync dark theme with DOM class list
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Scroll to top on navigation turns
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  // Active items counts
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // Header Nav Menu Definition
  const navLinks = [
    { label: 'Shop Objects', viewName: 'shop' as const },
    { label: 'Track Order', viewName: 'track-order' as const },
    { label: 'Our Story', viewName: 'about' as const },
    { label: 'Help Desk', viewName: 'faq' as const },
    { label: 'Contact', viewName: 'contact' as const },
  ];

  // Dynamic SEO parameters construction based on current view panel
  let seoTitle = '';
  let seoDesc = '';
  let seoProduct: any = undefined;
  let seoCollection = '';
  let seoFaqs: any[] = [];

  const activeProduct = currentView === 'product' ? PRODUCTS.find(p => p.handle === viewParams.handle) : undefined;

  switch (currentView) {
    case 'home':
      seoTitle = 'Premium Minimalist Design & Workspace Essentials';
      seoDesc = 'Discover Apna Adda, a premium lifestyle and design dropshipping store curated with modern workspace products, accessories, and home objects.';
      break;
    case 'shop':
      seoTitle = 'Shop Fine Design Objects';
      seoDesc = 'Explore our collection of hand-picked premium objects: acoustic driver devices, milled alloy stands, visual arts, and workspace items.';
      if (viewParams.collection) {
        seoCollection = viewParams.collection.toUpperCase();
        seoTitle = `Shop ${viewParams.collection.charAt(0).toUpperCase() + viewParams.collection.slice(1)}`;
      }
      break;
    case 'product':
      if (activeProduct) {
        seoProduct = activeProduct;
        seoTitle = activeProduct.title;
        seoDesc = activeProduct.description;
      } else {
        seoTitle = 'Curated Product Details';
      }
      break;
    case 'cart':
      seoTitle = 'Your Shopping Bag';
      seoDesc = 'Review your selection of artisanal design and technical workspace accessories before entering secure checkout.';
      break;
    case 'wishlist':
      seoTitle = 'Your Saved Objects';
      seoDesc = 'Your private wishlist of highly coveted modern design artifacts and lifestyle enhancements.';
      break;
    case 'about':
      seoTitle = 'Our Design Philosophy';
      seoDesc = 'Learn about Apna Adda, our source-first artisanal curation ethos, and our dedication to minimal structural beauty.';
      break;
    case 'faq':
      seoTitle = 'Help Desk & Shipping Policy';
      seoDesc = 'Find answers about express courier delivery, tracking, replacement guarantees for fragile wares, and security certifications.';
      seoFaqs = [
        { question: 'When will my order be dispatched?', answer: 'Orders placed before 5:00 PM are dispatched next morning via express BlueDart delivery.' },
        { question: 'Do you offer cash on delivery (COD)?', answer: 'Yes, we offer Cash on Delivery (COD) and UPI-at-door across 19,000+ pin codes in India.' },
        { question: 'What is your return policy?', answer: 'We offer a 7-day hassle-free return window with a 100% money-back guarantee for transit damages on fragile goods.' },
      ];
      break;
    case 'contact':
      seoTitle = 'Contact Design Labs';
      seoDesc = 'Get in touch with Apna Adda customer support and curators based in Bangalore, India. We reply within 2 hours.';
      break;
    case 'track-order':
      seoTitle = 'Track Your Courier';
      seoDesc = 'Enter your order ID or tracking code to trace your premium shipment package in real-time.';
      break;
    case 'login':
    case 'register':
    case 'forgot-password':
    case 'reset-password':
    case 'verify-email':
      seoTitle = 'Customer Portal';
      seoDesc = 'Secure portal for tracking shipments, reviewing purchase histories, and updating shipping details.';
      break;
    case 'privacy':
      seoTitle = 'Privacy Safeguards';
      seoDesc = 'How we protect your customer records and secure checkout details at Apna Adda.';
      break;
    case 'refund':
      seoTitle = 'Refund & Guarantee Policy';
      seoDesc = 'Read about our 7-day easy refund policy and our fragile transit item protection guarantees.';
      break;
    case 'shipping':
      seoTitle = 'Express Transit & Fulfillment';
      seoDesc = 'Details about our partnerships with BlueDart, Delhivery, and custom packaging systems for secure delivery.';
      break;
    case 'terms':
      seoTitle = 'Terms of Curation';
      seoDesc = 'Review the standard terms and customer service agreements governing your order placements.';
      break;
    default:
      seoTitle = 'Premium Minimalist Design & Workspace Essentials';
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans flex flex-col transition-colors duration-300">
      
      {/* Dynamic Production SEO & Schema.org JSON-LD Injector */}
      <SEO 
        title={seoTitle}
        description={seoDesc}
        product={seoProduct}
        collectionName={seoCollection || undefined}
        faqList={seoFaqs.length > 0 ? seoFaqs : undefined}
        isHome={currentView === 'home'}
      />

      {/* WCAG Accessibility: Skip to Content Anchor */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-stone-900 focus:text-white dark:focus:bg-white dark:focus:text-stone-950 focus:px-5 focus:py-3.5 focus:border focus:border-stone-200 dark:focus:border-stone-800 focus:shadow-2xl focus:outline-hidden font-bold text-[10px] tracking-widest uppercase font-mono"
      >
        Skip to content
      </a>
      
      {/* 1. TOP PROMOTIONAL ANN_BANNER */}
      <div className="bg-stone-950 text-white dark:bg-white dark:text-stone-950 text-center py-2 px-4 border-b border-stone-800 text-[10px] uppercase font-mono tracking-widest font-bold z-40 relative">
        <span>Free Express Delivery Across India Over ₹5,000 — Apply Code: <span className="text-luxury-gold dark:text-luxury-gold-dark font-black">WELCOME10</span></span>
      </div>

      {/* 2. HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-900 h-16 flex items-center justify-between px-6 sm:px-10 transition-colors">
        
        {/* Brand Logo with tracking */}
        <Link
          to="/"
          className="flex items-center gap-2 cursor-pointer font-display select-none"
        >
          <div className="w-7 h-7 bg-stone-950 dark:bg-white rounded-none flex items-center justify-center relative overflow-hidden group">
            <span className="text-white dark:text-stone-950 text-[10px] font-black group-hover:scale-110 transition-transform">A</span>
            <div className="absolute inset-0 border border-stone-100 opacity-20 pointer-events-none"></div>
          </div>
          <span className="text-sm font-black uppercase tracking-[0.3em] text-stone-950 dark:text-white">APNA ADDA</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.viewName}
              to={`/${link.viewName}`}
              className={`text-xs uppercase tracking-widest font-mono cursor-pointer transition-colors hover:text-luxury-gold ${
                currentView === link.viewName ? 'font-bold text-stone-950 dark:text-white' : 'text-stone-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Global Action Icons (Right Side) */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Instant Search Icon */}
          <button
            id="btn-trigger-search"
            onClick={() => setSearchDrawerOpen(true)}
            className="p-2 text-stone-500 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Open search drawer"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Theme switcher */}
          <button
            id="btn-toggle-theme"
            onClick={toggleTheme}
            className="p-2 text-stone-500 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Account link */}
          <Link
            id="btn-nav-account"
            to={customer ? '/account' : '/account/login'}
            className={`p-2 text-stone-500 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white transition-colors cursor-pointer ${
              currentView === 'account' || currentView === 'login' ? 'text-luxury-gold' : ''
            }`}
            aria-label="Your profile"
          >
            <User className="w-4.5 h-4.5" />
          </Link>

          {/* Wishlist Link */}
          <Link
            id="btn-nav-wishlist"
            to="/wishlist"
            className="p-2 text-stone-500 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white transition-colors cursor-pointer relative"
            aria-label="Saved items"
          >
            <Heart className={`w-4.5 h-4.5 ${currentView === 'wishlist' ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-950 text-white dark:bg-white dark:text-stone-950 text-[8px] font-bold font-mono w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Dynamic Cart Sidemenu Trigger */}
          <button
            id="btn-nav-cart"
            onClick={() => setCartDrawerOpen(true)}
            className="p-2 text-stone-500 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white transition-colors cursor-pointer relative"
            aria-label="Open cart side drawer"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-950 text-white dark:bg-white dark:text-stone-950 text-[8px] font-bold font-mono w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger toggle (only visible below lg breakpoint) */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-stone-500 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </header>

      {/* 3. MOBILE MENU DROPDOWN LIST */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-stone-200 dark:border-stone-900 bg-white dark:bg-stone-950 px-6 py-4 space-y-3.5 z-30 animate-slide-down">
          {navLinks.map((link) => (
            <button
              key={link.viewName}
              onClick={() => {
                navigateTo(link.viewName);
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-xs uppercase tracking-widest font-mono text-stone-500 hover:text-stone-950 dark:hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* 4. MAIN CENTRAL CONTENT CHANGER */}
      <main id="main-content" className="flex-grow">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/shop" element={
            <React.Suspense fallback={<ShopSkeleton />}>
              <ShopView />
            </React.Suspense>
          } />
          <Route path="/collections/:handle" element={
            <React.Suspense fallback={<ShopSkeleton />}>
              <ShopView />
            </React.Suspense>
          } />
          <Route path="/product/:handle" element={
            <React.Suspense fallback={<ProductSkeleton />}>
              <ProductDetailView />
            </React.Suspense>
          } />
          <Route path="/cart" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <CartView />
            </React.Suspense>
          } />
          <Route path="/wishlist" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <WishlistView />
            </React.Suspense>
          } />
          <Route path="/account" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <AccountDashboardView />
            </React.Suspense>
          } />
          <Route path="/orders" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <AccountDashboardView />
            </React.Suspense>
          } />
          <Route path="/track-order" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <TrackOrderView />
            </React.Suspense>
          } />
          <Route path="/search" element={
            <React.Suspense fallback={<ShopSkeleton />}>
              <ShopView />
            </React.Suspense>
          } />
          <Route path="/about" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <AboutView />
            </React.Suspense>
          } />
          <Route path="/contact" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <ContactView />
            </React.Suspense>
          } />
          <Route path="/privacy" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <PrivacyPolicyView />
            </React.Suspense>
          } />
          <Route path="/terms" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <TermsView />
            </React.Suspense>
          } />
          <Route path="/returns" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <RefundPolicyView />
            </React.Suspense>
          } />
          <Route path="/shipping" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <ShippingPolicyView />
            </React.Suspense>
          } />
          
          {/* Auth Views */}
          <Route path="/account/login" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <LoginView />
            </React.Suspense>
          } />
          <Route path="/account/register" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <RegisterView />
            </React.Suspense>
          } />
          <Route path="/account/forgot-password" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <ForgotPasswordView />
            </React.Suspense>
          } />
          <Route path="/account/reset-password" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <ResetPasswordView />
            </React.Suspense>
          } />
          <Route path="/account/verify-email" element={
            <React.Suspense fallback={<PageSkeleton />}>
              <VerifyEmailView />
            </React.Suspense>
          } />
          
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>

      {/* 5. FOOTER */}
      <footer className="bg-stone-950 text-stone-400 dark:bg-stone-900/60 dark:text-stone-400 border-t border-stone-900 py-16 px-6 sm:px-10 space-y-12 transition-colors">
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer font-display" onClick={() => navigateTo('home')}>
              <div className="w-6 h-6 bg-white dark:bg-white rounded-none flex items-center justify-center">
                <span className="text-stone-950 text-[9px] font-black">A</span>
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-white">APNA ADDA</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
              We engineer beautiful physical objects designed to cultivate absolute peace of mind and minimalist balance. Sourced globally, backed by Shopify, dropshipped straight.
            </p>
            <div className="flex gap-4 text-stone-500">
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook Link"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram Link"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter Link"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick shop coordinates */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">Shop Directory</h4>
            <div className="flex flex-col gap-2 text-xs">
              <button onClick={() => navigateTo('shop', { collection: 'curated-living' })} className="text-left hover:text-white transition-colors">Curated Living</button>
              <button onClick={() => navigateTo('shop', { collection: 'personal-tech' })} className="text-left hover:text-white transition-colors">Personal Tech</button>
              <button onClick={() => navigateTo('shop', { collection: 'modern-apparel' })} className="text-left hover:text-white transition-colors">Modern Apparel</button>
              <button onClick={() => navigateTo('shop', {})} className="text-left hover:text-white transition-colors">All Objects</button>
            </div>
          </div>

          {/* Legal policy files */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">Legal Agreements</h4>
            <div className="flex flex-col gap-2 text-xs">
              <button onClick={() => navigateTo('privacy')} className="text-left hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => navigateTo('refund')} className="text-left hover:text-white transition-colors">Refund & Returns</button>
              <button onClick={() => navigateTo('shipping')} className="text-left hover:text-white transition-colors">Shipping Guidelines</button>
              <button onClick={() => navigateTo('terms')} className="text-left hover:text-white transition-colors">Terms of Service</button>
            </div>
          </div>

          {/* Logistics care */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">Customer Support</h4>
            <div className="flex flex-col gap-2 text-xs">
              <p className="text-stone-500">Corporate care desk open 24/7:</p>
              <span className="font-mono text-white">care@apnaadda.store</span>
              <button onClick={() => navigateTo('faq')} className="text-left hover:text-white transition-colors mt-1 font-bold">Frequently Asked Questions</button>
              <button onClick={() => navigateTo('track-order')} className="text-left hover:text-white transition-colors font-bold">Live Order Tracking</button>
            </div>
          </div>

        </div>

        {/* Trust logos bottom split */}
        <div className="max-w-7xl mx-auto border-t border-stone-900 pt-8 flex flex-wrap justify-between items-center gap-4 text-[10px] font-mono text-stone-600">
          <div className="space-y-1">
            <p>© 2026 APNA ADDA INC. ALL RIGHTS RESERVED.</p>
            <p>DESIGNED UNDER GEOMETRIC BALANCE CRITERIA.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-stone-500" />
            <span>Secure Shopify Encryption Verified</span>
          </div>
        </div>

      </footer>

      {/* 6. MODAL DRAWER OVERLAYS */}
      <SearchDrawer />
      <CartDrawer />
      <ToastContainer />
      <MarketingPopups />

    </div>
  );
}
