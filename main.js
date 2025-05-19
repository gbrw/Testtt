// بيانات التحديات (مثال)
const challenges = [
    {
        id: 1,
        name: "بطولة الرياض للشباب",
        city: "الرياض",
        date: "2025-06-15",
        type: "فريق",
        status: "current" // حالي
    },
    {
        id: 2,
        name: "تحدي المهارات الفردية",
        city: "جدة",
        date: "2025-05-25",
        type: "فردي",
        status: "current" // حالي
    },
    {
        id: 3,
        name: "بطولة الخليج للناشئين",
        city: "الدمام",
        date: "2025-07-10",
        type: "فريق",
        status: "upcoming" // قادم
    },
    {
        id: 4,
        name: "كأس القاهرة المفتوح",
        city: "القاهرة",
        date: "2025-08-05",
        type: "فريق",
        status: "upcoming" // قادم
    }
];

// بيانات النتائج السابقة (مثال)
const results = [
    {
        id: 1,
        name: "بطولة النجوم",
        city: "الرياض",
        date: "2025-04-20",
        type: "فريق",
        winner: "النجوم الزرقاء",
        score: "3-1"
    },
    {
        id: 2,
        name: "تحدي المهارات",
        city: "جدة",
        date: "2025-04-10",
        type: "فردي",
        winner: "أحمد محمد",
        score: "85 نقطة"
    },
    {
        id: 3,
        name: "بطولة الأهلي الودية",
        city: "القاهرة",
        date: "2025-03-25",
        type: "فريق",
        winner: "الأهلي",
        score: "2-0"
    },
    {
        id: 4,
        name: "مسابقة المراوغات",
        city: "الإسكندرية",
        date: "2025-03-05",
        type: "فردي",
        winner: "خالد علي",
        score: "92 نقطة"
    }
];

// المستخدمين المسجلين (مثال بسيط)
const users = [
    { username: "admin", password: "admin123" },
    { username: "user", password: "user123" }
];

// المستخدم الحالي
let currentUser = null;

// الوظائف الرئيسية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // عرض التحديات
    displayChallenges();
    
    // عرض النتائج السابقة إذا كنا في صفحة النتائج
    if (document.getElementById('pastResults')) {
        displayResults(results);
    }
    
    // تفعيل نموذج تسجيل الدخول
    setupLoginModal();
    
    // تفعيل البحث
    setupSearch();
    
    // تفعيل التصفية في صفحة النتائج
    if (document.getElementById('filterBtn')) {
        document.getElementById('filterBtn').addEventListener('click', filterResults);
    }
});

// عرض التحديات على الصفحة الرئيسية
function displayChallenges() {
    const currentContainer = document.getElementById('currentChallenges');
    const upcomingContainer = document.getElementById('upcomingChallenges');
    
    if (!currentContainer || !upcomingContainer) return;
    
    // تفريغ الحاويات
    currentContainer.innerHTML = '';
    upcomingContainer.innerHTML = '';
    
    // تقسيم التحديات إلى حالية وقادمة
    challenges.forEach(challenge => {
        const challengeHTML = `
            <div class="challenge-card">
                <div class="card-header">
                    <h3>${challenge.name}</h3>
                </div>
                <div class="card-body">
                    <div class="card-info">
                        <strong>المدينة:</strong> ${challenge.city}
                    </div>
                    <div class="card-info">
                        <strong>التاريخ:</strong> ${formatDate(challenge.date)}
                    </div>
                    <div class="tag">${challenge.type}</div>
                </div>
            </div>
        `;
        
        if (challenge.status === 'current') {
            currentContainer.innerHTML += challengeHTML;
        } else if (challenge.status === 'upcoming') {
            upcomingContainer.innerHTML += challengeHTML;
        }
    });
}

