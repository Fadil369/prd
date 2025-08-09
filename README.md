# من الفكرة إلى السوق | Idea to Market

<div align="center">

![Idea to Market Logo](./public/logo-full.png)

**منصة مدعومة بالذكاء الاصطناعي لرواد الأعمال السعوديين**  
*AI-powered platform for Saudi entrepreneurs*

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.6-blue.svg)](https://tailwindcss.com/)
[![Claude AI](https://img.shields.io/badge/Claude%20AI-Sonnet%204-orange.svg)](https://www.anthropic.com/)

</div>

## 🇸🇦 نظرة عامة | Overview

منصة "من الفكرة إلى السوق" هي حل شامل يساعد رواد الأعمال السعوديين على تحويل أفكارهم إلى منتجات قابلة للتسويق في ثلاث خطوات بسيطة باستخدام الذكاء الاصطناعي.

The "Idea to Market" platform is a comprehensive solution that helps Saudi entrepreneurs transform their ideas into market-ready products in three simple steps using artificial intelligence.

### ✨ الميزات الرئيسية | Key Features

#### 🧠 **عصف الأفكار الذكي | Smart Brainstorming**
- توليد أفكار أعمال مبتكرة باستخدام الذكاء الاصطناعي
- تحليل السوق السعودي والفرص المتاحة
- اقتراحات مخصصة تتماشى مع رؤية 2030

#### 📋 **إنشاء مستندات متطلبات المنتج | PRD Creation**
- تحويل الأفكار إلى مستندات احترافية
- قوالب محسّنة للسوق السعودي
- دعم اللغتين العربية والإنجليزية

#### 🚀 **بناء النماذج الأولية | Prototype Generation**
- إنشاء نماذج أولية تفاعلية
- دعم تقنيات الويب الحديثة
- تحسين للأجهزة المحمولة

### 🎯 الجمهور المستهدف | Target Audience
- رواد الأعمال السعوديون (25-45 سنة)
- مديرو المنتجات والمشاريع
- الشركات الناشئة والمؤسسات الصغيرة
- المطورون والمصممون

## 🛠️ التقنيات المستخدمة | Tech Stack

### Frontend
- **React 18.2** with TypeScript
- **Tailwind CSS** for styling with RTL support
- **Framer Motion** for animations
- **Lucide React** for icons
- **PWA** capabilities with service worker

### AI Integration  
- **Claude Sonnet 4** for content generation
- **Anthropic API** with Saudi cultural context
- Smart prompt engineering for Arabic responses

### Payment Integration
- **Mada** (Saudi debit cards)
- **STC Pay** (Saudi digital wallet)
- **Apple Pay** & **Google Pay**
- **SAR** currency support

### Localization
- **Arabic (primary)** with RTL support
- **English (secondary)** language
- Saudi cultural adaptations
- Local time zone support (Asia/Riyadh)

## 🚀 البدء السريع | Quick Start

### المتطلبات | Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher
- Git

### التثبيت | Installation

```bash
# Clone the repository
git clone https://github.com/brainsait/idea-to-market-saudi.git
cd idea-to-market-saudi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

### متغيرات البيئة | Environment Variables

```bash
# Claude AI API
VITE_CLAUDE_API_KEY=your_claude_api_key

# Payment Gateway APIs
VITE_MADA_API_KEY=your_mada_api_key
VITE_STC_PAY_API_KEY=your_stc_pay_api_key

# Analytics
VITE_GA_TRACKING_ID=your_google_analytics_id
VITE_MIXPANEL_TOKEN=your_mixpanel_token

# App Configuration  
VITE_APP_URL=https://idea-to-market.sa
VITE_API_BASE_URL=https://api.idea-to-market.sa
```

## 📁 هيكل المشروع | Project Structure

```
idea-to-market-saudi/
├── public/                 # Static assets
│   ├── icons/             # App icons and favicons  
│   ├── images/            # Saudi-themed images
│   └── locales/           # Translation files
├── src/
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   └── main.tsx          # App entry point
├── App.tsx               # Main application component
├── tailwind.config.js    # Tailwind configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies
```

## 🔧 الأوامر المتاحة | Available Scripts

```bash
# Development
npm run dev                # Start development server
npm run build             # Build for production
npm run preview           # Preview production build
npm run serve             # Serve production build

# Quality & Testing
npm run lint              # Run ESLint
npm run typecheck         # Check TypeScript types
npm run test              # Run tests
npm run test:watch        # Run tests in watch mode
npm run cypress           # Open Cypress for E2E testing

# Deployment
npm run deploy:staging    # Deploy to staging
npm run deploy:production # Deploy to production
```

## 🎨 التصميم والواجهات | Design System

### الألوان | Colors
- **Saudi Green**: `#059669` - اللون الأساسي
- **Gold**: `#f59e0b` - اللون الثانوي  
- **Desert Sand**: `#c47d2a` - لون مساعد
- **White/Gray**: للخلفيات والنصوص

### الخطوط | Typography
- **Arabic**: Cairo, Tajawal, Amiri
- **English**: Inter, System UI
- **Display**: Cairo (for headings)

### الاستجابة | Responsive Breakpoints
- **Mobile**: 375px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+
- **Touch**: Special handling for touch devices

## 💳 التكامل مع المدفوعات | Payment Integration

### خطط الاشتراك | Subscription Plans

| الخطة | Plan | السعر/شهر | Price/Month | الميزات | Features |
|--------|------|-----------|-------------|---------|----------|
| تجريبية | Free Trial | مجاني | Free | ساعة واحدة | 1 hour access |
| المبتدئ | Starter | 99 ريال | 99 SAR | 10 مشاريع | 10 projects |
| المحترف | Professional | 299 ريال | 299 SAR | 50 مشروع | 50 projects |
| المؤسسي | Enterprise | 999 ريال | 999 SAR | غير محدود | Unlimited |

### طرق الدفع المدعومة | Supported Payment Methods
- **بطاقات مدى** (Mada Cards)
- **STC Pay** (محفظة رقمية)
- **Apple Pay** (آيفون/ماك)
- **Google Pay** (أندرويد)
- **التحويل البنكي** (Bank Transfer)

## 🔒 الأمان والخصوصية | Security & Privacy

### إجراءات الأمان | Security Measures
- HTTPS إجباري في الإنتاج
- تشفير البيانات الحساسة
- مصادقة ثنائية العوامل
- مراقبة محاولات التسلل
- نسخ احتياطية مشفرة

### حماية الخصوصية | Privacy Protection
- امتثال لقوانين حماية البيانات السعودية
- تشفير المعلومات الشخصية
- حفظ البيانات محلياً عندما أمكن
- إمكانية حذف الحساب نهائياً

## 📱 تطبيق الويب التدريجي | PWA Features

### الميزات المدعومة | Supported Features
- تثبيت على الشاشة الرئيسية
- العمل بدون اتصال (محدود)
- إشعارات الدفع
- التحديث التلقائي
- مشاركة الملفات

### متطلبات التثبيت | Installation Requirements
- متصفح حديث يدعم PWA
- HTTPS (مطلوب للإنتاج)
- Service Worker فعال

## 🌍 الدعم والتعريب | Localization Support

### اللغات المدعومة | Supported Languages
- **العربية** (اللغة الأساسية) - RTL
- **الإنجليزية** (اللغة الثانوية) - LTR

### التخصيص للسوق السعودي | Saudi Market Customization
- تقويم هجري وميلادي
- التوقيت المحلي (GMT+3)
- العملة بالريال السعودي
- أرقام عربية وإنجليزية
- مراعاة الثقافة المحلية

## 🚀 النشر | Deployment

### البيئات | Environments
- **Development**: `dev.idea-to-market.sa`
- **Staging**: `staging.idea-to-market.sa`  
- **Production**: `idea-to-market.sa`

### متطلبات الاستضافة | Hosting Requirements
- **الخادم**: Node.js 18+ أو Static Hosting
- **قاعدة البيانات**: PostgreSQL/MongoDB
- **CDN**: CloudFront أو مماثل
- **SSL**: شهادة SSL صالحة
- **النطاق**: `.sa` مفضل

### خطوات النشر | Deployment Steps

```bash
# Build the application
npm run build

# Deploy to staging
npm run deploy:staging

# After testing, deploy to production
npm run deploy:production
```

## 🤝 المساهمة | Contributing

نرحب بمساهماتكم لتحسين المنصة! يرجى اتباع هذه الخطوات:

We welcome contributions to improve the platform! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### معايير المساهمة | Contribution Guidelines
- اتبع معايير الكود الموجودة
- أضف اختبارات للميزات الجديدة
- حدّث الوثائق عند الحاجة
- اكتب رسائل الcommit بوضوح

## 📞 الدعم | Support

### تواصل معنا | Contact Us
- **البريد الإلكتروني**: support@idea-to-market.sa
- **واتساب**: +966501234567
- **تويتر**: [@IdeaToMarketSA](https://twitter.com/IdeaToMarketSA)
- **لينكد إن**: [شركة من الفكرة إلى السوق](https://linkedin.com/company/idea-to-market-sa)

### المجتمع | Community
- **تليجرام**: [مجموعة رواد الأعمال](https://t.me/IdeaToMarketSA)
- **ديسكورد**: [خادم المطورين](https://discord.gg/IdeaToMarketSA)
- **GitHub**: [المشاريع مفتوحة المصدر](https://github.com/idea-to-market-sa)

## 📄 الترخيص | License

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 شكر وتقدير | Acknowledgments

- **فريق BrainSAIT** لتطوير المنصة
- **المجتمع السعودي التقني** للدعم والتشجيع  
- **Anthropic** لتوفير Claude AI
- **المساهمين** في المشاريع مفتوحة المصدر المستخدمة

---

<div align="center">

**صُنع بـ ❤️ في المملكة العربية السعودية**  
*Made with ❤️ in Saudi Arabia*

[الموقع الرسمي](https://idea-to-market.sa) • [الوثائق](https://docs.idea-to-market.sa) • [المدونة](https://blog.idea-to-market.sa)

</div>