// Apnar deya 20-ti Links
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
const adGrid = document.getElementById('adGrid');
const balanceDisplay = document.getElementById('balance');

// Balance Update UI
function updateUI() {
    balanceDisplay.innerText = balance;
    localStorage.setItem('mistiBalance', balance);
}

// 20-ti Ad Button toiri kora
adLinks.forEach((link, index) => {
    const adId = index + 1;
    const btn = document.createElement('button');
    btn.id = `adBtn${adId}`;
    btn.className = 'ad-btn';
    
    // Check 24 hour limit logic
    const lastClick = localStorage.getItem(`ad_${adId}_time`);
    const isLocked = lastClick && (Date.now() - lastClick < 24 * 60 * 60 * 1000);

    if (isLocked) {
        btn.disabled = true;
        btn.innerText = "Done (24h)";
    } else {
        btn.innerText = `Ad ${adId}`;
        btn.onclick = () => startAdProcess(adId, link);
    }
    adGrid.appendChild(btn);
});

function startAdProcess(id, link) {
    const btn = document.getElementById(`adBtn${id}`);
    window.open(link, '_blank'); // Link open hobe
    
    let timeLeft = 300; // 5 minute = 300 seconds
    btn.disabled = true;

    const timer = setInterval(() => {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        btn.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            balance += 5;
            localStorage.setItem(`ad_${id}_time`, Date.now()); // Save click time
            updateUI();
            btn.innerText = "Done (24h)";
        }
        timeLeft--;
    }, 1000);
}

function joinTelegram() {
    window.open("https://t.me/mistiam5", '_blank');
    if (!localStorage.getItem('tgJoined')) {
        balance += 10;
        localStorage.setItem('tgJoined', 'true');
        updateUI();
    }
}

function share(platform) {
    const shareText = encodeURIComponent("Misti AM-e ad dekhe income korun! Join: https://t.me/mistiam5");
    const url = platform === 'whatsapp' ? `https://wa.me/?text=${shareText}` : `https://t.me/share/url?url=${shareText}`;
    window.open(url, '_blank');
    
    // Referral bonus (click korlei 10 taka)
    balance += 10;
    updateUI();
}

// Initial UI load
updateUI();
                
