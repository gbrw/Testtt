// الملف الرئيسي لتطبيق اللعبة
document.addEventListener('DOMContentLoaded', () => {
  // مراجع عناصر DOM
  const welcomeScreen = document.getElementById('welcome-screen');
  const createRoomBtn = document.getElementById('create-room-btn');
  const joinRoomBtn = document.getElementById('join-room-btn');
  const joinRoomForm = document.getElementById('join-room-form');
  const confirmJoinBtn = document.getElementById('confirm-join-btn');
  const playerNameInput = document.getElementById('player-name');
  const roomCodeInput = document.getElementById('room-code');
  const createdRoomInfo = document.getElementById('created-room-info');
  const roomCodeDisplay = document.getElementById('room-code-display');
  const waitingRoomCode = document.getElementById('waiting-room-code');
  const playAgainBtn = document.getElementById('play-again-btn');
  
  // مراجع عناصر DOM لجولة "ماذا تعرف؟"
  const knowledgeAnswer = document.getElementById('knowledge-answer');
  const submitKnowledge = document.getElementById('submit-knowledge');
  const passKnowledge = document.getElementById('pass-knowledge');
  
  // مراجع عناصر DOM لجولة "المزاد"
  const decreaseBid = document.getElementById('decrease-bid');
  const increaseBid = document.getElementById('increase-bid');
  const currentBid = document.getElementById('current-bid');
  const submitBid = document.getElementById('submit-bid');
  const passBid = document.getElementById('pass-bid');
  const submitAnswers = document.getElementById('submit-answers');
  
  // مراجع عناصر DOM لجولة "الجرس"
  const bellButton = document.getElementById('bell-button');
  const bellAnswer = document.getElementById('bell-answer');
  const submitBellAnswer = document.getElementById('submit-bell-answer');
  
  // مراجع عناصر DOM لجولة "مسيرة لاعب"
  const careerAnswer = document.getElementById('career-answer');
  const submitCareer = document.getElementById('submit-career');
  
  // متغيرات الحالة
  let currentBidValue = 1;
  
  // حدث إنشاء غرفة
  createRoomBtn.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
      // إنشاء غرفة جديدة
      createRoom(playerName).then(roomCode => {
        // عرض معلومات الغرفة
        roomCodeDisplay.textContent = roomCode;
        waitingRoomCode.textContent = roomCode;
        createdRoomInfo.classList.remove('hidden');
        joinRoomForm.classList.add('hidden');
        
        // تهيئة اللعبة
        initGame(roomCode, 'player1', true);
        
        // بعد ثانيتين، إظهار شاشة الانتظار
        setTimeout(() => {
          showScreen('waiting-screen');
        }, 2000);
      }).catch(error => {
        alert('حدث خطأ أثناء إنشاء الغرفة: ' + error.message);
      });
    } else {
      alert('يرجى إدخال اسم اللاعب.');
    }
  });
  
  // حدث إظهار نموذج الانضمام
  joinRoomBtn.addEventListener('click', () => {
    createdRoomInfo.classList.add('hidden');
    joinRoomForm.classList.remove('hidden');
  });
  
  // حدث تأكيد الانضمام
  confirmJoinBtn.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    const roomCode = roomCodeInput.value.trim();
    
    if (playerName && roomCode) {
      // الانضمام إلى غرفة موجودة
      joinRoom(roomCode, playerName).then(() => {
        // تهيئة اللعبة
        initGame(roomCode, 'player2', false);
        
        // إظهار شاشة الانتظار
        waitingRoomCode.textContent = roomCode;
        showScreen('game-screen');
      }).catch(error => {
        alert('حدث خطأ أثناء الانضمام إلى الغرفة: ' + error.message);
      });
    } else {
      alert('يرجى إدخال اسم اللاعب ورمز الغرفة.');
    }
  });
  
  // حدث اللعب مرة أخرى
  playAgainBtn.addEventListener('click', () => {
    // العودة إلى الشاشة الرئيسية
    showScreen('welcome-screen');
    
    // إعادة تعيين النموذج
    playerNameInput.value = '';
    roomCodeInput.value = '';
    createdRoomInfo.classList.add('hidden');
    joinRoomForm.classList.add('hidden');
  });
  
  // أحداث جولة "ماذا تعرف؟"
  submitKnowledge.addEventListener('click', () => {
    const answer = knowledgeAnswer.value.trim();
    if (answer) {
      // إرسال الإجابة إلى Firebase
      submitAnswer(gameState.roomCode, gameState.playerId, answer).then(() => {
        knowledgeAnswer.value = '';
      }).catch(error => {
        console.error('Error submitting answer:', error);
      });
    }
  });
  
  passKnowledge.addEventListener('click', () => {
    // إرسال "تمرير" إلى Firebase
    submitAnswer(gameState.roomCode, gameState.playerId, 'PASS').catch(error => {
      console.error('Error passing:', error);
    });
  });
  
  // أحداث جولة "المزاد"
  decreaseBid.addEventListener('click', () => {
    if (currentBidValue > 1) {
      currentBidValue--;
      currentBid.textContent = currentBidValue;
    }
  });
  
  increaseBid.addEventListener('click', () => {
    currentBidValue++;
    currentBid.textContent = currentBidValue;
  });
  
  submitBid.addEventListener('click', () => {
    // إرسال المزايدة إلى Firebase
    submitBid(gameState.roomCode, gameState.playerId, currentBidValue).catch(error => {
      console.error('Error submitting bid:', error);
    });
  });
  
  passBid.addEventListener('click', () => {
    // تمرير المزايدة
    submitBid(gameState.roomCode, gameState.playerId, 0).catch(error => {
      console.error('Error passing bid:', error);
    });
  });
  
  // أحداث جولة "الجرس"
  bellButton.addEventListener('click', () => {
    // إرسال الجرس إلى Firebase
    ringBell(gameState.roomCode, gameState.playerId).then(() => {
      // إظهار حقل الإجابة
      document.getElementById('bell-answer-section').style.display = 'flex';
    }).catch(error => {
      console.error('Error ringing bell:', error);
    });
  });
  
  submitBellAnswer.addEventListener('click', () => {
    const answer = bellAnswer.value.trim();
    if (answer) {
      // إرسال الإجابة إلى Firebase
      submitAnswer(gameState.roomCode, gameState.playerId, answer).then(() => {
        bellAnswer.value = '';
      }).catch(error