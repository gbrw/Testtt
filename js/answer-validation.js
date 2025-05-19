// ملف معالجة وتحقق الإجابات بشكل مرن
console.log('تحميل وظائف معالجة الإجابات المرنة...');

// تنقية النص من الحروف غير الضرورية
function cleanText(text) {
  if (!text) return '';
  return text
    .trim()                        // إزالة المسافات الزائدة
    .replace(/\s+/g, ' ')          // استبدال المسافات المتعددة بمسافة واحدة
    .replace(/أ|آ|إ/g, 'ا')        // توحيد الألف بأشكالها
    .replace(/ة/g, 'ه')            // توحيد التاء المربوطة
    .replace(/ي/g, 'ى')            // توحيد الياء
    .replace(/[^\w\s\u0600-\u06FF]/g, ''); // إزالة الرموز والحروف الخاصة
}

// مقارنة الإجابات بشكل مرن
function compareAnswers(userAnswer, correctAnswer) {
  if (!userAnswer || !correctAnswer) return false;
  
  // تنظيف النصوص
  const cleanedUserAnswer = cleanText(userAnswer.toLowerCase());
  let cleanedCorrectAnswer = correctAnswer;
  
  // التحقق من كون الإجابة الصحيحة نصاً أو مصفوفة
  if (typeof correctAnswer === 'string') {
    cleanedCorrectAnswer = cleanText(correctAnswer.toLowerCase());
    
    // المقارنة المباشرة
    if (cleanedUserAnswer === cleanedCorrectAnswer) {
      return true;
    }
    
    // المقارنة الجزئية (مثل: "انشيلوتي" بدلاً من "كارلو انشيلوتي")
    const correctParts = cleanedCorrectAnswer.split(' ');
    
    // التحقق من وجود أي جزء من الإجابة الصحيحة في إجابة المستخدم
    for (const part of correctParts) {
      if (part.length > 2 && cleanedUserAnswer.includes(part)) {
        return true;
      }
    }
    
    // التحقق من تطابق جزئي (مثلاً إذا كان هناك خطأ إملائي بسيط)
    return calculateSimilarity(cleanedUserAnswer, cleanedCorrectAnswer) > 0.8;
  }
  
  // إذا كانت الإجابة الصحيحة مصفوفة من الإجابات المحتملة
  if (Array.isArray(correctAnswer)) {
    for (const answer of correctAnswer) {
      if (compareAnswers(userAnswer, answer)) {
        return true;
      }
    }
  }
  
  return false;
}

// حساب تشابه النصوص (للتعامل مع الأخطاء الإملائية البسيطة)
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  
  // مقياس تشابه بسيط
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  // حساب مسافة ليفنشتاين (Levenshtein distance)
  const editDistance = levenshteinDistance(longer, shorter);
  
  return (longer.length - editDistance) / longer.length;
}

// حساب مسافة ليفنشتاين (لقياس الاختلاف بين سلسلتين)
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  // تهيئة المصفوفة
  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }
  
  // ملء المصفوفة
  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i-1] !== str2[j-1] ? 1 : 0;
      matrix[i][j] = Math.min(
        matrix[i-1][j] + 1,        // حذف
        matrix[i][j-1] + 1,        // إضافة
        matrix[i-1][j-1] + cost    // استبدال
      );
    }
  }
  
  return matrix[str1.length][str2.length];
}

// إنشاء قائمة بالإجابات البديلة للإجابات الشائعة
function generateAlternativeAnswers(correctAnswer) {
  if (!correctAnswer) return [];
  
  const alternatives = [correctAnswer];
  
  // فصل الأسماء الأول والأخير
  if (correctAnswer.includes(' ')) {
    const nameParts = correctAnswer.split(' ');
    
    // إضافة الاسم الأخير فقط (مثل "انشيلوتي")
    if (nameParts.length >= 2) {
      alternatives.push(nameParts[nameParts.length - 1]);
    }
    
    // إضافة الاسم الأول فقط (مثل "كارلو")
    alternatives.push(nameParts[0]);
  }
  
  // إضافة بدائل للأسماء المعروفة مع اختلافات إملائية شائعة
  const commonMisspellings = {
    'انشيلوتي': ['انشلوتي', 'انشيلوتى', 'انشلوتى', 'انجيلوتي'],
    'كريستيانو': ['كرستيانو', 'كريستيانو', 'كريستانو'],
    'رونالدو': ['رونالدو', 'رنالدو', 'رونالدوا'],
    'ميسي': ['ميسى', 'ميسي', 'مسي'],
    'زيدان': ['زيدان', 'زيدين', 'زين الدين زيدان', 'زين'],
    'انييستا': ['انيستا', 'إنييستا', 'انييستا'],
    'تشافي': ['تشافي', 'تشابي', 'خافي', 'تشافى'],
    'مبابي': ['مبابي', 'امبابي', 'مبابى'],
    'كلوزه': ['كلوزه', 'كلوزي', 'ميروسلاف كلوزه', 'ميروسلاف', 'كلوز'],
    'كاسياس': ['كاسياس', 'كاسيس', 'كاسياث'],
    'بوفون': ['بوفون', 'بيفون', 'غيانلويجي بوفون', 'بفون'],
    'نوير': ['نوير', 'نوير', 'مانويل نوير'],
    'هازارد': ['هازارد', 'هازار', 'هازرد', 'ايدين هازارد', 'ايدن'],
    'بنزيما': ['بنزيما', 'بنزيمه', 'بنزما', 'كريم بنزيما', 'كريم'],
    'ريال مدريد': ['ريال مدريد', 'ريال', 'مدريد', 'الريال'],
    'برشلونة': ['برشلونة', 'برشلونه', 'برشلونا', 'البرسا', 'البارسا'],
    'الارجنتين': ['الارجنتين', 'ارجنتين', 'الأرجنتين'],
    'فرنسا': ['فرنسا', 'الفرنسي', 'فرنسية', 'منتخب فرنسا'],
    'اسبانيا': ['اسبانيا', 'إسبانيا', 'اسبانية', 'منتخب اسبانيا'],
    'البرازيل': ['البرازيل', 'برازيل', 'منتخب البرازيل'],
    'مانشستر يونايتد': ['مانشستر يونايتد', 'مانشستر', 'اليونايتد', 'مان يونايتد'],
    'ليفربول': ['ليفربول', 'ليفربوول', 'ليڤربول'],
    'باريس سان جيرمان': ['باريس سان جيرمان', 'باريس', 'سان جيرمان', 'بي اس جي']
  };
  
  // إضافة البدائل الشائعة إذا وجدت
  Object.entries(commonMisspellings).forEach(([key, spellings]) => {
    if (correctAnswer.toLowerCase().includes(key.toLowerCase())) {
      alternatives.push(...spellings);
    }
  });
  
  // إزالة التكرارات
  return [...new Set(alternatives)];
}
