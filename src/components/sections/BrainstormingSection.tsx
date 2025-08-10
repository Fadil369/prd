import { Lightbulb } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import Button from "../ui/Button";
import Card from "../ui/Card";

interface FormData {
  idea: string;
  context: string;
  goals: string;
}

const ResultCard: React.FC<{
  result: string | null;
  error: string | null;
  isRTL: boolean;
}> = ({ result, error, isRTL }) => {
  if (!result && !error) return null;
  return (
    <div className="mt-6">
      <Card className="p-6">
        {error ? (
          <p
            className={`${
              isRTL ? "font-arabic" : "font-english"
            } text-red-600 dark:text-red-400`}
          >
            {error}
          </p>
        ) : (
          <div
            className={`${
              isRTL ? "font-arabic text-right" : "font-english text-left"
            } whitespace-pre-wrap text-neutral-800 dark:text-neutral-100`}
          >
            {result}
          </div>
        )}
      </Card>
    </div>
  );
};

const BrainstormingSection: React.FC = () => {
  const { t, isRTL } = useApp();
  const [formData, setFormData] = useState<FormData>({
    idea: "",
    context: "",
    goals: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callBrainstorm = async (payload: {
    businessIdea: string;
    targetMarket: string;
    uniqueValue: string;
  }) => {
    const res = await fetch("/api/claude/brainstorm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data?.data?.generatedIdeas as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);
    setError(null);

    try {
      const ideas = await callBrainstorm({
        businessIdea: formData.idea,
        targetMarket: formData.context,
        uniqueValue: formData.goals,
      });
      setResult(ideas || "");
    } catch (err: any) {
      setError(
        isRTL
          ? "حدث خطأ أثناء توليد الأفكار. يرجى المحاولة مرة أخرى."
          : "An error occurred while generating ideas. Please try again."
      );
      console.error("Brainstorming error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = useMemo(
    () => Boolean(formData.idea && formData.context && formData.goals),
    [formData]
  );

  const commonInputClass = `w-full px-4 py-3 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 ${
    isRTL ? "font-arabic text-right" : "font-english text-left"
  }`;

  return (
    <section
      id="brainstorming"
      className="py-16 bg-white dark:bg-neutral-900"
      aria-labelledby="brainstorming-heading"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2
            id="brainstorming-heading"
            className={`text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4 ${
              isRTL ? "font-arabic" : "font-english"
            }`}
          >
            {t("step1Title")}
          </h2>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="business-idea"
                className={`block mb-2 text-sm font-medium ${
                  isRTL ? "font-arabic" : "font-english"
                }`}
              >
                {isRTL ? "فكرة العمل" : "Business Idea"}
              </label>
              <input
                id="business-idea"
                name="business-idea"
                value={formData.idea}
                onChange={(e) =>
                  setFormData({ ...formData, idea: e.target.value })
                }
                placeholder={
                  isRTL ? "اكتب فكرتك بإيجاز" : "Briefly describe your idea"
                }
                className={commonInputClass}
                data-testid="business-idea-input"
                required
                aria-required
              />
            </div>

            <div>
              <label
                htmlFor="target-market"
                className={`block mb-2 text-sm font-medium ${
                  isRTL ? "font-arabic" : "font-english"
                }`}
              >
                {isRTL ? "السوق المستهدف" : "Target Market"}
              </label>
              <input
                id="target-market"
                name="target-market"
                value={formData.context}
                onChange={(e) =>
                  setFormData({ ...formData, context: e.target.value })
                }
                placeholder={
                  isRTL ? "من هم عملاؤك؟" : "Who are your customers?"
                }
                className={commonInputClass}
                data-testid="target-market-input"
                required
                aria-required
              />
            </div>

            <div>
              <label
                htmlFor="goals"
                className={`block mb-2 text-sm font-medium ${
                  isRTL ? "font-arabic" : "font-english"
                }`}
              >
                {isRTL ? "الأهداف" : "Goals"}
              </label>
              <textarea
                id="goals"
                name="goals"
                rows={4}
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
                placeholder={
                  isRTL
                    ? "ما الذي تريد تحقيقه؟"
                    : "What do you want to achieve?"
                }
                className={`${commonInputClass} resize-y`}
                data-testid="goals-input"
                required
                aria-required
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                icon={<Lightbulb className="w-5 h-5" />}
                disabled={!isFormValid || isSubmitting}
                className="px-12 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                data-testid="brainstorm-submit"
              >
                {isRTL ? "ابدأ العصف الذهني" : "Start Brainstorming"}
              </Button>
            </div>
          </form>
        </Card>
        <ResultCard result={result} error={error} isRTL={isRTL} />
      </div>
    </section>
  );
};

export default BrainstormingSection;
