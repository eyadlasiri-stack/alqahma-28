window.onload = function() {
    // 1. تحديد التاريخ (نظام الساعة 3 فجراً)
    const nowTime = new Date();
    if (nowTime.getHours() < 3) { nowTime.setDate(nowTime.getDate() - 1); }
    const formattedToday = nowTime.toISOString().split('T')[0];

    const allMatches = document.querySelectorAll('.match-day-source');
    const containers = {
        today: document.getElementById('today-matches-list'),
        upcoming: document.getElementById('upcoming-matches-list'),
        previous: document.getElementById('previous-matches-list')
    };

    // تعريف المجموعات والفرق
    const groupsData = {
        "المجموعة 1": ["السوق", "جندلة", "الفيض"],
        "المجموعة 2": ["البرك", "ساحل مغزل", "وحدة الرقه"],
        "المجموعة 3": ["الصقر", "عمق", "العرق"],
        "المجموعة 4": ["السلطان", "الساحل الرياضي", "مستقبل عرمرم"],
        "المجموعة 5": ["الفيصلي", "الوسام", "خليج الصوالحة"],
        "المجموعة 6": ["صقلية", "عرمرم", "دبسا"]
    };

    let standings = {}; // مخزن النقاط

    // تهيئة مخزن النقاط لكل الفرق
    Object.values(groupsData).flat().forEach(team => {
        standings[team] = { played: 0, points: 0 };
    });

    // 2. توزيع المباريات وحساب النقاط تلقائياً
    allMatches.forEach(match => {
        const matchDate = match.getAttribute('data-date');
        const cloned = match.cloneNode(true);
        cloned.className = 'match-day';
        
        const cards = cloned.querySelectorAll('.match-card');
        cards.forEach(card => {
            const teams = card.querySelectorAll('.team');
            const vs = card.querySelector('.vs');
            const resultText = vs.innerText.trim();
            const t1 = teams[0].innerText.trim();
            const t2 = teams[1].innerText.trim();

            // إذا كان التاريخ قديم أو مكتوب "انتهت" نحسب النقاط
            if (matchDate < formattedToday || card.querySelector('.match-time').innerText.includes('انتهت')) {
                if (resultText.includes('-')) {
                    const scores = resultText.split('-').map(Number);
                    standings[t1].played++;
                    standings[t2].played++;
                    if (scores[0] > scores[1]) standings[t1].points += 3;
                    else if (scores[1] > scores[0]) standings[t2].points += 3;
                    else { standings[t1].points += 1; standings[t2].points += 1; }
                }
                
                // تنسيق الشكل في التبويب
                vs.style.backgroundColor = 'var(--secondary-dark)';
                if (vs.innerText.trim() === 'VS') vs.innerText = 'انتهت';
            }
        });

        if (matchDate < formattedToday) containers.previous.appendChild(cloned);
        else if (matchDate === formattedToday) containers.today.appendChild(cloned);
        else containers.upcoming.appendChild(cloned);
    });

    // 3. بناء جداول المجموعات تلقائياً في الصفحة
    const groupsContainer = document.getElementById('auto-groups');
    for (const [groupName, teams] of Object.entries(groupsData)) {
        let tableHTML = `
            <div class="group-card">
                <div class="group-header">${groupName}</div>
                <table style="width:100%; border-collapse:collapse; margin-top:10px; font-size:0.85rem;">
                    <thead><tr style="color:#D4AF37; border-bottom:1px solid #D4AF37;">
                        <th style="text-align:right; padding:5px;">الفريق</th>
                        <th>لعب</th><th>نقاط</th>
                    </tr></thead><tbody>`;
        
        // ترتيب فرق المجموعة حسب النقاط
        teams.sort((a, b) => standings[b].points - standings[a].points);

        teams.forEach(team => {
            tableHTML += `
                <tr style="border-bottom:1px solid rgba(212,175,55,0.1);">
                    <td style="text-align:right; padding:8px 5px;">${team}</td>
                    <td style="text-align:center;">${standings[team].played}</td>
                    <td style="text-align:center; font-weight:bold; color:#D4AF37;">${standings[team].points}</td>
                </tr>`;
        });

        tableHTML += `</tbody></table></div>`;
        groupsContainer.innerHTML += tableHTML;
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
// دالة checkLive تبقى كما هي في الكود السابق...
