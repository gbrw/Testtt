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
  console.log(`جاري محاولة الانضمام إلى الغرفة ${roomCode} باسم ${playerName}`);
  
  if (!roomCode || !playerName) {
    return Promise.reject(new Error('يجب توفير رمز الغرفة واسم اللاعب'));
  }
  
  const roomRef = database.ref('rooms/' + roomCode);
  
  return roomRef.once('value')
    .then(snapshot => {
      console.log('تم استلام بيانات الغرفة', snapshot.exists());
      
      if (!snapshot.exists()) {
        throw new Error('الغرفة غير موجودة');
      }
      
      const roomData = snapshot.val();
      console.log('بيانات الغرفة:', roomData);
      
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
      console.log('تم إضافة اللاعب بنجاح، تحديث حالة الغرفة إلى "ready"');
      // تحديث حالة الغرفة إلى 'جاهزة للبدء'
      return roomRef.update({
        status: 'ready'
      });
    })
    .then(() => {
      console.log('اكتمل الانضمام إلى الغرفة بنجاح');
    });
}

// الاستماع للتغييرات في الغرفة
function listenToRoomChanges(roomCode, callbacks) {
  const roomRef = database.ref('rooms/' + roomCode);
  
  // الاستماع للتغييرات
  roomRef.on('value', snapshot => {
    if (!snapshot.exists()) {
      callbacks.onRoomDeleted?.();
      return;
    }
    
    const roomData = snapshot.val();
    callbacks.onRoomUpdate?.(roomData);
  });
  
  return roomRef;
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
