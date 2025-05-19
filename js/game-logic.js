// تحديث دالة moveToNextQuestion لمعالجة خطأ محتمل
function moveToNextQuestion() {
  console.log('الانتقال إلى السؤال التالي');
  let nextQuestion = gameState.currentQuestion + 1;
  let nextRound = gameState.currentRound;
  
  // التحقق مما إذا وصلنا لنهاية أسئلة الجولة الحالية
  if (nextQuestion > 5) {
    nextQuestion = 1;
    nextRound += 1;
    
    // التحقق من انتهاء اللعبة
    if (nextRound > 4) {
      // انتهاء اللعبة
      endGame();
      return;
    }
  }
  
  // تحديد اللاعب الذي سيبدأ في السؤال التالي (تناوب)
  let nextTurn = gameState.currentTurn;
  
  // إذا كان سؤال جديد في نفس الجولة، استمر مع نفس اللاعب
  if (nextQuestion === 1) {
    // تناوب البداية في كل جولة
    nextTurn = (nextRound % 2 === 1) ? 'player1' : 'player2';
  }
  
  // تحديث حالة اللعبة
  updateGameState(gameState.roomCode, {
    currentQuestion: nextQuestion,
    currentRound: nextRound,
    currentTurn: nextTurn,
    timeLeft: 0,
    roundStarted: true
  })
  .then(() => {
    console.log('تم تحديث حالة اللعبة بنجاح للسؤال التالي');
  })
  .catch(error => {
    console.error('خطأ في تحديث حالة اللعبة:', error);
    showToast('حدث خطأ أثناء الانتقال للسؤال التالي', 'error');
  });
}
