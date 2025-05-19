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
    // إذا كان منشئ الغرفة وحالة الغرفة جاهزة، ابدأ اللعبة
    setTimeout(() => {
      startGame();
    }, 2000);
  } else if (roomData.status === 'in_progress') {
    // إخفاء شاشة الانتظار وإظهار شاشة اللعبة
    showScreen('game-screen');
    
    // تنفيذ المنطق المناسب للجولة الحالية
    handleCurrentRound();
  } else if (roomData.status === 'completed') {
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
  alert('انتهت اللعبة أو تم حذف الغرفة.');
  // العودة إلى الشاشة الرئيسية
  showScreen('welcome-screen');
}

// بدء اللعبة
function startGame() {
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
  // سيتم تنفيذ هذا بناءً على نوع الجولة والمنطق الخاص بها
  // للتبسيط، هذه وظيفة عامة، ولكن في التطبيق الفعلي
  // قد ترغب في فصلها إلى وظائف مختلفة لكل نوع من الجولات
}

// معالجة مزايدة اللاعب
function handlePlayerBid(bidData) {
  // سيتم تنفيذ هذا للجولة 2 (المزاد)
}

// معالجة ضغط زر الجرس
function handleBellRing(bellData) {
  // سيتم تنفيذ هذا للجولة 3 (الجرس)
}

// عرض النتائج النهائية
function showFinalResults() {
  showScreen('results-screen');
  
  // تحديث معلومات النتائج
  if (gameState.players.player1) {
    document.getElementById('result-player1-name').textContent = gameState.players.player1.name;
    document.getElementById('result-player1-score').textContent = gameState.players.player1.score || 0;
  }
  
  if (gameState.players.player2) {
    document.getElementById('result-player2-name').textContent = gameState.players.player2.name;
    document.getElementById('result-player2-score').textContent = gameState.players.player2.score || 0;
  }
  
  // تحديد الفائز
  let winnerName = 'تعادل';
  let player1Score = gameState.players.player1?.score || 0;
  let player2Score = gameState.players.player2?.score || 0;
  
  if (player1Score > player2Score) {
    winnerName = gameState.players.player1.name;
  } else if (player2Score > player1Score) {
    winnerName = gameState.players.player2.name;
  }
  
  document.getElementById('winner-name').textContent = winnerName;
}

// خلط مصفوفة (لخلط الأسئلة)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}