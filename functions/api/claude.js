/**
 * Claude AI API Routes for Idea to Market Platform
 * Handles AI content generation with Saudi cultural context
 */

import { Hono } from 'hono';

const app = new Hono();

// ===== CLAUDE AI INTEGRATION =====

// Generate brainstorming ideas
app.post('/brainstorm', async (c) => {
  try {
    const { businessIdea, targetMarket, uniqueValue, businessModel, competitiveAdvantage } = await c.req.json();
    const locale = c.get('locale') || 'ar-SA';
    const isArabic = locale === 'ar-SA';
    
    // Validate required fields
    if (!businessIdea || !targetMarket) {
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'يرجى إدخال الفكرة والسوق المستهدف' : 'Business idea and target market are required',
          code: 'MISSING_FIELDS'
        }
      }, 400);
    }

    // Saudi cultural context prompt
    const saudiContext = isArabic ? `
تعامل مع هذا الطلب كخبير في ريادة الأعمال السعودية. ضع في اعتبارك:
- رؤية السعودية 2030 والتحول الاقتصادي
- القيم والثقافة الإسلامية والعربية
- السوق السعودي المحلي والاحتياجات الخاصة
- القوانين واللوائح السعودية
- الفرص في قطاعات النمو (التقنية، السياحة، الترفيه، الرياضة)
- التركيز على التوطين والاستدامة
` : `
Act as a Saudi business expert. Consider:
- Saudi Vision 2030 and economic transformation
- Islamic and Arabic cultural values
- Local Saudi market and specific needs
- Saudi laws and regulations
- Growth sectors (technology, tourism, entertainment, sports)
- Focus on localization and sustainability
`;

    const prompt = `${saudiContext}

${isArabic ? 'بناءً على المعلومات التالية:' : 'Based on the following information:'}

${isArabic ? 'فكرة العمل:' : 'Business Idea:'} ${businessIdea}
${isArabic ? 'السوق المستهدف:' : 'Target Market:'} ${targetMarket}
${uniqueValue ? `${isArabic ? 'القيمة الفريدة:' : 'Unique Value:'} ${uniqueValue}` : ''}
${businessModel ? `${isArabic ? 'نموذج العمل:' : 'Business Model:'} ${businessModel}` : ''}
${competitiveAdvantage ? `${isArabic ? 'الميزة التنافسية:' : 'Competitive Advantage:'} ${competitiveAdvantage}` : ''}

${isArabic ? `يرجى تطوير وتحسين هذه الفكرة التجارية بالتفصيل، مع تقديم:

1. **تحليل الفكرة والسوق:**
   - تقييم جدوى الفكرة في السوق السعودي
   - حجم السوق المحتمل والعملاء المستهدفين
   - الاتجاهات والفرص في هذا القطاع

2. **الاستراتيجية والتنفيذ:**
   - خطة العمل المبدئية
   - متطلبات البدء (رأس المال، التراخيص، الموارد)
   - الشراكات الاستراتيجية المحتملة

3. **النمو والتطوير:**
   - استراتيجيات التسويق للسوق السعودي
   - خطط التوسع والنمو
   - التحديات المحتملة وحلولها

4. **الجوانب التقنية والإبداعية:**
   - التقنيات والأدوات المطلوبة
   - الابتكارات الممكنة
   - التطوير المستقبلي

يرجى الكتابة باللغة العربية مع مراعاة الثقافة السعودية والقيم الإسلامية.` : `Please develop and enhance this business idea in detail, providing:

1. **Idea and Market Analysis:**
   - Feasibility assessment in the Saudi market
   - Potential market size and target customers
   - Trends and opportunities in this sector

2. **Strategy and Implementation:**
   - Initial business plan
   - Starting requirements (capital, licenses, resources)
   - Potential strategic partnerships

3. **Growth and Development:**
   - Marketing strategies for the Saudi market
   - Expansion and growth plans
   - Potential challenges and solutions

4. **Technical and Creative Aspects:**
   - Required technologies and tools
   - Possible innovations
   - Future development

Please write in English while considering Saudi culture and Islamic values.`}`;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${c.env.CLAUDE_API_KEY}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.content[0].text;

    // Track usage
    await c.env.ANALYTICS?.writeDataPoint({
      blobs: [c.req.header('CF-Ray'), 'brainstorm_generation'],
      doubles: [Date.now(), generatedContent.length],
      indexes: ['claude_api_usage']
    });

    return c.json({
      success: true,
      data: {
        generatedIdeas: generatedContent,
        timestamp: new Date().toISOString(),
        locale: locale
      }
    });

  } catch (error) {
    console.error('Brainstorm generation error:', error);
    
    const isArabic = c.get('locale') === 'ar-SA';
    return c.json({
      success: false,
      error: {
        message: isArabic ? 'فشل في توليد الأفكار' : 'Failed to generate ideas',
        code: 'GENERATION_ERROR'
      }
    }, 500);
  }
});

