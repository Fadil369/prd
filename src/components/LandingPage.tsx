import React from 'react';
import { ArrowRight, Play, Sparkles, Globe, Users, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from './ui/Button';
import Card from './ui/Card';

const LandingPage: React.FC = () => {
  const { t, isRTL } = useApp();

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary-500" />,
      titleKey: "step1Title",
      descriptionKey: "step1Description"
    },
    {
      icon: <Globe className="h-8 w-8 text-secondary-500" />,
      titleKey: "step2Title",
      descriptionKey: "step2Description"
    },
    {
      icon: <Award className="h-8 w-8 text-accent-500" />,
      titleKey: "step3Title",
      descriptionKey: "step3Description"
    }
  ];

  const stats = [
    { number: "500+", labelKey: "activeUsers" },
    { number: "1000+", labelKey: "ideasGenerated" },
    { number: "200+", labelKey: "prototypesBuilt" },
    { number: "50+", labelKey: "businessesLaunched" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-secondary-100/50 dark:from-neutral-800/30 dark:to-neutral-800/10" />
        <div className="absolute top-0 start-0 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 end-0 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 start-20 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

        <div className="relative container mx-auto px-4 py-24 sm:py-32">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main heading */}
            <h1 className={`
              text-5xl sm:text-6xl lg:text-7xl font-bold
              bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600
              bg-clip-text text-transparent
              leading-tight tracking-tight
              mb-6 animate-fade-in-up
              ${isRTL ? 'font-arabic' : 'font-english'}
            `}>
              {t('platformTitle')}
            </h1>

            {/* Subtitle */}
            <p className={`
              text-xl sm:text-2xl text-neutral-600 dark:text-neutral-300
              max-w-3xl mx-auto leading-relaxed mb-8
              animate-fade-in-up animation-delay-200
              ${isRTL ? 'font-arabic' : 'font-english'}
            `}>
              {t('platformSubtitle')}
            </p>

            {/* Description */}
            <p className={`
              text-lg text-neutral-500 dark:text-neutral-300/90
              max-w-2xl mx-auto leading-relaxed mb-12
              animate-fade-in-up animation-delay-400
              ${isRTL ? 'font-arabic' : 'font-english'}
            `}>
              {t('heroDescription')}
            </p>

            {/* CTA Buttons */}
            <div className={`
              flex flex-col sm:flex-row gap-4 justify-center
              animate-fade-in-up animation-delay-600
              ${isRTL ? 'sm:flex-row-reverse' : ''}
            `}>
              <Button
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition={isRTL ? 'left' : 'right'}
                className="text-lg px-8 py-4"
              >
                {t('getStartedFree')}
              </Button>

              <Button
                variant="outline"
                size="lg"
                icon={<Play className="h-5 w-5" />}
                iconPosition="left"
                className="text-lg px-8 py-4"
              >
                {t('watchDemo')}
              </Button>
            </div>

            {/* Trust indicator */}
            <p className={`
              text-sm text-neutral-500 dark:text-neutral-400 mt-8
              animate-fade-in-up animation-delay-800
              ${isRTL ? 'font-arabic' : 'font-english'}
            `}>
              {t('trustedBy')}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 dark:bg-neutral-900/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`
              text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6
              ${isRTL ? 'font-arabic' : 'font-english'}
            `}>
              {t('features')}
            </h2>
            <p className={`
              text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto
              ${isRTL ? 'font-arabic' : 'font-english'}
            `}>
              Transform your entrepreneurial journey with our AI-powered tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {features.map((feature) => (
              <Card
        key={feature.titleKey}
                variant="elevated"
                hover={true}
                className="text-center group"
              >
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-800 dark:to-neutral-700 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className={`
                  text-xl font-semibold text-neutral-900 dark:text-white mb-4
                  ${isRTL ? 'font-arabic' : 'font-english'}
                `}>
                  {t(feature.titleKey)}
                </h3>
                
                <p className={`
                  text-neutral-600 dark:text-neutral-300 leading-relaxed
                  ${isRTL ? 'font-arabic' : 'font-english'}
                `}>
                  {t(feature.descriptionKey)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.labelKey} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className={`
                  text-primary-100 text-sm md:text-base
                  ${isRTL ? 'font-arabic' : 'font-english'}
                `}>
                  {t(stat.labelKey)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 to-primary-50 dark:from-neutral-900 dark:to-neutral-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className={`
              text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6
              ${isRTL ? 'font-arabic' : 'font-english'}
            `}>
              Ready to transform your idea?
            </h2>
            
            <p className={`
              text-xl text-neutral-600 dark:text-neutral-300 mb-12 leading-relaxed
              ${isRTL ? 'font-arabic' : 'font-english'}
            `}>
              Join hundreds of Saudi entrepreneurs who have already turned their ideas into successful businesses
            </p>
            
            <Button
              size="xl"
              icon={<Users className="h-6 w-6" />}
              iconPosition={isRTL ? 'left' : 'right'}
              className="text-xl px-12 py-6"
            >
              {t('getStartedFree')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
