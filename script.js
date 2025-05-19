// ملف JavaScript الرئيسي
console.log('بدء تحميل الكود');

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCdYrpdM_7UJ-5VWWoJ0usrQR7lsvqoFog",
  authDomain: "footballchallange.firebaseapp.com",
  databaseURL: "https://footballchallange-default-rtdb.firebaseio.com", 
  projectId: "footballchallange",
  storageBucket: "footballchallange.firebasestorage.app",
  messagingSenderId: "717977440447",
  appId: "1:717977440447:web:cc60fe924b93869dca760a",
  measurementId: "G-WXRVK8N5EW"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// مجموعة أسئلة اللعبة
const gameQuestions = {
  // جولة 1: ماذا تعرف؟
  knowledge: [
    {
      question: "اذكر اسم لاعب سجل هاتريك في كأس العالم.",
      type: "إجابات مفتوحة",
      answers: ["كريستيانو رونالدو", "ليونيل ميسي", "جاست فونتين", "جيرد مولر", "باتيستوتا", "مبابي", "زين الدين زيدان", "ميروسلاف كلوزه", "هاري كين"]
    },
    {
      question: "اذكر اسم فريق فاز بدوري أبطال أوروبا.",
      type: "إجابات مفتوحة",
      answers: ["ريال مدريد", "برشلونة", "بايرن ميونخ", "ليفربول", "مانشستر يونايتد", "ميلان", "إنتر ميلان", "تشيلسي", "بورتو", "أياكس", "يوفنتوس", "أستون فيلا", "بنفيكا", "نوتنغهام فورست"]
    },
    {
      question: "اذكر دولة شاركت في نهائيات كأس العالم 2022.",
      type: "إجابات مفتوحة",
      answers: ["قطر", "البرازيل", "الأرجنتين", "فرنسا", "إنجلترا", "المغرب", "كرواتيا", "اليابان", "السعودية", "تونس", "كوريا الجنوبية", "الإكوادور", "هولندا", "السنغال", "الولايات المتحدة", "ويلز", "إيران", "المكسيك", "بولندا", "أستراليا", "الدنمارك", "ألمانيا", "إسبانيا", "كوستاريكا", "بلجيكا", "كندا", "سويسرا", "الكاميرون", "أوروغواي", "غانا", "صربيا", "البرتغال"]
    },
    {
      question: "اذكر اسم حارس مرمى مشهور.",
      type: "إجابات مفتوحة",
      answers: ["جانلويجي بوفون", "إيكر كاسياس", "مانويل نوير", "بيتر تشيك", "أليسون بيكر", "إدرسون", "دافيد دي خيا", "تيبو كورتوا", "ياسين بونو", "محمد الدعيع", "عصام الحضري", "أوليفر كان", "إدوين فان دير سار"]
    },
    {
      question: "اذكر اسم مدرب فاز بلقب دوري كروي.",
      type: "إجابات مفتوحة",
      answers: ["بيب غوارديولا", "يورغن كلوب", "كارلو أنشيلوتي", "زين الدين زيدان", "أليكس فيرغسون", "جوزيه مورينيو", "أرسين فينغر", "فينسنت كومباني", "دييغو سيميوني", "أنطونيو كونتي", "لويس إنريكي", "ماسيميليانو أليغري"]
    }
  ],
  
  // جولة 2: المزاد
  auction: [
    {
      question: "اذكر أسماء لاعبين لعبوا في ريال مدريد منذ عام 2000.",
      type: "مزايدة",
      answers: ["كريستيانو رونالدو", "كريم بنزيما", "سيرجيو راموس", "زين الدين زيدان", "لوكا مودريتش", "رونالدو", "توني كروس", "جاريث بيل", "كاسيميرو", "مارسيلو", "إيكر كاسياس", "كاكا", "روبيرتو كارلوس", "رود فان نيستلروي", "رافائيل فاران", "إيمانويل ادبايور", "ديفيد بيكهام", "إدين هازارد", "تشيتشاريتو", "لويس فيغو", "كلود ماكيليلي", "خابي ألونسو", "فينيسيوس جونيور", "كيليان مبابي", "جود بيلينغهام", "ميشيل أوين", "راؤول غونزاليس", "فابيو كانافارو", "أنخيل دي ماريا", "خوسيلو"]
    },
    {
      question: "اذكر أسماء منتخبات شاركت في كأس العالم على الأقل مرة واحدة.",
      type: "مزايدة",
      answers: ["البرازيل", "ألمانيا", "إيطاليا", "الأرجنتين", "فرنسا", "إنجلترا", "إسبانيا", "هولندا", "البرتغال", "بلجيكا", "المكسيك", "السويد", "روسيا", "أوروغواي", "كرواتيا", "اليابان", "كوريا الجنوبية", "السعودية", "مصر", "المغرب", "تونس", "نيجيريا", "الكاميرون", "غانا", "السنغال", "كوستاريكا", "كولومبيا", "الإكوادور", "أستراليا", "نيوزيلندا", "الولايات المتحدة", "كندا", "صربيا", "بولندا", "سويسرا", "النمسا", "المجر", "تشيكوسلوفاكيا", "رومانيا", "بلغاريا", "أوكرانيا", "ويلز", "أيرلندا", "تركيا", "إيران", "العراق", "قطر"]
    },
    {
      question: "اذكر أسماء بطولات كرة قدم دولية أو قارية.",
      type: "مزايدة",
      answers: ["كأس العالم", "دوري أبطال أوروبا", "كأس أمم أوروبا", "كأس أمم أفريقيا", "كوبا أمريكا", "كأس آسيا", "الدوري الأوروبي", "دوري أبطال أفريقيا", "دوري أبطال آسيا", "كأس العالم للأندية", "دوري الأمم الأوروبية", "كأس الاتحاد الآسيوي", "كأس الكونفدرالية الأفريقية", "كأس الخليج العربي", "بطولة كأس العرب", "كأس القارات", "الألعاب الأولمبية", "كأس الاتحاد الإنجليزي", "كأس السوبر الأوروبي", "كأس ليبرتادوريس", "الدوري الأوروبي المؤتمر", "كأس السوبر الإسباني", "كأس السوبر الإيطالي", "كأس أمم أمريكا الشمالية", "كأس أوقيانوسيا"]
    },
    {
      question: "اذكر أسماء لاعبين فازوا بجائزة الكرة الذهبية.",
      type: "مزايدة",
      answers: ["ليونيل ميسي", "كريستيانو رونالدو", "كريم بنزيما", "لوكا مودريتش", "زين الدين زيدان", "رونالدينيو", "كاكا", "رونالدو", "ريفالدو", "فابيو كانافارو", "مايكل أوين", "لويس فيغو", "روبرتو باجيو", "ماتيو دوناروما", "جورج وياه", "جورجينيو", "ريفيرا", "بوبي شارلتون", "فان باستن", "آلان سيرر", "أويغن", "خافي", "أندريس إنييستا", "باولو روسي", "جيرد مولر"]
    },
    {
      question: "اذكر أسماء أندية تلعب في الدوري الإنجليزي الممتاز حالياً أو سابقاً.",
      type: "مزايدة",
      answers: ["مانشستر يونايتد", "مانشستر سيتي", "ليفربول", "تشيلسي", "آرسنال", "توتنهام", "أستون فيلا", "إيفرتون", "نيوكاسل", "وست هام", "برايتون", "وولفرهامبتون", "كريستال بالاس", "ليستر سيتي", "ساوثهامبتون", "واتفورد", "بورنموث", "نوتنغهام فورست", "ليدز يونايتد", "شيفيلد يونايتد", "بيرنلي", "فولهام", "ميدلسبره", "سندرلاند", "وست بروميتش ألبيون", "ستوك سيتي", "سوانزي سيتي", "كارديف سيتي", "هال سيتي", "بلاكبيرن روفرز", "بورتسموث", "بولتون", "ويغان أثلتيك", "تشارلتون أثلتيك", "كوفنتري سيتي", "بريستول سيتي"]
    }
  ],
  
  // جولة 3: الجرس
  bell: [
    {
      question: "من هو هداف كأس العالم التاريخي؟",
      type: "جرس",
      answer: "ميروسلاف كلوزه"
    },
    {
      question: "من هو أكثر لاعب فاز بدوري أبطال أوروبا؟",
      type: "جرس",
      answer: "فرانشيسكو خينتو"
    },
    {
      question: "ما هو النادي الذي فاز بأكبر عدد من بطولات دوري أبطال أوروبا؟",
      type: "جرس",
      answer: "ريال مدريد"
    },
    {
      question: "من هو اللاعب الذي سجل أكبر عدد من الأهداف في موسم واحد بالدوريات الأوروبية الخمس الكبرى؟",
      type: "جرس",
      answer: "ليونيل ميسي"
    },
    {
      question: "ما هو المنتخب الذي فاز بكأس العالم 2022؟",
      type: "جرس",
      answer: "الأرجنتين"
    }
  ],
  
  // جولة 4: التعويض - مسيرة لاعب
  career: [
    {
      question: "سبورتينغ لشبونة → مانشستر يونايتد → ريال مدريد → يوفنتوس → مانشستر يونايتد → النصر",
      type: "مسيرة لاعب",
      answer: "كريستيانو رونالدو"
    },
    {
      question: "لانوس → برشلونة → باريس سان جيرمان → انتر ميامي",
      type: "مسيرة لاعب",
      answer: "ليونيل ميسي"
    },
    {
      question: "سانتوس → برشلونة → باريس سان جيرمان → الهلال",
      type: "مسيرة لاعب",
      answer: "نيمار"
    },
    {
      question: "ليل → تشيلسي → ريال مدريد",
      type: "مسيرة لاعب",
      answer: "إيدين هازارد"
    },
    {
      question: "مارسيليا → يوفنتوس → مانشستر يونايتد → وست هام → إنتر ميامي",
      type: "مسيرة لاعب",
      answer: "باتريس إيفرا"
    }
  ]
};

