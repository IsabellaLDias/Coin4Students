const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

const Sounds = {
    playClick: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    },
    playPop: () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    },
    playChaChing: () => {
        if (!audioCtx) return;
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc1.type = 'square';
        osc2.type = 'triangle';
        
        osc1.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.2);
        
        osc2.frequency.setValueAtTime(1500, audioCtx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(2500, audioCtx.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc1.start();
        osc2.start();
        osc1.stop(audioCtx.currentTime + 0.4);
        osc2.stop(audioCtx.currentTime + 0.4);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const meshBg = document.createElement("div");
    meshBg.id = "mesh-bg";
    document.body.prepend(meshBg);

    setupDarkMode();

    document.body.addEventListener("click", (e) => {
        initAudio();
        const target = e.target.closest('button, a, .tilt-card');
        if (target) {
            Sounds.playClick();
        }
    });

    initTiltCards();

    initParticles();
});

function setupDarkMode() {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
        document.body.setAttribute('data-theme', 'dark');
    }

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "theme-toggle";
    toggleBtn.innerHTML = isDark ? "🌙" : "☀️";
    toggleBtn.setAttribute("aria-label", "Alternar tema");
    
    toggleBtn.onclick = () => {
        initAudio();
        Sounds.playPop();
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            toggleBtn.innerHTML = "☀️";
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggleBtn.innerHTML = "🌙";
        }
    };
    
    document.body.appendChild(toggleBtn);
}

function animateCountUp(element, target, duration = 1500) {
    if (!element) return;
    
    let startTimestamp = null;
    const startValue = parseInt(element.innerText.replace(/\D/g, '') || 0, 10);
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        const currentVal = Math.floor(easeProgress * (target - startValue) + startValue);
        element.innerText = currentVal.toLocaleString("pt-BR");
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.innerText = target.toLocaleString("pt-BR");
        }
    };
    window.requestAnimationFrame(step);
}

function initTiltCards() {
    bindTiltToCards(document.querySelectorAll('.tilt-card'));
}

function bindTiltToCards(cards) {
    cards.forEach(card => {
        if (card.dataset.tiltBound) return;
        card.dataset.tiltBound = "true";
        
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

window.bindTiltToCards = bindTiltToCards;

window.showGlassToast = function(message, icon = "🔔") {
    initAudio();
    Sounds.playPop();
    
    const toast = document.createElement("div");
    toast.className = "glass-toast";
    toast.innerHTML = `<span style="font-size: 20px;">${icon}</span> <span>${message}</span>`;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });
    
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 4000);
};

