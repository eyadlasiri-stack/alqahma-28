function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) tabcontent[i].classList.remove("active");
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) tablinks[i].classList.remove("active");
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

function distributeMatches() {
    const todayStr = "2026-03-01"; // تثبيت تاريخ اليوم للتجربة أو استخدم New Date()...
    const master = document.getElementById('master-schedule');
    const matches = master.getElementsByClassName('match-item');
    
    const todayTab = document.getElementById('today-tab');
    const upcomingTab = document.getElementById('upcoming-tab');
    const previousTab = document.getElementById('previous-tab');

    Array.from(matches).forEach(match => {
        const matchDate = match.getAttribute('data-date');
        const html = match.innerHTML;
        if (matchDate === todayStr) todayTab.innerHTML += html;
        else if (matchDate > todayStr) upcomingTab.innerHTML += html;
        else previousTab.innerHTML += html;
    });
}

async function updateWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=18.01&longitude=41.69&current_weather=true');
        const data = await res.json();
        document.getElementById('w-temp').innerText = Math.round(data.current_weather.temperature) + "°C";
        document.getElementById('w-icon').innerText = data.current_weather.is_day ? "☀️" : "🌙";
    } catch (e) { document.getElementById('w-icon').innerText = "📍"; }
}

function shareSite() {
    if (navigator.share) navigator.share({ title: 'بطولة القحمة 28', url: window.location.href });
    else window.open('https://wa.me/?text=' + encodeURIComponent(window.location.href));
}

window.onload = () => { distributeMatches(); updateWeather(); };
