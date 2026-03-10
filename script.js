import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, update, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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

// আপনার অ্যাড লিঙ্কগুলো
const adLinks = [
    "https://omg10.com/4/10692959", "https://omg10.com/4/10708147", "https://omg10.com/4/10708152",
    "https://omg10.com/4/10708143", "https://omg10.com/4/10678359", "https://omg10.com/4/10692954",
    "https://omg10.com/4/10692953", "https://omg10.com/4/10708154", "https://omg10.com/4/10677665",
    "https://omg10.com/4/10692960", "https://omg10.com/4/10692961", "https://omg10.com/4/10692957",
    "https://omg10.com/4/10692955", "https://omg10.com/4/10708158", "https://omg10.com/4/10708156",
    "https://omg10.com/4/10708157", "https://omg10.com/4/10708145", "https://omg10.com/4/10708142",
    "https://omg10.com/4/10692956", "https://omg10.com/4/10708149"
];

// ব্যালেন্স লোড করা
get(ref(db, 'users/' + userId)).then((snapshot) => {
    if (snapshot.exists()) {
        balance = snapshot.val().balance || 0;
        balanceDisplay.innerText = balance;
    } else {
        set(ref(db, 'users/' + userId), { balance: 0 });
    }
});

// ব্যালেন্স আপডেট
function syncBalance() {
    update(ref(db, 'users/' + userId), { balance: balance });
    balanceDisplay.innerText = balance;
}

// অ্যাড বাটন তৈরি
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
        } else {
            btn.innerText = `অ্যাড ${adId}`;
            btn.onclick = () => {
                window.open(link, '_blank');
                let timer = 5; // ৫ সেকেন্ডের টাইমার
                btn.disabled = true;
                const interval = setInterval(() => {
                    btn.innerText = `অপেক্ষা করুন ${timer}s`;
                    if (timer <= 0) {
                        clearInterval(interval);
                        balance += 5;
                        localStorage.setItem(`ad_${adId}_time`, Date.now());
                        syncBalance();
                        btn.innerText = "দেখা শেষ";
                    }
                    timer--;
                }, 1000);
            };
        }
        adGrid.appendChild(btn);
    });
}

// উইথড্র ফাংশন
window.withdrawMoney = function() {
    const num = document.getElementById('withdrawNumber').value;
    const amount = parseInt(document.getElementById('withdrawAmount').value);
    const method = document.getElementById('paymentMethod').value;

    if (amount > balance || amount < 40) {
        alert("ব্যালেন্স কম বা সর্বনিম্ন ৪০ টাকা লাগবে।");
        return;
    }

    balance -= amount;
    syncBalance();

    push(ref(db, 'withdrawRequests'), {
        userId: userId,
        number: num,
        amount: amount,
        method: method,
        time: new Date().toLocaleString()
    }).then(() => alert("অনুরোধ পাঠানো হয়েছে!"));
};

window.share = (p) => {
    const url = encodeURIComponent(window.location.href);
    window.open(p === 'whatsapp' ? `https://wa.me/?text=${url}` : `https://t.me/share/url?url=${url}`);
};
              
