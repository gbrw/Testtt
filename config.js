// ملف إعدادات التطبيق وقاعدة البيانات
console.log('تحميل إعدادات التطبيق...');

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

// تعريف حالة اللعبة العالمية
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
  currentTurn: null,
  lastBidValue: 1
};

// اختبار الاتصال بقاعدة البيانات
function testFirebaseConnection() {
  console.log("جاري اختبار الاتصال بـ Firebase...");
  
  const testRef = database.ref("connection_test");
  testRef.set({
    message: "تم الاتصال بنجاح",
    timestamp: new Date().toString()
  })
  .then(() => {
    console.log("✅ تم الاتصال بقاعدة البيانات بنجاح!");
  })
  .catch((error) => {
    console.error("❌ فشل الاتصال بقاعدة البيانات:", error);
  });
}