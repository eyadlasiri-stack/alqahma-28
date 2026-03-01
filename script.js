/**
 * نظام إدارة بطولة القحمة الرمضانية 28
 * تطوير: إياد عسيري
 */

// 1. دالة التبديل بين التبويبات (اليوم، القادمة، السابقة، المجموعات)
function showTab(evt, tabName) {
    // إخفاء جميع محتويات التبويبات
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
        tabContents[i].style.display = "none";
    }

    // إلغاء تفعيل جميع الأزرار
    const tabButtons = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    // إظهار التبويب المطلوب وتفعيل الزر الخاص به
    const activeTab = document.getElementById(tabName);
    if (activeTab) {
        activeTab.classList.add("active");
        activeTab.style.display = "block";
    }
    
    if (evt) {
        evt.currentTarget.classList.add("active");
    }
}

// 2. دالة جلب حالة الطقس المباشرة لمدينة القحمة
async function updateWeather() {
    const tempElement = document.getElementById('w-temp');
    const iconElement = document.getElementById('w-icon');

    try {
        // إحداثيات القحمة التقريبية
        const lat = 18.01;
        const lon = 41.69;
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();

        if (data && data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const isDay = data.current_weather.is_day;

            if (tempElement) tempElement.innerText = temp + "°C";
            if (iconElement) iconElement.innerText = isDay ? "☀️" : "🌙";
        }
    } catch (error) {
        console.error("خطأ في جلب بيانات الطقس:", error);
        if (iconElement) iconElement.innerText = "📍";
    }
}

// 3. دالة مشاركة الموقع عبر الواتساب أو تطبيقات التواصل
function shareSite() {
    const shareData = {
        title: 'بطولة القحمة الرمضانية 28',
        text: 'تابع نتائج وترتيب بطولة القحمة الرمضانية الـ 28 مباشرة عبر هذا الرابط:',
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch((err) => console.log("خطأ في المشاركة:", err));
    } else {
        // إذا كان المتصفح لا يدعم المشاركة الأصلية، يفتح الواتساب مباشرة
        const waUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`;
        window.open(waUrl, '_blank');
    }
}

// 4. تشغيل الوظائف الأساسية عند تحميل الصفحة
window.addEventListener('load', () => {
    // تحديث الطقس فور التحميل
    updateWeather();
    
    // تحديث الطقس تلقائياً كل 15 دقيقة
    setInterval(updateWeather, 900000);

    // التأكد من فتح أول تبويب تلقائياً (اليوم)
    const defaultTab = document.getElementById('defaultOpen');
    if (defaultTab) {
        defaultTab.click();
    } else {
        // حل بديل إذا لم يوجد زر افتراضي
        const firstBtn = document.querySelector('.tab-btn');
        if (firstBtn) firstBtn.click();
    }
});