window.triggerCoinRain = function() {
    initAudio();
    Sounds.playChaChing();
    
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '99999';
    document.body.appendChild(container);

    const coinCount = 50;
    
    for (let i = 0; i < coinCount; i++) {
        const coin = document.createElement('div');
        
        coin.style.position = 'absolute';
        coin.style.width = '30px';
        coin.style.height = '30px';
        coin.style.backgroundColor = '#ffd700';
        coin.style.borderRadius = '50%';
        coin.style.border = '3px solid #d4af37';
        coin.style.boxShadow = 'inset 0 0 5px rgba(0,0,0,0.3), 0 5px 10px rgba(0,0,0,0.2)';
        coin.style.display = 'flex';
        coin.style.alignItems = 'center';
        coin.style.justifyContent = 'center';
        coin.style.fontSize = '14px';
        coin.style.fontWeight = 'bold';
        coin.style.color = '#b8860b';
        coin.innerText = 'C$';
        
        const startX = Math.random() * window.innerWidth;
        coin.style.left = startX + 'px';
        coin.style.top = '-40px';
        
        const duration = 1.5 + Math.random() * 2;
        const delay = Math.random() * 0.5;
        const rotate = Math.random() * 720;
        
        coin.animate([
            { transform: `translate3d(0, 0, 0) rotate(0deg) scale(1)`, opacity: 1 },
            { transform: `translate3d(${(Math.random() - 0.5) * 100}px, ${window.innerHeight + 50}px, 0) rotate(${rotate}deg) scale(0.8)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });
        
        container.appendChild(coin);
    }
    
    setTimeout(() => {
        container.remove();
    }, 5000);
};

class NotificationSystem {
    constructor(userType, badgeEl, listEl, btnEl) {
        this.userType = userType;
        this.badgeEl = badgeEl;
        this.listEl = listEl;
        this.btnEl = btnEl;
        this.userId = null;
        this.notifications = [];
        this.unreadCount = 0;
        
        if (this.btnEl) {
            this.btnEl.addEventListener('click', () => {
                this.listEl.classList.toggle('show');
                this.clearBadge();
            });
            
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.notification-wrapper')) {
                    this.listEl.classList.remove('show');
                }
            });
        }
    }

    setUserId(id) {
        this.userId = id;
        this.loadFromStorage();
        
        if (this.notifications.length === 0) {
            let msg = "Bem-vindo ao portal Coin4Students!";
            if (this.userType === 'aluno') msg = "Ganhe moedas, veja o extrato e resgate vantagens exclusivas!";
            else if (this.userType === 'professor') msg = "Reconheça o esforço dos seus alunos enviando moedas!";
            else if (this.userType === 'empresa') msg = "Cadastre vantagens e conecte-se com o talento universitário!";
            
            this.addNotification(msg, "👋", false);
        }
        this.updateUI();
    }

    getStorageKey() {
        return `notificacoes_${this.userType}_${this.userId}`;
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.getStorageKey());
            if (data) {
                const parsed = JSON.parse(data);
                this.notifications = parsed.items.map(n => ({...n, time: new Date(n.time)}));
                this.unreadCount = parsed.unread || 0;
            }
        } catch (e) {
            console.error("Error loading notifications", e);
        }
    }

    saveToStorage() {
        if (!this.userId) return;
        localStorage.setItem(this.getStorageKey(), JSON.stringify({
            items: this.notifications,
            unread: this.unreadCount
        }));
    }
    
    addNotification(text, icon = "🌟", playToast = true) {
        this.notifications.unshift({ text, icon, time: new Date() });
        if (this.notifications.length > 3) {
            this.notifications.length = 3;
        }
        this.unreadCount++;
        this.saveToStorage();
        this.updateUI();
        
        if (this.btnEl) {
            this.btnEl.classList.add('animating');
            setTimeout(() => this.btnEl.classList.remove('animating'), 500);
        }
        
        if (playToast && window.showGlassToast) {
            window.showGlassToast(text, icon);
        }
    }
    
    clearBadge() {
        this.unreadCount = 0;
        this.saveToStorage();
        if (this.badgeEl) this.badgeEl.style.display = 'none';
    }
    
    updateUI() {
        if (this.badgeEl && this.unreadCount > 0) {
            this.badgeEl.textContent = this.unreadCount;
            this.badgeEl.style.display = 'block';
        } else if (this.badgeEl) {
            this.badgeEl.style.display = 'none';
        }
        
        if (!this.listEl) return;
        
        const bodyEl = this.listEl.querySelector('.notif-body');
        if (!bodyEl) return;
        
        if (this.notifications.length === 0) {
            bodyEl.innerHTML = '<div class="notif-empty">Nenhuma notificação nova</div>';
            return;
        }
        
        bodyEl.innerHTML = '';
        this.notifications.forEach(n => {
            const timeStr = n.time.toLocaleDateString() + ' ' + n.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            bodyEl.innerHTML += `
                <div class="notif-item">
                    <div class="notif-icon">${n.icon}</div>
                    <div class="notif-content">
                        <p>${n.text}</p>
                        <span class="notif-time">${timeStr}</span>
                    </div>
                </div>
            `;
        });
    }
}

window.NotificationSystem = NotificationSystem;

function initParticles() {
    const canvas = document.createElement("canvas");
    canvas.id = "particles-bg";
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 2 + 1,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.1
        });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        const isDark = document.body.getAttribute('data-theme') === 'dark';

        particles.forEach(p => {
            const parallaxX = (width / 2 - mouseX) * 0.05;
            const parallaxY = (height / 2 - mouseY) * 0.05;

            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x + parallaxX, p.y + parallaxY, p.r, 0, Math.PI * 2);
            ctx.fillStyle = (isDark ? "rgba(255, 255, 255, " : "rgba(46, 125, 50, ") + p.opacity + ")";
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}
