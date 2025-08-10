import { BarChart3, Star, TrendingUp, Users } from "lucide-react";
import React from "react";
import { useApp } from "../../context/AppContext";

const StatsSection: React.FC = () => {
  const { t, isRTL } = useApp();

  const stats = [
    {
      id: "activeUsers",
      icon: Users,
      value: "10,000+",
      label: t("activeUsersLabel"),
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "projectsCreated",
      icon: BarChart3,
      value: "25,000+",
      label: t("projectsCreatedLabel"),
      color: "text-green-600 dark:text-green-400",
    },
    {
      id: "satisfactionRate",
      icon: Star,
      value: "98%",
      label: t("satisfactionRateLabel"),
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      id: "growthRate",
      icon: TrendingUp,
      value: "150%",
      label: t("growthRateLabel"),
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <section
      id="stats"
      className="py-16 bg-white dark:bg-neutral-900"
      data-testid="stats-section"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className={`
                  text-center group
                  ${isRTL ? "font-arabic" : "font-english"}
                `}
                data-testid={`stat-${stat.id}`}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className={`
                    p-4 rounded-full bg-gradient-to-br
                    from-neutral-100 to-neutral-200
                    dark:from-neutral-800 dark:to-neutral-700
                    group-hover:scale-110 transition-transform duration-300
                  `}
                  >
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-600 dark:text-neutral-400 text-sm lg:text-base">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
