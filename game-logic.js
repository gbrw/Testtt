// إدارة منطق اللعبة والجولات المختلفة

let gameState = {
  roomCode: null,
  playerId: null,  // 'player1' أو 'player2'
  isCreator: false,
  players: {},
  currentRound: 0,  // 0 = لم تبدأ بعد، 1-4 للجولات
  currentQuestion: 0,
  questions: [],
  timer: null,
  timeLeft: 0,
  gameRef: null,
  currentTurn: null
};

// تهيئة اللعبة
function initGame(roomCode, playerKey, isCreator) {
  console.log('تهيئة اللعبة:', roomCode, playerKey, isCreator);
  gameState.roomCode = roomCode;
  gameState.playerId = playerKey;
  gameState.isCreator = isCreator;
  
  // الاستماع لتغييرات الغرفة
  gameState.gameRef = listenToRoomChanges(roomCode, {
    onRoomUpdate: handleRoomUpdate,
    onRoomDeleted: handleRoomDeleted
  });
  
  // إذا كان منشئ الغرفة، قم بخلط الأسئلة وتحضيرها
  if (isCreator) {
    prepareQuestions();
  }
}

// تحضير الأسئلة للعبة
function prepareQuestions() {
  console.log('تحضير الأسئلة للعبة');
  const questions = {
    knowledge: shuffleArray([...gameQuestions.knowledge]).slice(0, 5),
    auction: shuffleArray([...gameQuestions.auction]).slice(0, 5),
    bell: shuffleArray([...gameQuestions.bell]).slice(0, 5),
    career: shuffleArray([...gameQuestions.career]).slice(0, 5)
  };
  
  // تخزين الأسئلة في Firebase
  database.ref('rooms/' + gameState.roomCode + '/questions').set(questions);
}

// معالجة تحديثات الغرفة
function handleRoomUpdate(roomData) {
  console.log('تم استلام تحديث للغرفة:', roomData);
  // تحديث معلومات اللاعبين
  gameState.players = roomData.players || {};
  
  // تحديث حالة اللعبة
  if (roomData.gameState) {
    gameState.currentRound = roomData.gameState.currentRound || 0;
    gameState.currentQuestion = roomData.gameState.currentQuestion || 0;
    gameState.currentTurn = roomData.gameState.currentTurn || 'player1';
    gameState.timeLeft = roomData.gameState.timeLeft || 0;
  }
  
  // تحديث الأسئلة إذا كانت متاحة
  if (roomData.questions) {
    gameState.questions = roomData.questions;
  }
  
  // تحديث واجهة اللعبة
  updateGameUI();
  
  // التحقق من حالة الغرفة
  if (roomData.status === 'ready' && gameState.isCreator) {
    console.log('الغرفة جاهزة وأنت المنشئ، بدء اللعبة قريباً');
    // إذا كان منشئ الغرفة وحالة الغرفة جاهزة، ابدأ اللعبة
    setTimeout(() => {
      startGame();
    }, 2000);
  } else if (roomData.status === 'in_progress') {
    console.log('اللعبة قيد التقدم، عرض شاشة اللعبة');
    // إخفاء شاشة الانتظار وإظهار شاشة اللعبة
    showScreen('game-screen');
    
    // تنفيذ المنطق المناسب للجولة الحالية
    handleCurrentRound();
  } else if (roomData.status === 'completed') {
    console.log('انتهت اللعبة، عرض شاشة النتائج');
    // إظهار شاشة النتائج النهائية
    showFinalResults();
  }
  
  // معالجة الإجابات إذا كانت موجودة
  if (roomData.currentAnswer && roomData.gameState && roomData.gameState.roundStarted) {
    handlePlayerAnswer(roomData.currentAnswer);
  }
  
  // معالجة المزايدات إذا كانت موجودة
  if (roomData.currentBid && gameState.currentRound === 2) {
    handlePlayerBid(roomData.currentBid);
  }
  
  // معالجة الجرس إذا كان موجودًا
  if (roomData.bell && gameState.currentRound === 3) {
    handleBellRing(roomData.bell);
  }
}

// معالجة حذف الغرفة
function handleRoomDeleted() {
  console.log('تم حذف الغرفة أو انتهت اللعبة');
  alert('انتهت اللعبة أو تم حذف الغرفة.');
  // العودة إلى الشاشة الرئيسية
  showScreen('welcome-screen');
}

