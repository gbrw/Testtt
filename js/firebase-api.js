// ملف واجهة Firebase
console.log('تحميل واجهة Firebase...');

// إنشاء غرفة جديدة
function createRoom(playerName) {
  const roomCode = generateRoomCode();
  const roomRef = database.ref('rooms/' + roomCode);
  
  // إنشاء هيكل الغرفة
  return roomRef.set({
    status: 'waiting',
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    players: {
      player1: {
        name: playerName,
        score: 0,
        ready: true
      }
    },
    gameState: {
      currentRound: 0,
      currentQuestion: 0,
      currentTurn: 'player1',
      timeLeft: 0,
      roundStarted: false
    }
  }).then(() => {
    return roomCode;
  });
}

// الانضمام إلى غرفة موجودة
// تحديث وظيفة الانضمام إلى غرفة
function joinRoom(roomCode, playerName) {
// استبدل وظيفة الانضمام إلى غرفة بهذه الوظيفة
function joinRoom(roomCode, playerName) {
  console.log(`🔄 جاري الانضمام إلى الغرفة ${roomCode} باسم ${playerName}`);
  
  return new Promise((resolve, reject) => {
    if (!roomCode || !playerName) {
      reject(new Error('يجب توفير رمز الغرفة واسم اللاعب'));
      return;
    }
    
    const roomRef = database.ref('rooms/' + roomCode);
    
    roomRef.once('value')
      .then(snapshot => {
        if (!snapshot.exists()) {
          throw new Error('الغرفة غير موجودة');
        }
        
        const roomData = snapshot.val();
        console.log('🔍 بيانات الغرفة:', roomData);
        
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
        console.log('✅ تم إضافة اللاعب الثاني بنجاح');
        
        // تحديث حالة الغرفة
        return roomRef.update({
          status: 'ready'
        });
      })
      .then(() => {
        console.log('✅ تم تحديث حالة الغرفة بنجاح');
        
        // تهيئة اللعبة
        window.gameState.roomCode = roomCode;
        window.gameState.playerId = 'player2';
        window.gameState.isCreator = false;
        
        // الاستماع لتغييرات الغرفة
        window.gameState.gameRef = listenToRoomChanges(roomCode, {
          onRoomUpdate: handleRoomUpdate,
          onRoomDeleted: handleRoomDeleted
        });
        
        resolve();
      })
      .catch(error => {
        console.error('❌ خطأ في الانضمام إلى الغرفة:', error);
        reject(error);
      });
  });
}

// تحديث حالة اللعبة
function updateGameState(roomCode, gameStateUpdate) {
  return database.ref('rooms/' + roomCode + '/gameState').update(gameStateUpdate);
}

// تحديث نتيجة اللاعب
function updatePlayerScore(roomCode, playerKey, score) {
  return database.ref('rooms/' + roomCode + '/players/' + playerKey).update({
    score
  });
}

// إرسال إجابة اللاعب
function submitAnswer(roomCode, playerKey, answer) {
  return database.ref('rooms/' + roomCode + '/currentAnswer').set({
    playerKey,
    answer,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
}

// إرسال مزايدة اللاعب
function submitBid(roomCode, playerKey, bidValue) {
  return database.ref('rooms/' + roomCode + '/currentBid').set({
    playerKey,
    value: bidValue,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
}

// إرسال ضغطة الجرس
function ringBell(roomCode, playerKey) {
  return database.ref('rooms/' + roomCode + '/bell').set({
    playerKey,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
}
