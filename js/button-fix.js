/**
 * ملف إصلاح مشكلة الأزرار
 * يحل مشاكل معالجات الأحداث بطريقة مستقلة
 */

console.log('🔄 جاري تحميل إصلاح معالجات الأحداث...');

// تنفيذ الإصلاح عند تحميل المستند
document.addEventListener('DOMContentLoaded', function fixButtons() {
  console.log('🔍 بدء فحص وإصلاح الأزرار...');
  
  // قائمة بالأزرار الرئيسية وعملها المفترض
  const buttonActions = [
    {
      id: 'create-room-btn',
      action: function() {
        console.log('👆 تم النقر على زر إنشاء غرفة');
        const playerName = document.getElementById('player-name').value.trim();
        if (!playerName) {
          alert('يرجى إدخال اسم اللاعب');
          return;
        }
        
        try {
          if (typeof createRoom === 'function') {
            console.log('🏁 استدعاء وظيفة إنشاء غرفة مع الاسم:', playerName);
            createRoom(playerName).then(roomCode => {
              console.log('✅ تم إنشاء الغرفة بنجاح، الرمز:', roomCode);
              
              // عرض معلومات الغرفة
              const roomCodeDisplay = document.getElementById('room-code-display');
              const waitingRoomCode = document.getElementById('waiting-room-code');
              const createdRoomInfo = document.getElementById('created-room-info');
              const joinRoomForm = document.getElementById('join-room-form');
              
              if (roomCodeDisplay) roomCodeDisplay.textContent = roomCode;
              if (waitingRoomCode) waitingRoomCode.textContent = roomCode;
              if (createdRoomInfo) createdRoomInfo.classList.remove('hidden');
              if (joinRoomForm) joinRoomForm.classList.add('hidden');
              
              // تهيئة اللعبة
              if (typeof initGame === 'function') {
                initGame(roomCode, 'player1', true);
              }
              
              // بعد ثانيتين، إظهار شاشة الانتظار
              setTimeout(() => {
                if (typeof showScreen === 'function') {
                  showScreen('waiting-screen');
                }
                
                if (typeof showToast === 'function') {
                  showToast('تم إنشاء الغرفة بنجاح! انتظر انضمام اللاعب الآخر', 'success');
                } else {
                  alert('تم إنشاء الغرفة بنجاح! انتظر انضمام اللاعب الآخر');
                }
              }, 2000);
            }).catch(error => {
              console.error('❌ خطأ في إنشاء الغرفة:', error);
              alert('حدث خطأ أثناء إنشاء الغرفة: ' + error.message);
            });
          } else {
            console.error('⚠️ وظيفة createRoom غير معرفة!');
            alert('حدث خطأ: وظيفة إنشاء الغرفة غير متاحة');
          }
        } catch (e) {
          console.error('💥 خطأ غير متوقع في إنشاء الغرفة:', e);
          alert('حدث خطأ غير متوقع: ' + e.message);
        }
      }
    },
    {
      id: 'join-room-btn',
      action: function() {
        console.log('👆 تم النقر على زر الانضمام إلى غرفة');
        
        // إخفاء/إظهار الأقسام المناسبة
        const createdRoomInfo = document.getElementById('created-room-info');
        const joinRoomForm = document.getElementById('join-room-form');
        
        if (createdRoomInfo) createdRoomInfo.classList.add('hidden');
        if (joinRoomForm) joinRoomForm.classList.remove('hidden');
        
        // تركيز حقل رمز الغرفة
        const roomCodeInput = document.getElementById('room-code');
        if (roomCodeInput) roomCodeInput.focus();
      }
    },
    {
      id: 'confirm-join-btn',
      action: function() {
        console.log('👆 تم النقر على زر تأكيد الانضمام');
        
        // الحصول على قيم الإدخال
        const playerNameInput = document.getElementById('player-name');
        const roomCodeInput = document.getElementById('room-code');
        
        if (!playerNameInput || !roomCodeInput) {
          console.error('⚠️ حقول الإدخال غير موجودة!');
          alert('حدث خطأ: حقول الإدخال غير موجودة');
          return;
        }
        
        const playerName = playerNameInput.value.trim();
        const roomCode = roomCodeInput.value.trim().toUpperCase();
        
        console.log(`📝 محاولة الانضمام: الاسم=${playerName}, رمز الغرفة=${roomCode}`);
        
        // التحقق من البيانات
        if (!playerName) {
          alert('يرجى إدخال اسم اللاعب');
          playerNameInput.focus();
          return;
        }
        
        if (!roomCode) {
          alert('يرجى إدخال رمز الغرفة');
          roomCodeInput.focus();
          return;
        }
        
        try {
          const confirmBtn = document.getElementById('confirm-join-btn');
          if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'جارِ الانضمام...';
          }
          
          if (typeof joinRoom === 'function') {
            console.log('🏁 استدعاء وظيفة الانضمام مع الرمز:', roomCode);
            
            joinRoom(roomCode, playerName)
              .then(() => {
                console.log('✅ تم الانضمام إلى الغرفة بنجاح');
                
                // تهيئة اللعبة
                if (typeof initGame === 'function') {
                  initGame(roomCode, 'player2', false);
                }
                
                // إظهار شاشة اللعبة
                if (typeof showScreen === 'function') {
                  showScreen('game-screen');
                }
                
                if (typeof showToast === 'function') {
                  showToast('تم الانضمام إلى الغرفة بنجاح!', 'success');
                } else {
                  alert('تم الانضمام إلى الغرفة بنجاح!');
                }
              })
              .catch(error => {
                console.error('❌ خطأ في الانضمام إلى الغرفة:', error);
                alert('حدث خطأ أثناء الانضمام إلى الغرفة: ' + (error.message || 'فشلت محاولة الانضمام'));
              })
              .finally(() => {
                if (confirmBtn) {
                  confirmBtn.disabled = false;
                  confirmBtn.textContent = 'انضمام';
                }
              });
          } else {
            console.error('⚠️ وظيفة joinRoom غير معرفة!');
            alert('حدث خطأ: وظيفة الانضمام غير متاحة');
            
            if (confirmBtn) {
              confirmBtn.disabled = false;
              confirmBtn.textContent = 'انضمام';
            }
          }
        } catch (e) {
          console.error('💥 خطأ غير متوقع في الانضمام:', e);
          alert('حدث خطأ غير متوقع: ' + e.message);
          
          const confirmBtn = document.getElementById('confirm-join-btn');
          if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'انضمام';
          }
        }
      }
    },
    // أزرار أخرى حسب الحاجة...
    {
      id: 'submit-knowledge',
      action: function() {
        console.log('👆 تم النقر على زر إرسال إجابة المعرفة');
        const answerInput = document.getElementById('knowledge-answer');
        if (!answerInput) return;
        
        const answer = answerInput.value.trim();
        if (!answer) {
          alert('يرجى إدخال إجابة');
          return;
        }
        
        try {
          if (typeof submitAnswer === 'function' && window.gameState) {
            submitAnswer(window.gameState.roomCode, window.gameState.playerId, answer)
              .then(() => {
                answerInput.value = '';
              })
              .catch(error => {
                console.error('❌ خطأ في إرسال الإجابة:', error);
                alert('حدث خطأ أثناء إرسال الإجابة');
              });
          }
        } catch (e) {
          console.error('💥 خطأ في إرسال الإجابة:', e);
        }
      }
    },
    {
      id: 'pass-knowledge',
      action: function() {
        console.log('👆 تم النقر على زر تمرير المعرفة');
        try {
          if (typeof submitAnswer === 'function' && window.gameState) {
            submitAnswer(window.gameState.roomCode, window.gameState.playerId, 'PASS')
              .catch(error => {
                console.error('❌ خطأ في التمرير:', error);
                alert('حدث خطأ أثناء تمرير الدور');
              });
          }
        } catch (e) {
          console.error('💥 خطأ في تمرير الدور:', e);
        }
      }
    },
    {
      id: 'bell-button',
      action: function() {
        console.log('👆 تم النقر على زر الجرس');
        try {
          if (typeof ringBell === 'function' && window.gameState) {
            ringBell(window.gameState.roomCode, window.gameState.playerId)
              .then(() => {
                const bellAnswerSection = document.getElementById('bell-answer-section');
                if (bellAnswerSection) bellAnswerSection.style.display = 'flex';
                
                if (typeof showToast === 'function') {
                  showToast('تم ضغط الجرس! أدخل إجابتك الآن', 'info');
                }
              })
              .catch(error => {
                console.error('❌ خطأ في إرسال الجرس:', error);
                alert('حدث خطأ أثناء ضغط الجرس');
              });
          }
        } catch (e) {
          console.error('💥 خطأ في ضغط الجرس:', e);
        }
      }
    }
  ];

  // إضافة معالجات الأحداث إلى الأزرار
  buttonActions.forEach(item => {
    const button = document.getElementById(item.id);
    if (button) {
      console.log(`✅ تم العثور على الزر: ${item.id} - إضافة معالج حدث`);
      
      // إزالة جميع معالجات الأحداث السابقة (لتجنب التكرار)
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // إضافة معالج حدث جديد
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log(`🖱️ تم النقر على: ${item.id}`);
        item.action();
      });
    } else {
      console.warn(`⚠️ لم يتم العثور على الزر: ${item.id}`);
    }
  });

  // إضافة استجابة للمدخلات عند الضغط على Enter في حقول الإدخال
  addEnterKeyHandlers();
  
  console.log('✅ تم إصلاح معالجات الأحداث بنجاح');
});

