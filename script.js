import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBWhYvIKGHfDO4NrH0G5N692FljzD_wmZc",
  authDomain: "misti-am.firebaseapp.com",
  projectId: "misti-am",
  storageBucket: "misti-am.firebasestorage.app",
  messagingSenderId: "335857181187",
  appId: "1:335857181187:web:ce34124f9daea3a4262436",
  measurementId: "G-2DEXZT0L85"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let userId = localStorage.getItem('mistiUserId') || "User_" + Math.floor(Math.random() * 1000000);
localStorage.setItem('mistiUserId', userId);

let balance = 0;
const balanceDisplay = document.getElementById('balance');
const adGrid = document.getElementById('adGrid');

// আপনার অ্যাড লিঙ্কসমূহ
const adLinks = [
    "https://omg10.com/4/10692959", "https://omg10.com/4/10708147", "https://omg10.com/4/10708152",
    "https://omg10.com/4/10708143", "https://omg10.com/4/10678359", "https://omg10.com/4/10692954",
    "https://omg10.com/4/10692953", "https://omg10.com/4/10708154", "https://omg10.com/4/10677665",
    "https://omg10.com/4/10692960", "https://omg10.com/4/10692961", "https://omg10.com/4/10692957",
    "https://omg10.com/4/10692955", "https://omg10.com/4/10708158", "https://omg10.com/4/10708156",
    "https://omg10.com/4/10708157", "https://omg10.com/4/10708145", "https://omg10.com/4/10708142",
    "https://omg10.com/4/10692956", "https://omg10.com/4/10708149"
];

// ডাটা লোড
get(ref(db, 'users/' + userId)).then((snapshot) => {
    if (snapshot.exists()) {
        balance = snapshot.val().balance || 0;
    } else {
        set(ref(db, 'users/' + userId), { balance: 0 });
    }
    if(balanceDisplay) balanceDisplay.innerText = balance;
});

function syncBalance() {
    update(ref(db, 'users/' + userId), { balance: balance });
    if(balanceDisplay) balanceDisplay.innerText = balance;
}

// অ্যাড বাটন (৫ মিনিট টাইমার + ২৪ ঘণ্টা লক)
if (adGrid) {
    adLinks.forEach((link, index) => {
        const adId = index + 1;
        const btn = document.createElement('button');
        btn.className = 'ad-btn';
        
        const lastClick = localStorage.getItem(`ad_${adId}_time`);
        const isLocked = lastClick && (Date.now() - lastClick < 24 * 60 * 60 * 1000);

        if (isLocked) {
            btn.disabled = true;
            btn.innerText = "দেখা শেষ";
            btn.style.background = "#ccc";
        } else {
            btn.innerText = `অ্যাড ${adId}`;
            btn.onclick = () => {
                window.open(link, '_blank');
                let timeLeft = 300; // ৫ মিনিট
                btn.disabled = true;
                const timer = setInterval(() => {
                    let mins = Math.floor(timeLeft / 60);
                    let secs = timeLeft % 60;
                    btn.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        balance += 5;
                        localStorage.setItem(`ad_${adId}_time`, Date.now());
                        syncBalance();
                        btn.innerText = "দেখা শেষ";
                        btn.style.background = "#ccc";
                    }
                    timeLeft--;
                }, 1000);
            };
        }
        adGrid.appendChild(btn);
    });
}

// টেলিগ্রাম বোনাস (একবার ক্লিক করলেই ব্ল্যাঙ্ক হবে)
if (localStorage.getItem('tgBonusClaimed') === 'true') {
    const tgSec = document.getElementById('tgJoinSection');
    if (tgSec) tgSec.style.display = 'none';
}

window.claimTelegramBonus = function() {
    window.open("https://t.me/mistiam5", '_blank');
    balance += 10;
    syncBalance();
    localStorage.setItem('tgBonusClaimed', 'true');
    const tgSec = document.getElementById('tgJoinSection');
    if (tgSec) tgSec.innerHTML = "";
    alert("১০ টাকা বোনাস যোগ হয়েছে!");
};

// রেফার অপশন (বোট লিঙ্ক শেয়ার হবে)
window.shareReferral = function() {
    const botLink = "https://t.me/mistiambot";
    const text = encodeURIComponent("মিষ্টি AM-এ জয়েন করে ইনকাম শুরু করুন! লিঙ্ক: " + botLink);
    window.open(`https://t.me/share/url?url=${botLink}&text=${text}`, '_blank');
};
              
