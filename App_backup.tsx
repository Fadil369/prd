import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { 
  FileText, Copy, Download, Loader2, Globe,
  Lightbulb, Rocket, Palette, ArrowRight, ArrowLeft, CheckCircle,
  Shield, CreditCard, Users, Smartphone, MessageCircle as WhatsApp,
  Menu, X, Play, Award, MapPin
} from 'lucide-react';

// ===== GLOBAL DECLARATIONS =====
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    analytics?: {
      track: (event: string, properties: Record<string, any>) => void;
    };
  }
}

// ===== TYPES & INTERFACES =====
interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'starter' | 'professional' | 'enterprise';
  trialDaysLeft: number;
  isTrialActive: boolean;
  createdAt: Date;
  features: string[];
}

interface StepData {
  brainstormer: {
    businessIdea: string;
    targetMarket: string;
    uniqueValue: string;
    businessModel: string;
    competitiveAdvantage: string;
    generatedIdeas: string;
  };
  prdCreator: {
    question1: string;
    question2: string;
    question3: string;
    generatedPRD: string;
  };
  prototypeGenerator: {
    appType: string;
    features: string[];
    designStyle: string;
    targetPlatform: string;
    generatedPrototype: string;
  };
}

interface AppContextType {
  user: User | null;
  currentStep: number;
  stepData: StepData;
  currentLocale: string;
  isRTL: boolean;
  setUser: (user: User | null) => void;
  setCurrentStep: (step: number) => void;
  updateStepData: (step: keyof StepData, data: Partial<StepData[keyof StepData]>) => void;
  setCurrentLocale: (locale: string) => void;
  t: (key: string) => string;
}

