// ملف الوظائف المساعدة
console.log('تحميل الوظائف المساعدة...');

// خلط مصفوفة (لخلط الأسئلة)
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// إنشاء رمز غرفة عشوائي
function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// عرض الشاشة المحددة وإخفاء الشاشات الأخرى
function showScreen(screenId) {
  console.log('عرض الشاشة:', screenId);
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// تحديث عرض المؤقت
function updateTimer() {
  const timerElement = document.getElementById('timer');
  if (!timerElement) return;
  
  if (gameState.timeLeft > 0) {
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    timerElement.textContent = '00:00';
  }
}

// بدء المؤقت
function startTimer(seconds) {
  // تحويل القيمة إلى رقم وضمان أنها على الأقل 1 ثانية
  const timerSeconds = Math.max(1, parseInt(seconds) || 30);
  
  console.log(`بدء المؤقت: ${timerSeconds} ثانية`);
  
  // تحديث حالة اللعبة
  gameState.timeLeft = timerSeconds;
  
  // إيقاف أي مؤقت سابق
  if (gameState.timer) {
    clearInterval(gameState.timer);
    gameState.timer = null;
  }
  
  // تحديث العرض أولاً
  updateTimer();
  
  // بدء مؤقت جديد
  gameState.timer = setInterval(() => {
    // تحديث الوقت المتبقي
    gameState.timeLeft--;
    
    // تحديث عرض المؤقت
    updateTimer();
    
    // التحقق من انتهاء الوقت
    if (gameState.timeLeft <= 0) {
      console.log('انتهى الوقت!');
      clearInterval(gameState.timer);
      gameState.timer = null;
      
      // استدعاء دالة معالجة انتهاء الوقت
      handleTimeUp();
    }
  }, 1000);
  
  console.log('تم بدء المؤقت بنجاح');
}