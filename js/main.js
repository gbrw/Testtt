// ملف التطبيق الرئيسي
console.log('تحميل ملف التطبيق الرئيسي...');

// تنفيذ عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  console.log('تم تحميل الصفحة، بدء التطبيق');
  
  // اختبار الاتصال بقاعدة البيانات Firebase
  testFirebaseConnection();
  
  // تحقق من تحميل معالجات الأحداث
  if (typeof showToast === 'function') {
    // عرض رسالة ترحيبية للمستخدم
    setTimeout(() => {
      showToast('مرحباً بك في تحدي كرة القدم! 🎮', 'info');
    }, 1000);
  } else {
    console.error('لم يتم تحميل وظائف تجربة المستخدم بشكل صحيح');
  }
  
  // التحقق من تحميل وظائف معالجة الإجابات المرنة
  if (typeof compareAnswers === 'function') {
    console.log('تم تحميل وظائف معالجة الإجابات المرنة بنجاح');
  } else {
    console.error('لم يتم تحميل وظائف معالجة الإجابات المرنة بشكل صحيح');
  }
  
  // تحقق من تهيئة وظائف منطق اللعبة
  if (typeof initGame === 'function') {
    console.log('تم تحميل منطق اللعبة بنجاح');
  } else {
    console.error('لم يتم تحميل منطق اللعبة بشكل صحيح');
  }
  
  console.log('اكتمل بدء التطبيق');
});

// تحميل معالجات تحسين الإجابات
const originalCheckKnowledgeAnswer = checkKnowledgeAnswer;
const originalCheckBellAnswer = checkBellAnswer;
const originalCheckCareerAnswer = checkCareerAnswer;

// استبدال وظائف التحقق من الإجابة بالوظائف المحسنة
checkKnowledgeAnswer = function(answer, playerKey) {
  console.log('التحقق من إجابة جولة المعرفة:', answer);
  const questionIndex = gameState.currentQuestion - 1;
  const question = gameState.questions.knowledge[questionIndex];
  
  if (!question) return;
  
  // تحويل الإجابة إلى نص صغير للمقارنة
  const normalizedAnswer = answer.toLowerCase().trim();
  
  // البحث عن تطابق في قائمة الإجابات الصحيحة باستخدام معالجة مرنة
  const isCorrect = question.answers.some(validAnswer => {
    const alternatives = generateAlternativeAnswers(validAnswer);
    return alternatives.some(alt => compareAnswers(normalizedAnswer, alt));
  });
  
  if (isCorrect) {
    console.log('الإجابة صحيحة!');
    showToast('إجابة صحيحة! 🎉', 'success');
    
    // تحديث النتيجة للاعب
    const currentScore = gameState.players[playerKey].score || 0;
    updatePlayerScore(gameState.roomCode, playerKey, currentScore + 1);
    
    // إظهار مؤثرات الاحتفال إذا كانت متاحة
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    // الانتقال إلى السؤال التالي
    moveToNextQuestion();
  } else if (answer === 'PASS') {
    console.log('اللاعب قام بتمرير الدور');
    // تغيير الدور إلى اللاعب الآخر
    const nextPlayer = playerKey === 'player1' ? 'player2' : 'player1';
    updateGameState(gameState.roomCode, { currentTurn: nextPlayer });
  } else {
    console.log('الإجابة خاطئة');
    showToast('إجابة خاطئة', 'error');
    
    // الإجابة خاطئة، تقليل عدد المحاولات
    const attemptsLeft = parseInt(document.getElementById('attempts-left').textContent);
    if (attemptsLeft > 1) {
      // تقليل عدد المحاولات
      document.getElementById('attempts-left').textContent = attemptsLeft - 1;
    } else {
      // نفذت المحاولات، تغيير الدور
      const nextPlayer = playerKey === 'player1' ? 'player2' : 'player1';
      updateGameState(gameState.roomCode, { currentTurn: nextPlayer });
      document.getElementById('attempts-left').textContent = '3'; // إعادة تعيين المحاولات
    }
  }
};

// استبدال وظائف التحقق الأخرى
checkBellAnswer = function(answer, playerKey) {
  console.log('التحقق من إجابة جولة الجرس:', answer);
  const questionIndex = gameState.currentQuestion - 1;
  const question = gameState.questions.bell[questionIndex];
  
  if (!question) return;
  
  // استخدام التحقق المرن من الإجابة
  const alternatives = generateAlternativeAnswers(question.answer);
  const isCorrect = alternatives.some(alt => compareAnswers(answer, alt));
  
  if (isCorrect) {
    console.log('إجابة الجرس صحيحة!');
    showToast('إجابة صحيحة! 🔔', 'success');
    
    // تحديث النتيجة للاعب
    const currentScore = gameState.players[playerKey].score || 0;
    updatePlayerScore(gameState.roomCode, playerKey, currentScore + 1);
    
    // إظهار مؤثرات الاحتفال
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    // الانتقال إلى السؤال التالي
    moveToNextQuestion();
  } else {
    console.log('إجابة الجرس خاطئة، نقل الدور للاعب الآخر');
    showToast('إجابة خاطئة', 'error');
    
    // الإجابة خاطئة، نقل الدور إلى اللاعب الآخر
    const nextPlayer = playerKey === 'player1' ? 'player2' : 'player1';
    updateGameState(gameState.roomCode, { currentTurn: nextPlayer });
  }
};

checkCareerAnswer = function(answer, playerKey) {
  console.log('التحقق من إجابة جولة مسيرة لاعب:', answer);
  const questionIndex = gameState.currentQuestion - 1;
  const question = gameState.questions.career[questionIndex];
  
  if (!question) return;
  
  // استخدام التحقق المرن من الإجابة
  const alternatives = generateAlternativeAnswers(question.answer);
  const isCorrect = alternatives.some(alt => compareAnswers(answer, alt));
  
  if (isCorrect) {
    console.log('إجابة مسيرة اللاعب صحيحة!');
    showToast('إجابة صحيحة! 🌟', 'success');
    
    // تحديث النتيجة للاعب
    const currentScore = gameState.players[playerKey].score || 0;
    updatePlayerScore(gameState.roomCode, playerKey, currentScore + 1);
    
    // إظهار مؤثرات الاحتفال
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    // الانتقال إلى السؤال التالي
    moveToNextQuestion();
  } else {
    showToast('إجابة خاطئة', 'error');
  }
};
