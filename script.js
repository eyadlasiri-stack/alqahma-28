// 1. نظام التبديل بين التبويبات
function showTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    if (evt) evt.currentTarget.classList.add("active");
}

// 2. جلب حالة الطقس
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

// 3. دالة المشاركة
function shareSite() {
    if (navigator.share) {
        navigator.share({ title: 'بطولة القحمة 28', url: window.location.href });
    } else {
        window.open('https://wa.me/?text=' + encodeURIComponent(window.location.href));
    }
}

// 4. التشغيل عند التحميل
window.onload = function() {
    updateWeather();
    // لضمان فتح تبويب اليوم تلقائياً
    const defBtn = document.getElementById('defaultOpen');
    if (defBtn) defBtn.click();
};
