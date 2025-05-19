// إعدادات Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// مرجع قاعدة البيانات
const database = firebase.database();

// إنشاء رمز غرفة عشوائي
function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

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
function joinRoom(roomCode, playerName) {
  const roomRef = database.ref('rooms/' + roomCode);
  
  return roomRef.once('value').then(snapshot => {
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
    }).then(() => {
      // تحديث حالة الغرفة إلى 'جاهزة للبدء'
      return roomRef.update({
        status: 'ready'
      });
    });
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
function updateGameState(roomCode, gameState) {
  return database.ref('rooms/' + roomCode + '/gameState').update(gameState);
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