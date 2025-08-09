import React, { useState } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from './ui/Button';

const Header: React.FC = () => {
  const { t, currentLocale, setCurrentLocale, isRTL } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const navigation = [
    { key: 'features', href: '#features' },
    { key: 'pricing', href: '#pricing' },
    { key: 'about', href: '#about' },
    { key: 'contact', href: '#contact' }
  ];

  const languages = [
    { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const toggleLanguage = (langCode: string) => {
    setCurrentLocale(langCode);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className={`
              text-2xl md:text-3xl font-bold
              bg-gradient-to-r from-primary-600 to-secondary-600
              bg-clip-text text-transparent
              ${isRTL ? 'font-arabic' : 'font-english'}
            `}>
              {t('platformTitle')}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={`
                  text-neutral-600 hover:text-primary-600
                  transition-colors duration-200
                  font-medium
                  ${isRTL ? 'font-arabic' : 'font-english'}
                `}
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg
                  text-neutral-600 hover:text-primary-600 hover:bg-primary-50
                  transition-all duration-200
                  ${isRTL ? 'font-arabic' : 'font-english'}
                `}
              >
                <Globe className="h-4 w-4" />
                <span>{currentLanguage.flag}</span>
                <span className="text-sm">{currentLanguage.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isLanguageDropdownOpen && (
                <div className={`
                  absolute top-full mt-2 w-40 py-2
                  bg-white rounded-xl shadow-soft border border-neutral-200
                  z-50
                  ${isRTL ? 'end-0' : 'start-0'}
                `}>
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => toggleLanguage(language.code)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2
                        text-sm hover:bg-primary-50
                        transition-colors duration-200
                        ${currentLocale === language.code ? 'text-primary-600 bg-primary-50' : 'text-neutral-600'}
                        ${isRTL ? 'text-right font-arabic' : 'text-left font-english'}
                      `}
                    >
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <Button variant="ghost" size="sm">
              {t('login')}
            </Button>
            
            <Button size="sm">
              {t('signup')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200/50 py-4">
            <nav className="flex flex-col gap-4 mb-6">
              {navigation.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    text-neutral-600 hover:text-primary-600
                    transition-colors duration-200
                    font-medium py-2
                    ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}
                  `}
                >
                  {t(item.key)}
                </a>
              ))}
            </nav>

            {/* Mobile Language Selector */}
            <div className="mb-6">
              <div className={`
                text-sm font-medium text-neutral-700 mb-2
                ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}
              `}>
                {t('languageToggle')}
              </div>
              <div className="flex gap-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => toggleLanguage(language.code)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg
                      text-sm transition-all duration-200
                      ${currentLocale === language.code 
                        ? 'text-primary-600 bg-primary-100' 
                        : 'text-neutral-600 bg-neutral-100 hover:bg-primary-50'
                      }
                      ${isRTL ? 'font-arabic' : 'font-english'}
                    `}
                  >
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-3">
              <Button variant="outline" fullWidth>
                {t('login')}
              </Button>
              
              <Button fullWidth>
                {t('signup')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for language dropdown */}
      {isLanguageDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsLanguageDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