// حالة اللعبة الحالية
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

// اختبار الاتصال بقاعدة البيانات
function testFirebaseConnection() {
  console.log("جاري اختبار الاتصال بـ Firebase...");
  
  const testRef = database.ref("connection_test");
  testRef.set({
    message: "تم الاتصال بنجاح",
    timestamp: new Date().toString(),
    user: "gbrw"
  })
  .then(() => {
    console.log("✅ تم الاتصال بقاعدة البيانات بنجاح!");
    console.log("🔗 الرابط: https://footballchallange-default-rtdb.firebaseio.com/");
    
    return testRef.once('value');
  })
  .then(snapshot => {
    if (snapshot.exists()) {
      console.log("✅ تم قراءة البيانات بنجاح:", snapshot.val());
    }
  })
  .catch((error) => {
    console.error("❌ فشل الاتصال بقاعدة البيانات:", error);
  });
}

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

// خلط مصفوفة (لخلط الأسئلة)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// معالجة تحديثات الغرفة
function handleRoomUpdate(roomData) {
  console.log('تم استلام تحديث للغرفة');
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
  
  // بدء المؤقت (30 ثانية للإجابة)
  startTimer(30);
}

// بدء المؤقت
function startTimer(seconds) {
  gameState.timeLeft = seconds;
  updateTimer();
  
  // إيقاف أي مؤقت سابق
  if (gameState.timer) {
    clearInterval(gameState.timer);
  }
  
  // بدء مؤقت جديد
  gameState.timer = setInterval(() => {
    gameState.timeLeft--;
        // استكمال دالة startTimer
    if (gameState.timeLeft <= 0) {
      clearInterval(gameState.timer);
      handleTimeUp();
    }
  }, 1000);
}

