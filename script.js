const adLinks = [
    "https://omg10.com/4/10692959", "https://omg10.com/4/10708147", "https://omg10.com/4/10708152",
    "https://omg10.com/4/10708143", "https://omg10.com/4/10678359", "https://omg10.com/4/10692954",
    "https://omg10.com/4/10692953", "https://omg10.com/4/10708154", "https://omg10.com/4/10677665",
    "https://omg10.com/4/10692960", "https://omg10.com/4/10692961", "https://omg10.com/4/10692957",
    "https://omg10.com/4/10692955", "https://omg10.com/4/10708158", "https://omg10.com/4/10708156",
    "https://omg10.com/4/10708157", "https://omg10.com/4/10708145", "https://omg10.com/4/10708142",
    "https://omg10.com/4/10692956", "https://omg10.com/4/10708149"
];

let balance = parseInt(localStorage.getItem('mistiBalance')) || 0;
const balanceDisplay = document.getElementById('balance');
const adGrid = document.getElementById('adGrid');
const tgBtn = document.getElementById('tgJoinBtn');

function updateUI() {
    balanceDisplay.innerText = balance;
    localStorage.setItem('mistiBalance', balance);
}

// Telegram Join - strictly once
function checkTgStatus() {
    if (localStorage.getItem('tgJoined')) {
        tgBtn.disabled = true;
        tgBtn.innerText = "জয়েন করেছেন (১০ টাকা যোগ হয়েছে)";
    }
}

function joinTelegram() {
    if (!localStorage.getItem('tgJoined')) {
        window.open("https://t.me/mistiam5", '_blank');
        balance += 10;
        localStorage.setItem('tgJoined', 'true');
        updateUI();
        checkTgStatus();
    }
}

// Ads Setup
adLinks.forEach((link, index) => {
    const adId = index + 1;
    const btn = document.createElement('button');
    btn.id = `adBtn${adId}`;
    btn.className = 'ad-btn';
    
    const lastClick = localStorage.getItem(`ad_${adId}_time`);
    const isLocked = lastClick && (Date.now() - lastClick < 24 * 60 * 60 * 1000);

    if (isLocked) {
        btn.disabled = true;
        btn.innerText = "দেখা শেষ";
    } else {
        btn.innerText = `অ্যাড ${adId}`;
        btn.onclick = () => {
            window.open(link, '_blank');
            let timeLeft = 300; 
            btn.disabled = true;
            const timer = setInterval(() => {
                let mins = Math.floor(timeLeft / 60);
                let secs = timeLeft % 60;
                btn.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    balance += 5;
                    localStorage.setItem(`ad_${adId}_time`, Date.now());
                    updateUI();
                    btn.innerText = "দেখা শেষ";
                }
                timeLeft--;
            }, 1000);
        };
    }
    adGrid.appendChild(btn);
});

function share(platform) {
    const msg = encodeURIComponent("মিষ্টি AM-এ জয়েন করুন: " + window.location.href);
    const url = platform === 'whatsapp' ? `https://wa.me/?text=${msg}` : `https://t.me/share/url?url=${msg}`;
    window.open(url, '_blank');
    // NO balance added for refer
}

updateUI();
checkTgStatus();
            
