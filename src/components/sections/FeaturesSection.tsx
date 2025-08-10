import { Sparkles, Target, Zap } from "lucide-react";
import React from "react";
import { useApp } from "../../context/AppContext";
import Card from "../ui/Card";

const FeaturesSection: React.FC = () => {
  const { t, isRTL } = useApp();

  const features = [
    {
      id: "aiPowered",
      icon: Sparkles,
      title: t("aiPoweredTitle"),
      description: t("aiPoweredDescription"),
    },
    {
      id: "smartTemplates",
      icon: Target,
      title: t("smartTemplatesTitle"),
      description: t("smartTemplatesDescription"),
    },
    {
      id: "instantResults",
      icon: Zap,
      title: t("instantResultsTitle"),
      description: t("instantResultsDescription"),
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-neutral-50 dark:bg-neutral-800"
      data-testid="features-section"
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
            {t("featuresTitle")}
          </h2>
          <p
            className={`
              text-lg text-neutral-600 dark:text-neutral-300
              leading-relaxed
              ${isRTL ? "font-arabic" : "font-english"}
            `}
          >
            {t("featuresSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.id}
                className="text-center p-8 hover:shadow-xl transition-shadow duration-300"
                data-testid={`feature-${feature.id}`}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-700">
                    <IconComponent className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <h3
                  className={`
                    text-xl font-bold text-neutral-900 dark:text-white mb-4
                    ${isRTL ? "font-arabic" : "font-english"}
                  `}
                >
                  {feature.title}
                </h3>
                <p
                  className={`
                    text-neutral-600 dark:text-neutral-300 leading-relaxed
                    ${isRTL ? "font-arabic" : "font-english"}
                  `}
                >
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
