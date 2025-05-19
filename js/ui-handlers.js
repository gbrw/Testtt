// ملف معالجات واجهة المستخدم والأحداث
console.log('تحميل معالجات واجهة المستخدم...');

// تنفيذ معالجات الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  console.log('تم تحميل الصفحة، إعداد معالجات الأحداث');
  
  // مراجع عناصر DOM - شاشة البداية
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
  
  // مراجع عناصر DOM - جولة "ماذا تعرف؟"
  const knowledgeAnswer = document.getElementById('knowledge-answer');
  const submitKnowledge = document.getElementById('submit-knowledge');
  const passKnowledge = document.getElementById('pass-knowledge');
  
  // مراجع عناصر DOM - جولة "المزاد"
  const decreaseBid = document.getElementById('decrease-bid');
  const increaseBid = document.getElementById('increase-bid');
  const currentBid = document.getElementById('current-bid');
  const submitBid = document.getElementById('submit-bid');
  const passBid = document.getElementById('pass-bid');
  const submitAnswers = document.getElementById('submit-answers');
  
  // مراجع عناصر DOM - جولة "الجرس"
  const bellButton = document.getElementById('bell-button');
  const bellAnswer = document.getElementById('bell-answer');
  const submitBellAnswer = document.getElementById('submit-bell-answer');
  
  // مراجع عناصر DOM - جولة "مسيرة لاعب"
  const careerAnswer = document.getElementById('career-answer');
  const submitCareer = document.getElementById('submit-career');
  
  // متغيرات الحالة
  let currentBidValue = 1;
  
  console.log('إضافة مستمعي الأحداث للأزرار');
  
  // ==== معالجات أحداث شاشة البداية ====
  
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
          // عرض رسالة نجاح
          showToast('تم إنشاء الغرفة بنجاح! انتظر انضمام اللاعب الآخر', 'success');
        }, 2000);
      }).catch(error => {
        console.error('خطأ في إنشاء الغرفة:', error);
        showToast('حدث خطأ أثناء إنشاء الغرفة: ' + error.message, 'error');
      });
    } else {
      showToast('يرجى إدخال اسم اللاعب', 'error');
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
      joinRoom(roomCode, playerName).then(() => {
        console.log('تم الانضمام إلى الغرفة بنجاح');
        // تهيئة اللعبة
        initGame(roomCode, 'player2', false);
        
        // إظهار شاشة اللعبة
        waitingRoomCode.textContent = roomCode;
        showScreen('game-screen');
        showToast('تم الانضمام إلى الغرفة بنجاح!', 'success');
      }).catch(error => {
        console.error('خطأ في الانضمام إلى الغرفة:', error);
        showToast('حدث خطأ أثناء الانضمام إلى الغرفة: ' + error.message, 'error');
      });
    } else {
      showToast('يرجى إدخال اسم اللاعب ورمز الغرفة', 'error');
    }
  });
  
  // ==== معالجات أحداث جولة "ماذا تعرف؟" ====
  
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
        showToast('حدث خطأ أثناء إرسال الإجابة', 'error');
      });
    } else {
      showToast('يرجى إدخال إجابة', 'error');
    }
  });
  
  passKnowledge.addEventListener('click', () => {
    console.log('تم النقر على زر تمرير - جولة المعرفة');
    // إرسال "تمرير" إلى Firebase
    submitAnswer(gameState.roomCode, gameState.playerId, 'PASS').catch(error => {
      console.error('خطأ في التمرير:', error);
      showToast('حدث خطأ أثناء تمرير الدور', 'error');
    });
  });
  
  // إضافة استجابة للمدخلات عند الضغط على Enter في حقل الإجابة
  knowledgeAnswer.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !submitKnowledge.disabled) {
      submitKnowledge.click();
    }
  });
  
  // ==== معالجات أحداث جولة "المزاد" ====
  
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
      showToast('حدث خطأ أثناء إرسال المزايدة', 'error');
    });
  });
  
  passBid.addEventListener('click', () => {
    console.log('تم النقر على زر تمرير المزايدة');
    // تمرير المزايدة
    submitBid(gameState.roomCode, gameState.playerId, 0).catch(error => {
      console.error('خطأ في تمرير المزايدة:', error);
      showToast('حدث خطأ أثناء تمرير المزايدة', 'error');
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
        showToast('حدث خطأ أثناء إرسال الإجابات', 'error');
      });
    } else {
      showToast(`يجب تقديم ${requiredAnswers} إجابات`, 'error');
    }
  });
  
  // ==== معالجات أحداث جولة "الجرس" ====
  
  bellButton.addEventListener('click', () => {
    console.log('تم النقر على زر الجرس');
    // إرسال الجرس إلى Firebase
    ringBell(gameState.roomCode, gameState.playerId).then(() => {
      // إظهار حقل الإجابة
      document.getElementById('bell-answer-section').style.display = 'flex';
      showToast('تم ضغط الجرس! أدخل إجابتك الآن', 'info');
    }).catch(error => {
      console.error('خطأ في إرسال الجرس:', error);
      showToast('حدث خطأ أثناء ضغط الجرس', 'error');
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
        showToast('حدث خطأ أثناء إرسال الإجابة', 'error');
      });
    } else {
      showToast('يرجى إدخال إجابة', 'error');
    }
  });
  
  // إضافة استجابة للمدخلات عند الضغط على Enter في حقل إجابة الجرس
  bellAnswer.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitBellAnswer.click();
    }
  });
  
  // ==== معالجات أحداث جولة "مسيرة لاعب" ====
  
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
        showToast('حدث خطأ أثناء إرسال الإجابة', 'error');
      });
    } else {
      showToast('يرجى إدخال إجابة', 'error');
    }
  });
  
  // إضافة استجابة للمدخلات عند الضغط على Enter في حقل إجابة مسيرة لاعب
  careerAnswer.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitCareer.click();
    }
  });
  
  // ==== معالج حدث اللعب مرة أخرى ====
  
  playAgainBtn.addEventListener('click', () => {
    console.log('تم النقر على زر اللعب مرة أخرى');
    // العودة إلى الشاشة الرئيسية
    showScreen('welcome-screen');
    
    // إعادة تعيين النموذج
    playerNameInput.value = '';
    roomCodeInput.value = '';
    createdRoomInfo.classList.add('hidden');
    joinRoomForm.classList.add('hidden');
    
    showToast('مرحباً بك مرة أخرى في تحدي كرة القدم!', 'info');
  });
  
  // تحسين تجربة المستخدم
  console.log('إعداد تحسينات تجربة المستخدم للأزرار');
  
  // إضافة تأثير صوتي للأزرار
  const allButtons = document.querySelectorAll('.btn');
  allButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // إضافة تأثير نقرة للزر (اختياري إذا كان الصوت متاحاً)
      btn.classList.add('clicked');
      setTimeout(() => {
        btn.classList.remove('clicked');
      }, 200);
    });
  });
  
  console.log('تم إعداد جميع معالجات الأحداث بنجاح');
});