// بدء اللعبة
function startGame() {
  console.log('بدء اللعبة');
  // تحديث حالة الغرفة إلى 'قيد التقدم'
  database.ref('rooms/' + gameState.roomCode).update({
    status: 'in_progress',
    gameState: {
      currentRound: 1,
      currentQuestion: 1,
      currentTurn: 'player1',
      timeLeft: 0,
      roundStarted: true
    }
  });
}

// عرض الشاشة المحددة وإخفاء الشاشات الأخرى
function showScreen(screenId) {
  console.log('عرض الشاشة:', screenId);
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// تحديث واجهة اللعبة
function updateGameUI() {
  // تحديث أسماء اللاعبين ونقاطهم
  if (gameState.players.player1) {
    document.getElementById('player1-name').textContent = gameState.players.player1.name;
    document.getElementById('player1-score').textContent = gameState.players.player1.score || 0;
  }
  
  if (gameState.players.player2) {
    document.getElementById('player2-name').textContent = gameState.players.player2.name;
    document.getElementById('player2-score').textContent = gameState.players.player2.score || 0;
  }
  
  // تحديث معلومات الجولة والسؤال
  document.getElementById('current-round').textContent = gameState.currentRound;
  document.getElementById('current-question').textContent = gameState.currentQuestion;
  
  // تحديث دور اللاعب الحالي
  if (gameState.currentTurn) {
    const currentPlayerName = gameState.players[gameState.currentTurn]?.name || '';
    document.getElementById('current-player-turn').textContent = currentPlayerName;
  }
  
  // تحديث المؤقت
  updateTimer();
}

// تحديث عرض المؤقت
function updateTimer() {
  if (gameState.timeLeft > 0) {
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    document.getElementById('timer').textContent = 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    document.getElementById('timer').textContent = '00:00';
  }
}

// معالجة الجولة الحالية
function handleCurrentRound() {
  console.log('معالجة الجولة الحالية:', gameState.currentRound);
  // إخفاء جميع حاويات الجولات
  document.querySelectorAll('.round-container').forEach(container => {
    container.style.display = 'none';
  });
  
  // عرض حاوية الجولة الحالية
  switch (gameState.currentRound) {
    case 1:
      document.getElementById('round-knowledge').style.display = 'block';
      setupKnowledgeRound();
      break;
    case 2:
      document.getElementById('round-auction').style.display = 'block';
      setupAuctionRound();
      break;
    case 3:
      document.getElementById('round-bell').style.display = 'block';
      setupBellRound();
      break;
    case 4:
      document.getElementById('round-career').style.display = 'block';
      setupCareerRound();
      break;
  }
}

// إعداد جولة "ماذا تعرف؟"
function setupKnowledgeRound() {
  console.log('إعداد جولة المعرفة');
  if (gameState.questions.knowledge && gameState.questions.knowledge.length > 0) {
    const questionIndex = gameState.currentQuestion - 1;
    const question = gameState.questions.knowledge[questionIndex];
    
    if (question) {
      document.getElementById('knowledge-question').textContent = question.question;
      
      // تحديث عناصر التحكم بناءً على الدور الحالي
      const isMyTurn = gameState.currentTurn === gameState.playerId;
      document.getElementById('knowledge-answer').disabled = !isMyTurn;
      document.getElementById('submit-knowledge').disabled = !isMyTurn;
      document.getElementById('pass-knowledge').disabled = !isMyTurn;
      
      // تحديث عداد المحاولات
      const attemptsLeft = 3; // يمكن جلب هذه القيمة من Firebase
      document.getElementById('attempts-left').textContent = attemptsLeft;
    }
  }
}

// إعداد جولة "المزاد"
function setupAuctionRound() {
  console.log('إعداد جولة المزاد');
  if (gameState.questions.auction && gameState.questions.auction.length > 0) {
    const questionIndex = gameState.currentQuestion - 1;
    const question = gameState.questions.auction[questionIndex];
    
    if (question) {
      document.getElementById('auction-question').textContent = question.question;
      
      // عرض قسم المزايدة أو قسم الإجابات بناءً على حالة اللعبة
      const biddingSection = document.getElementById('bidding-section');
      const answersSection = document.getElementById('answers-section');
      
      // هنا يجب التحقق من وجود مزايدة نشطة أو إذا كان الوقت لإدخال الإجابات
      // هذا سيعتمد على حالة اللعبة في Firebase
      
      // هذا مجرد مثال:
      biddingSection.style.display = 'block';
      answersSection.style.display = 'none';
    }
  }
}

// إعداد جولة "الجرس"
function setupBellRound() {
  console.log('إعداد جولة الجرس');
  if (gameState.questions.bell && gameState.questions.bell.length > 0) {
    const questionIndex = gameState.currentQuestion - 1;
    const question = gameState.questions.bell[questionIndex];
    
    if (question) {
      document.getElementById('bell-question').textContent = question.question;
      
      // إخفاء قسم الإجابة في البداية
      document.getElementById('bell-answer-section').style.display = 'none';
    }
  }
}

// إعداد جولة "مسيرة لاعب"
function setupCareerRound() {
  console.log('إعداد جولة مسيرة لاعب');
  if (gameState.questions.career && gameState.questions.career.length > 0) {
    const questionIndex = gameState.currentQuestion - 1;
    const question = gameState.questions.career[questionIndex];
    
    if (question) {
      document.getElementById('career-clubs').textContent = question.question;
    }
  }
}

// معالجة إجابة اللاعب
function handlePlayerAnswer(answerData) {
  console.log('معالجة إجابة اللاعب:', answerData);
  // سيتم تنفيذ هذا بناءً على نوع الجولة والمنطق الخاص بها
  const { playerKey, answer } = answerData;
  const isCurrentPlayer = playerKey === gameState.playerId;
  
  // التنفيذ سيختلف حسب الجولة الحالية
  switch (gameState.currentRound) {
    case 1: // ماذا تعرف؟
      checkKnowledgeAnswer(answer, playerKey);
      break;
    case 2: // المزاد
      // يتم التعامل مع إجابات المزاد بشكل مختلف
      break;
    case 3: // الجرس
      checkBellAnswer(answer, playerKey);
      break;
    case 4: // مسيرة لاعب
      checkCareerAnswer(answer, playerKey);
      break;
  }
}

// التحقق من إجابة جولة "ماذا تعرف؟"
function checkKnowledgeAnswer(answer, playerKey) {
  console.log('التحقق من إجابة جولة المعرفة:', answer);
  const questionIndex = gameState.currentQuestion - 1;
  const question = gameState.questions.knowledge[questionIndex];
  
  if (!question) return;
  
  // تحويل الإجابة إلى نص صغير للمقارنة
  const normalizedAnswer = answer.toLowerCase().trim();
  
  // البحث عن تطابق في قائمة الإجابات الصحيحة
  const isCorrect = question.answers.some(
    validAnswer => normalizedAnswer === validAnswer.toLowerCase().trim()
  );
  
  if (isCorrect) {
    console.log('الإجابة صحيحة!');
    // تحديث النتيجة للاعب
    const currentScore = gameState.players[playerKey].score || 0;
    updatePlayerScore(gameState.roomCode, playerKey, currentScore + 1);
    
    // الانتقال إلى السؤال التالي
    moveToNextQuestion();
  } else if (answer === 'PASS') {
    console.log('اللاعب قام بتمرير الدور');
    // تغيير الدور إلى اللاعب الآخر
    const nextPlayer = playerKey === 'player1' ? 'player2' : 'player1';
    updateGameState(gameState.roomCode, { currentTurn: nextPlayer });
  } else {
    console.log('الإجابة خاطئة');
    // الإجابة خاطئة، تقليل عدد المحاولات
    // هذا يتطلب تتبع عدد المحاولات في Firebase
    // للتبسيط، نفترض أنه بعد 3 محاولات خاطئة يتم تمرير الدور
    
    // احصل على عدد المحاولات المتبقية
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
}

// التحقق من إجابة جولة "الجرس"
function checkBellAnswer(answer, playerKey) {
  console.log('التحقق من إجابة جولة الجرس:', answer);
  const questionIndex = gameState.currentQuestion - 1;
  const question = gameState.questions.bell[questionIndex];
  
  if (!question) return;
  
  // تحويل الإجابة للمقارنة
  const normalizedAnswer = answer.toLowerCase().trim();
  const correctAnswer = question.answer.toLowerCase().trim();
  
  // التحقق من الإجابة
  const isCorrect = normalizedAnswer === correctAnswer;
  
  if (isCorrect) {
    console.log('إجابة الجرس صحيحة!');
    // تحديث النتيجة للاعب
    const currentScore = gameState.players[playerKey].score || 0;
    updatePlayerScore(gameState.roomCode, playerKey, currentScore + 1);
    
    // الانتقال إلى السؤال التالي
    moveToNextQuestion();
  } else {
    console.log('إجابة الجرس خاطئة، نقل الدور للاعب الآخر');
    // الإجابة خاطئة، نقل الدور إلى اللاعب الآخر
    const nextPlayer = playerKey === 'player1' ? 'player2' : 'player1';
    updateGameState(gameState.roomCode, { currentTurn: nextPlayer });
  }
}

// التحقق من إجابة جولة "مسيرة لاعب"
function checkCareerAnswer(answer, playerKey) {
  console.log('التحقق من إجابة جولة مسيرة لاعب:', answer);
  const questionIndex = gameState.currentQuestion - 1;
  const question = gameState.questions.career[questionIndex];
  
  if (!question) return;
  
  // تحويل الإجابة للمقارنة
  const normalizedAnswer = answer.toLowerCase().trim();
  const correctAnswer = question.answer.toLowerCase().trim();
  
  // التحقق من الإجابة
  const isCorrect = normalizedAnswer === correctAnswer;
  
  if (isCorrect) {
    console.log('إجابة مسيرة اللاعب صحيحة!');
    // تحديث النتيجة للاعب
    const currentScore = gameState.players[playerKey].score || 0;
    updatePlayerScore(gameState.roomCode, playerKey, currentScore + 1);
    
    // الانتقال إلى السؤال التالي
    moveToNextQuestion();
  }
  // في هذه الجولة، اللاعبان يمكنهما محاولة الإجابة في أي وقت
  // ولا يوجد تبديل للأدوار بعد الإجابة الخاطئة
}

// معالجة مزايدة اللاعب
function handlePlayerBid(bidData) {
  console.log('معالجة مزايدة اللاعب:', bidData);
  const { playerKey, value } = bidData;
  
  // إذا كانت القيمة 0، فهذا يعني أن اللاعب قد مرر دوره
  if (value === 0) {
    console.log('اللاعب تنازل عن المزايدة');
    // اللاعب الآخر فاز بالمزايدة
    const winningPlayer = playerKey === 'player1' ? 'player2' : 'player1';
    
    // تحديث حالة اللعبة لتظهر أن اللاعب الفائز يجب أن يقدم الإجابات
    updateGameState(gameState.roomCode, { 
      biddingWinner: winningPlayer,
      bidValue: gameState.lastBidValue || 1
    });
    
    // إظهار قسم الإجابات للاعب الفائز
    if (gameState.playerId === winningPlayer) {
      setupAnswersSection(gameState.lastBidValue || 1);
    }
  } else {
    console.log('تم تقديم مزايدة جديدة:', value);
    // تخزين آخر قيمة مزايدة
    gameState.lastBidValue = value;
    
    // تبديل الدور إلى اللاعب الآخر
    const nextPlayer = playerKey === 'player1' ? 'player2' : 'player1';
    updateGameState(gameState.roomCode, { currentTurn: nextPlayer });
  }
}

// إعداد قسم الإجابات بعد المزايدة
function setupAnswersSection(requiredAnswers) {
  console.log('إعداد قسم إجابات المزاد، عدد الإجابات المطلوبة:', requiredAnswers);
  const biddingSection = document.getElementById('bidding-section');
  const answersSection = document.getElementById('answers-section');
  const answersContainer = document.getElementById('answers-container');
  
  // تغيير العرض
  biddingSection.style.display = 'none';
  answersSection.style.display = 'block';
  
  // تحديث عدد الإجابات المطلوبة
  document.getElementById('required-answers').textContent = requiredAnswers;
  
  // إنشاء حقول الإدخال للإجابات
  answersContainer.innerHTML = '';
  for (let i = 0; i < requiredAnswers; i++) {
    const inputDiv = document.createElement('div');
    inputDiv.className = 'answer-input';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `الإجابة ${i + 1}`;
    input.id = `auction-answer-${i}`;
    
    inputDiv.appendChild(input);
    answersContainer.appendChild(inputDiv);
  }
  
  // بدء المؤقت (30 ث
// إضافة هذه الأسطر في نهاية ملف game-logic.js
window.initGame = initGame;
window.showScreen = showScreen;
window.gameState = gameState;
window.moveToNextQuestion = moveToNextQuestion;
window.endGame = endGame;

// الانتقال إلى السؤال التالي
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
  let nextTurn = 'player1';
  
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
  });
}

// إنهاء اللعبة
function endGame() {
  console.log('إنهاء اللعبة');
  // تحديث حالة الغرفة إلى 'مكتملة'
  database.ref('rooms/' + gameState.roomCode).update({
    status: 'completed'
  });
  
  // عرض شاشة النتائج
  showFinalResults();
}
