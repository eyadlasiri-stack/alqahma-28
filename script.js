window.onload = function() {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];

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
        
        const vsElements = cloned.querySelectorAll('.vs');
        vsElements.forEach(vs => {
            vs.setAttribute('data-original', vs.innerText.trim());
            if (matchDate < formattedToday) {
                vs.style.backgroundColor = 'var(--secondary-dark)';
                if (vs.innerText.trim() === 'VS') vs.innerText = 'انتهت';
            }
        });

        if (matchDate < formattedToday) {
            cloned.querySelector('.day-header').style.backgroundColor = '#334155';
            containers.previous.appendChild(cloned);
        } else if (matchDate === formattedToday) {
            containers.today.appendChild(cloned);
        } else {
            containers.upcoming.appendChild(cloned);
        }
    });

    Object.keys(containers).forEach(key => {
        if (!containers[key].children.length) {
            containers[key].innerHTML = '<div style="text-align:center; padding:20px; color:gray;">لا توجد مباريات</div>';
        }
    });

    setInterval(checkLive, 60000);
    checkLive();
};

function checkLive() {
    const now = new Date();
    let h = now.getHours();
    if (h < 5) h += 24; 
    const currentMins = (h * 60) + now.getMinutes();

    document.querySelectorAll('#today-matches-list .match-card').forEach(card => {
        const startStr = card.getAttribute('data-start');
        const vs = card.querySelector('.vs');
        if (startStr && vs && vs.getAttribute('data-original') === 'VS') {
            const [sh, sm] = startStr.split(':').map(Number);
            const startMins = (sh * 60) + sm;
            if (currentMins >= startMins && currentMins < startMins + 110) {
                vs.innerHTML = 'تلعب الآن 🔴';
                vs.classList.add('live-now');
            } else if (currentMins >= startMins + 110) {
                vs.innerHTML = 'انتهت';
                vs.classList.remove('live-now');
                vs.style.backgroundColor = 'var(--secondary-dark)';
            }
        }
    });
}

function openTab(evt, tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
}