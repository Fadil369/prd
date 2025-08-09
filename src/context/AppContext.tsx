import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'starter' | 'professional' | 'enterprise';
  trialDaysLeft: number;
  isTrialActive: boolean;
  createdAt: Date;
  features: string[];
}

export interface StepData {
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

export interface AppContextType {
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

// Translations
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
    "languageToggle": "Language",
    
    // Steps
    "step1Title": "Brainstormer",
    "step1Description": "Generate and refine business ideas",
    "step2Title": "PRD Creator", 
    "step2Description": "Create professional product requirements",
    "step3Title": "Prototype Generator",
    "step3Description": "Build interactive prototypes",
    
    // Common UI
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "save": "Save",
    "edit": "Edit",
    "delete": "Delete",
    "back": "Back",
    "next": "Next",
    "finish": "Finish",
    "retry": "Try Again",
    "copy": "Copy",
    "download": "Download",
    "share": "Share"
  },
  "ar-SA": {
    // Landing Page
    "platformTitle": "من الفكرة إلى السوق",
    "platformSubtitle": "حوّل أفكارك إلى منتجات جاهزة للسوق باستخدام الذكاء الاصطناعي",
    "heroDescription": "المنصة الشاملة لرواد الأعمال السعوديين للتحقق من أفكارهم التجارية وتخطيطها وإنشاء نماذج أولية باستخدام تقنية الذكاء الاصطناعي المتقدمة.",
    "getStartedFree": "ابدأ تجربة مجانية",
    "watchDemo": "شاهد العرض التوضيحي",
    "trustedBy": "موثوق من قبل أكثر من 500 رائد أعمال سعودي",
    
    // Navigation
    "features": "الميزات",
    "pricing": "الأسعار",
    "about": "حول",
    "contact": "اتصل بنا",
    "login": "تسجيل الدخول",
    "signup": "إنشاء حساب",
    "dashboard": "لوحة التحكم",
    "logout": "تسجيل الخروج",
    "languageToggle": "اللغة",
    
    // Steps
    "step1Title": "عصف الأفكار",
    "step1Description": "توليد وتطوير الأفكار التجارية",
    "step2Title": "منشئ مستند المتطلبات", 
    "step2Description": "إنشاء متطلبات المنتج المهنية",
    "step3Title": "منشئ النماذج الأولية",
    "step3Description": "بناء نماذج أولية تفاعلية",
    
    // Common UI
    "loading": "جاري التحميل...",
    "error": "خطأ",
    "success": "نجح",
    "cancel": "إلغاء",
    "save": "حفظ",
    "edit": "تحرير",
    "delete": "حذف",
    "back": "رجوع",
    "next": "التالي",
    "finish": "إنهاء",
    "retry": "حاول مرة أخرى",
    "copy": "نسخ",
    "download": "تحميل",
    "share": "مشاركة"
  }
};

// Initial state
const initialStepData: StepData = {
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
    appType: '',
    features: [],
    designStyle: '',
    targetPlatform: '',
    generatedPrototype: ''
  }
};

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<StepData>(initialStepData);
  const [currentLocale, setCurrentLocale] = useState('ar-SA');

  // Detect browser locale and set direction
  useEffect(() => {
    const browserLocale = navigator.language || 'ar-SA';
    const supportedLocale = TRANSLATIONS[browserLocale as keyof typeof TRANSLATIONS] 
      ? browserLocale 
      : browserLocale.startsWith('ar') ? 'ar-SA' : 'en-US';
    
    setCurrentLocale(supportedLocale);
  }, []);

  // Update document direction when locale changes
  const isRTL = currentLocale.startsWith('ar');
  
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLocale;
    
    // Update font family based on locale
    const fontClass = isRTL ? 'font-arabic' : 'font-english';
    document.body.className = `${fontClass} ${document.body.className.replace(/font-\w+/g, '')}`.trim();
  }, [currentLocale, isRTL]);

  // Translation function
  const t = (key: string): string => {
    return TRANSLATIONS[currentLocale as keyof typeof TRANSLATIONS]?.[key as keyof typeof TRANSLATIONS['en-US']] 
      || TRANSLATIONS['en-US'][key as keyof typeof TRANSLATIONS['en-US']] 
      || key;
  };

  // Update step data
  const updateStepData = (step: keyof StepData, data: Partial<StepData[keyof StepData]>) => {
    setStepData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        ...data
      }
    }));
  };

  const value: AppContextType = {
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
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