// Generate PRD document
app.post('/generate-prd', async (c) => {
  try {
    const { question1, question2, question3 } = await c.req.json();
    const locale = c.get('locale') || 'ar-SA';
    const isArabic = locale === 'ar-SA';

    if (!question1 || !question2 || !question3) {
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'يرجى الإجابة على جميع الأسئلة' : 'Please answer all questions',
          code: 'MISSING_ANSWERS'
        }
      }, 400);
    }

    const languageInstruction = isArabic ? 
      'يرجى الرد باللغة العربية مع التنسيق المناسب للنص من اليمين إلى اليسار.' : 
      'Please respond in English language.';

    const prompt = `أنت مدير منتج خبير لديه أكثر من 10 سنوات من الخبرة في إنشاء مستندات متطلبات المنتج الناجحة للسوق السعودي. قم بإنشاء مستند متطلبات منتج شامل ومهني من صفحة واحدة بناءً على هذه المدخلات:

1. المنتج/الميزة: ${question1}
2. المستخدمون المستهدفون والمشكلة: ${question2}
3. الوظائف الأساسية ومقاييس النجاح: ${question3}

${languageInstruction}

قم بتنسيق مستند متطلبات المنتج بالضبط وفقاً لهذا النموذج باستخدام عناوين markdown المناسبة. كن محدداً وقابلاً للتنفيذ وأدرج مقاييس ومؤشرات أداء ذات صلة:

# مستند من صفحة واحدة: [اسم المنتج]

## 1. الملخص التنفيذي
ملخص جذاب من 2-3 جمل—ما هذا، لمن، ولماذا مهم؟

## 2. الأهداف
### أهداف العمل
* [3-4 أهداف عمل محددة وقابلة للقياس]

### أهداف المستخدم
* [3-4 نتائج وفوائد محددة للمستخدم]

### غير الأهداف
* [2-3 أشياء خارج النطاق بوضوح]

## 3. قصص المستخدم
**الشخصية الأساسية:** [الاسم والوصف]
* كمستخدم [الشخصية]، أريد [الهدف] حتى [الفائدة]
* [2-3 قصص مستخدم إضافية]

## 4. المتطلبات الوظيفية
### يجب أن يكون (P0)
* [الميزات الأساسية المطلوبة بشكل مطلق للإطلاق]

### يجب أن يكون (P1)
* [ميزات مهمة للميزة التنافسية]

### يمكن أن يكون (P2)
* [ميزات لطيفة للتكرارات المستقبلية]

## 5. تجربة المستخدم
### المسار السعيد
* [رحلة المستخدم خطوة بخطوة لحالة الاستخدام الأساسية]

### الحالات الحدية
* [حالات الخطأ الرئيسية والحالات الحدية للتعامل معها]

### ملاحظات UI/UX
* [متطلبات التصميم والتفاعل الحرجة]

## 6. السرد
سيناريو يوم في الحياة يظهر كيف يحول هذا المنتج تجربة المستخدم. اجعله جذاباً ومحدداً.

## 7. مقاييس النجاح
### مؤشرات الأداء الرئيسية
* [2-3 مقاييس رئيسية تحدد النجاح]

### المقاييس الثانوية
* [مقاييس داعمة للتتبع]

### الجدول الزمني المستهدف
* [متى نقيس والنتائج المتوقعة]

## 8. المعالم والتسلسل
### المرحلة 1 (النموذج الأولي) - [الجدول الزمني]
* [الميزات والتسليمات الأساسية]

### المرحلة 2 (التحسين) - [الجدول الزمني]
* [ميزات وتحسينات إضافية]

### المرحلة 3 (التوسيع) - [الجدول الزمني]
* [ميزات متقدمة وتحسين]

## 9. المخاطر والتخفيف
* **المخاطرة:** [مشكلة محتملة] | **التخفيف:** [كيفية المعالجة]
* [2-3 مخاطر إضافية]

## 10. التبعيات والموارد
* **التبعيات التقنية:** [الأنظمة/APIs المطلوبة]
* **متطلبات الفريق:** [الأدوار والجهد التقريبي]
* **التبعيات الخارجية:** [متطلبات الطرف الثالث]

اجعله محترفاً وشاملاً وقابلاً للتنفيذ فوراً. أدرج أرقاماً وجداول زمنية ونتائج قابلة للقياس محددة حيثما أمكن. تأكد من مراعاة السوق السعودي والثقافة المحلية.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${c.env.CLAUDE_API_KEY}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedPRD = data.content[0].text;

    // Track PRD generation
    await c.env.ANALYTICS?.writeDataPoint({
      blobs: [c.req.header('CF-Ray'), 'prd_generation'],
      doubles: [Date.now(), generatedPRD.length],
      indexes: ['claude_api_usage']
    });

    return c.json({
      success: true,
      data: {
        generatedPRD,
        timestamp: new Date().toISOString(),
        locale: locale
      }
    });

  } catch (error) {
    console.error('PRD generation error:', error);
    
    const isArabic = c.get('locale') === 'ar-SA';
    return c.json({
      success: false,
      error: {
        message: isArabic ? 'فشل في إنشاء مستند متطلبات المنتج' : 'Failed to generate PRD',
        code: 'PRD_GENERATION_ERROR'
      }
    }, 500);
  }
});

// Generate prototype specifications
app.post('/generate-prototype', async (c) => {
  try {
    const { appType, features, designStyle, targetPlatform, prdContent } = await c.req.json();
    const locale = c.get('locale') || 'ar-SA';
    const isArabic = locale === 'ar-SA';

    if (!appType || !features || features.length === 0) {
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'يرجى تحديد نوع التطبيق والميزات' : 'Please specify app type and features',
          code: 'MISSING_PROTOTYPE_INFO'
        }
      }, 400);
    }

    const prompt = `أنت مطور نماذج أولية خبير متخصص في السوق السعودي. بناءً على مستند متطلبات المنتج والمعلومات التالية، قم بإنشاء مواصفات نموذج أولي HTML كامل وعملي:

