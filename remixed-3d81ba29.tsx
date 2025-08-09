import React, { useState, useEffect } from 'react';
import { FileText, Copy, Download, Loader2, Globe, FileDown, Printer } from 'lucide-react';

const TRANSLATIONS = {
  "en-US": {
    "pageTitle": "One-pager PRD",
    "pageSubtitle": "Turn your vague thoughts into a clear and concise one-pager",
    "threeQuestions": "3 questions",
    "tryExample": "Try:",
    "question1Label": "1. What product or feature are you building?",
    "question1Placeholder": "e.g., A real-time collaboration dashboard for remote teams...",
    "question2Label": "2. Who are the target users and what problem does this solve?",
    "question2Placeholder": "e.g., Remote team managers who struggle with visibility into project progress...",
    "question3Label": "3. What are the key features and how will you measure success?",
    "question3Placeholder": "e.g., Live status updates, team activity feed... Success measured by 40% reduction in status meeting time...",
    "generateButton": "Generate AI-Powered PRD",
    "generatingButton": "AI Generating PRD...",
    "copyTooltip": "Copy to clipboard",
    "downloadTooltip": "Download as markdown",
    "printTooltip": "Print as PDF",
    "emptyStateText": "Your AI-generated PRD will appear here after answering the questions",
    "errorMessage": "Failed to generate PRD. Please try again.",
    "teamDashboard": "Team Dashboard",
    "shoppingApp": "Shopping App",
    "fitnessTracker": "Fitness Tracker",
    "languageToggle": "Language",
    "poweredByAI": "Powered by Claude AI",
    "downloadingPdf": "Preparing PDF...",
    "downloadMarkdown": "Download Markdown",
    "downloadPdf": "Download PDF",
    "printPdf": "Print PDF"
  },
  "ar-SA": {
    "pageTitle": "مستند المنتج من صفحة واحدة",
    "pageSubtitle": "حوّل أفكارك الغامضة إلى مستند واضح ومختصر من صفحة واحدة",
    "threeQuestions": "3 أسئلة",
    "tryExample": "جرب:",
    "question1Label": "1. ما هو المنتج أو الميزة التي تبنيها؟",
    "question1Placeholder": "مثال: لوحة تحكم للتعاون في الوقت الفعلي للفرق عن بُعد...",
    "question2Label": "2. من هم المستخدمون المستهدفون وما المشكلة التي يحلها هذا؟",
    "question2Placeholder": "مثال: مديرو الفرق عن بُعد الذين يواجهون صعوبة في متابعة تقدم المشاريع...",
    "question3Label": "3. ما هي الميزات الرئيسية وكيف ستقيس النجاح؟",
    "question3Placeholder": "مثال: تحديثات الحالة المباشرة، تغذية نشاط الفريق... النجاح يُقاس بتقليل 40% من وقت اجتماعات المتابعة...",
    "generateButton": "إنشاء مستند بالذكاء الاصطناعي",
    "generatingButton": "الذكاء الاصطناعي ينشئ المستند...",
    "copyTooltip": "نسخ إلى الحافظة",
    "downloadTooltip": "تحميل كـ markdown",
    "printTooltip": "طباعة كـ PDF",
    "emptyStateText": "سيظهر مستندك المُنشأ بالذكاء الاصطناعي هنا بعد الإجابة على الأسئلة",
    "errorMessage": "فشل في إنشاء المستند. يرجى المحاولة مرة أخرى.",
    "teamDashboard": "لوحة الفريق",
    "shoppingApp": "تطبيق التسوق",
    "fitnessTracker": "متتبع اللياقة",
    "languageToggle": "اللغة",
    "poweredByAI": "مدعوم بـ Claude AI",
    "downloadingPdf": "جاري تحضير PDF...",
    "downloadMarkdown": "تحميل Markdown",
    "downloadPdf": "تحميل PDF",
    "printPdf": "طباعة PDF"
  }
};