// معالجة انتهاء الوقت
function handleTimeUp() {
  console.log('انتهى الوقت');
  // تنفيذ الإجراء المناسب بناءً على الجولة الحالية
  switch (gameState.currentRound) {
    case 1: // ماذا تعرف؟
      // تبديل الدور إلى اللاعب الآخر
      const nextPlayer = gameState.currentTurn === 'player1' ? 'player2' : 'player1';
      updateGameState(gameState.roomCode, { currentTurn: nextPlayer });
      break;
    case 2: // المزاد
      // تعتمد على ما إذا كنا في مرحلة المزايدة أو تقديم الإجابات
      if (document.getElementById('answers-section').style.display === 'block') {
        // فشل في تقديم الإجابات في الوقت المحدد
        handleAuctionFailure();
      }
      break;
  }
}

// معالجة فشل جولة المزاد
function handleAuctionFailure() {
  // اللاعب الآخر يحصل على نقطة
  const otherPlayer = gameState.playerId === 'player1' ? 'player2' : 'player1';
  const currentScore = gameState.players[otherPlayer].score || 0;
  
  updatePlayerScore(gameState.roomCode, otherPlayer, currentScore + 1);
  
  // الانتقال إلى السؤال التالي
  moveToNextQuestion();
}

// معالجة ضغط زر الجرس
function handleBellRing(bellData) {
  const { playerKey } = bellData;
  
  // إذا كنت أنت من ضغط الجرس، أظهر حقل الإجابة
  if (playerKey === gameState.playerId) {
    document.getElementById('bell-answer-section').style.display = 'flex';
    document.getElementById('bell-button').disabled = true;
  } else {
    // إذا كان اللاعب الآخر هو من ضغط الجرس، عطل الجرس
    document.getElementById('bell-button').disabled = true;
  }
  
  // تحديث الدور ليكون للاعب الذي ضغط الجرس
  updateGameState(gameState.roomCode, { currentTurn: playerKey });
  
  // بدء مؤقت للإجابة (5 ثوانٍ)
  startTimer(5);
}

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

// عرض النتائج النهائية
function showFinalResults() {
  console.log('عرض النتائج النهائية');
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
  const player1Score = gameState.players.player1?.score || 0;
  const player2Score = gameState.players.player2?.score || 0;
  
  if (player1Score > player2Score) {
    winnerName = gameState.players.player1.name;
  } else if (player2Score > player1Score) {
    winnerName = gameState.players.player2.name;
  }
  
  document.getElementById('winner-name').textContent = winnerName;
}

// إعداد أحداث DOM عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  console.log('تم تحميل الصفحة');
  
  // اختبار الاتصال بـ Firebase
  testFirebaseConnection();
  
  // مراجع عناصر DOM
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
  
  // أحداث الأزرار الأخرى تضاف هنا
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
      }).catch(error => {
        console.error('خطأ في الانضمام إلى الغرفة:', error);
        alert('حدث خطأ أثناء الانضمام إلى الغرفة: ' + error.message);
      });
    } else {
      alert('يرجى إدخال اسم اللاعب ورمز الغرفة.');
    }
  });
  
  // إضافة باقي مستمعي الأحداث للأزرار...
  
  console.log('تم إعداد جميع مستمعي الأحداث بنجاح');
});