// تم التحميل
window.addEventListener('load', function() {
  console.log('🌟 تم تحميل الصفحة بالكامل وإصلاح الأزرار');
});

// إضافة معالجات مفتاح الإدخال
function addEnterKeyHandlers() {
  // قائمة بحقول الإدخال ومعالجاتها
  const enterKeyHandlers = [
    {
      inputId: 'room-code',
      buttonId: 'confirm-join-btn'
    },
    {
      inputId: 'knowledge-answer',
      buttonId: 'submit-knowledge'
    },
    {
      inputId: 'bell-answer',
      buttonId: 'submit-bell-answer'
    },
    {
      inputId: 'career-answer',
      buttonId: 'submit-career'
    }
  ];
  
  // إضافة معالجات الأحداث
  enterKeyHandlers.forEach(item => {
    const input = document.getElementById(item.inputId);
    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const button = document.getElementById(item.buttonId);
          if (button && !button.disabled) {
            button.click();
          }
        }
      });
    }
  });
}

// وظيفة طوارئ للانضمام إلى الغرفة
window.joinRoomEmergency = function(roomCode, playerName) {
  console.log(`📢 وظيفة انضمام الطوارئ: ${roomCode}, ${playerName}`);
  
  if (!roomCode || !playerName) {
    alert('يجب توفير رمز الغرفة واسم اللاعب');
    return Promise.reject(new Error('بيانات غير كاملة'));
  }
  
  const roomRef = window.database.ref('rooms/' + roomCode);
  
  return roomRef.once('value')
    .then(snapshot => {
      if (!snapshot.exists()) {
        throw new Error('الغرفة غير موجودة');
      }
      
      const roomData = snapshot.val();
      
      if (roomData.status !== 'waiting') {
        throw new Error('اللعبة قد بدأت بالفعل');
      }
      
      if (roomData.players && roomData.players.player2) {
        throw new Error('الغرفة ممتلئة');
      }
      
      // إضافة اللاعب الثاني
      return roomRef.child('players').update({
        player2: {
          name: playerName,
          score: 0,
          ready: true
        }
      });
    })
    .then(() => {
      // تحديث حالة الغرفة
      return roomRef.update({
        status: 'ready'
      });
    })
    .then(() => {
      // تهيئة اللعبة
      if (window.gameState) {
        window.gameState.roomCode = roomCode;
        window.gameState.playerId = 'player2';
        window.gameState.isCreator = false;
      }
      
      // الاستماع لتغييرات الغرفة
      if (typeof listenToRoomChanges === 'function' && 
          typeof handleRoomUpdate === 'function' && 
          typeof handleRoomDeleted === 'function' &&
          window.gameState) {
        
        window.gameState.gameRef = listenToRoomChanges(roomCode, {
          onRoomUpdate: handleRoomUpdate,
          onRoomDeleted: handleRoomDeleted
        });
      }
      
      // عرض شاشة اللعبة
      if (typeof showScreen === 'function') {
        showScreen('game-screen');
      }
      
      if (typeof showToast === 'function') {
        showToast('تم الانضمام بنجاح!', 'success');
      } else {
        alert('تم الانضمام بنجاح!');
      }
    });
};
