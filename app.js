// الملف الرئيسي لتطبيق اللعبة
document.addEventListener('DOMContentLoaded', () => {
  console.log('تم تحميل الصفحة');
  
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
  
  // اختبار الاتصال بـ Firebase
  console.log('جاري التحقق من اتصال Firebase...');
  if (typeof database === 'undefined') {
    console.error('❌ خطأ: كائن قاعدة البيانات غير معرف. تأكد من تحميل ملف firebase-config.js بشكل صحيح.');
    alert('هناك مشكلة في الاتصال بـ Firebase. يرجى التحقق من وحدة التحكم للتفاصيل.');
  } else {
    console.log('✅ كائن قاعدة البيانات موجود. جاري اختبار الاتصال...');
    
    const testRef = database.ref("test_connection");
    testRef.set({
      timestamp: new Date().toString()
    })
    .then(() => {
      console.log('✅ تم الاتصال بـ Firebase بنجاح!');
    })
    .catch(error => {
      console.error('❌ فشل الاتصال بـ Firebase:', error);
      alert('فشل الاتصال بـ Firebase. يرجى التحقق من اتصالك بالإنترنت وإعدادات Firebase.');
    });
  }
  
  console.log('إضافة مستمعي الأحداث للأزرار');
  
  // حدث إنشاء غرفة
  createRoomBtn.addEventListener('click', () => {
    console.log('تم النقر على زر إنشاء غرفة');
    const playerName = playerNameInput.value.trim();
    if (playerName) {
      console.log('جاري إنشاء غرفة للاعب:', playerName);
      // إنشاء غرفة جديدة
      createRoom(playerName).then(roomCode => {
        console.log('تم إنشاء الغرفة بنجاح، الرمز:', roomCode);
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
        console.error('خطأ في إنشاء الغرفة:', error);
        alert('حدث خطأ أثناء إنشاء الغرفة: ' + error.message);
      });
    } else {
      alert('يرجى إدخال اسم اللاعب.');
    }
  });
  
  // حدث إظهار نموذج الانضمام
  joinRoomBtn.addEventListener('click', () => {
    console.log('تم النقر على زر الانضمام إلى غرفة');
    createdRoomInfo.classList.add('hidden');
    joinRoomForm.classList.remove('hidden');
  });
  
  // حدث تأكيد الانضمام
  confirmJoinBtn.addEventListener('click', () => {
    console.log('تم النقر على زر تأكيد الانضمام');
    const playerName = playerNameInput.value.trim();
    const roomCode = roomCodeInput.value.trim();
    
    if (playerName && roomCode) {
      console.log('جاري الانضمام إلى الغرفة:', roomCode, 'باسم:', playerName);
      // الانضمام إلى غرفة موجودة
      joinRoom(roomCode, playerName).then(() => {
        console.log('تم الانضمام إلى الغرفة بنجاح');
        // تهيئة اللعبة
        initGame(roomCode, 'player2', false);
        
        // إظهار شاشة الانتظار
        waitingRoomCode.textContent = roomCode;
        showScreen('game-screen');
      }).catch(error => {
        console.error('خطأ في الانضمام إلى الغرفة:', error);
        alert('حدث خطأ أثناء الانضمام إلى الغرفة: ' + error.message);
      });
    } else {
      alert('يرجى إدخال اسم اللاعب ورمز الغرفة.');
    }
  });
  
  // حدث اللعب مرة أخرى
  playAgainBtn.addEventListener('click', () => {
    console.log('تم النقر على زر اللعب مرة أخرى');
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
    console.log('تم النقر على زر إرسال الإجابة - جولة المعرفة');
    const answer = knowledgeAnswer.value.trim();
    if (answer) {
      console.log('إرسال الإجابة:', answer);
      // إرسال الإجابة إلى Firebase
      submitAnswer(gameState.roomCode, gameState.playerId, answer).then(() => {
        knowledgeAnswer.value = '';
      }).catch(error => {
        console.error('خطأ في إرسال الإجابة:', error);
      });
    }
  });
  
  passKnowledge.addEventListener('click', () => {
    console.log('تم النقر على زر تمرير - جولة المعرفة');
    // إرسال "تمرير" إلى Firebase
    submitAnswer(gameState.roomCode, gameState.playerId, 'PASS').catch(error => {
      console.error('خطأ في التمرير:', error);
    });
  });
  
  // أحداث جولة "المزاد"
  decreaseBid.addEventListener('click', () => {
    console.log('تم النقر على زر تقليل المزايدة');
    if (currentBidValue > 1) {
      currentBidValue--;
      currentBid.textContent = currentBidValue;
    }
  });
  
  increaseBid.addEventListener('click', () => {
    console.log('تم النقر على زر زيادة المزايدة');
    currentBidValue++;
    currentBid.textContent = currentBidValue;
  });
  
  submitBid.addEventListener('click', () => {
    console.log('تم النقر على زر تأكيد المزايدة:', currentBidValue);
    // إرسال المزايدة إلى Firebase
    submitBid(gameState.roomCode, gameState.playerId, currentBidValue).catch(error => {
      console.error('خطأ في إرسال المزايدة:', error);
    });
  });
  
  passBid.addEventListener('click', () => {
    console.log('تم النقر على زر تمرير المزايدة');
    // تمرير المزايدة
    submitBid(gameState.roomCode, gameState.playerId, 0).catch(error => {
      console.error('خطأ في تمرير المزايدة:', error);
    });
  });
  
  // إضافة حدث تقديم الإجابات في جولة المزاد
  submitAnswers.addEventListener('click', () => {
    console.log('تم النقر على زر تقديم إجابات المزاد');
    // جمع الإجابات من حقول الإدخال
    const answers = [];
    const requiredAnswers = parseInt(document.getElementById('required-answers').textContent);
    
    for (let i = 0; i < requiredAnswers; i++) {
      const answerInput = document.getElementById(`auction-answer-${i}`);
      if (answerInput && answerInput.value.trim()) {
        answers.push(answerInput.value.trim());
      }
    }
    
    console.log('الإجابات المقدمة:', answers);
    
    // التحقق من عدد الإجابات
    if (answers.length === requiredAnswers) {
      // إرسال الإجابات إلى Firebase
      database.ref('rooms/' + gameState.roomCode + '/auctionAnswers').set({
        playerKey: gameState.playerId,
        answers: answers,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).catch(error => {
        console.error('خطأ في إرسال إجابات المزاد:', error);
      });
    } else {
      alert(`يجب تقديم ${requiredAnswers} إجابات.`);
    }
  });
  
  // أحداث جولة "الجرس"
  bellButton.addEventListener('click', () => {
    console.log('تم النقر على زر الجرس');
    // إرسال الجرس إلى Firebase
    ringBell(gameState.roomCode, gameState.playerId).then(() => {
      // إظهار حقل الإجابة
      document.getElementById('bell-answer-section').style.display = 'flex';
    }).catch(error => {
      console.error('خطأ في إرسال الجرس:', error);
    });
  });
  
  submitBellAnswer.addEventListener('click', () => {
    console.log('تم النقر على زر إرسال إجابة الجرس');
    const answer = bellAnswer.value.trim();
    if (answer) {
      console.log('إرسال إجابة الجرس:', answer);
      // إرسال الإجابة إلى Firebase
      submitAnswer(gameState.roomCode, gameState.playerId, answer).then(() => {
        bellAnswer.value = '';
      }).catch(error => {
        console.error('خطأ في إرسال إجابة الجرس:', error);
      });
    }
  });
  
  // أحداث جولة "مسيرة لاعب"
  submitCareer.addEventListener('click', () => {
    console.log('تم النقر على زر إرسال إجابة مسيرة لاعب');
    const answer = careerAnswer.value.trim();
    if (answer) {
      console.log('إرسال إجابة مسيرة لاعب:', answer);
      // إرسال الإجابة إلى Firebase
      submitAnswer(gameState.roomCode, gameState.playerId, answer).then(() => {
        careerAnswer.value = '';
      }).catch(error => {
        console.error('خطأ في إرسال إجابة مسيرة لاعب:', error);
      });
    }
  });
  
  // إضافة استجابة للمدخلات عند الضغط على Enter
  knowledgeAnswer.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !submitKnowledge.disabled) {
      submitKnowledge.click();
    }
  });
  
  bellAnswer.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitBellAnswer.click();
    }
  });
  
  careerAnswer.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitCareer.click();
    }
  });
  
  console.log('تم إعداد جميع مستمعي الأحداث بنجاح');
});

// الانتقال إلى السؤال التالي (يجب إضافته لملف game-logic.js)
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