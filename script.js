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

// Check if user came from a referral link
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('ref') && !localStorage.getItem('isReferred')) {
    balance += 10;
    localStorage.setItem('isReferred', 'true');
    saveData();
}

function updateUI() {
    balanceDisplay.innerText = balance;
}

function saveData() {
    localStorage.setItem('mistiBalance', balance);
    updateUI();
}

// Ad Buttons setup
adLinks.forEach((link, index) => {
    const adId = index + 1;
    const btn = document.createElement('button');
    btn.id = `adBtn${adId}`;
    btn.className = 'ad-btn';
    
    const lastClick = localStorage.getItem(`ad_${adId}_time`);
    const isLocked = lastClick && (Date.now() - lastClick < 24 * 60 * 60 * 1000);

    if (isLocked) {
        btn.disabled = true;
        btn.innerText = "Done (24h)";
    } else {
        btn.innerText = `Ad ${adId}`;
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
                    saveData();
                    btn.innerText = "Done (24h)";
                }
                timeLeft--;
            }, 1000);
        };
    }
    adGrid.appendChild(btn);
});

// Telegram Join - Only once logic
const tgBtn = document.querySelector('.btn-join');
if (localStorage.getItem('tgJoined')) {
    tgBtn.disabled = true;
    tgBtn.innerText = "Joined (10 Taka Added)";
    tgBtn.style.background = "#9e9e9e";
}

function joinTelegram() {
    if (!localStorage.getItem('tgJoined')) {
        window.open("https://t.me/mistiam5", '_blank');
        balance += 10;
        localStorage.setItem('tgJoined', 'true');
        saveData();
        tgBtn.disabled = true;
        tgBtn.innerText = "Joined (10 Taka Added)";
        tgBtn.style.background = "#9e9e9e";
    }
}

// Refer Share (generates a ref link)
function share(platform) {
    const mySiteUrl = window.location.href.split('?')[0]; // Current URL
    const refLink = `${mySiteUrl}?ref=user123`; // Refer link structure
    const msg = encodeURIComponent("Misti AM-e join kore 10 taka bonus nin! Link: " + refLink);
    const url = platform === 'whatsapp' ? `https://wa.me/?text=${msg}` : `https://t.me/share/url?url=${msg}`;
    window.open(url, '_blank');
}

updateUI();
                                   