// عرض النتائج السابقة
function displayResults(resultsArray) {
    const resultsContainer = document.getElementById('pastResults');
    if (!resultsContainer) return;
    
    // تفريغ الحاوية
    resultsContainer.innerHTML = '';
    
    if (resultsArray.length === 0) {
        resultsContainer.innerHTML = '<p>لم يتم العثور على نتائج مطابقة</p>';
        return;
    }
    
    // إضافة نتيجة لكل بطاقة
    resultsArray.forEach(result => {
        resultsContainer.innerHTML += `
            <div class="result-card">
                <div class="card-header">
                    <h3>${result.name}</h3>
                </div>
                <div class="card-body">
                    <div class="card-info">
                        <strong>المدينة:</strong> ${result.city}
                    </div>
                    <div class="card-info">
                        <strong>التاريخ:</strong> ${formatDate(result.date)}
                    </div>
                    <div class="card-info">
                        <strong>الفائز:</strong> ${result.winner}
                    </div>
                    <div class="card-info">
                        <strong>النتيجة:</strong> ${result.score}
                    </div>
                    <div class="tag">${result.type}</div>
                </div>
            </div>
        `;
    });
}

// تصفية النتائج
function filterResults() {
    const cityFilter = document.getElementById('cityFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    const filteredResults = results.filter(result => {
        const cityMatch = cityFilter === '' || result.city === cityFilter;
        const typeMatch = typeFilter === '' || result.type === typeFilter;
        return cityMatch && typeMatch;
    });
    
    displayResults(filteredResults);
}

// إعداد نموذج تسجيل الدخول
function setupLoginModal() {
    const modal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    
    if (!modal || !loginBtn || !closeBtn || !loginForm) return;
    
    // فتح النموذج
    loginBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });
    
    // إغلاق النموذج
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // إغلاق النموذج عند النقر خارجه
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // معالجة تسجيل الدخول
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            currentUser = user;
            alert('تم تسجيل الدخول بنجاح!');
            modal.style.display = 'none';
            loginBtn.textContent = 'مرحباً، ' + username;
        } else {
            alert('اسم المستخدم أو كلمة المرور غير صحيحة');
        }
    });
}

// إعداد وظيفة البحث
function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchBtn || !searchInput) return;
    
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            displayChallenges();
            return;
        }
        
        const filteredChallenges = challenges.filter(challenge => 
            challenge.name.toLowerCase().includes(searchTerm) ||
            challenge.city.toLowerCase().includes(searchTerm) ||
            challenge.type.toLowerCase().includes(searchTerm)
        );
        
        // عرض نتائج البحث
        const currentFiltered = filteredChallenges.filter(c => c.status === 'current');
        const upcomingFiltered = filteredChallenges.filter(c => c.status === 'upcoming');
        
        const currentContainer = document.getElementById('currentChallenges');
        const upcomingContainer = document.getElementById('upcomingChallenges');
        
        if (currentContainer) {
            currentContainer.innerHTML = '';
            if (currentFiltered.length === 0) {
                currentContainer.innerHTML = '<p>لم يتم العثور على تحديات حالية مطابقة</p>';
            } else {
                currentFiltered.forEach(challenge => {
                    currentContainer.innerHTML += `
                        <div class="challenge-card">
                            <div class="card-header">
                                <h3>${challenge.name}</h3>
                            </div>
                            <div class="card-body">
                                <div class="card-info">
                                    <strong>المدينة:</strong> ${challenge.city}
                                </div>
                                <div class="card-info">
                                    <strong>التاريخ:</strong> ${formatDate(challenge.date)}
                                </div>
                                <div class="tag">${challenge.type}</div>
                            </div>
                        </div>
                    `;
                });
            }
        }
        
        if (upcomingContainer) {
            upcomingContainer.innerHTML = '';
            if (upcomingFiltered.length === 0) {
                upcomingContainer.innerHTML = '<p>لم يتم العثور على تحديات قادمة مطابقة</p>';
            } else {
                upcomingFiltered.forEach(challenge => {
                    upcomingContainer.innerHTML += `
                        <div class="challenge-card">
                            <div class="card-header">
                                <h3>${challenge.name}</h3>
                            </div>
                            <div class="card-body">
                                <div class="card-info">
                                    <strong>المدينة:</strong> ${challenge.city}
                                </div>
                                <div class="card-info">
                                    <strong>التاريخ:</strong> ${formatDate(challenge.date)}
                                </div>
                                <div class="tag">${challenge.type}</div>
                            </div>
                        </div>
                    `;
                });
            }
        }
    });
}

// تنسيق التاريخ
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
}
