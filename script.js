window.onload = function() {
    // إجبار النظام على التعامل مع تاريخ 25 فبراير كأنه "اليوم"
    // هذا يضمن بقاء مباراة الصقر وعمق في خانة اليوم طوال السهرة
    const formattedToday = "2026-02-25"; 

    const groupsData = {
        "المجموعة 1": ["السوق", "جندلة", "الفيض"],
        "المجموعة 2": ["ساحل مغزل", "البرك", "وحدة الرقه"],
        "المجموعة 3": ["الصقر", "عمق", "العرق"],
        "المجموعة 4": ["السلطان", "الساحل الرياضي", "مستقبل عرمرم"],
        "المجموعة 5": ["الوسام", "الفيصلي", "خليج الصوالحة"],
        "المجموعة 6": ["صقلية", "عرمرم", "دبسا"]
    };

    let standings = {};
    Object.values(groupsData).flat().forEach(t => standings[t] = { played: 0, points: 0 });

    const allMatches = document.querySelectorAll('.match-day-source');
    const containers = {
        today: document.getElementById('today-matches-list'),
        upcoming: document.getElementById('upcoming-matches-list'),
        previous: document.getElementById('previous-matches-list')
    };

    allMatches.forEach(match => {
        const matchDate = match.getAttribute('data-date');
        const cloned = match.cloneNode(true);
        cloned.className = 'match-day';
        
        cloned.querySelectorAll('.match-card').forEach(card => {
            const stadium = card.getAttribute('data-stadium');
            const commentator = card.getAttribute('data-commentator');
            if (stadium || commentator) {
                const infoDiv = document.createElement('div');
                infoDiv.className = 'match-extra-info';
                infoDiv.innerHTML = `${stadium ? `📍 ${stadium}` : ''}${commentator ? `<br>🎙️ بصوت: ${commentator}` : ''}`;
                card.appendChild(infoDiv);
            }

            const teams = card.querySelectorAll('.team');
            const vs = card.querySelector('.vs');
            const result = vs.innerText.trim();
            const isFinished = card.querySelector('.match-time').innerText.includes('انتهت');
            
            if (teams.length >= 2 && result.includes('-') && isFinished) {
                const [t1, t2] = [teams[0].innerText.trim(), teams[1].innerText.trim()];
                const scores = result.split('-').map(Number);
                if (standings[t1] && standings[t2]) {
                    standings[t1].played++; standings[t2].played++;
                    if (scores[0] > scores[1]) standings[t1].points += 3;
                    else if (scores[1] > scores[0]) standings[t2].points += 3;
                    else { standings[t1].points += 1; standings[t2].points += 1; }
                }
            }
        });

        // المقارنة اليدوية لضمان الترتيب المطلوب:
        // 1. إذا كان التاريخ أصغر من 25 فبراير -> سابقة
        // 2. إذا كان التاريخ يساوي 25 فبراير -> اليوم (الصقر وعمق)
        // 3. إذا كان التاريخ أكبر من 25 فبراير -> قادمة
        if (matchDate < formattedToday) {
            containers.previous.appendChild(cloned);
        } else if (matchDate === formattedToday) {
            containers.today.appendChild(cloned);
        } else {
            containers.upcoming.appendChild(cloned);
        }
    });

    const gContainer = document.getElementById('auto-groups');
    if (gContainer) {
        gContainer.innerHTML = '';
        for (const [groupName, teams] of Object.entries(groupsData)) {
            teams.sort((a, b) => standings[b].points - standings[a].points);
            let tableHTML = `<div class="group-card"><div class="group-header">${groupName}</div><table class="group-table"><thead><tr><th style="text-align:right;">الفريق</th><th>لعب</th><th>نقاط</th></tr></thead><tbody>`;
            teams.forEach(team => {
                const isQual = (team === "السوق") ? '<span class="qualified-tag">تأهل ✅</span>' : '';
                tableHTML += `<tr><td class="team-name-cell">${team} ${isQual}</td><td>${standings[team].played}</td><td class="points-cell">${standings[team].points}</td></tr>`;
            });
            tableHTML += `</tbody></table></div>`;
            gContainer.innerHTML += tableHTML;
        }
    }
};

function openTab(evt, tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
}
