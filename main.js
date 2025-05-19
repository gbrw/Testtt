// تحسينات في ملف JavaScript

// إضافة خيار التبديل بين المظهر الفاتح والمظهر الداكن
function setupDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.classList.add('dark-mode-toggle');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.title = 'تبديل المظهر';
    
    document.querySelector('header .container').appendChild(darkModeToggle);
    
    // التحقق من الإعدادات المحفوظة
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
}

// تحسين البحث ليكون فوريًا مع الكتابة
function setupImprovedSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        performSearch(searchTerm);
    });
    
    // إضافة زر مسح البحث
    const clearButton = document.createElement('button');
    clearButton.classList.add('clear-search');
    clearButton.innerHTML = '×';
    clearButton.style.display = 'none';
    
    searchInput.parentNode.style.position = 'relative';
    searchInput.parentNode.appendChild(clearButton);
    
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        this.style.display = 'none';
        performSearch('');
    });
    
    searchInput.addEventListener('input', function() {
        clearButton.style.display = this.value ? 'block' : 'none';
    });
}

// إجراء البحث بشكل أكثر كفاءة
function performSearch(searchTerm) {
    if (!searchTerm) {
        displayChallenges();
        return;
    }
    
    const filteredChallenges = challenges.filter(challenge => 
        challenge.name.toLowerCase().includes(searchTerm) ||
        challenge.city.toLowerCase().includes(searchTerm) ||
        challenge.type.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredChallenges(filteredChallenges);
}

// عرض التحديات المصفاة
function displayFilteredChallenges(filteredChallenges) {
    const currentFiltered = filteredChallenges.filter(c => c.status === 'current');
    const upcomingFiltered = filteredChallenges.filter(c => c.status === 'upcoming');
    
    updateChallengeContainer('currentChallenges', currentFiltered, 'لم يتم العثور على تحديات حالية مطابقة');
    updateChallengeContainer('upcomingChallenges', upcomingFiltered, 'لم يتم العثور على تحديات قادمة مطابقة');
}

// تحديث حاوية التحديات (تجنب تكرار الكود)
function updateChallengeContainer(containerId, challenges, emptyMessage) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (challenges.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-result';
        emptyDiv.innerHTML = `<p>${emptyMessage}</p>`;
        container.appendChild(emptyDiv);
        return;
    }
    
    challenges.forEach(challenge => {
        const card = document.createElement('div');
        card.className = 'challenge-card';
        card.innerHTML = `
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
        `;
        container.appendChild(card);
    });
}

// تحسين نموذج تسجيل الدخول مع رسائل خطأ أفضل
function setupImprovedLoginModal() {
    const modal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    
    if (!modal || !loginBtn || !closeBtn || !loginForm) return;
    
    // إضافة حقل رسالة الخطأ
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.color = 'red';
    errorMessage.style.marginBottom = '15px';
    errorMessage.style.display = 'none';
    
    loginForm.insertBefore(errorMessage, loginForm.firstChild);
    
    loginBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        errorMessage.style.display = 'none';
        loginForm.reset();
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            currentUser = user;
            modal.style.display = 'none';
            loginBtn.textContent = 'مرحباً، ' + username;
            
            // إضافة إشعار نجاح
            showNotification('تم تسجيل الدخول بنجاح!', 'success');
        } else {
            errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
            errorMessage.style.display = 'block';
        }
    });
}

// إضافة إشعارات جميلة
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// تحسين تجربة التصفح
document.addEventListener('DOMContentLoaded', function() {
    displayChallenges();
    
    if (document.getElementById('pastResults')) {
        displayResults(results);
    }
    
    setupImprovedLoginModal();
    setupImprovedSearch();
    setupDarkMode();
    
    if (document.getElementById('filterBtn')) {
        document.getElementById('filterBtn').addEventListener('click', filterResults);
    }
    
    // إضافة تأثيرات لطيفة عند التمرير
    window.addEventListener('scroll', function() {
        const cards = document.querySelectorAll('.challenge-card, .result-card');
        cards.forEach(card => {
            const position = card.getBoundingClientRect();
            
            if (position.top >= 0 && position.bottom <= window.innerHeight) {
                card.classList.add('in-view');
            }
        });
    });
});
