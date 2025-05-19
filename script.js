// البيانات
const challenges = [
    {
        id: 1,
        name: "بطولة الرياض للشباب",
        city: "الرياض",
        date: "2025-06-15",
        type: "فريق",
        status: "current"
    },
    {
        id: 2,
        name: "تحدي المهارات الفردية",
        city: "جدة",
        date: "2025-05-25",
        type: "فردي",
        status: "current"
    },
    {
        id: 3,
        name: "بطولة الخليج للناشئين",
        city: "الدمام",
        date: "2025-07-10",
        type: "فريق",
        status: "upcoming"
    },
    {
        id: 4,
        name: "كأس القاهرة المفتوح",
        city: "القاهرة",
        date: "2025-08-05",
        type: "فريق",
        status: "upcoming"
    }
];

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

const users = [
    { username: "admin", password: "admin123" },
    { username: "user", password: "user123" }
];

let currentUser = null;

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة بيانات التحديات
    const currentContainer = document.getElementById('currentChallenges');
    const upcomingContainer = document.getElementById('upcomingChallenges');
    
    if (currentContainer && upcomingContainer) {
        // عرض التحديات الحالية
        challenges.filter(c => c.status === 'current').forEach(challenge => {
            currentContainer.innerHTML += createChallengeCard(challenge);
        });
        
        // عرض التحديات القادمة
        challenges.filter(c => c.status === 'upcoming').forEach(challenge => {
            upcomingContainer.innerHTML += createChallengeCard(challenge);
        });
    }
    
    // عرض النتائج السابقة
    const resultsContainer = document.getElementById('pastResults');
    if (resultsContainer) {
        results.forEach(result => {
            resultsContainer.innerHTML += createResultCard(result);
        });
    }
    
    // تهيئة البحث
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
            if (!searchTerm) return;
            
            if (currentContainer) {
                currentContainer.innerHTML = '';
                const filteredCurrent = challenges.filter(c => 
                    c.status === 'current' && 
                    (c.name.toLowerCase().includes(searchTerm) || 
                     c.city.toLowerCase().includes(searchTerm) || 
                     c.type.toLowerCase().includes(searchTerm))
                );
                
                if (filteredCurrent.length === 0) {
                    currentContainer.innerHTML = '<p>لا توجد تحديات حالية مطابقة</p>';
                } else {
                    filteredCurrent.forEach(challenge => {
                        currentContainer.innerHTML += createChallengeCard(challenge);
                    });
                }
            }
            
            if (upcomingContainer) {
                upcomingContainer.innerHTML = '';
                const filteredUpcoming = challenges.filter(c => 
                    c.status === 'upcoming' && 
                    (c.name.toLowerCase().includes(searchTerm) || 
                     c.city.toLowerCase().includes(searchTerm) || 
                     c.type.toLowerCase().includes(searchTerm))
                );
                
                if (filteredUpcoming.length === 0) {
                    upcomingContainer.innerHTML = '<p>لا توجد تحديات قادمة مطابقة</p>';
                } else {
                    filteredUpcoming.forEach(challenge => {
                        upcomingContainer.innerHTML += createChallengeCard(challenge);
                    });
                }
            }
        });
    }
    
    // تهيئة التصفية
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            const cityFilter = document.getElementById('cityFilter').value;
            const typeFilter = document.getElementById('typeFilter').value;
            
            const filteredResults = results.filter(result => {
                return (!cityFilter || result.city === cityFilter) && 
                       (!typeFilter || result.type === typeFilter);
            });
            
            const resultsContainer = document.getElementById('pastResults');
            resultsContainer.innerHTML = '';
            
            if (filteredResults.length === 0) {
                resultsContainer.innerHTML = '<p>لا توجد نتائج مطابقة</p>';
            } else {
                filteredResults.forEach(result => {
                    resultsContainer.innerHTML += createResultCard(result);
                });
            }
        });
    }
    
    // تهيئة نموذج تسجيل الدخول
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (loginBtn && loginModal && closeBtn && loginForm) {
        loginBtn.addEventListener('click', function() {
            loginModal.style.display = 'block';
            loginError.style.display = 'none';
        });
        
        closeBtn.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
        
        window.addEventListener('click', function(e) {
            if (e.target == loginModal) {
                loginModal.style.display = 'none';
            }
        });
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                currentUser = user;
                loginModal.style.display = 'none';
                loginBtn.textContent = 'مرحباً، ' + username;
                alert('تم تسجيل الدخول بنجاح!');
            } else {
                loginError.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
                loginError.style.display = 'block';
            }
        });
    }
});

// إنشاء بطاقة تحدي
function createChallengeCard(challenge) {
    return `
        <div class="card">
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
}

// إنشاء بطاقة نتيجة
function createResultCard(result) {
    return `
        <div class="card">
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
}

// تنسيق التاريخ
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
}
