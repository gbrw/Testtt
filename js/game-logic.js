// منطق اللعبة الكامل - يعمل مع الأزرار المصلحة

// أسئلة اللعبة
const gameQuestions = {
    knowledge: [
        {
            question: "من هو الهداف التاريخي لكأس العالم؟",
            answers: ["ميروسلاف كلوزه"]
        },
        {
            question: "من هو اللاعب الوحيد الذي حصل على كأس العالم كلاعب ومدرب؟",
            answers: ["فرانز بكنباور"]
        },
        {
            question: "في أي نادي لعب كريستيانو رونالدو قبل ريال مدريد؟",
            answers: ["مانشستر يونايتد"]
        },
        {
            question: "من هو المدرب الذي فاز بدوري أبطال أوروبا مع ريال مدريد أربع مرات؟",
            answers: ["زين الدين زيدان", "زيدان"]
        },
        {
            question: "ما هو النادي الذي فاز بأكبر عدد من بطولات دوري أبطال أوروبا؟",
            answers: ["ريال مدريد"]
        }
    ],
    auction: [
        {
            question: "اذكر 5 لاعبين فازوا بكرة ذهبية",
            answers: []
        },
        {
            question: "اذكر 4 أندية فازت بدوري أبطال أوروبا",
            answers: []
        },
        {
            question: "اذكر 6 منتخبات فازت بكأس العالم",
            answers: []
        },
        {
            question: "اذكر 3 هدافين للدوري الإنجليزي الممتاز",
            answers: []
        },
        {
            question: "اذكر 4 لاعبين تجاوزوا 100 هدف في الدوريات الأوروبية الخمس الكبرى",
            answers: []
        }
    ],
    bell: [
        {
            question: "من هو المدرب الحالي لريال مدريد؟",
            answer: "كارلو أنشيلوتي"
        },
        {
            question: "من هو هداف كأس العالم 2022؟",
            answer: "كيليان مبابي"
        },
        {
            question: "أي نادي فاز بدوري أبطال أوروبا 2023؟",
            answer: "مانشستر سيتي"
        },
        {
            question: "من هو اللاعب الحائز على كرة ذهبية 2022؟",
            answer: "كريم بنزيما"
        },
        {
            question: "ما هو النادي الذي انتقل إليه ميسي بعد برشلونة؟",
            answer: "باريس سان جيرمان"
        }
    ],
    career: [
        {
            question: "لاعب فاز بكأس العالم مع منتخب فرنسا، لعب في ريال مدريد ويوفنتوس وحقق دوري الأبطال. من هو؟",
            answer: "زين الدين زيدان"
        },
        {
            question: "لاعب فاز بدوري الأبطال مع برشلونة، فائز بكأس العالم مع منتخب إسبانيا، لعب في نادي فيسيل كوبي. من هو؟",
            answer: "أندريس إنييستا"
        },
        {
            question: "لاعب إنجليزي لعب في مانشستر يونايتد وريال مدريد وإل إيه جالاكسي، متزوج من مغنية سابقة. من هو؟",
            answer: "ديفيد بيكهام"
        },
        {
            question: "لاعب برازيلي فاز بكأسين عالم، لعب في برشلونة وميلان وفلامنغو. اشتهر برقصه بعد الأهداف. من هو؟",
            answer: "رونالدينيو"
        },
        {
            question: "حارس مرمى إيطالي لعب طوال مسيرته في نادي واحد، فاز بكأس العالم 2006، يعتبر من أفضل الحراس في التاريخ. من هو؟",
            answer: "جيانلويجي بوفون"
        }
    ]
};

// التحقق من الإجابات
function cleanText(text) {
  if (!text) return '';
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/أ|آ|إ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ي/g, 'ى')
    .replace(/[^\w\s\u0600-\u06FF]/g, '');
}

// مقارنة الإجابات بشكل مرن
function compareAnswers(userAnswer, correctAnswer) {
  if (!userAnswer || !correctAnswer) return false;
  
  // تنظيف النصوص
  const cleanedUserAnswer = cleanText(userAnswer.toLowerCase());
  
  // التحقق من كون الإجابة الصحيحة نصاً أو مصفوفة
  if (typeof correctAnswer === 'string') {
    const cleanedCorrectAnswer = cleanText(correctAnswer.toLowerCase());
    return cleanedUserAnswer === cleanedCorrectAnswer || 
           cleanedUserAnswer.includes(cleanedCorrectAnswer) || 
           cleanedCorrectAnswer.includes(cleanedUserAnswer);
  }
  
  // إذا كانت الإجابة الصحيحة مصفوفة من الإجابات المحتملة
  if (Array.isArray(correctAnswer)) {
    for (const answer of correctAnswer) {
      if (compareAnswers(userAnswer, answer)) {
        return true;
      }
    }
  }
  
  return false;
}

// التحقق من إجابة جولة المعرفة
function checkKnowledgeAnswer(answer) {
  console.log('التحقق من إجابة المعرفة:', answer);
  
  if (!gameState || !gameState.currentQuestion) return false;
  
  const questionIndex = gameState.currentQuestion - 1;
  const question = gameQuestions.knowledge[questionIndex];
  
  if (!question) return false;
  
  // البحث عن تطابق في قائمة الإجابات الصحيحة
  return question.answers.some(validAnswer => 
    compareAnswers(answer, validAnswer)
  );
}

// التحقق من إجابة جولة الجرس
function checkBellAnswer(answer) {
  console.log('التحقق من إجابة الجرس:', answer);
  
  if (!gameState || !gameState.currentQuestion) return false;
  
  const questionIndex = gameState.currentQuestion - 1;
  const question = gameQuestions.bell[questionIndex];
  
  if (!question) return false;
  
  return compareAnswers(answer, question.answer);
}

// التحقق من إجابة جولة المسيرة
function checkCareerAnswer(answer) {
  console.log('التحقق من إجابة المسيرة:', answer);
  
  if (!gameState || !gameState.currentQuestion) return false;
  
  const questionIndex = gameState.currentQuestion - 1;
  const question = gameQuestions.career[questionIndex];
  
  if (!question) return false;
  
  return compareAnswers(answer, question.answer);
}