// ===== TRANSLATIONS =====
const TRANSLATIONS = {
  "en-US": {
    // Landing Page
    "platformTitle": "Idea to Market",
    "platformSubtitle": "Transform Your Ideas into Market-Ready Products with AI",
    "heroDescription": "The complete platform for Saudi entrepreneurs to validate, plan, and prototype their business ideas using advanced AI technology.",
    "getStartedFree": "Start Free Trial",
    "watchDemo": "Watch Demo",
    "trustedBy": "Trusted by 500+ Saudi Entrepreneurs",
    
    // Navigation
    "features": "Features",
    "pricing": "Pricing",
    "about": "About",
    "contact": "Contact",
    "login": "Login",
    "signup": "Sign Up",
    "dashboard": "Dashboard",
    "logout": "Logout",
    
    // Steps
    "step1Title": "Brainstormer",
    "step1Description": "Generate and refine business ideas",
    "step2Title": "PRD Creator", 
    "step2Description": "Create professional product requirements",
    "step3Title": "Prototype Generator",
    "step3Description": "Build interactive prototypes",
    
    // Pricing
    "freePlan": "Free Trial",
    "starterPlan": "Starter",
    "professionalPlan": "Professional", 
    "enterprisePlan": "Enterprise",
    "sarMonth": "SAR/month",
    "mostPopular": "Most Popular",
    "choosePlan": "Choose Plan",
    "currentPlan": "Current Plan",
    
    // Features
    "aiPowered": "AI-Powered Analysis",
    "saudiMarket": "Saudi Market Focus",
    "arabicSupport": "Full Arabic Support",
    "localPayments": "Local Payment Methods",
    "mobileFirst": "Mobile-First Design",
    "expertSupport": "Expert Support",
    
    // Trust Signals
    "saudiCertified": "Saudi Arabia Certified",
    "dataSecure": "Data Security Compliant",
    "localSupport": "Local Support Team",
    "riyadhBased": "Riyadh-Based Company",
    
    // Common
    "next": "Next",
    "previous": "Previous",
    "save": "Save",
    "generate": "Generate",
    "download": "Download",
    "share": "Share",
    "copy": "Copy",
    "print": "Print",
    "loading": "Loading...",
    "error": "Error occurred",
    "success": "Success!",
    "tryAgain": "Try Again",
    "languageToggle": "العربية",
    
    // Brainstormer specific
    "businessIdeaLabel": "What's your business idea?",
    "businessIdeaPlaceholder": "Describe your business concept, no matter how rough...",
    "targetMarketLabel": "Who is your target market in Saudi Arabia?",
    "targetMarketPlaceholder": "Young professionals in Riyadh, families in Jeddah...",
    "uniqueValueLabel": "What makes your idea unique?",
    "uniqueValuePlaceholder": "Your competitive advantage or special approach...",
    "businessModelLabel": "How will you make money?",
    "businessModelPlaceholder": "Subscription, one-time sales, advertising...",
    "competitiveAdvantageLabel": "What's your competitive advantage?",
    "competitiveAdvantagePlaceholder": "Technology, partnerships, market knowledge...",
    "generateIdeas": "Generate Business Analysis",
    "generatingIdeas": "Analyzing Your Business Idea...",
    
    // PRD Creator (existing translations)
    "pageTitle": "PRD Creator",
    "pageSubtitle": "Turn your business plan into a detailed product requirements document",
    "question1Label": "What product or feature are you building?",
    "question1Placeholder": "e.g., A mobile app for food delivery in Saudi Arabia...",
    "question2Label": "Who are the target users and what problem does this solve?",
    "question2Placeholder": "e.g., Busy Saudi families who want convenient meal ordering...",
    "question3Label": "What are the key features and how will you measure success?",
    "question3Placeholder": "e.g., Arabic interface, local payment methods... Success measured by user adoption...",
    "generateButton": "Generate AI-Powered PRD",
    "generatingButton": "AI Generating PRD...",
    
    // Prototype Generator
    "prototypeTitle": "Prototype Generator",
    "prototypeSubtitle": "Create interactive prototypes from your PRD",
    "appTypeLabel": "What type of application?",
    "webApp": "Web Application",
    "mobileApp": "Mobile App",
    "desktopApp": "Desktop Application",
    "featuresLabel": "Key Features",
    "userAuth": "User Authentication",
    "arabicUI": "Arabic Interface",
    "localPayments": "Local Payments",
    "pushNotifications": "Push Notifications",
    "socialSharing": "Social Sharing",
    "offlineMode": "Offline Mode",
    "designStyleLabel": "Design Style",
    "modern": "Modern",
    "minimal": "Minimal",
    "traditional": "Traditional Saudi",
    "colorful": "Colorful",
    "targetPlatformLabel": "Target Platform",
    "ios": "iOS",
    "android": "Android",
    "web": "Web Browser",
    "generatePrototype": "Generate Prototype",
    "generatingPrototype": "Creating Your Prototype...",
    
    // WhatsApp Integration
    "shareWhatsApp": "Share on WhatsApp",
    "whatsappMessage": "Check out my business idea created with Idea to Market platform:",
    
    // Time and Date
    "timeFormat": "en-US",
    "dateFormat": "MM/DD/YYYY",
    "offlineMode": "Offline Mode",
    "workingSaved": "Your work is saved locally",
    "autoSaved": "Auto-saved",
    "saving": "Saving...",
    "installApp": "Install App",
    "installAppDescription": "Get the best experience with our mobile app",
    "install": "Install",
    "dismiss": "Dismiss",
    "closeMenu": "Close menu",
    "openMenu": "Open menu",
    "skipToContent": "Skip to main content",
    "languageSelector": "Language selector",
    "currentLanguage": "Current language"
  },
  
  "ar-SA": {
    // Landing Page
    "platformTitle": "من الفكرة إلى السوق",
    "platformSubtitle": "حوّل أفكارك إلى منتجات جاهزة للسوق بالذكاء الاصطناعي",
    "heroDescription": "المنصة الشاملة لرواد الأعمال السعوديين للتحقق من صحة أفكارهم وتخطيطها وإنشاء نماذج أولية باستخدام تقنية الذكاء الاصطناعي المتقدمة.",
    "getStartedFree": "ابدأ التجربة المجانية",
    "watchDemo": "شاهد العرض التوضيحي",
    "trustedBy": "يثق بنا أكثر من 500 رائد أعمال سعودي",
    
    // Navigation
    "features": "المميزات",
    "pricing": "الأسعار",
    "about": "من نحن",
    "contact": "تواصل معنا",
    "login": "تسجيل الدخول",
    "signup": "إنشاء حساب",
    "dashboard": "لوحة التحكم",
    "logout": "تسجيل الخروج",
    
    // Steps
    "step1Title": "مولد الأفكار",
    "step1Description": "اكتشف وطور أفكار أعمالك",
    "step2Title": "منشئ وثيقة المتطلبات",
    "step2Description": "أنشئ متطلبات منتج احترافية",
    "step3Title": "مولد النموذج الأولي",
    "step3Description": "اصنع نماذج أولية تفاعلية",
    
    // Pricing  
    "freePlan": "التجربة المجانية",
    "starterPlan": "المبتدئ",
    "professionalPlan": "المحترف",
    "enterprisePlan": "المؤسسات",
    "sarMonth": "ريال/شهر",
    "mostPopular": "الأكثر شيوعاً",
    "choosePlan": "اختر الخطة",
    "currentPlan": "الخطة الحالية",
    
    // Features
    "aiPowered": "تحليل بالذكاء الاصطناعي",
    "saudiMarket": "تركيز على السوق السعودي",
    "arabicSupport": "دعم كامل للغة العربية",
    "localPayments": "طرق دفع محلية",
    "mobileFirst": "تصميم يركز على الجوال",
    "expertSupport": "دعم الخبراء",
    
    // Trust Signals
    "saudiCertified": "معتمد في المملكة العربية السعودية",
    "dataSecure": "متوافق مع أمان البيانات",
    "localSupport": "فريق دعم محلي",
    "riyadhBased": "شركة مقرها الرياض",
    
    // Common
    "next": "التالي",
    "previous": "السابق", 
    "save": "حفظ",
    "generate": "إنشاء",
    "download": "تحميل",
    "share": "مشاركة",
    "copy": "نسخ",
    "print": "طباعة",
    "loading": "جاري التحميل...",
    "error": "حدث خطأ",
    "success": "نجح!",
    "tryAgain": "حاول مرة أخرى",
    "languageToggle": "English",
    
    // Brainstormer specific
    "businessIdeaLabel": "ما هي فكرة مشروعك؟",
    "businessIdeaPlaceholder": "اوصف فكرة مشروعك، مهما كانت أولية...",
    "targetMarketLabel": "من هو السوق المستهدف في السعودية؟",
    "targetMarketPlaceholder": "الشباب المهنيين في الرياض، العائلات في جدة...",
    "uniqueValueLabel": "ما الذي يميز فكرتك؟",
    "uniqueValuePlaceholder": "ميزتك التنافسية أو نهجك الخاص...",
    "businessModelLabel": "كيف ستحقق الأرباح؟",
    "businessModelPlaceholder": "اشتراك، مبيعات لمرة واحدة، إعلانات...",
    "competitiveAdvantageLabel": "ما هي ميزتك التنافسية؟",
    "competitiveAdvantagePlaceholder": "التكنولوجيا، الشراكات، معرفة السوق...",
    "generateIdeas": "إنشاء تحليل الأعمال",
    "generatingIdeas": "جاري تحليل فكرة مشروعك...",
    
    // PRD Creator
    "pageTitle": "منشئ وثيقة المتطلبات",
    "pageSubtitle": "حوّل خطة أعمالك إلى وثيقة متطلبات منتج مفصلة",
    "question1Label": "ما المنتج أو الميزة التي تبنيها؟",
    "question1Placeholder": "مثال: تطبيق محمول لتوصيل الطعام في السعودية...",
    "question2Label": "من هم المستخدمون المستهدفون وما المشكلة التي يحلها هذا؟",
    "question2Placeholder": "مثال: العائلات السعودية المشغولة التي تريد طلب وجبات مريح...",
    "question3Label": "ما هي الميزات الرئيسية وكيف ستقيس النجاح؟",
    "question3Placeholder": "مثال: واجهة عربية، طرق دفع محلية... النجاح يُقاس بتبني المستخدمين...",
    "generateButton": "إنشاء وثيقة بالذكاء الاصطناعي",
    "generatingButton": "الذكاء الاصطناعي ينشئ الوثيقة...",
    
    // Prototype Generator
    "prototypeTitle": "مولد النموذج الأولي",
    "prototypeSubtitle": "أنشئ نماذج أولية تفاعلية من وثيقة المتطلبات",
    "appTypeLabel": "ما نوع التطبيق؟",
    "webApp": "تطبيق ويب",
    "mobileApp": "تطبيق محمول",
    "desktopApp": "تطبيق سطح مكتب",
    "featuresLabel": "الميزات الرئيسية",
    "userAuth": "تسجيل المستخدمين",
    "arabicUI": "واجهة عربية",
    "localPayments": "مدفوعات محلية",
    "pushNotifications": "إشعارات فورية",
    "socialSharing": "مشاركة اجتماعية",
    "offlineMode": "وضع عدم الاتصال",
    "designStyleLabel": "نمط التصميم",
    "modern": "عصري",
    "minimal": "بسيط",
    "traditional": "سعودي تقليدي",
    "colorful": "ملون",
    "targetPlatformLabel": "المنصة المستهدفة",
    "ios": "iOS",
    "android": "أندرويد",
    "web": "متصفح الويب",
    "generatePrototype": "إنشاء نموذج أولي",
    "generatingPrototype": "جاري إنشاء نموذجك الأولي...",
    
    // WhatsApp Integration
    "shareWhatsApp": "شارك على واتساب",
    "whatsappMessage": "اطلع على فكرة مشروعي المُنشأة بمنصة من الفكرة إلى السوق:",
    
    // Time and Date
    "timeFormat": "ar-SA",
    "dateFormat": "DD/MM/YYYY",
    "offlineMode": "وضع عدم الاتصال",
    "workingSaved": "تم حفظ عملك محلياً",
    "autoSaved": "تم الحفظ تلقائياً",
    "saving": "جاري الحفظ...",
    "installApp": "تثبيت التطبيق",
    "installAppDescription": "احصل على أفضل تجربة مع تطبيقنا المحمول",
    "install": "تثبيت",
    "dismiss": "إغلاق",
    "closeMenu": "إغلاق القائمة",
    "openMenu": "فتح القائمة",
    "skipToContent": "انتقال إلى المحتوى الرئيسي",
    "languageSelector": "محدد اللغة",
    "currentLanguage": "اللغة الحالية"
  }
};

// ===== CONTEXT =====
// ===== ERROR BOUNDARY =====
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<any> }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    // Log error to analytics service
    console.error('Error Boundary Caught:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error }> = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="mb-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">حدث خطأ غير متوقع</h2>
        <p className="text-gray-600 mb-6">
          نعتذر، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.
        </p>
        {error && (
          <details className="text-left text-sm text-gray-500 bg-gray-50 p-4 rounded mb-4">
            <summary className="cursor-pointer">تفاصيل الخطأ</summary>
            <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
          </details>
        )}
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          إعادة تحميل الصفحة
        </button>
      </div>
    </div>
  </div>
);

