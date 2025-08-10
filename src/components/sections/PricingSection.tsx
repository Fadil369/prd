import { Check, Crown, Star } from "lucide-react";
import React from "react";
import { useApp } from "../../context/AppContext";
import Button from "../ui/Button";
import Card from "../ui/Card";

const PricingSection: React.FC = () => {
  const { t, isRTL } = useApp();

  const plans = [
    {
      id: "free",
      name: t("freePlanName"),
      price: t("freePlanPrice"),
      period: t("freePlanPeriod"),
      description: t("freePlanDescription"),
      icon: Star,
      features: [
        t("freePlanFeature1"),
        t("freePlanFeature2"),
        t("freePlanFeature3"),
      ],
      cta: t("freePlanCTA"),
      popular: false,
    },
    {
      id: "pro",
      name: t("proPlanName"),
      price: t("proPlanPrice"),
      period: t("proPlanPeriod"),
      description: t("proPlanDescription"),
      icon: Crown,
      features: [
        t("proPlanFeature1"),
        t("proPlanFeature2"),
        t("proPlanFeature3"),
        t("proPlanFeature4"),
        t("proPlanFeature5"),
      ],
      cta: t("proPlanCTA"),
      popular: true,
    },
  ];

  return (
    <section
      id="pricing"
      className="py-20 bg-white dark:bg-neutral-900"
      data-testid="pricing-section"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={`
              text-3xl sm:text-4xl lg:text-5xl font-bold
              text-neutral-900 dark:text-white mb-6
              ${isRTL ? "font-arabic" : "font-english"}
            `}
          >
            {t("pricingTitle")}
          </h2>
          <p
            className={`
              text-lg text-neutral-600 dark:text-neutral-300
              leading-relaxed
              ${isRTL ? "font-arabic" : "font-english"}
            `}
          >
            {t("pricingSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`
                  relative p-8 hover:shadow-xl transition-all duration-300
                  ${plan.popular ? "ring-2 ring-primary-500 scale-105" : ""}
                `}
                data-testid={`plan-${plan.id}`}
              >
                {plan.popular && (
                  <div
                    className={`
                      absolute -top-4 left-1/2 transform -translate-x-1/2
                      bg-gradient-to-r from-primary-500 to-secondary-500
                      text-white px-6 py-2 rounded-full text-sm font-bold
                      ${isRTL ? "font-arabic" : "font-english"}
                    `}
                  >
                    {t("mostPopular")}
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`
                      p-3 rounded-full
                      ${
                        plan.popular
                          ? "bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-800 dark:to-secondary-800"
                          : "bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700"
                      }
                    `}
                    >
                      <IconComponent
                        className={`
                        h-6 w-6
                        ${
                          plan.popular
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-neutral-600 dark:text-neutral-400"
                        }
                      `}
                      />
                    </div>
                  </div>

                  <h3
                    className={`
                      text-2xl font-bold text-neutral-900 dark:text-white mb-2
                      ${isRTL ? "font-arabic" : "font-english"}
                    `}
                  >
                    {plan.name}
                  </h3>

                  <p
                    className={`
                      text-neutral-600 dark:text-neutral-300 mb-6
                      ${isRTL ? "font-arabic" : "font-english"}
                    `}
                  >
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <div
                      className={`
                        text-4xl font-bold text-neutral-900 dark:text-white
                        ${isRTL ? "font-arabic" : "font-english"}
                      `}
                    >
                      {plan.price}
                    </div>
                    <div
                      className={`
                        text-neutral-600 dark:text-neutral-400
                        ${isRTL ? "font-arabic" : "font-english"}
                      `}
                    >
                      {plan.period}
                    </div>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`
                        flex items-center gap-3
                        ${
                          isRTL
                            ? "flex-row-reverse font-arabic"
                            : "font-english"
                        }
                      `}
                    >
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  size="lg"
                  className="w-full"
                  data-testid={`plan-${plan.id}-cta`}
                >
                  {plan.cta}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
