import { ArrowRight, Play } from "lucide-react";
import React from "react";
import { useApp } from "../../context/AppContext";
import Button from "../ui/Button";

const HeroSection: React.FC = () => {
  const { t, isRTL } = useApp();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-saudi-green"
      data-testid="hero-section"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-neutral-800/30 dark:to-neutral-800/10" />
      <div className="absolute top-0 start-0 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 end-0 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 start-20 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative container mx-auto px-4 py-24 sm:py-32">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main heading */}
          <h1
            className={`
              text-5xl sm:text-6xl lg:text-7xl font-bold
              bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600
              bg-clip-text text-transparent
              leading-tight tracking-tight
              mb-6 animate-fade-in-up
              ${isRTL ? "font-arabic" : "font-english"}
            `}
          >
            {t("platformTitle")}
          </h1>

          {/* Subtitle */}
          <p
            className={`
              text-xl sm:text-2xl text-neutral-600 dark:text-neutral-300
              max-w-3xl mx-auto leading-relaxed mb-8
              animate-fade-in-up animation-delay-200
              ${isRTL ? "font-arabic" : "font-english"}
            `}
          >
            {t("platformSubtitle")}
          </p>

          {/* Description */}
          <p
            className={`
              text-lg text-neutral-500 dark:text-neutral-300/90
              max-w-2xl mx-auto leading-relaxed mb-12
              animate-fade-in-up animation-delay-400
              ${isRTL ? "font-arabic" : "font-english"}
            `}
          >
            {t("heroDescription")}
          </p>

          {/* CTA Buttons */}
          <div
            className={`
              flex flex-col sm:flex-row gap-4 justify-center
              animate-fade-in-up animation-delay-600
              ${isRTL ? "sm:flex-row-reverse" : ""}
            `}
          >
            <Button
              data-testid="primary-button"
              size="lg"
              icon={<ArrowRight className="h-5 w-5" />}
              iconPosition={isRTL ? "left" : "right"}
              className="text-lg px-8 py-4"
            >
              {t("getStartedFree")}
            </Button>

            <Button
              variant="outline"
              size="lg"
              icon={<Play className="h-5 w-5" />}
              iconPosition="left"
              className="text-lg px-8 py-4"
            >
              {t("watchDemo")}
            </Button>
          </div>

          {/* Trust indicator */}
          <p
            className={`
              text-sm text-neutral-500 dark:text-neutral-400 mt-8
              animate-fade-in-up animation-delay-800
              ${isRTL ? "font-arabic" : "font-english"}
            `}
          >
            {t("trustedBy")} • مدعوم بـ Claude AI • Powered by Claude AI
          </p>

          {/* Saudi cultural reference and Vision 2030 integration */}
          <div
            className={`mt-8 p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 ${
              isRTL ? "font-arabic" : "font-english"
            }`}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-2xl">🇸🇦</span>
              <h3
                className="text-xl font-bold text-white"
                data-testid="vision-2030-heading"
              >
                رؤية المملكة 2030
              </h3>
              <span className="text-2xl">🚀</span>
            </div>
            <p className="text-white/90 text-center leading-relaxed">
              نحن فخورون بدعم رؤية المملكة العربية السعودية 2030 من خلال تمكين
              رواد الأعمال وتطوير الاقتصاد الرقمي وريادة الأعمال في المملكة
            </p>
            <div className="flex justify-center gap-6 mt-4 text-sm text-white/80">
              <span>🏗️ البناء والتطوير</span>
              <span>💡 الابتكار والإبداع</span>
              <span>🌱 النمو المستدام</span>
            </div>
          </div>

          {/* Accessible skip link */}
          <div
            className={`mt-4 text-center ${
              isRTL ? "font-arabic" : "font-english"
            }`}
          >
            <a
              href="#main-content"
              className="text-white/70 hover:text-white text-sm underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-2 py-1"
              aria-label={
                isRTL ? "انتقل إلى المحتوى الرئيسي" : "Skip to main content"
              }
            >
              انتقل إلى المحتوى الرئيسي
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