// ===== LOADING SKELETONS =====
const LoadingSkeleton: React.FC<{ isRTL: boolean; lines?: number }> = ({ isRTL, lines = 3 }) => (
  <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

const FormSkeleton: React.FC<{ isRTL: boolean }> = ({ isRTL }) => (
  <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-12 bg-gray-100 border rounded-lg"></div>
    </div>
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="h-32 bg-gray-100 border rounded-lg"></div>
    </div>
    <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
  </div>
);

// ===== CUSTOM HOOKS =====
// Hook for auto-save functionality
const useAutoSave = (data: any, key: string, delay: number = 2000) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (data && Object.keys(data).some(k => data[k])) {
        localStorage.setItem(key, JSON.stringify(data));
      }
    }, delay);
    return () => clearTimeout(timeoutId);
  }, [data, key, delay]);
};

// Hook for optimized translations
const useTranslation = (locale: string) => {
  return useMemo(() => {
    const translations = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS['en-US'];
    return (key: string): string => translations[key as keyof typeof translations] || key;
  }, [locale]);
};

// Hook for Saudi time zone handling
const useSaudiTime = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      const saudiTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Riyadh'
      });
      setTime(new Date(saudiTime));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return time;
};

// Hook for touch gestures (popular in Saudi mobile usage)
const useTouchGestures = (elementRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;
      
      // Swipe detection
      if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100 && deltaTime < 500) {
        if (deltaX > 0) {
          // Right swipe
          element.dispatchEvent(new CustomEvent('swipeRight'));
        } else {
          // Left swipe
          element.dispatchEvent(new CustomEvent('swipeLeft'));
        }
      }
    };
    
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef]);
};

// Hook for PWA install prompt
const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  
  const installPWA = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };
  
  return { showInstallPrompt, installPWA, hideInstallPrompt: () => setShowInstallPrompt(false) };
};

// Hook for online/offline status
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};

// Hook for analytics tracking
const useAnalytics = () => {
  const trackEvent = useCallback((eventName: string, properties: Record<string, any> = {}) => {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }
    
    // Custom analytics service
    if (window.analytics) {
      window.analytics.track(eventName, properties);
    }
    
    console.log('Analytics Event:', eventName, properties);
  }, []);
  
  const trackPageView = useCallback((page: string) => {
    trackEvent('page_view', { page });
  }, [trackEvent]);
  
  return { trackEvent, trackPageView };
};

// Hook for A/B testing
const useABTest = (testName: string, variants: string[]) => {
  const [variant, setVariant] = useState<string>(variants[0]);
  
  useEffect(() => {
    // Simple hash-based A/B testing
    const userId = localStorage.getItem('userId') || 'anonymous';
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const variantIndex = Math.abs(hash) % variants.length;
    setVariant(variants[variantIndex]);
  }, [testName, variants]);
  
  return variant;
};

// Hook for payment integration (Saudi-specific)
const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const processPayment = useCallback(async (paymentData: {
    amount: number;
    currency: string;
    method: 'mada' | 'visa' | 'mastercard' | 'stc_pay' | 'apple_pay';
    planId: string;
  }) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Integration with Saudi payment gateways
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          locale: 'ar-SA',
          country: 'SA',
          timezone: 'Asia/Riyadh'
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Payment failed');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);
  
  return { processPayment, isProcessing, error };
};

// Hook for Claude API integration with Saudi-specific prompts
const useClaudeAPI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateContent = useCallback(async (prompt: string, context: {
    market: string;
    language: string;
    industry?: string;
    tone?: 'formal' | 'friendly' | 'professional';
  }) => {
    setIsGenerating(true);
    setError(null);
    
    const saudiContext = `
Context: Saudi Arabian market focus
Language: ${context.language === 'ar-SA' ? 'Arabic' : 'English'}
Cultural considerations: Islamic values, conservative business practices, Vision 2030 alignment
Market specifics: ${context.market}
Tone: ${context.tone || 'professional'}

Please provide culturally appropriate and market-relevant content.

User Request: ${prompt}`;
    
    try {
      const response = await fetch('/api/claude/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`
        },
        body: JSON.stringify({
          prompt: saudiContext,
          max_tokens: 4000,
          temperature: 0.7
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate content');
      }
      
      return result.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Content generation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  return { generateContent, isGenerating, error };
};

// Hook for real-time collaboration preparation
const useCollaboration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  
  useEffect(() => {
    // WebSocket connection for real-time collaboration
    // This would connect to your collaboration service
    const ws = new WebSocket(process.env.WEBSOCKET_URL || 'ws://localhost:3001');
    
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'collaborators_update') {
        setCollaborators(data.collaborators);
      }
    };
    
    return () => {
      ws.close();
    };
  }, []);
  
  return { isConnected, collaborators };
};

// Hook for AI API with retry logic
const useAIGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateWithRetry = useCallback(async (prompt: string, maxRetries: number = 3): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        // Simulate API call - replace with actual Claude API integration
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
        
        if (Math.random() > 0.1) { // 90% success rate simulation
          const response = `Generated response for: ${prompt.substring(0, 50)}...`;
          setIsLoading(false);
          return response;
        } else {
          throw new Error('API Error');
        }
      } catch (err) {
        if (i === maxRetries - 1) {
          setError('Failed to generate content after multiple attempts');
          setIsLoading(false);
          throw err;
        }
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000)); // Exponential backoff
      }
    }
    
    setIsLoading(false);
    throw new Error('Max retries exceeded');
  }, []);
  
  return { generateWithRetry, isLoading, error };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// ===== MAIN APP COMPONENT =====
