window.onload = function() {
    // 1. إعداد التاريخ (نظام الساعة 3 فجراً)
    const nowTime = new Date();
    if (nowTime.getHours() < 3) {
        nowTime.setDate(nowTime.getDate() - 1);
    }
    const formattedToday = nowTime.toISOString().split('T')[0];

    // 2. تعريف المجموعات والفرق (تأكد من مطابقة الأسماء تماماً)
    const groupsData = {
        "المجموعة 1": ["السوق", "جندلة", "الفيض"],
        "المجموعة 2": ["البرك", "ساحل مغزل", "وحدة الرقه"],
        "المجموعة 3": ["الصقر", "عمق", "العرق"],
        "المجموعة 4": ["السلطان", "الساحل الرياضي", "مستقبل عرمرم"],
        "المجموعة 5": ["الفيصلي", "الوسام", "خليج الصوالحة"],
        "المجموعة 6": ["صقلية", "عرمرم", "دبسا"]
    };

    let standings = {};
    Object.values(groupsData).flat().forEach(team => {
        standings[team] = { played: 0, points: 0 };
    });

    const allMatches = document.querySelectorAll('.match-day-source');
    const containers = {
        today: document.getElementById('today-matches-list'),
        upcoming: document.getElementById('upcoming-matches-list'),
        previous: document.getElementById('previous-matches-list')
    };

    // 3. تحليل المباريات وحساب النقاط
    allMatches.forEach(match => {
        const matchDate = match.getAttribute('data-date');
        const cloned = match.cloneNode(true);
        cloned.className = 'match-day';
        
        const cards = cloned.querySelectorAll('.match-card');
        cards.forEach(card => {
            const teams = card.querySelectorAll('.team');
            const vs = card.querySelector('.vs');
            const resultText = vs.innerText.trim();
            const timeText = card.querySelector('.match-time').innerText;
            
            if (teams.length >= 2) {
                const t1 = teams[0].innerText.trim();
                const t2 = teams[1].innerText.trim();

                // إذا كانت النتيجة مسجلة والمباراة "انتهت"
                if (resultText.includes('-') && timeText.includes('انتهت')) {
                    const scores = resultText.split('-').map(Number);
                    if (standings[t1] && standings[t2]) {
                        standings[t1].played++;
                        standings[t2].played++;
                        if (scores[0] > scores[1]) standings[t1].points += 3;
                        else if (scores[1] > scores[0]) standings[t2].points += 3;
                        else { standings[t1].points += 1; standings[t2].points += 1; }
                    }
                }
            }
        });

        if (matchDate < formattedToday) containers.previous.appendChild(cloned);
        else if (matchDate === formattedToday) containers.today.appendChild(cloned);
        else containers.upcoming.appendChild(cloned);
    });

    // 4. بناء جداول المجموعات وعرضها بدل "جاري الحساب"
    const groupsContainer = document.getElementById('auto-groups');
    if (groupsContainer) {
        groupsContainer.innerHTML = ''; // مسح كلمة "جاري الحساب"
        for (const [groupName, teams] of Object.entries(groupsData)) {
            // ترتيب الفرق داخل المجموعة حسب النقاط
            teams.sort((a, b) => standings[b].points - standings[a].points);

            let tableHTML = `
                <div class="group-card">
                    <div class="group-header">${groupName}</div>
                    <table class="group-table">
                        <thead>
                            <tr><th class="team-name">الفريق</th><th>لعب</th><th>نقاط</th></tr>
                        </thead>
                        <tbody>`;
            
            teams.forEach(team => {
                tableHTML += `
                    <tr>
                        <td class="team-name">${team}</td>
                        <td>${standings[team].played}</td>
                        <td style="font-weight:bold; color:#D4AF37;">${standings[team].points}</td>
                    </tr>`;
            });

            tableHTML += `</tbody></table></div>`;
            groupsContainer.innerHTML += tableHTML;
        }
    }

    setInterval(checkLive, 60000);
    checkLive();
};

function openTab(evt, tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
}

function checkLive() {
    const now = new Date();
    let h = now.getHours();
    if (h < 5) h += 24; 
    const currentMins = (h * 60) + now.getMinutes();

    document.querySelectorAll('#today-matches-list .match-card').forEach(card => {
        const startStr = card.getAttribute('data-start');
        const vs = card.querySelector('.vs');
        if (startStr && vs && vs.innerText.trim() === 'VS') {
            const [sh, sm] = startStr.split(':').map(Number);
            let startH = sh; if (startH < 5) startH += 24;
            const startMins = (startH * 60) + sm;
            if (currentMins >= startMins && currentMins < startMins + 110) {
                vs.innerHTML = 'تلعب الآن 🔴';
                vs.classList.add('live-now');
            }
        }
    });
}
