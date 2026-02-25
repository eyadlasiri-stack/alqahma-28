function openTab(evt, tabId) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabId).style.display = "block";
    document.getElementById(tabId).classList.add("active");
    if (evt) evt.currentTarget.className += " active";
}

window.onload = function() {
    // --- نظام توقيت السعودية الذكي (KSA Time) ---
    // جلب الوقت الحالي بتوقيت السعودية
    const ksaDate = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Riyadh"}));
    
    // إذا كانت الساعة الآن في السعودية أقل من 5 فجراً، نعتبر أننا لا نزال في اليوم السابق
    if (ksaDate.getHours() < 5) { 
        ksaDate.setDate(ksaDate.getDate() - 1);
    }
    
    // تنسيق التاريخ بصيغة YYYY-MM-DD
    const y = ksaDate.getFullYear();
    const m = String(ksaDate.getMonth() + 1).padStart(2, '0');
    const d = String(ksaDate.getDate()).padStart(2, '0');
    const formattedToday = `${y}-${m}-${d}`;
    // ------------------------------------------

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

    // تفريغ الحاويات قبل التوزيع للتأكد من عدم التكرار
    containers.today.innerHTML = '';
    containers.upcoming.innerHTML = '';
    containers.previous.innerHTML = '';

    allMatches.forEach(match => {
        const matchDate = match.getAttribute('data-date');
        const cloned = match.cloneNode(true);
        cloned.className = 'match-day';
        
        cloned.querySelectorAll('.match-card').forEach(card => {
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

        if (matchDate < formattedToday) containers.previous.appendChild(cloned);
        else if (matchDate === formattedToday) containers.today.appendChild(cloned);
        else containers.upcoming.appendChild(cloned);
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

    openTab(null, 'today-tab');
};