const IdeaToMarketApp: React.FC = () => {
  // Core State Management
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: Landing, 1-3: Steps
  const [currentLocale, setCurrentLocale] = useState<string>('ar-SA'); // Arabic first
  const [isRTL, setIsRTL] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Custom hooks for enhanced functionality
  const isOnline = useOnlineStatus();
  const saudiTime = useSaudiTime();
  const t = useTranslation(currentLocale);
  const { showInstallPrompt, installPWA, hideInstallPrompt } = usePWAInstall();
  const { trackEvent, trackPageView } = useAnalytics();
  const { processPayment } = usePayment();
  const { generateContent } = useClaudeAPI();
  const { isConnected: isCollabConnected, collaborators } = useCollaboration();
  
  // A/B test for button colors
  const buttonColorVariant = useABTest('button_colors', ['blue', 'green', 'purple']);
  
  // Step Data Management
  const [stepData, setStepData] = useState<StepData>({
    brainstormer: {
      businessIdea: '',
      targetMarket: '',
      uniqueValue: '',
      businessModel: '',
      competitiveAdvantage: '',
      generatedIdeas: ''
    },
    prdCreator: {
      question1: '',
      question2: '',
      question3: '',
      generatedPRD: ''
    },
    prototypeGenerator: {
      appType: 'mobileApp',
      features: [],
      designStyle: 'modern',
      targetPlatform: 'android',
      generatedPrototype: ''
    }
  });

  // Translation function
  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('ideaToMarket_stepData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setStepData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to load saved data:', error);
      }
    }
  }, []);
  
  // Track page views when step changes
  useEffect(() => {
    const stepNames = ['landing', 'brainstormer', 'prd-creator', 'prototype-generator'];
    trackPageView(stepNames[currentStep] || 'unknown');
  }, [currentStep, trackPageView]);

  // Update RTL and document direction
  useEffect(() => {
    const newIsRTL = currentLocale.startsWith('ar');
    setIsRTL(newIsRTL);
    document.documentElement.dir = newIsRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLocale.split('-')[0];
  }, [currentLocale]);

  // Handle language toggle
  const handleLanguageToggle = () => {
    const newLocale = currentLocale === 'en-US' ? 'ar-SA' : 'en-US';
    setCurrentLocale(newLocale);
  };

  // Update step data
  const updateStepData = useCallback((step: keyof StepData, data: Partial<StepData[keyof StepData]>) => {
    setStepData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  }, []);
  
  // Auto-save functionality
  useAutoSave(stepData, 'ideaToMarket_stepData', 1500);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue: AppContextType = useMemo(() => ({
    user,
    currentStep,
    stepData,
    currentLocale,
    isRTL,
    setUser,
    setCurrentStep,
    updateStepData,
    setCurrentLocale,
    t
  }), [user, currentStep, stepData, currentLocale, isRTL, updateStepData, t]);

  // ===== LANDING PAGE COMPONENT =====
  const LandingPage: React.FC = () => {
    const { t, isRTL } = useApp();

    return (
      <div className={`min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Navigation Header */}
        <nav className="bg-white/90 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">{t('platformTitle')}</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">{t('features')}</a>
                <a href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors">{t('pricing')}</a>
                <a href="#about" className="text-gray-600 hover:text-green-600 transition-colors">{t('about')}</a>
                <button
                  onClick={handleLanguageToggle}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{t('languageToggle')}</span>
                </button>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {t('getStartedFree')}
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden pb-4 border-t border-gray-100">
                <div className="flex flex-col gap-4 pt-4">
                  <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">{t('features')}</a>
                  <a href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors">{t('pricing')}</a>
                  <button
                    onClick={handleLanguageToggle}
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors self-start"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{t('languageToggle')}</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium self-start"
                  >
                    {t('getStartedFree')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className={`text-4xl md:text-6xl font-bold text-gray-900 mb-6 ${isRTL ? 'text-right' : 'text-left'} md:text-center`}>
                {t('platformTitle')}
              </h1>
              <p className={`text-xl md:text-2xl text-gray-600 mb-4 ${isRTL ? 'text-right' : 'text-left'} md:text-center`}>
                {t('platformSubtitle')}
              </p>
              <p className={`text-lg text-gray-500 mb-8 max-w-3xl mx-auto ${isRTL ? 'text-right' : 'text-left'} md:text-center`}>
                {t('heroDescription')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center gap-3"
                >
                  <Rocket className="w-5 h-5" />
                  {t('getStartedFree')}
                </button>
                <button className="px-8 py-4 bg-white/80 text-gray-700 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all shadow-lg backdrop-blur-sm border border-white/50 flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  {t('watchDemo')}
                </button>
              </div>

              {/* Trust Signal */}
              <p className="text-sm text-gray-500 mb-8">{t('trustedBy')}</p>

              {/* Saudi Trust Badges */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  {t('saudiCertified')}
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-600" />
                  {t('dataSecure')}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  {t('riyadhBased')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Process Preview */}
        <section className="py-20 bg-white/50 backdrop-blur-sm" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'} md:text-center`}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                طريقة عملنا في ثلاث خطوات بسيطة
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                من الفكرة الأولى إلى النموذج الأولي الجاهز للسوق السعودي
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('step1Title')}
                </h3>
                <p className={`text-gray-600 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('step1Description')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">AI-Powered</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Saudi Market</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('step2Title')}
                </h3>
                <p className={`text-gray-600 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('step2Description')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Professional</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Detailed</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('step3Title')}
                </h3>
                <p className={`text-gray-600 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('step3Description')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Interactive</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Mobile-First</span>
                </div>
              </div>

              {/* Connecting Lines (Desktop Only) */}
              <div className="hidden md:block absolute top-1/2 left-1/3 transform -translate-y-1/2 translate-x-8">
                <ArrowRight className="w-6 h-6 text-gray-300" />
              </div>
              <div className="hidden md:block absolute top-1/2 right-1/3 transform -translate-y-1/2 -translate-x-8">
                <ArrowRight className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>
        </section>

        {/* Saudi-Focused Features */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'} md:text-center`}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                مصمم خصيصاً للسوق السعودي
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                نفهم احتياجات رواد الأعمال السعوديين ونوفر الأدوات المناسبة لهم
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/50">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('arabicSupport')}
                </h3>
                <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  واجهة عربية كاملة مع دعم RTL واستيعاب الثقافة المحلية
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/50">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('localPayments')}
                </h3>
                <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  دعم مدى، STC Pay، Apple Pay وطرق الدفع المحلية
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/50">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('mobileFirst')}
                </h3>
                <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  مصمم أولاً للجوال لتناسب عادات الاستخدام السعودية
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/50">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('expertSupport')}
                </h3>
                <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  فريق دعم محلي من خبراء ريادة الأعمال السعوديين
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/50">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('dataSecure')}
                </h3>
                <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  أمان البيانات وفقاً للمعايير السعودية والعالمية
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/50">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <WhatsApp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  تكامل واتساب
                </h3>
                <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  مشاركة مشاريعك ونماذجك الأولية عبر واتساب بسهولة
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-white/50 backdrop-blur-sm" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'} md:text-center`}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                خطط أسعار تناسب جميع رواد الأعمال
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                ابدأ مجاناً وانتقل للخطط المدفوعة حسب نمو مشروعك
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Free Trial */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all">
                <div className={`${isRTL ? 'text-right' : 'text-left'} mb-6`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('freePlan')}</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    مجاني
                  </div>
                  <p className="text-gray-500">لمدة 7 أيام</p>
                </div>
                <ul className={`space-y-3 mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">3 أفكار مشاريع</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">وثيقة متطلبات واحدة</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">نموذج أولي واحد</span>
                  </li>
                </ul>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  {t('getStartedFree')}
                </button>
              </div>

              {/* Starter Plan */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all">
                <div className={`${isRTL ? 'text-right' : 'text-left'} mb-6`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('starterPlan')}</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    99 <span className="text-lg font-normal text-gray-500">{t('sarMonth')}</span>
                  </div>
                  <p className="text-gray-500">للمشاريع الصغيرة</p>
                </div>
                <ul className={`space-y-3 mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">10 أفكار مشاريع شهرياً</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">5 وثائق متطلبات</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">3 نماذج أولية</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">دعم بريد إلكتروني</span>
                  </li>
                </ul>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all">
                  {t('choosePlan')}
                </button>
              </div>

              {/* Professional Plan - Most Popular */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-2 border-green-500 hover:shadow-2xl transition-all relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {t('mostPopular')}
                  </span>
                </div>
                <div className={`${isRTL ? 'text-right' : 'text-left'} mb-6`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('professionalPlan')}</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    299 <span className="text-lg font-normal text-gray-500">{t('sarMonth')}</span>
                  </div>
                  <p className="text-gray-500">للشركات النامية</p>
                </div>
                <ul className={`space-y-3 mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">50 فكرة مشروع شهرياً</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">25 وثيقة متطلبات</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">15 نموذج أولي</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">دعم أولوية</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">استشارات شهرية</span>
                  </li>
                </ul>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all">
                  {t('choosePlan')}
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all">
                <div className={`${isRTL ? 'text-right' : 'text-left'} mb-6`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('enterprisePlan')}</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    تواصل معنا
                  </div>
                  <p className="text-gray-500">للمؤسسات الكبيرة</p>
                </div>
                <ul className={`space-y-3 mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">استخدام غير محدود</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">فرق متعددة</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">تكامل API</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">دعم مخصص</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">تدريب الفريق</span>
                  </li>
                </ul>
                <button className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                  تواصل معنا
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">{t('platformTitle')}</span>
                </div>
                <p className="text-gray-400 mb-4">
                  المنصة الرائدة لتحويل الأفكار إلى منتجات جاهزة للسوق السعودي
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  الرياض، المملكة العربية السعودية
                </div>
              </div>

              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h4 className="text-lg font-semibold mb-4">المنصة</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">مولد الأفكار</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">منشئ وثيقة المتطلبات</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">مولد النماذج الأولية</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">المميزات</a></li>
                </ul>
              </div>

              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h4 className="text-lg font-semibold mb-4">الدعم</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">مركز المساعدة</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">تواصل معنا</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a></li>
                </ul>
              </div>

              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">
                    <WhatsApp className="w-4 h-4" />
                    <span>+966 50 123 4567</span>
                  </li>
                  <li>support@ideatomarket.sa</li>
                  <li>
                    <div className="flex gap-3 mt-4">
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                        <WhatsApp className="w-4 h-4" />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className={`border-t border-gray-800 pt-8 text-center ${isRTL ? 'text-right' : 'text-left'} md:text-center`}>
              <p className="text-gray-400">
                © 2024 منصة من الفكرة إلى السوق. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  // ===== STEP COMPONENTS =====
  const StepHeader: React.FC<{ stepNumber: number }> = ({ stepNumber }) => {
    const { t, isRTL, currentStep } = useApp();
    
    const steps = [
      { number: 1, title: t('step1Title'), icon: Lightbulb },
      { number: 2, title: t('step2Title'), icon: FileText },
      { number: 3, title: t('step3Title'), icon: Palette }
    ];

    return (
      <div className="bg-white/90 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              
              return (
                <React.Fragment key={step.number}>
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive
                          ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0 text-right' : ''}`}>
                      <p className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4">
                      <div className={`h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Language Toggle */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(0)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للرئيسية
            </button>
            
            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white/90 text-gray-700 rounded-full transition-all backdrop-blur-sm border border-white/40"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{t('languageToggle')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Brainstormer Component
  const BrainstormerStep: React.FC = () => {
    const { t, isRTL, stepData, updateStepData } = useApp();
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (field: keyof StepData['brainstormer'], value: string) => {
      updateStepData('brainstormer', { [field]: value });
    };

    const generateBusinessAnalysis = async () => {
      setIsGenerating(true);
      setError('');
      
      const languageInstruction = isRTL ? 'Please respond in Arabic language with proper RTL formatting.' : 'Please respond in English language.';
      
      const prompt = `You are a seasoned business consultant specializing in the Saudi Arabian market. Analyze this business idea and provide comprehensive insights:

Business Idea: ${stepData.brainstormer.businessIdea}
Target Market: ${stepData.brainstormer.targetMarket}
Unique Value: ${stepData.brainstormer.uniqueValue}
Business Model: ${stepData.brainstormer.businessModel}
Competitive Advantage: ${stepData.brainstormer.competitiveAdvantage}

${languageInstruction}

Provide a detailed analysis following this structure:

# Business Idea Analysis: [BUSINESS NAME]

## Executive Summary
[2-3 sentence compelling summary of the business opportunity]

## Market Opportunity in Saudi Arabia
### Market Size & Potential
* [Specific market size data for Saudi Arabia]
* [Growth trends and projections]
* [Key market drivers]

### Target Customer Profile
* [Detailed customer personas for Saudi market]
* [Customer pain points and needs]
* [Buying behavior and preferences]

## Competitive Landscape
### Direct Competitors
* [Key competitors in Saudi Arabia]
* [Their strengths and weaknesses]

### Competitive Advantage Analysis
* [How this business stands out]
* [Sustainable differentiation factors]

## Business Model Assessment
### Revenue Streams
* [Primary revenue sources]
* [Pricing strategy for Saudi market]
* [Revenue projections]

### Cost Structure
* [Key cost components]
* [Fixed vs variable costs]

## Implementation Strategy
### Go-to-Market Plan
* [Launch strategy for Saudi market]
* [Marketing channels and approach]
* [Partnership opportunities]

### Milestones & Timeline
* [6-month milestones]
* [12-month goals]
* [18-month vision]

## Risk Analysis
### Market Risks
* [Potential market challenges]
* [Regulatory considerations in KSA]

### Mitigation Strategies
* [Risk mitigation approaches]
* [Contingency plans]

## Success Metrics
### Key Performance Indicators
* [Primary KPIs to track]
* [Success benchmarks]
* [Timeline for achieving goals]

## Recommendations
### Next Steps
* [Immediate action items]
* [Resource requirements]
* [Success factors]

### Saudi Market Considerations
* [Cultural factors to consider]
* [Local regulations and compliance]
* [Local partnership opportunities]

Make it specific to the Saudi Arabian market with cultural insights, local regulations, and market dynamics. Include specific numbers and actionable recommendations.`;

      try {
        // Simulate AI call - Replace with actual Claude API
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const mockResponse = `# تحليل فكرة المشروع: ${stepData.brainstormer.businessIdea}

## الملخص التنفيذي
فكرة مشروع واعدة تستهدف السوق السعودي بحلول مبتكرة تلبي احتياجات العملاء المحليين...

## الفرصة التجارية في السعودية
### حجم السوق والإمكانات
* حجم السوق المقدر: 2.5 مليار ريال سعودي
* معدل النمو المتوقع: 15% سنوياً
* العوامل المحركة: رؤية 2030 والتحول الرقمي

### ملف العميل المستهدف
* الفئة الرئيسية: ${stepData.brainstormer.targetMarket}
* نقاط الألم: الحاجة لحلول مبتكرة وسريعة
* سلوك الشراء: تفضيل للمنتجات المحلية والمتوافقة ثقافياً

## المشهد التنافسي
### المنافسون المباشرون
* شركة XYZ: قوية في التسويق لكن ضعيفة في الخدمة
* شركة ABC: منتجات جيدة لكن أسعار مرتفعة

### تحليل الميزة التنافسية
* ${stepData.brainstormer.competitiveAdvantage}
* عوامل التميز المستدامة: التركيز على الثقافة المحلية

## تقييم نموذج الأعمال
### مصادر الإيرادات
* ${stepData.brainstormer.businessModel}
* استراتيجية التسعير: تنافسية مع هامش ربح جيد

## استراتيجية التنفيذ
### خطة دخول السوق
* البدء في الرياض وجدة
* التوسع تدريجياً للمناطق الأخرى

## تحليل المخاطر
### مخاطر السوق
* التغيرات التنظيمية
* زيادة المنافسة

## مقاييس النجاح
### مؤشرات الأداء الرئيسية
* عدد العملاء المكتسبين شهرياً
* معدل الاحتفاظ بالعملاء
* الإيرادات الشهرية

## التوصيات
### الخطوات التالية
* تطوير نموذج أولي للمنتج
* إجراء دراسة سوق تفصيلية
* البحث عن شركاء محليين

### اعتبارات السوق السعودي
* مراعاة العادات والتقاليد المحلية
* الامتثال للوائح المحلية
* فرص الشراكة مع الجهات الحكومية`;

        updateStepData('brainstormer', { generatedIdeas: mockResponse });
      } catch (err) {
        setError('Failed to generate business analysis. Please try again.');
      }
      
      setIsGenerating(false);
    };

    const isFormValid = stepData.brainstormer.businessIdea && 
                       stepData.brainstormer.targetMarket && 
                       stepData.brainstormer.uniqueValue &&
                       stepData.brainstormer.businessModel &&
                       stepData.brainstormer.competitiveAdvantage;

    return (
      <div className={`min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Left Side - Input Form */}
        <div className={`w-1/2 p-8 overflow-y-auto ${isRTL ? 'order-2' : 'order-1'}`}>
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('step1Title')}
              </h1>
              <p className={`text-xl text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                أخبرنا عن فكرة مشروعك وسنساعدك في تحليلها وتطويرها
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/50 p-8">
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('businessIdeaLabel')} *
                  </label>
                  <textarea
                    value={stepData.brainstormer.businessIdea}
                    onChange={(e) => handleInputChange('businessIdea', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                    rows={4}
                    placeholder={t('businessIdeaPlaceholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('targetMarketLabel')} *
                  </label>
                  <textarea
                    value={stepData.brainstormer.targetMarket}
                    onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                    rows={3}
                    placeholder={t('targetMarketPlaceholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('uniqueValueLabel')} *
                  </label>
                  <textarea
                    value={stepData.brainstormer.uniqueValue}
                    onChange={(e) => handleInputChange('uniqueValue', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                    rows={3}
                    placeholder={t('uniqueValuePlaceholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('businessModelLabel')} *
                  </label>
                  <textarea
                    value={stepData.brainstormer.businessModel}
                    onChange={(e) => handleInputChange('businessModel', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                    rows={3}
                    placeholder={t('businessModelPlaceholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('competitiveAdvantageLabel')} *
                  </label>
                  <textarea
                    value={stepData.brainstormer.competitiveAdvantage}
                    onChange={(e) => handleInputChange('competitiveAdvantage', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                    rows={3}
                    placeholder={t('competitiveAdvantagePlaceholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <button
                  onClick={generateBusinessAnalysis}
                  disabled={isGenerating || !isFormValid}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('generatingIdeas')}
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-5 h-5" />
                      {t('generateIdeas')}
                    </>
                  )}
                </button>

                {error && (
                  <p className={`text-red-600 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{error}</p>
                )}

                {stepData.brainstormer.generatedIdeas && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      {t('next')}: {t('step2Title')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Generated Analysis */}
        <div className={`w-1/2 bg-white/90 backdrop-blur-lg border-l border-white/50 flex flex-col ${isRTL ? 'order-1 border-r border-l-0' : 'order-2'}`}>
          {/* Header */}
          {stepData.brainstormer.generatedIdeas && (
            <div className="border-b border-white/50 p-4 flex items-center justify-end bg-white/90 backdrop-blur-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(stepData.brainstormer.generatedIdeas)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 rounded-md transition-colors"
                  title={t('copy')}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([stepData.brainstormer.generatedIdeas], { type: 'text/markdown' });
                    element.href = URL.createObjectURL(file);
                    element.download = 'business-analysis.md';
                    element.click();
                  }}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50/80 rounded-md transition-colors"
                  title={t('download')}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(t('whatsappMessage') + '\n\n' + stepData.brainstormer.generatedIdeas)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50/80 rounded-md transition-colors"
                  title={t('shareWhatsApp')}
                >
                  <WhatsApp className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {stepData.brainstormer.generatedIdeas ? (
              <div 
                className={`prose prose-sm max-w-none text-gray-800 ${isRTL ? 'prose-rtl' : ''}`}
                dangerouslySetInnerHTML={{ 
                  __html: stepData.brainstormer.generatedIdeas
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h2>')
                    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h3>')
                }}
              />
            ) : (
              <div className={`text-gray-500 text-center py-12 ${isRTL ? 'text-right' : 'text-left'}`}>
                <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>تحليل فكرة مشروعك سيظهر هنا بعد ملء النموذج</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // PRD Creator Component - Using existing implementation
  const PRDCreatorStep: React.FC = () => {
    const { t, isRTL, stepData, updateStepData } = useApp();
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (field: keyof StepData['prdCreator'], value: string) => {
      updateStepData('prdCreator', { [field]: value });
    };

    const generatePRD = async () => {
      setIsGenerating(true);
      setError('');
      
      const languageInstruction = isRTL ? 'Please respond in Arabic language with proper RTL formatting.' : 'Please respond in English language.';
      
      const prompt = `You are an expert product manager with 10+ years of experience creating successful PRDs for Saudi Arabian market. Create a comprehensive, professional one-pager PRD based on these inputs:

1. Product/Feature: ${stepData.prdCreator.question1}
2. Target Users & Problem: ${stepData.prdCreator.question2}  
3. Key Functionality & Success Metrics: ${stepData.prdCreator.question3}

${languageInstruction}

Focus specifically on Saudi market requirements, cultural considerations, Arabic language support, local payment methods, and regulatory compliance.

Format the PRD exactly following this template using proper markdown headers...`;

      try {
        // Simulate AI generation
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const mockPRD = `# وثيقة متطلبات المنتج: ${stepData.prdCreator.question1}

## 1. الملخص التنفيذي
منتج مصمم خصيصاً للسوق السعودي يلبي احتياجات المستخدمين المحليين ويتوافق مع الثقافة والتقاليد...

## 2. الأهداف
### الأهداف التجارية
* زيادة حصة السوق في المملكة العربية السعودية بنسبة 25%
* تحقيق إيرادات شهرية تبلغ 500,000 ريال سعودي خلال 6 أشهر
* بناء قاعدة عملاء مخلصين من 10,000 مستخدم نشط

### أهداف المستخدمين
* توفير حل سهل ومريح للمشكلة المحددة
* تجربة مستخدم متميزة باللغة العربية
* دعم طرق الدفع المحلية المفضلة

## 3. المتطلبات الوظيفية
### المتطلبات الأساسية (P0)
* واجهة مستخدم كاملة باللغة العربية مع دعم RTL
* تسجيل الدخول عبر رقم الجوال (OTP)
* دعم مدى وSTC Pay وApple Pay
* تشفير البيانات وفقاً للمعايير السعودية

### المتطلبات المهمة (P1)  
* إشعارات push باللغة العربية
* مشاركة عبر WhatsApp
* دعم للعملاء باللغة العربية
* تحليلات الاستخدام والسلوك

## 4. تجربة المستخدم
### المسار الأساسي
1. المستخدم يفتح التطبيق
2. يختار اللغة العربية كافتراضية
3. يسجل الدخول برقم الجوال السعودي
4. يتصفح المحتوى المحلي المناسب
5. يكمل المهمة المطلوبة بسهولة

## 5. مقاييس النجاح
### مؤشرات الأداء الرئيسية
* معدل اكتساب المستخدمين: 1000 مستخدم جديد أسبوعياً
* معدل الاحتفاظ: 70% بعد شهر واحد
* معدل إكمال المهام: 85%
* درجة رضا المستخدمين: 4.5/5

## 6. الجدول الزمني
### المرحلة الأولى (شهرين)
* تطوير الواجهة العربية الأساسية
* تكامل طرق الدفع المحلية
* اختبار beta مع مجموعة مختارة

### المرحلة الثانية (شهر واحد)
* إطلاق عام في الرياض وجدة
* حملة تسويقية رقمية
* دعم العملاء متعدد القنوات

## 7. المخاطر والتخفيف
* **المخاطر التنظيمية**: مراجعة دورية للامتثال للوائح المحلية
* **مخاطر الأمان**: تطبيق أعلى معايير الأمان السيبراني
* **المنافسة**: التركيز على الميزات الفريدة والدعم المحلي`;

        updateStepData('prdCreator', { generatedPRD: mockPRD });
      } catch (err) {
        setError('Failed to generate PRD. Please try again.');
      }
      
      setIsGenerating(false);
    };

    const isFormValid = stepData.prdCreator.question1 && 
                       stepData.prdCreator.question2 && 
                       stepData.prdCreator.question3;

    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Left Side - Input Form */}
        <div className={`w-1/2 p-8 overflow-y-auto ${isRTL ? 'order-2' : 'order-1'}`}>
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('pageTitle')}
              </h1>
              <p className={`text-xl text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('pageSubtitle')}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/50 p-8">
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('question1Label')} *
                  </label>
                  <textarea
                    value={stepData.prdCreator.question1}
                    onChange={(e) => handleInputChange('question1', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                    rows={4}
                    placeholder={t('question1Placeholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('question2Label')} *
                  </label>
                  <textarea
                    value={stepData.prdCreator.question2}
                    onChange={(e) => handleInputChange('question2', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                    rows={4}
                    placeholder={t('question2Placeholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('question3Label')} *
                  </label>
                  <textarea
                    value={stepData.prdCreator.question3}
                    onChange={(e) => handleInputChange('question3', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                    rows={4}
                    placeholder={t('question3Placeholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <button
                  onClick={generatePRD}
                  disabled={isGenerating || !isFormValid}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('generatingButton')}
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      {t('generateButton')}
                    </>
                  )}
                </button>

                {error && (
                  <p className={`text-red-600 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{error}</p>
                )}

                {/* Navigation */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t('previous')}: {t('step1Title')}
                  </button>
                  
                  {stepData.prdCreator.generatedPRD && (
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      {t('next')}: {t('step3Title')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Generated PRD */}
        <div className={`w-1/2 bg-white/90 backdrop-blur-lg border-l border-white/50 flex flex-col ${isRTL ? 'order-1 border-r border-l-0' : 'order-2'}`}>
          {/* Header */}
          {stepData.prdCreator.generatedPRD && (
            <div className="border-b border-white/50 p-4 flex items-center justify-end bg-white/90 backdrop-blur-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(stepData.prdCreator.generatedPRD)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 rounded-md transition-colors"
                  title={t('copy')}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([stepData.prdCreator.generatedPRD], { type: 'text/markdown' });
                    element.href = URL.createObjectURL(file);
                    element.download = 'prd-document.md';
                    element.click();
                  }}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50/80 rounded-md transition-colors"
                  title={t('download')}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(t('whatsappMessage') + '\n\n' + stepData.prdCreator.generatedPRD)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50/80 rounded-md transition-colors"
                  title={t('shareWhatsApp')}
                >
                  <WhatsApp className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {stepData.prdCreator.generatedPRD ? (
              <div 
                className={`prose prose-sm max-w-none text-gray-800 ${isRTL ? 'prose-rtl text-right' : 'text-left'}`}
                dangerouslySetInnerHTML={{ 
                  __html: stepData.prdCreator.generatedPRD
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h2>')
                    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h3>')
                }}
              />
            ) : (
              <div className={`text-gray-500 text-center py-12 ${isRTL ? 'text-right' : 'text-left'}`}>
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>وثيقة متطلبات المنتج ستظهر هنا بعد الإجابة على الأسئلة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Prototype Generator Component
  const PrototypeGeneratorStep: React.FC = () => {
    const { t, isRTL, stepData, updateStepData } = useApp();
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (field: keyof StepData['prototypeGenerator'], value: any) => {
      updateStepData('prototypeGenerator', { [field]: value });
    };

    const handleFeatureToggle = (feature: string) => {
      const currentFeatures = stepData.prototypeGenerator.features;
      const updatedFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter(f => f !== feature)
        : [...currentFeatures, feature];
      handleInputChange('features', updatedFeatures);
    };

    const generatePrototype = async () => {
      setIsGenerating(true);
      setError('');
      
      try {
        // Simulate prototype generation
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        const mockPrototype = `# النموذج الأولي التفاعلي

## نظرة عامة على التطبيق
نوع التطبيق: ${t(stepData.prototypeGenerator.appType)}
المنصة المستهدفة: ${t(stepData.prototypeGenerator.targetPlatform)}
نمط التصميم: ${t(stepData.prototypeGenerator.designStyle)}

## الميزات المختارة
${stepData.prototypeGenerator.features.map(feature => `• ${t(feature)}`).join('\n')}

## تخطيط الشاشات

### 1. شاشة الترحيب
- تصميم جذاب مع العلامة التجارية
- أزرار تسجيل الدخول والتسجيل
- إمكانية اختيار اللغة (عربي/إنجليزي)

### 2. شاشة تسجيل الدخول
- حقل رقم الجوال السعودي
- زر إرسال رمز التحقق
- دعم كامل للغة العربية

### 3. الشاشة الرئيسية
- واجهة سهلة الاستخدام
- قائمة تنقل واضحة
- محتوى مخصص للمستخدم

### 4. شاشات الميزات
${stepData.prototypeGenerator.features.map(feature => `- شاشة ${t(feature)}`).join('\n')}

## تفاعلات المستخدم
- انتقالات سلسة بين الشاشات
- تحميل سريع وسلس
- تجاوبية كاملة مع الأجهزة المختلفة

## الألوان والتصميم
نمط التصميم: ${t(stepData.prototypeGenerator.designStyle)}
- ألوان متوافقة مع الثقافة السعودية
- خطوط عربية واضحة ومقروءة
- تخطيط RTL مناسب

## التكامل المحلي
- دعم مدى وطرق الدفع المحلية
- تكامل مع WhatsApp للمشاركة
- دعم للمنطقة الزمنية السعودية
- تقويم هجري وميلادي

## المرحلة التالية
النموذج الأولي جاهز للمراجعة والاختبار مع المستخدمين المستهدفين في السوق السعودي.`;

        updateStepData('prototypeGenerator', { generatedPrototype: mockPrototype });
      } catch (err) {
        setError('Failed to generate prototype. Please try again.');
      }
      
      setIsGenerating(false);
    };

    const appTypes = [
      { value: 'webApp', label: t('webApp'), icon: Globe },
      { value: 'mobileApp', label: t('mobileApp'), icon: Smartphone },
      { value: 'desktopApp', label: t('desktopApp'), icon: Palette }
    ];

    const features = [
      'userAuth', 'arabicUI', 'localPayments', 'pushNotifications', 'socialSharing', 'offlineMode'
    ];

    const designStyles = [
      { value: 'modern', label: t('modern') },
      { value: 'minimal', label: t('minimal') },
      { value: 'traditional', label: t('traditional') },
      { value: 'colorful', label: t('colorful') }
    ];

    const platforms = [
      { value: 'ios', label: t('ios') },
      { value: 'android', label: t('android') },
      { value: 'web', label: t('web') }
    ];

    return (
      <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Left Side - Input Form */}
        <div className={`w-1/2 p-8 overflow-y-auto ${isRTL ? 'order-2' : 'order-1'}`}>
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('prototypeTitle')}
              </h1>
              <p className={`text-xl text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('prototypeSubtitle')}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/50 p-8">
              <div className="space-y-8">
                {/* App Type Selection */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('appTypeLabel')} *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {appTypes.map(type => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => handleInputChange('appType', type.value)}
                          className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                            stepData.prototypeGenerator.appType === type.value
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-purple-300'
                          } ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Features Selection */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('featuresLabel')} *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {features.map(feature => (
                      <button
                        key={feature}
                        onClick={() => handleFeatureToggle(feature)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          stepData.prototypeGenerator.features.includes(feature)
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300'
                        } ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <CheckCircle className={`w-4 h-4 ${
                            stepData.prototypeGenerator.features.includes(feature) ? 'text-purple-600' : 'text-gray-300'
                          }`} />
                          <span className="text-sm font-medium">{t(feature)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Design Style */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('designStyleLabel')} *
                  </label>
                  <select
                    value={stepData.prototypeGenerator.designStyle}
                    onChange={(e) => handleInputChange('designStyle', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 ${isRTL ? 'text-right' : 'text-left'}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {designStyles.map(style => (
                      <option key={style.value} value={style.value}>
                        {style.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Platform */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('targetPlatformLabel')} *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {platforms.map(platform => (
                      <button
                        key={platform.value}
                        onClick={() => handleInputChange('targetPlatform', platform.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          stepData.prototypeGenerator.targetPlatform === platform.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300'
                        } text-center`}
                      >
                        <span className="text-sm font-medium">{platform.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generatePrototype}
                  disabled={isGenerating || stepData.prototypeGenerator.features.length === 0}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('generatingPrototype')}
                    </>
                  ) : (
                    <>
                      <Palette className="w-5 h-5" />
                      {t('generatePrototype')}
                    </>
                  )}
                </button>

                {error && (
                  <p className={`text-red-600 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{error}</p>
                )}

                {/* Navigation */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t('previous')}: {t('step2Title')}
                  </button>
                  
                  {stepData.prototypeGenerator.generatedPrototype && (
                    <button
                      onClick={() => {
                        // Share complete project via WhatsApp
                        const completeProject = `${t('whatsappMessage')}\n\n=== تحليل المشروع ===\n${stepData.brainstormer.generatedIdeas}\n\n=== وثيقة المتطلبات ===\n${stepData.prdCreator.generatedPRD}\n\n=== النموذج الأولي ===\n${stepData.prototypeGenerator.generatedPrototype}`;
                        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(completeProject)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <WhatsApp className="w-4 h-4" />
                      مشاركة المشروع الكامل
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Generated Prototype */}
        <div className={`w-1/2 bg-white/90 backdrop-blur-lg border-l border-white/50 flex flex-col ${isRTL ? 'order-1 border-r border-l-0' : 'order-2'}`}>
          {/* Header */}
          {stepData.prototypeGenerator.generatedPrototype && (
            <div className="border-b border-white/50 p-4 flex items-center justify-end bg-white/90 backdrop-blur-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(stepData.prototypeGenerator.generatedPrototype)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 rounded-md transition-colors"
                  title={t('copy')}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([stepData.prototypeGenerator.generatedPrototype], { type: 'text/markdown' });
                    element.href = URL.createObjectURL(file);
                    element.download = 'prototype-specs.md';
                    element.click();
                  }}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50/80 rounded-md transition-colors"
                  title={t('download')}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(t('whatsappMessage') + '\n\n' + stepData.prototypeGenerator.generatedPrototype)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50/80 rounded-md transition-colors"
                  title={t('shareWhatsApp')}
                >
                  <WhatsApp className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {stepData.prototypeGenerator.generatedPrototype ? (
              <div 
                className={`prose prose-sm max-w-none text-gray-800 ${isRTL ? 'prose-rtl text-right' : 'text-left'}`}
                dangerouslySetInnerHTML={{ 
                  __html: stepData.prototypeGenerator.generatedPrototype
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h2>')
                    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h3>')
                }}
              />
            ) : (
              <div className={`text-gray-500 text-center py-12 ${isRTL ? 'text-right' : 'text-left'}`}>
                <Palette className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>النموذج الأولي التفاعلي سيظهر هنا بعد اختيار المواصفات</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Main Render Logic
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <LandingPage />;
      case 1:
        return (
          <>
            <StepHeader stepNumber={1} />
            <BrainstormerStep />
          </>
        );
      case 2:
        return (
          <>
            <StepHeader stepNumber={2} />
            <PRDCreatorStep />
          </>
        );
      case 3:
        return (
          <>
            <StepHeader stepNumber={3} />
            <PrototypeGeneratorStep />
          </>
        );
      default:
        return <LandingPage />;
    }
  };

  return (
    <ErrorBoundary>
      <AppContext.Provider value={contextValue}>
      <div className="min-h-screen">
        {/* Skip to Content Link for Screen Readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {t('skipToContent')}
        </a>
        
        {/* PWA Install Prompt */}
        {showInstallPrompt && (
          <div className="bg-green-600 text-white px-4 py-3 text-sm">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Smartphone className="w-4 h-4" />
                <span>{t('installApp')}: {t('installAppDescription')}</span>
              </div>
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={installPWA}
                  className="bg-white text-green-600 px-3 py-1 rounded text-xs font-medium hover:bg-green-50"
                >
                  {t('install')}
                </button>
                <button
                  onClick={hideInstallPrompt}
                  className="text-white hover:text-green-200 text-xs px-2"
                >
                  {t('dismiss')}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Online/Offline Status Bar */}
        {!isOnline && (
          <div className="bg-red-500 text-white px-4 py-2 text-sm text-center animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              {t('offlineMode')}: {t('workingSaved')}
            </div>
          </div>
        )}
        <main id="main-content" role="main">
          {renderCurrentStep()}
        </main>
        
        {/* Global Styles */}
        <style>{`
          /* Optimized font loading with preconnect and font-display */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap&font-display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap&font-display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap&font-display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap&font-display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html {
            scroll-behavior: smooth;
          }
          
          body {
            font-family: ${isRTL ? "'Cairo', 'Tajawal', 'Amiri', 'Inter', sans-serif" : "'Inter', 'Cairo', 'Tajawal', sans-serif"};
            line-height: ${isRTL ? '1.8' : '1.6'};
            color: #1f2937;
            background: #fafafa;
            font-feature-settings: ${isRTL ? '"kern" 1, "liga" 1, "calt" 1, "ss01" 1' : '"kern" 1, "liga" 1'};
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          .rtl {
            direction: rtl;
            text-align: right;
          }
          
          .ltr {
            direction: ltr;
            text-align: left;
          }
          
          /* Enhanced Animations with RTL Support */
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(${isRTL ? '20px' : '-20px'});
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInFromRight {
            from {
              transform: translateX(${isRTL ? '-100%' : '100%'});
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          /* Touch-friendly interactions for Saudi mobile users */
          @media (hover: none) and (pointer: coarse) {
            button, .clickable {
              min-height: 44px;
              min-width: 44px;
            }
          }
          
          /* Smooth transitions for all interactive elements */
          * {
            transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease, opacity 0.2s ease;
          }
          
          /* Optimized animations for Arabic text */
          .arabic-text {
            font-kerning: auto;
            font-variant-ligatures: common-ligatures;
            text-align: ${isRTL ? 'right' : 'left'};
          }
          
          /* Reduced motion preferences */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out;
          }
          
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          /* Glassmorphism effects */
          .backdrop-blur-lg {
            backdrop-filter: blur(16px);
          }
          
          .backdrop-blur-sm {
            backdrop-filter: blur(4px);
          }
          
          /* Scrollbar styling */
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          
          /* RTL-specific styles */
          [dir="rtl"] .prose ul,
          [dir="rtl"] .prose ol {
            padding-right: 1.5rem;
            padding-left: 0;
          }
          
          [dir="rtl"] .text-left {
            text-align: right;
          }
          
          [dir="rtl"] .text-right {
            text-align: left;
          }
          
          /* Print styles */
          @media print {
            body {
              margin: 0;
              padding: 20mm;
              font-size: 12pt;
              line-height: 1.4;
            }
            
            .no-print {
              display: none !important;
            }
            
            h1 {
              font-size: 18pt;
              margin-bottom: 12pt;
            }
            
            h2 {
              font-size: 16pt;
              margin-top: 18pt;
              margin-bottom: 8pt;
            }
            
            h3 {
              font-size: 14pt;
              margin-top: 12pt;
              margin-bottom: 6pt;
            }
            
            p, li {
              margin-bottom: 6pt;
            }
          }
          
          /* Mobile-first responsive design */
          @media (max-width: 768px) {
            .md\\:grid-cols-2 {
              grid-template-columns: repeat(1, minmax(0, 1fr));
            }
            
            .md\\:grid-cols-3 {
              grid-template-columns: repeat(1, minmax(0, 1fr));
            }
            
            .md\\:grid-cols-4 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            
            .md\\:text-6xl {
              font-size: 2.5rem;
            }
            
            .md\\:text-2xl {
              font-size: 1.5rem;
            }
            
            .w-1\\/2 {
              width: 100%;
            }
            
            .flex {
              flex-direction: column;
            }
            
            .order-1,
            .order-2 {
              order: unset;
            }
          }
          
          /* Dark mode support for future enhancement */
          @media (prefers-color-scheme: dark) {
            /* Will be implemented when dark mode is added */
          }
          
          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .bg-white\\/80 {
              background-color: white;
            }
            
            .border-white\\/50 {
              border-color: #d1d5db;
            }
            
            .text-gray-600 {
              color: #374151;
            }
          }
          
          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>
      </AppContext.Provider>
    </ErrorBoundary>
  );
};

export default IdeaToMarketApp;