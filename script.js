// دالة التبديل بين التبويبات
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// دالة توزيع المباريات حسب التاريخ
function distributeMatches() {
    const today = new Date().toISOString().split('T')[0]; // يحصل على تاريخ اليوم بتنسيق 2026-03-01
    const master = document.getElementById('master-schedule');
    const matches = master.getElementsByClassName('match-item');
    
    const todayContainer = document.getElementById('today-tab');
    const upcomingContainer = document.getElementById('upcoming-tab');
    const previousContainer = document.getElementById('previous-tab');

    // مسح الحاويات أولاً
    todayContainer.innerHTML = '';
    upcomingContainer.innerHTML = '';
    previousContainer.innerHTML = '';

    Array.from(matches).forEach(match => {
        const matchDate = match.getAttribute('data-date');
        const content = match.innerHTML;

        if (matchDate === today) {
            todayContainer.innerHTML += content;
        } else if (matchDate > today) {
            upcomingContainer.innerHTML += content;
        } else {
            previousContainer.innerHTML += content;
        }
    });
}

// دالة الطقس
async function updateWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=18.01&longitude=41.69&current_weather=true');
        const data = await res.json();
        document.getElementById('w-temp').innerText = Math.round(data.current_weather.temperature) + "°C";
        document.getElementById('w-icon').innerText = data.current_weather.is_day ? "☀️" : "🌙";
    } catch (e) {
        document.getElementById('w-icon').innerText = "📍";
    }
}

// دالة المشاركة
function shareSite() {
    if (navigator.share) {
        navigator.share({ title: 'بطولة القحمة 28', url: window.location.href });
    } else {
        window.open('https://wa.me/?text=' + encodeURIComponent(window.location.href));
    }
}

// تشغيل الوظائف عند تحميل الصفحة
window.onload = function() {
    distributeMatches();
    updateWeather();
};