const PRDCreator = () => {
  const [currentLocale, setCurrentLocale] = useState('en-US');
  const [formData, setFormData] = useState({
    question1: '',
    question2: '',
    question3: ''
  });
  const [generatedPRD, setGeneratedPRD] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const t = (key) => TRANSLATIONS[currentLocale]?.[key] || TRANSLATIONS['en-US'][key] || key;
  const isRTL = currentLocale.startsWith('ar');

  // Update document direction when locale changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLocale.split('-')[0];
  }, [currentLocale, isRTL]);

  // Sample examples with localized content
  const getSampleExamples = () => [
    {
      name: t('teamDashboard'),
      icon: '📊',
      data: {
        question1: isRTL 
          ? 'لوحة تحكم للتعاون في الوقت الفعلي تُظهر حالة العمل الحالية والمواعيد النهائية القادمة وتوفر الفريق'
          : 'A real-time team collaboration dashboard that shows current work status, upcoming deadlines, and team availability',
        question2: isRTL
          ? 'قادة الفرق عن بُعد ومديرو المشاريع الذين يواجهون صعوبة في معرفة من يعمل على ماذا ومتى ستكتمل المشاريع'
          : 'Remote team leads and project managers who struggle with visibility into who\'s working on what and when projects will be completed',
        question3: isRTL
          ? 'تحديثات الحالة المباشرة، تقويم توفر الفريق، تخصيص المهام الآلي، وعرض الجدول الزمني بالسحب والإفلات. النجاح يُقاس بتقليل 30% من اجتماعات المتابعة و25% تسريع في تسليم المشاريع'
          : 'Live status updates, team availability calendar, automated task assignments, and drag-and-drop timeline view. Success measured by 30% reduction in status meetings and 25% faster project delivery times'
      }
    },
    {
      name: t('shoppingApp'),
      icon: '🛍️',
      data: {
        question1: isRTL
          ? 'تطبيق تسوق محمول مع توصيات شخصية مدعومة بالذكاء الاصطناعي ودفع فوري'
          : 'A mobile shopping app with AI-powered personalized recommendations and instant checkout',
        question2: isRTL
          ? 'المهنيون المشغولون من سن 25-45 الذين يريدون التسوق بكفاءة واكتشاف المنتجات المناسبة لأسلوبهم دون قضاء ساعات في التصفح'
          : 'Busy professionals aged 25-45 who want to shop efficiently and discover products tailored to their style without spending hours browsing',
        question3: isRTL
          ? 'توصيات الأناقة بالذكاء الاصطناعي، الدفع بنقرة واحدة، توقع المقاسات، ميزة التجربة بالواقع المعزز، تتبع الأسعار، ومشاركة قائمة الأمنيات. النجاح يُقاس بزيادة 40% في متوسط قيمة الطلب و60% تقليل في هجر السلة'
          : 'AI style recommendations, one-tap checkout, size prediction, AR try-on feature, price tracking, and wishlist sharing. Success measured by 40% increase in average order value and 60% reduction in cart abandonment'
      }
    },
    {
      name: t('fitnessTracker'),
      icon: '💪',
      data: {
        question1: isRTL
          ? 'تطبيق تتبع اللياقة يجمع بين تخطيط التمارين وتسجيل التغذية وميزات التحفيز الاجتماعي'
          : 'A fitness tracking app that combines workout planning, nutrition logging, and social motivation features',
        question2: isRTL
          ? 'عشاق اللياقة والمبتدئون الذين يريدون حلاً شاملاً لتخطيط التمارين وتتبع التقدم والبقاء محفزين من خلال دعم المجتمع'
          : 'Fitness enthusiasts and beginners who want an all-in-one solution to plan workouts, track progress, and stay motivated through community support',
        question3: isRTL
          ? 'منشئ التمارين المخصص، تتبع الوجبات مع مسح الباركود، صور التقدم، تحديات المجتمع، ونصائح التدريب. النجاح يُقاس بـ 70% احتفاظ بالمستخدمين بعد 3 أشهر و45% تحسن في انتظام التمارين'
          : 'Custom workout builder, meal tracking with barcode scanning, progress photos, community challenges, and coaching tips. Success measured by 70% user retention after 3 months and 45% improvement in workout consistency'
      }
    }
  ];

  const handleLanguageToggle = () => {
    const newLocale = currentLocale === 'en-US' ? 'ar-SA' : 'en-US';
    setCurrentLocale(newLocale);
    // Clear form when switching languages
    setFormData({ question1: '', question2: '', question3: '' });
    setGeneratedPRD('');
    setCurrentExampleIndex(0);
  };

  const handleExampleClick = () => {
    const examples = getSampleExamples();
    const nextIndex = (currentExampleIndex + 1) % examples.length;
    setCurrentExampleIndex(nextIndex);
    setFormData(examples[nextIndex].data);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Enhanced markdown renderer with RTL support
  const renderMarkdown = (text) => {
    const directionClass = isRTL ? 'rtl' : 'ltr';
    const textAlign = isRTL ? 'text-right' : 'text-left';
    
    // Process the markdown with RTL considerations
    let html = text
      .replace(/\`\`\`([\s\S]*?)\`\`\`/g, `<pre class="bg-gray-100 p-4 rounded mb-4 overflow-x-auto ${textAlign}"><code>$1</code></pre>`)
      .replace(/\`(.*?)\`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');

    const lines = html.split('\n');
    const processedLines = [];
    let lists = [];
    let currentLevel = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      const indentMatch = line.match(/^(\s*)([\*\-\+]|\d+\.)\s/);
      
      if (indentMatch) {
        const indent = indentMatch[1].length;
        const level = Math.floor(indent / 2);
        const marker = indentMatch[2];
        const listType = marker.match(/\d+\./) ? 'ol' : 'ul';
        const cleanItem = line.replace(/^(\s*)([\*\-\+]|\d+\.)\s/, '');
        
        if (level > currentLevel) {
          for (let j = currentLevel; j < level; j++) {
            lists.push({ type: listType, items: [] });
          }
          currentLevel = level;
        } else if (level < currentLevel) {
          while (currentLevel > level) {
            const completedList = lists.pop();
            const listClass = completedList.type === 'ol' ? 'list-decimal' : 'list-disc';
            const marginClass = isRTL ? 'mr-4' : 'ml-4';
            const nestedList = `<${completedList.type} class="${listClass} list-inside mb-2 ${marginClass} ${textAlign}">${completedList.items.join('')}</${completedList.type}>`;
            
            if (lists.length > 0) {
              lists[lists.length - 1].items[lists[lists.length - 1].items.length - 1] += nestedList;
            } else {
              processedLines.push(nestedList);
            }
            currentLevel--;
          }
          currentLevel = level;
        }
        
        if (lists.length === 0 || level >= lists.length) {
          lists.push({ type: listType, items: [] });
        }
        
        lists[level].items.push(`<li class="mb-1 ${textAlign}">${cleanItem}</li>`);
      } else {
        while (lists.length > 0) {
          const completedList = lists.pop();
          const listClass = completedList.type === 'ol' ? 'list-decimal' : 'list-disc';
          const marginClass = isRTL ? (lists.length > 0 ? 'mr-4' : '') : (lists.length > 0 ? 'ml-4' : '');
          const listElement = `<${completedList.type} class="${listClass} list-inside mb-4 ${marginClass} ${textAlign}">${completedList.items.join('')}</${completedList.type}>`;
          
          if (lists.length > 0) {
            lists[lists.length - 1].items[lists[lists.length - 1].items.length - 1] += listElement;
          } else {
            processedLines.push(listElement);
          }
        }
        currentLevel = 0;
        
        if (trimmedLine) {
          if (line.startsWith('# ')) {
            processedLines.push(`<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4 ${textAlign}">${line.substring(2)}</h1>`);
          } else if (line.startsWith('## ')) {
            processedLines.push(`<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3 ${textAlign}">${line.substring(3)}</h2>`);
          } else if (line.startsWith('### ')) {
            processedLines.push(`<h3 class="text-lg font-bold text-gray-900 mt-4 mb-2 ${textAlign}">${line.substring(4)}</h3>`);
          } else {
            processedLines.push(`<p class="mb-4 ${textAlign}">${line}</p>`);
          }
        } else {
          processedLines.push('');
        }
      }
    }
    
    while (lists.length > 0) {
      const completedList = lists.pop();
      const listClass = completedList.type === 'ol' ? 'list-decimal' : 'list-disc';
      const marginClass = isRTL ? (lists.length > 0 ? 'mr-4' : '') : (lists.length > 0 ? 'ml-4' : '');
      const listElement = `<${completedList.type} class="${listClass} list-inside mb-4 ${marginClass} ${textAlign}">${completedList.items.join('')}</${completedList.type}>`;
      
      if (lists.length > 0) {
        lists[lists.length - 1].items[lists[lists.length - 1].items.length - 1] += listElement;
      } else {
        processedLines.push(listElement);
      }
    }
    
    html = processedLines.join('\n');
    
    html = html
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');

    return html;
  };

  // Enhanced AI-powered PRD generation
  const generatePRD = async () => {
    setIsGenerating(true);
    setError('');
    setGeneratedPRD('');
    
    const languageInstruction = isRTL ? 'Please respond in Arabic language with proper RTL formatting.' : 'Please respond in English language.';
    
    const prompt = `You are an expert product manager with 10+ years of experience creating successful PRDs. Create a comprehensive, professional one-pager PRD based on these inputs:

1. Product/Feature: ${formData.question1}
2. Target Users & Problem: ${formData.question2}
3. Key Functionality & Success Metrics: ${formData.question3}

${languageInstruction}

Format the PRD exactly following this template using proper markdown headers. Be specific, actionable, and include relevant metrics and KPIs:

# One-pager: [PRODUCT NAME]

## 1. TL;DR
A compelling 2-3 sentence summary—what is this, who's it for, and why does it matter?

## 2. Goals
### Business Goals
* [3-4 specific, measurable business objectives]

### User Goals
* [3-4 specific user outcomes and benefits]

### Non-Goals
* [2-3 things explicitly out of scope]

## 3. User Stories
**Primary Persona:** [Name and description]
* As a [persona], I want [goal] so that [benefit]
* [2-3 additional user stories]

## 4. Functional Requirements
### Must-Have (P0)
* [Core features absolutely required for launch]

### Should-Have (P1)
* [Important features for competitive advantage]

### Could-Have (P2)
* [Nice-to-have features for future iterations]

## 5. User Experience
### Happy Path
* [Step-by-step user journey for primary use case]

### Edge Cases
* [Key error states and edge cases to handle]

### UI/UX Notes
* [Critical design and interaction requirements]

## 6. Narrative
A day-in-the-life scenario showing how this product transforms the user's experience. Make it compelling and specific.

## 7. Success Metrics
### Primary KPIs
* [2-3 key metrics that define success]

### Secondary Metrics
* [Supporting metrics to track]

### Target Timeline
* [When to measure and expected results]

## 8. Milestones & Sequencing
### Phase 1 (MVP) - [Timeline]
* [Core features and deliverables]

### Phase 2 (Enhancement) - [Timeline]
* [Additional features and improvements]

### Phase 3 (Scale) - [Timeline]
* [Advanced features and optimization]

## 9. Risks & Mitigation
* **Risk:** [Potential issue] | **Mitigation:** [How to address]
* [2-3 additional risks]

## 10. Dependencies & Resources
* **Technical Dependencies:** [Required systems/APIs]
* **Team Requirements:** [Roles and approximate effort]
* **External Dependencies:** [Third-party requirements]

Make it professional, comprehensive, and immediately actionable. Include specific numbers, timeframes, and measurable outcomes where possible.`;

    try {
      // Use the Claude API available in the artifact environment
      if (typeof window !== 'undefined' && window.claude && window.claude.complete) {
        const fullResponse = await window.claude.complete(prompt);
        
        // Simulate streaming effect
        const words = fullResponse.split(' ');
        let displayText = '';
        
        for (let i = 0; i < words.length; i++) {
          displayText += words[i] + ' ';
          setGeneratedPRD(displayText);
          await new Promise(resolve => setTimeout(resolve, 15));
        }
      } else {
        // Fallback: Use fetch with proper Claude API integration
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            messages: [
              { role: "user", content: prompt }
            ]
          })
        });
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        const fullResponse = data.content[0].text;
        
        // Simulate streaming effect
        const words = fullResponse.split(' ');
        let displayText = '';
        
        for (let i = 0; i < words.length; i++) {
          displayText += words[i] + ' ';
          setGeneratedPRD(displayText);
          await new Promise(resolve => setTimeout(resolve, 15));
        }
      }
    } catch (err) {
      setError(t('errorMessage'));
      console.error('Error generating PRD:', err);
    }
    
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPRD);
  };

  const downloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedPRD], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'prd.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generatePDF = async () => {
    setIsDownloadingPdf(true);
    
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    const prdContent = renderMarkdown(generatedPRD);
    
    const pdfContent = `
      <!DOCTYPE html>
      <html dir="${isRTL ? 'rtl' : 'ltr'}" lang="${currentLocale.split('-')[0]}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PRD Document</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: system-ui, -apple-system, sans-serif; 
            line-height: 1.6; 
            color: #1f2937; 
            max-width: 210mm; 
            margin: 0 auto; 
            padding: 20mm;
            direction: ${isRTL ? 'rtl' : 'ltr'};
          }
          h1 { font-size: 24px; margin-bottom: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
          h2 { font-size: 20px; margin: 24px 0 12px 0; color: #374151; }
          h3 { font-size: 16px; margin: 16px 0 8px 0; color: #4b5563; }
          p { margin-bottom: 12px; }
          ul, ol { margin-bottom: 12px; padding-${isRTL ? 'right' : 'left'}: 20px; }
          li { margin-bottom: 4px; }
          strong { font-weight: 600; }
          em { font-style: italic; }
          code { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; font-family: monospace; }
          pre { background: #f3f4f6; padding: 12px; border-radius: 6px; margin-bottom: 12px; overflow-x: auto; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          @media print {
            body { margin: 0; padding: 20mm; }
            @page { margin: 15mm; size: A4; }
          }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; }
          .ai-badge { font-size: 12px; color: #6b7280; margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="ai-badge">${t('poweredByAI')} • ${new Date().toLocaleDateString(currentLocale)}</div>
        </div>
        ${prdContent}
      </body>
      </html>
    `;
    
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      setIsDownloadingPdf(false);
    }, 500);
  };

  const examples = getSampleExamples();

  return (
    <div className={`h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex overflow-hidden relative ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Glassmorphism background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side - Input Section */}
      <div className={`w-1/2 p-8 overflow-y-auto relative z-10 ${isRTL ? 'order-2' : 'order-1'}`}>
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('pageTitle')}
              </h1>
              <p className={`text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('pageSubtitle')}
              </p>
            </div>
            
            {/* Language Toggle */}
            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white/90 text-gray-700 rounded-full transition-all backdrop-blur-sm border border-white/40 hover:shadow-md"
              title={t('languageToggle')}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {currentLocale === 'en-US' ? 'العربية' : 'English'}
              </span>
            </button>
          </div>
          
          {/* AI Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 rounded-full text-sm backdrop-blur-sm border border-blue-200/30 ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            {t('poweredByAI')}
          </div>
        </div>

        {/* Input Form with glassmorphism */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/50 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('threeQuestions')}
              </h2>
              <button
                onClick={handleExampleClick}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-white/60 hover:bg-white/80 text-gray-700 rounded-full transition-all backdrop-blur-sm border border-white/40 hover:shadow-md"
              >
                <span>{examples[currentExampleIndex].icon}</span>
                <span>{t('tryExample')} {examples[currentExampleIndex].name}</span>
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('question1Label')}
              </label>
              <textarea
                value={formData.question1}
                onChange={(e) => handleInputChange('question1', e.target.value)}
                className={`w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                rows="3"
                placeholder={t('question1Placeholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('question2Label')}
              </label>
              <textarea
                value={formData.question2}
                onChange={(e) => handleInputChange('question2', e.target.value)}
                className={`w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                rows="3"
                placeholder={t('question2Placeholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('question3Label')}
              </label>
              <textarea
                value={formData.question3}
                onChange={(e) => handleInputChange('question3', e.target.value)}
                className={`w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                rows="3"
                placeholder={t('question3Placeholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <button
              onClick={generatePRD}
              disabled={isGenerating || !formData.question1 || !formData.question2 || !formData.question3}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('generatingButton')}
                </>
              ) : (
                t('generateButton')
              )}
            </button>

            {error && (
              <p className={`text-red-600 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Document Section with glassmorphism */}
      <div className={`w-1/2 bg-white/90 backdrop-blur-lg border-l border-white/50 flex flex-col relative z-10 ${isRTL ? 'order-1 border-r border-l-0' : 'order-2'}`}>
        {/* Document Header - Fixed */}
        {generatedPRD && (
          <div className="border-b border-white/50 p-4 flex items-center justify-end bg-white/90 backdrop-blur-sm">
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 rounded-md transition-colors backdrop-blur-sm"
                title={t('copyTooltip')}
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={downloadMarkdown}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50/80 rounded-md transition-colors backdrop-blur-sm"
                title={t('downloadMarkdown')}
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={generatePDF}
                disabled={isDownloadingPdf}
                className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50/80 rounded-md transition-colors backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title={t('printPdf')}
              >
                {isDownloadingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Printer className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Document Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {generatedPRD ? (
              <div 
                className={`prose prose-sm max-w-none text-gray-800 ${isRTL ? 'prose-rtl' : ''}`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(generatedPRD) }}
              />
            ) : (
              <div className={`text-gray-500 text-center py-12 ${isRTL ? 'text-right' : 'text-left'}`}>
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>{t('emptyStateText')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .prose-rtl {
          direction: rtl;
          text-align: right;
        }
        .prose-rtl ul, .prose-rtl ol {
          padding-right: 1.5rem;
          padding-left: 0;
        }
      `}</style>
    </div>
  );
};

export default PRDCreator;