**معلومات النموذج الأولي:**
- نوع التطبيق: ${appType}
- الميزات: ${features.join(', ')}
- أسلوب التصميم: ${designStyle}
- المنصة المستهدفة: ${targetPlatform}

${prdContent ? `**مستند متطلبات المنتج:**\n${prdContent}` : ''}

**متطلبات حاسمة:**
1. أرجع كود HTML صحيح فقط - بدون markdown، بدون backticks، بدون شروحات
2. أدرج جميع CSS inline في علامات <style>
3. أدرج جميع JavaScript inline في علامات <script>
4. اجعله نموذجاً أولياً كاملاً وتفاعلياً يُظهر جميع الميزات
5. استخدم معايير الويب الحديثة (HTML5, CSS3, ES6+)
6. نفذ تصميماً متجاوباً للجوال وسطح المكتب
7. تأكد من امتثال إمكانية الوصول (تسميات ARIA، HTML دلالي)
8. ابدأ بـ <!DOCTYPE html> وانته بـ </html>
9. دعم اتجاه النص من اليمين إلى اليسار للمحتوى العربي
10. استخدم الثقافة السعودية والألوان التراثية (الأخضر، الذهبي)

**إرشادات التصميم:**
- واجهة مستخدم نظيفة وحديثة مع UX ممتاز
- نظام ألوان وطباعة احترافية
- رسوم متحركة وتفاعلات سلسة
- تصميم متجاوب mobile-first
- تحميل سريع ومحسن للأداء
- مراعاة الثقافة السعودية والقيم الإسلامية

قم بإنشاء النموذج الأولي HTML الكامل الآن:`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${c.env.CLAUDE_API_KEY}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 8000,
        temperature: 0.4,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    let generatedPrototype = data.content[0].text;

    // Clean up the response
    generatedPrototype = generatedPrototype
      .replace(/```html\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Store the generated prototype in R2
    const prototypeId = crypto.randomUUID();
    await c.env.GENERATED_CONTENT.put(
      `prototypes/${prototypeId}.html`,
      generatedPrototype,
      {
        httpMetadata: {
          contentType: 'text/html; charset=utf-8'
        },
        customMetadata: {
          userId: c.get('jwtPayload')?.sub || 'anonymous',
          appType: appType,
          features: features.join(','),
          createdAt: new Date().toISOString()
        }
      }
    );

    // Track prototype generation
    await c.env.ANALYTICS?.writeDataPoint({
      blobs: [c.req.header('CF-Ray'), 'prototype_generation', appType],
      doubles: [Date.now(), generatedPrototype.length, features.length],
      indexes: ['claude_api_usage']
    });

    return c.json({
      success: true,
      data: {
        generatedPrototype,
        prototypeId,
        downloadUrl: `/api/prototypes/${prototypeId}`,
        timestamp: new Date().toISOString(),
        locale: locale
      }
    });

  } catch (error) {
    console.error('Prototype generation error:', error);
    
    const isArabic = c.get('locale') === 'ar-SA';
    return c.json({
      success: false,
      error: {
        message: isArabic ? 'فشل في إنشاء النموذج الأولي' : 'Failed to generate prototype',
        code: 'PROTOTYPE_GENERATION_ERROR'
      }
    }, 500);
  }
});

// Retrieve generated prototype
app.get('/prototypes/:id', async (c) => {
  try {
    const prototypeId = c.req.param('id');
    
    const prototype = await c.env.GENERATED_CONTENT.get(`prototypes/${prototypeId}.html`);
    
    if (!prototype) {
      const isArabic = c.get('locale') === 'ar-SA';
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'النموذج الأولي غير موجود' : 'Prototype not found',
          code: 'PROTOTYPE_NOT_FOUND'
        }
      }, 404);
    }

    const content = await prototype.text();
    
    return new Response(content, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000', // 1 year
        'X-Prototype-ID': prototypeId
      }
    });

  } catch (error) {
    console.error('Prototype retrieval error:', error);
    
    const isArabic = c.get('locale') === 'ar-SA';
    return c.json({
      success: false,
      error: {
        message: isArabic ? 'فشل في استرجاع النموذج الأولي' : 'Failed to retrieve prototype',
        code: 'PROTOTYPE_RETRIEVAL_ERROR'
      }
    }, 500);
  }
});

export { app as claudeRoutes };