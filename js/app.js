/**
 * PrintSwift | Peer-to-Peer Student Printing Platform
 * UNIMAS (Universiti Malaysia Sarawak) Class Activity 2026
 * Core Application Engine & State Management
 */

// --- AUDIO FEEDBACK (Web Audio API Synthesizer) ---
class SoundManager {
    constructor() {
        this.ctx = null;
    }
    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.ctx = new AudioContext();
        }
    }
    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
        try {
            this.init();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio policy fallback
        }
    }
    success() {
        this.playTone(523.25, 'triangle', 0.12, 0.12);
        setTimeout(() => this.playTone(659.25, 'triangle', 0.15, 0.12), 100);
        setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.15), 200);
    }
    pop() {
        this.playTone(440, 'sine', 0.08, 0.08);
    }
    alert() {
        this.playTone(330, 'sawtooth', 0.15, 0.1);
        setTimeout(() => this.playTone(311.13, 'sawtooth', 0.25, 0.1), 120);
    }
}
const sounds = new SoundManager();

// --- INITIAL STATE ---
const DEFAULT_STATE = {
    role: 'student', // 'student' | 'vendor'
    studentTab: 'home', // 'home' | 'upload' | 'orders' | 'chat'
    vendorTab: 'dashboard', // 'dashboard' | 'slots' | 'settings'
    deviceMode: 'mobile', // 'mobile' | 'fullscreen'
    vendorOnline: true,
    walletBalance: 25.00,
    vendorEarnings: 24.60,
    searchQuery: '',
    collegeFilter: 'All', // 'All' | 'KBR' | 'KTR' | 'KSA' | 'Holiday'
    selectedVendorId: 1,
    activeChatVendorId: 1,
    uploadStep: 1, // 1: Document & Specs, 2: Slot & Pickup, 3: Escrow Payment
    orderForm: {
        fileName: 'TMC2013_Group18_FinalReport.pdf',
        fileSize: '1.4 MB',
        pages: 14,
        colorMode: 'bw', // 'bw' | 'color'
        copies: 1,
        doubleSided: true,
        stapleBind: false,
        autoDelete: true,
        slot: 'Tonight, 11:45 PM - 12:00 AM',
        pickupPoint: 'Kolej Bunga Raya • Block B Lobby',
        paymentMethod: 'DuitNow QR',
        notes: ''
    },
    vendors: [
        {
            id: 1,
            name: 'Amirul Anas',
            code: 'KBR',
            matric: '98124',
            college: 'Kolej Bunga Raya • Block B',
            distance: '2 mins walk',
            printer: 'Canon PIXMA G3020 (80gsm A4 EcoTank)',
            bwPrice: 0.15,
            colorPrice: 0.50,
            rating: 4.9,
            reviewsCount: 42,
            topVendor: true,
            holidayAvailable: true,
            slots: ['Tonight, 11:45 PM - 12:00 AM', 'Tonight, 12:15 AM - 12:30 AM', 'Tomorrow, 7:30 AM - 8:00 AM'],
            status: 'Open Late Night',
            recentReviews: [
                { user: 'Raynold K.', text: 'Printed my 20-page lab report at 11:50 PM. Super crisp!', stars: 5 },
                { user: 'Siti A.', text: 'Fast reply and file auto-deleted right after pickup.', stars: 5 }
            ]
        },
        {
            id: 2,
            name: 'Calvin Joseph',
            code: 'KTR',
            matric: '98387',
            college: 'Kolej Tun Razak • Neutral Point',
            distance: '5 mins walk',
            printer: 'HP Smart Tank 580 + Comb Binder',
            bwPrice: 0.20,
            colorPrice: 0.60,
            rating: 4.8,
            reviewsCount: 29,
            topVendor: true,
            holidayAvailable: true,
            slots: ['Tonight, 12:00 AM - 12:15 AM', 'Tomorrow, 8:00 AM - 8:30 AM', 'Public Holiday Slot (10:00 AM)'],
            status: 'Open Late Night',
            recentReviews: [
                { user: 'Hafiz M.', text: 'Saved my scholarship form deadline before 8 AM class.', stars: 5 }
            ]
        },
        {
            id: 3,
            name: 'Arif Wajdi',
            code: 'KSA',
            matric: '82651',
            college: 'Kolej Sakura • Main Gate',
            distance: '7 mins walk',
            printer: 'Epson EcoTank L3250',
            bwPrice: 0.18,
            colorPrice: 0.55,
            rating: 4.7,
            reviewsCount: 18,
            topVendor: false,
            holidayAvailable: false,
            slots: ['Tomorrow, 7:00 AM - 7:30 AM', 'Tomorrow, 8:15 AM - 8:45 AM'],
            status: 'Early Bird Slot',
            recentReviews: [
                { user: 'Nurul I.', text: 'Clean color charts and easy meetup at Sakura gate.', stars: 5 }
            ]
        },
        {
            id: 4,
            name: 'Raynold Kabai',
            code: 'KBR',
            matric: '100853',
            college: 'Kolej Bunga Raya • Block D',
            distance: '3 mins walk',
            printer: 'Brother DCP-T420W Duplex',
            bwPrice: 0.16,
            colorPrice: 0.50,
            rating: 4.9,
            reviewsCount: 35,
            topVendor: true,
            holidayAvailable: true,
            slots: ['Tonight, 12:30 AM - 12:45 AM', 'Public Holiday All-Day Pass'],
            status: '24/7 Exam Week',
            recentReviews: [
                { user: 'Daniel L.', text: 'Best duplex print quality in KBR! Staple and folder included.', stars: 5 }
            ]
        }
    ],
    orders: [
        {
            id: 'PS-2026-884',
            pickupCode: '8842',
            studentName: 'Luqman Najib (99544)',
            vendorId: 1,
            vendorName: 'Amirul Anas (KBR)',
            fileName: 'Lab_Sheet_Week9.pdf',
            pages: 6,
            copies: 1,
            colorMode: 'bw',
            doubleSided: false,
            total: 1.10,
            slot: 'Tonight, 11:30 PM',
            pickup: 'Kolej Bunga Raya • Block B Lobby',
            status: 'ready', // 'paid_escrow' | 'printing' | 'ready' | 'completed' | 'reprint_requested'
            autoDelete: true,
            fileDeleted: false,
            rated: false,
            reprintReason: ''
        }
    ],
    chats: {
        1: [
            { sender: 'vendor', text: 'Hi! Got your PDF. Printing on Canon PIXMA now, sharp & clean.', time: '23:36' },
            { sender: 'student', text: 'Thanks bro! Saved my deadline. Heading down to Block B lobby in 5 mins.', time: '23:38' },
            { sender: 'vendor', text: 'Ready at the lobby table! Show code #8842 or tap Confirm Pick-Up.', time: '23:40' }
        ],
        2: [
            { sender: 'vendor', text: 'Hey! I have slots open until 1 AM tonight if you need binding too.', time: '22:15' }
        ],
        3: [
            { sender: 'vendor', text: 'Morning slots start at 7:00 AM sharp at Sakura Main Gate!', time: '21:00' }
        ],
        4: [
            { sender: 'vendor', text: 'Available all weekend & public holidays at KBR Block D.', time: '20:40' }
        ]
    },
    vendorSlots: [
        { time: '11:30 PM - 12:00 AM (Late Night)', active: true },
        { time: '12:00 AM - 12:30 AM (Late Night)', active: true },
        { time: '07:30 AM - 08:30 AM (Early Morning)', active: true },
        { time: 'Public Holiday All-Day Pass', active: true }
    ]
};

// --- STATE PERSISTENCE ---
const STORAGE_KEY = 'printswift_unimas_v2';
function loadSavedState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return { ...DEFAULT_STATE, ...parsed };
        }
    } catch (e) {
        console.warn('Failed to parse state from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

let state = loadSavedState();

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('Failed to save state:', e);
    }
}

function resetDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    showNotification('Demo data reset to factory state!');
    sounds.pop();
    render();
}

// --- NOTIFICATIONS & MODALS ---
function showNotification(msg) {
    const box = document.getElementById('toast-box');
    const txt = document.getElementById('toast-text');
    if (!box || !txt) return;
    txt.textContent = msg;
    box.classList.remove('hidden');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(hideNotification, 3800);
}

function hideNotification() {
    const box = document.getElementById('toast-box');
    if (box) box.classList.add('hidden');
}

function openModal(htmlContent) {
    const modal = document.getElementById('app-modal');
    const body = document.getElementById('app-modal-body');
    if (!modal || !body) return;
    body.innerHTML = htmlContent;
    modal.classList.remove('hidden');
    lucide.createIcons();
}

function closeModal() {
    const modal = document.getElementById('app-modal');
    if (modal) modal.classList.add('hidden');
}

// --- PRICING & CALCULATIONS ---
function calculateOrderTotal() {
    const vendor = state.vendors.find(v => v.id === state.selectedVendorId) || state.vendors[0];
    const rate = state.orderForm.colorMode === 'bw' ? vendor.bwPrice : vendor.colorPrice;
    const effectiveSheets = state.orderForm.doubleSided ? Math.ceil(state.orderForm.pages / 2) : state.orderForm.pages;
    const printCost = effectiveSheets * state.orderForm.copies * rate;
    const finishingCost = state.orderForm.stapleBind ? 0.50 : 0.00;
    const platformFee = 0.20; // PrintSwift platform escrow guarantee
    return {
        rate,
        effectiveSheets,
        printCost: printCost.toFixed(2),
        finishingCost: finishingCost.toFixed(2),
        platformFee: platformFee.toFixed(2),
        total: (printCost + finishingCost + platformFee).toFixed(2)
    };
}

// --- ROLE & NAVIGATION ---
function switchRole(role) {
    sounds.pop();
    state.role = role;
    saveState();

    const pillStudent = document.getElementById('pill-student');
    const pillVendor = document.getElementById('pill-vendor');
    const subtitle = document.getElementById('header-subtitle');

    if (role === 'student') {
        if (pillStudent) pillStudent.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-lime-300 text-slate-900 transition shadow-xs';
        if (pillVendor) pillVendor.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold text-blue-100 hover:text-white transition';
        if (subtitle) subtitle.textContent = 'Kolej Bunga Raya • 4 Vendors Online';
        showNotification('Switched to Student Printing View');
    } else {
        if (pillVendor) pillVendor.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-500 text-white transition shadow-xs';
        if (pillStudent) pillStudent.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold text-blue-100 hover:text-white transition';
        if (subtitle) subtitle.textContent = 'Vendor Desk • Amirul Anas (Top Vendor)';
        showNotification('Switched to Student Vendor Portal');
    }
    render();
}

function setStudentTab(tab) {
    sounds.pop();
    state.studentTab = tab;
    saveState();
    render();
}

function setVendorTab(tab) {
    sounds.pop();
    state.vendorTab = tab;
    saveState();
    render();
}

// --- INTERACTIVE MODALS (Vendor Profile, QR Pickup, Reprint, Wallet, Profile) ---
function openVendorProfile(vendorId) {
    sounds.pop();
    const v = state.vendors.find(x => x.id === vendorId);
    if (!v) return;
    openModal(`
        <div class="flex items-start justify-between">
            <div>
                <div class="flex items-center gap-1.5">
                    <h3 class="text-base font-extrabold text-slate-900">${v.name}</h3>
                    ${v.topVendor ? '<span class="px-2 py-0.5 bg-lime-200 text-slate-900 text-[10px] font-extrabold rounded-md flex items-center gap-1"><i data-lucide="award" class="w-3 h-3"></i> TOP VENDOR</span>' : ''}
                </div>
                <p class="text-xs text-slate-500">Verified UNIMAS Student • Matric ${v.matric}</p>
            </div>
            <button onclick="closeModal()" class="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>

        <div class="bg-slate-50 p-3.5 rounded-2xl space-y-1.5 text-xs border border-slate-100">
            <div class="flex justify-between"><span class="text-slate-500">College & Block:</span><span class="font-bold text-slate-800">${v.college}</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Printer Hardware:</span><span class="font-bold text-slate-800">${v.printer}</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Rates:</span><span class="font-bold text-blue-600">RM${v.bwPrice.toFixed(2)} B&W • RM${v.colorPrice.toFixed(2)} Color</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Average Turnaround:</span><span class="font-bold text-emerald-600">&lt; 15 minutes</span></div>
        </div>

        <div>
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">Student Reviews (${v.reviewsCount})</h4>
            <div class="space-y-2">
                ${v.recentReviews.map(r => `
                    <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div class="flex justify-between font-bold text-slate-800 mb-0.5">
                            <span>${r.user}</span>
                            <span class="text-amber-500">${'★'.repeat(r.stars)}</span>
                        </div>
                        <p class="text-slate-600 text-[11px]">"${r.text}"</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="flex gap-2 pt-1">
            <button onclick="closeModal(); openVendorChat(${v.id});" class="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl flex items-center gap-1.5 transition">
                <i data-lucide="message-circle" class="w-4 h-4"></i> Chat
            </button>
            <button onclick="closeModal(); selectVendorAndBook(${v.id});" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-sm transition">
                Book Print Slot
            </button>
        </div>
    `);
}

function openPickupVerificationModal(orderId) {
    sounds.pop();
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;
    openModal(`
        <div class="flex items-center justify-between">
            <h3 class="text-base font-extrabold text-slate-900">Verify Pick-Up & Release</h3>
            <button onclick="closeModal()" class="p-1.5 rounded-full bg-slate-100 text-slate-500"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>

        <div class="bg-slate-900 text-white p-4 rounded-3xl text-center space-y-2.5 relative overflow-hidden">
            <p class="text-[11px] text-slate-300">Show this Pick-Up PIN or scan vendor QR at <span class="text-lime-300 font-bold">${order.pickup}</span></p>
            
            <!-- Real QR Canvas Container -->
            <div class="relative w-36 h-36 mx-auto bg-white rounded-2xl p-2 flex items-center justify-center shadow-lg">
                <div id="pickup-qr-container" class="w-full h-full flex items-center justify-center"></div>
                <div class="animate-scanline absolute left-2 right-2 h-0.5 bg-pink-500 shadow-[0_0_8px_#ec4899]"></div>
            </div>

            <div class="text-2xl font-black tracking-[0.25em] text-lime-300 pt-0.5">#${order.pickupCode}</div>
            <p class="text-[10px] text-slate-400">Order: ${order.id} • ${order.fileName}</p>
        </div>

        <div class="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i>
            <span>Confirming pick-up releases <strong>RM${order.total.toFixed(2)}</strong> from escrow to vendor and triggers <strong>immediate file auto-deletion</strong>.</span>
        </div>

        <div class="flex gap-2">
            <button onclick="openReprintModal('${order.id}')" class="px-3.5 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-2xl transition">
                Print Issue?
            </button>
            <button onclick="confirmPickup('${order.id}');" class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center justify-center gap-1.5">
                <i data-lucide="check" class="w-4 h-4"></i> Confirm Handover
            </button>
        </div>
    `);

    // Generate Dynamic QR Code
    setTimeout(() => {
        const qrBox = document.getElementById('pickup-qr-container');
        if (qrBox && typeof QRCode !== 'undefined') {
            qrBox.innerHTML = '';
            new QRCode(qrBox, {
                text: `PRINTSWIFT:${order.id}:${order.pickupCode}:RM${order.total}`,
                width: 120,
                height: 120,
                colorDark: '#0f172a',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
        }
    }, 50);
}

function openReprintModal(orderId) {
    sounds.alert();
    openModal(`
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
                <i data-lucide="shield-alert" class="w-5 h-5 text-rose-600"></i>
                <h3 class="text-base font-extrabold text-slate-900">PrintSwift Reprint Guarantee</h3>
            </div>
            <button onclick="closeModal()" class="p-1.5 rounded-full bg-slate-100 text-slate-500"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <p class="text-xs text-slate-600">Your escrow payment stays frozen until you get clean, readable pages. Select the issue with this print:</p>
        <div class="space-y-2 text-xs">
            ${[
                'Smudged / Low Ink Quality (Canon/Epson refill needed)',
                'Missing or Cut-Off Pages (Page numbering error)',
                'Wrong Print Settings (Expected Color, got B&W / Duplex error)'
            ].map(reason => `
                <button onclick="submitReprintClaim('${orderId}', '${reason}')" class="w-full p-3 text-left font-bold rounded-2xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50 transition flex items-center justify-between">
                    <span>${reason}</span>
                    <i data-lucide="arrow-right" class="w-4 h-4 text-rose-600 shrink-0"></i>
                </button>
            `).join('')}
        </div>
    `);
}

function submitReprintClaim(orderId, reason) {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'reprint_requested';
        order.reprintReason = reason;
        saveState();
    }
    closeModal();
    sounds.alert();
    showNotification('Reprint Guarantee triggered! Escrow held & vendor alerted.');
    render();
}

function openRatingModal(orderId) {
    sounds.pop();
    openModal(`
        <div class="flex items-center justify-between">
            <h3 class="text-base font-extrabold text-slate-900">Rate Student Vendor</h3>
            <button onclick="closeModal()" class="p-1.5 rounded-full bg-slate-100 text-slate-500"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <p class="text-xs text-slate-600">Two-way ratings help top student vendors earn their badge and priority listing.</p>
        <div class="flex justify-center gap-2 py-3">
            ${[1, 2, 3, 4, 5].map(s => `
                <button onclick="rateOrder('${orderId}', ${s}); closeModal();" class="w-12 h-12 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-500 font-black text-base flex flex-col items-center justify-center transition shadow-xs">
                    <span>${s}★</span>
                </button>
            `).join('')}
        </div>
        <p class="text-[11px] text-center text-slate-400">100% peer verified on UNIMAS campus network</p>
    `);
}

function openWalletModal() {
    sounds.pop();
    openModal(`
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
                <i data-lucide="wallet" class="w-5 h-5 text-blue-600"></i>
                <h3 class="text-base font-extrabold text-slate-900">Campus E-Wallet & DuitNow</h3>
            </div>
            <button onclick="closeModal()" class="p-1.5 rounded-full bg-slate-100 text-slate-500"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-2xl shadow-md">
            <span class="text-[11px] text-blue-100">Available Campus Balance</span>
            <div class="text-3xl font-black mt-0.5">RM${state.walletBalance.toFixed(2)}</div>
            <div class="flex items-center gap-2 mt-2 pt-2 border-t border-blue-400/40 text-[10px] text-lime-300 font-semibold">
                <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                <span>Linked: DuitNow QR • Touch 'n Go • Maybank2u</span>
            </div>
        </div>
        <div class="space-y-1.5">
            <label class="text-[11px] font-bold text-slate-600">Quick Top Up via DuitNow</label>
            <div class="grid grid-cols-3 gap-2">
                ${[5, 10, 20].map(amt => `
                    <button onclick="topUpWallet(${amt})" class="py-2.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-extrabold text-xs rounded-xl border border-slate-200 transition">
                        + RM${amt}
                    </button>
                `).join('')}
            </div>
        </div>
    `);
}

function topUpWallet(amount) {
    state.walletBalance += amount;
    saveState();
    sounds.success();
    const balanceElem = document.getElementById('wallet-balance-header');
    if (balanceElem) balanceElem.textContent = `RM${state.walletBalance.toFixed(2)}`;
    closeModal();
    showNotification(`Topped up RM${amount.toFixed(2)} via DuitNow QR!`);
    render();
}

function openProfileModal() {
    sounds.pop();
    openModal(`
        <div class="flex items-center justify-between">
            <h3 class="text-base font-extrabold text-slate-900">UNIMAS Student Identity</h3>
            <button onclick="closeModal()" class="p-1.5 rounded-full bg-slate-100 text-slate-500"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
            <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                    RK
                </div>
                <div>
                    <div class="font-extrabold text-slate-900 text-sm">Raynold Kabai</div>
                    <div class="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <i data-lucide="badge-check" class="w-3.5 h-3.5 text-emerald-600"></i> 100853@siswa.unimas.my
                    </div>
                </div>
            </div>
            <div class="pt-2 border-t border-slate-200 flex justify-between text-[11px]">
                <span class="text-slate-500">Residential College:</span>
                <span class="font-bold text-slate-800">Kolej Bunga Raya (Block D)</span>
            </div>
            <div class="flex justify-between text-[11px]">
                <span class="text-slate-500">Faculty:</span>
                <span class="font-bold text-slate-800">Faculty of Computer Science (FCSIT)</span>
            </div>
            <div class="flex justify-between text-[11px]">
                <span class="text-slate-500">Trust Score:</span>
                <span class="font-bold text-amber-600">5.0 ★ (100% on-time pickup)</span>
            </div>
        </div>

        <button onclick="closeModal(); switchRole(state.role === 'student' ? 'vendor' : 'student');" class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition">
            Switch to ${state.role === 'student' ? 'Student Vendor Portal' : 'Student Printing View'}
        </button>
    `);
}

// --- STUDENT FLOW ACTIONS ---
function selectVendorAndBook(vendorId) {
    sounds.pop();
    state.selectedVendorId = vendorId;
    const v = state.vendors.find(x => x.id === vendorId);
    if (v && v.slots.length > 0) {
        state.orderForm.slot = v.slots[0];
        state.orderForm.pickupPoint = v.college + ' Lobby';
    }
    state.uploadStep = 1;
    state.studentTab = 'upload';
    saveState();
    render();
}

function openVendorChat(vendorId) {
    sounds.pop();
    state.activeChatVendorId = vendorId;
    state.studentTab = 'chat';
    saveState();
    render();
}

function triggerRealFileUpload() {
    sounds.pop();
    const input = document.getElementById('real-file-input');
    if (input) input.click();
}

function handleRealFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const estimatedPages = Math.max(1, Math.min(80, Math.round(file.size / 45000) || 8));
    state.orderForm.fileName = file.name;
    state.orderForm.fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    state.orderForm.pages = estimatedPages;
    saveState();
    sounds.pop();
    showNotification(`Uploaded "${file.name}" (${estimatedPages} pages detected)`);
    render();
}

function cycleSampleFile() {
    sounds.pop();
    const samples = [
        { name: 'FYP_Proposal_Draft_v3.pdf', size: '2.1 MB', pages: 22 },
        { name: 'Scholarship_Application_Form.pdf', size: '0.6 MB', pages: 4 },
        { name: 'Exam_Revision_Notes_LU4.pdf', size: '1.8 MB', pages: 18 },
        { name: 'TMC2013_Group18_FinalReport.pdf', size: '1.4 MB', pages: 14 }
    ];
    const idx = samples.findIndex(s => s.name === state.orderForm.fileName);
    const next = samples[(idx + 1) % samples.length];
    state.orderForm.fileName = next.name;
    state.orderForm.fileSize = next.size;
    state.orderForm.pages = next.pages;
    saveState();
    showNotification(`Loaded sample "${next.name}" (${next.pages} pages)`);
    render();
}

function submitOrder() {
    const vendor = state.vendors.find(v => v.id === state.selectedVendorId) || state.vendors[0];
    const pricing = calculateOrderTotal();
    const totalNum = parseFloat(pricing.total);

    if (state.orderForm.paymentMethod === 'Campus E-Wallet') {
        if (state.walletBalance < totalNum) {
            sounds.alert();
            showNotification('Insufficient wallet balance. Top up or use DuitNow QR!');
            return;
        }
        state.walletBalance -= totalNum;
        const balanceElem = document.getElementById('wallet-balance-header');
        if (balanceElem) balanceElem.textContent = `RM${state.walletBalance.toFixed(2)}`;
    }

    const newOrder = {
        id: 'PS-2026-' + Math.floor(100 + Math.random() * 900),
        pickupCode: Math.floor(1000 + Math.random() * 9000).toString(),
        studentName: 'Raynold Kabai (100853)',
        vendorId: vendor.id,
        vendorName: `${vendor.name} (${vendor.code})`,
        fileName: state.orderForm.fileName,
        pages: state.orderForm.pages,
        copies: state.orderForm.copies,
        colorMode: state.orderForm.colorMode,
        doubleSided: state.orderForm.doubleSided,
        total: totalNum,
        slot: state.orderForm.slot,
        pickup: state.orderForm.pickupPoint,
        status: 'paid_escrow',
        autoDelete: state.orderForm.autoDelete,
        fileDeleted: false,
        rated: false,
        reprintReason: ''
    };

    state.orders.unshift(newOrder);
    if (!state.chats[vendor.id]) state.chats[vendor.id] = [];
    state.chats[vendor.id].push({
        sender: 'student',
        text: `Sent "${newOrder.fileName}" (${newOrder.pages} pgs) for slot ${newOrder.slot}. Pick-up at ${newOrder.pickup}.`,
        time: 'Now'
    });

    state.uploadStep = 1;
    state.studentTab = 'orders';
    saveState();
    sounds.success();
    showNotification(`RM${pricing.total} held in Escrow! Sent to ${vendor.name}.`);
    render();
}

function confirmPickup(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'completed';
        if (order.autoDelete) {
            order.fileDeleted = true;
        }
        state.vendorEarnings += (order.total - 0.20);
        saveState();
        closeModal();
        sounds.success();

        // Confetti celebration
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 65,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        showNotification('Pick-up verified! Escrow released & file permanently wiped.');
        render();
    }
}

function rateOrder(orderId, stars = 5) {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
        order.rated = true;
        order.ratingGiven = stars;
        saveState();
        sounds.success();
        showNotification(`Submitted ${stars}★ rating! Thank you for supporting peer vendors.`);
        render();
    }
}

function sendChatMessage(quickText = null) {
    const input = document.getElementById('chat-input');
    const text = quickText || (input ? input.value.trim() : '');
    if (!text) return;

    sounds.pop();
    const vid = state.activeChatVendorId;
    const vendor = state.vendors.find(v => v.id === vid) || state.vendors[0];

    if (!state.chats[vid]) state.chats[vid] = [];
    state.chats[vid].push({ sender: 'student', text, time: '23:44' });
    if (input) input.value = '';
    saveState();
    render();

    // Humanized student peer responses
    let humanizedReply = '';
    const lower = text.toLowerCase();

    if (lower.includes('staple')) {
        humanizedReply = `No problem bro, gotchu! I'll corner-staple it and slip it into a clean clear folder for you 👍. Printing the last few pages now!`;
    } else if (lower.includes('on my way') || lower.includes('down') || lower.includes('coming')) {
        humanizedReply = `All good! Take your time bro, I'm already waiting at the ${vendor.code || 'hostel'} lobby table near the stairs. See you in a bit!`;
    } else if (lower.includes('meet') || lower.includes('where') || lower.includes('lobby')) {
        humanizedReply = `Yup, meet me at the ground floor lobby study table! Just bring your 4-digit PIN (#8842) or phone to verify.`;
    } else if (lower.includes('color') || lower.includes('colour') || lower.includes('black')) {
        humanizedReply = `Checked your specs! Colors are coming out super vibrant on the EcoTank. Looking really sharp!`;
    } else if (lower.includes('urgent') || lower.includes('deadline') || lower.includes('fast') || lower.includes('quick')) {
        humanizedReply = `Don't worry bro, I know the deadline panic haha! High-speed duplex printing is running now, done in 2 mins.`;
    } else {
        humanizedReply = `Got it bro! Printing right now—pages are looking crisp. I'll ping you the second it's ready on the table!`;
    }

    setTimeout(() => {
        state.chats[vid].push({
            sender: 'vendor',
            text: humanizedReply,
            time: '23:45'
        });
        sounds.pop();
        saveState();
        if (state.studentTab === 'chat') render();
    }, 800);
}

// --- VENDOR FLOW ACTIONS ---
function toggleVendorOnline() {
    sounds.pop();
    state.vendorOnline = !state.vendorOnline;
    saveState();
    showNotification(state.vendorOnline ? 'You are ONLINE for late-night print slots.' : 'You are OFFLINE.');
    render();
}

function toggleSlot(index) {
    sounds.pop();
    state.vendorSlots[index].active = !state.vendorSlots[index].active;
    saveState();
    render();
}

function advanceOrderStatus(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;
    if (order.status === 'paid_escrow' || order.status === 'reprint_requested') {
        order.status = 'printing';
        sounds.pop();
        showNotification(`Printing "${order.fileName}" via encrypted viewer...`);
    } else if (order.status === 'printing') {
        order.status = 'ready';
        sounds.success();
        showNotification(`Marked READY! Student notified for pick-up at ${order.pickup}`);
    }
    saveState();
    render();
}

// --- RENDER STUDENT VIEWS ---
function renderStudentHome() {
    const activeOrder = state.orders.find(o => o.status !== 'completed');
    const filteredVendors = state.vendors.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                              v.college.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchesFilter = state.collegeFilter === 'All' ||
                              (state.collegeFilter === 'Holiday' ? v.holidayAvailable : v.code === state.collegeFilter);
        return matchesSearch && matchesFilter;
    });

    return `
        <!-- Action Hero Banner -->
        <div class="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-4 rounded-3xl shadow-lg relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl"></div>
            <div class="flex items-center justify-between mb-1.5 relative z-10">
                <span class="px-2.5 py-0.5 rounded-full bg-lime-300 text-slate-900 text-[10px] font-black uppercase tracking-wide">
                    Campus Shops Closed • 24/7
                </span>
                <span class="text-[11px] text-blue-200 flex items-center gap-1 font-semibold">
                    <i data-lucide="moon" class="w-3.5 h-3.5 text-lime-300"></i> Late Night Active
                </span>
            </div>
            <h2 class="text-base font-extrabold leading-snug relative z-10">Print any hour with a student next door</h2>
            <p class="text-[11px] text-slate-300 mt-0.5 mb-3 relative z-10">Book a dorm slot, hold in escrow, and auto-delete after pickup.</p>
            <div class="flex gap-2 relative z-10">
                <button onclick="setStudentTab('upload')" class="flex-1 py-2.5 px-3 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-95">
                    <i data-lucide="upload-cloud" class="w-4 h-4"></i> Quick Print
                </button>
                <button onclick="setStudentTab('orders')" class="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition flex items-center gap-1.5 active:scale-95">
                    <i data-lucide="clock" class="w-4 h-4 text-lime-300"></i> Track (${state.orders.length})
                </button>
            </div>
        </div>

        ${activeOrder ? `
        <!-- Live Order Status Pill -->
        <div onclick="setStudentTab('orders')" class="cursor-pointer bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between hover:bg-amber-100/70 transition shadow-xs">
            <div class="flex items-center gap-2.5 overflow-hidden">
                <div class="w-8 h-8 rounded-xl bg-amber-400/25 text-amber-800 flex items-center justify-center shrink-0">
                    <i data-lucide="printer" class="w-4 h-4"></i>
                </div>
                <div class="truncate">
                    <div class="text-xs font-extrabold text-slate-900 truncate">${activeOrder.fileName}</div>
                    <p class="text-[11px] text-amber-800 font-medium truncate">
                        ${activeOrder.status === 'ready' ? 'Ready! Tap to show PIN #' + activeOrder.pickupCode : 'In progress • ' + activeOrder.vendorName}
                    </p>
                </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-amber-700 shrink-0"></i>
        </div>
        ` : ''}

        <!-- Search & College Filter Chips -->
        <div class="space-y-2">
            <div class="relative">
                <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5"></i>
                <input type="text" value="${state.searchQuery}" oninput="state.searchQuery=this.value; render()" placeholder="Search college, hostel block, or vendor..." class="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs">
            </div>
            <div class="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                ${[
                    { id: 'All', label: 'All Campus' },
                    { id: 'KBR', label: 'Kolej Bunga Raya' },
                    { id: 'KTR', label: 'Kolej Tun Razak' },
                    { id: 'KSA', label: 'Kolej Sakura' },
                    { id: 'Holiday', label: 'Public Holiday' }
                ].map(f => `
                    <button onclick="state.collegeFilter='${f.id}'; sounds.pop(); render()" class="px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition shadow-xs ${state.collegeFilter === f.id ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}">
                        ${f.label}
                    </button>
                `).join('')}
            </div>
        </div>

        <!-- Vendor List -->
        <div class="space-y-2.5">
            ${filteredVendors.map(v => `
                <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition">
                    <div class="flex justify-between items-start mb-2">
                        <div onclick="openVendorProfile(${v.id})" class="cursor-pointer">
                            <div class="flex items-center gap-1.5">
                                <span class="font-extrabold text-sm text-slate-900 hover:text-blue-600">${v.name}</span>
                                ${v.topVendor ? `<span class="px-1.5 py-0.5 bg-lime-200 text-slate-900 text-[9px] font-extrabold rounded-md flex items-center gap-0.5"><i data-lucide="award" class="w-2.5 h-2.5"></i> TOP</span>` : ''}
                            </div>
                            <p class="text-[11px] text-slate-500">${v.college} • <span class="text-blue-600 font-semibold">${v.distance}</span></p>
                        </div>
                        <div class="text-right">
                            <div class="text-xs font-extrabold text-slate-900">RM${v.bwPrice.toFixed(2)}<span class="text-[10px] font-normal text-slate-500">/pg</span></div>
                            <div class="text-[11px] font-semibold text-amber-500 flex items-center justify-end gap-0.5">
                                <i data-lucide="star" class="w-3 h-3 fill-amber-400 text-amber-400"></i> ${v.rating} (${v.reviewsCount})
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between pt-2 border-t border-slate-100 gap-1.5">
                        <span class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${v.status}
                        </span>
                        <div class="flex items-center gap-1.5">
                            <button onclick="openVendorProfile(${v.id})" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl transition">
                                Reviews
                            </button>
                            <button onclick="selectVendorAndBook(${v.id})" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition shadow-xs active:scale-95">
                                Book Slot
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderStudentUpload() {
    const vendor = state.vendors.find(v => v.id === state.selectedVendorId) || state.vendors[0];
    const pricing = calculateOrderTotal();

    return `
        <!-- Stepper -->
        <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            <div class="flex items-center justify-between text-[10px] font-bold">
                <button onclick="state.uploadStep=1; sounds.pop(); render()" class="flex items-center gap-1 ${state.uploadStep >= 1 ? 'text-blue-600' : 'text-slate-400'}">
                    <span class="w-5 h-5 rounded-full ${state.uploadStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'} flex items-center justify-center">1</span>
                    Document
                </button>
                <div class="h-0.5 flex-1 mx-2 ${state.uploadStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'}"></div>
                <button onclick="state.uploadStep=2; sounds.pop(); render()" class="flex items-center gap-1 ${state.uploadStep >= 2 ? 'text-blue-600' : 'text-slate-400'}">
                    <span class="w-5 h-5 rounded-full ${state.uploadStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'} flex items-center justify-center">2</span>
                    Slot & Meetup
                </button>
                <div class="h-0.5 flex-1 mx-2 ${state.uploadStep >= 3 ? 'bg-blue-600' : 'bg-slate-200'}"></div>
                <button onclick="state.uploadStep=3; sounds.pop(); render()" class="flex items-center gap-1 ${state.uploadStep >= 3 ? 'text-blue-600' : 'text-slate-400'}">
                    <span class="w-5 h-5 rounded-full ${state.uploadStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200'} flex items-center justify-center">3</span>
                    Escrow Pay
                </button>
            </div>
        </div>

        ${state.uploadStep === 1 ? `
            <div class="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3.5">
                <div class="flex items-center justify-between">
                    <h3 class="font-extrabold text-sm text-slate-900">1. Upload & Print Specs</h3>
                    <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <i data-lucide="lock" class="w-3 h-3"></i> In-App Vault
                    </span>
                </div>

                <!-- Interactive File Dropzone -->
                <div class="p-3 bg-blue-50/70 border border-dashed border-blue-300 rounded-2xl space-y-2">
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2.5 overflow-hidden">
                            <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <i data-lucide="file-text" class="w-5 h-5"></i>
                            </div>
                            <div class="truncate">
                                <p class="text-xs font-bold text-slate-900 truncate">${state.orderForm.fileName}</p>
                                <p class="text-[11px] text-slate-500">${state.orderForm.pages} pages • ${state.orderForm.fileSize}</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-1.5 pt-1">
                        <button onclick="triggerRealFileUpload()" class="flex-1 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-xl hover:bg-blue-700 transition shadow-xs">
                            Browse Device File
                        </button>
                        <button onclick="cycleSampleFile()" class="px-2.5 py-1.5 bg-white border border-slate-200 text-[11px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition shadow-xs">
                            Sample PDF
                        </button>
                    </div>
                </div>

                <!-- Page Count & Copies Stepper -->
                <div class="grid grid-cols-2 gap-2">
                    <div class="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <span class="text-[10px] font-bold text-slate-500 block mb-1">Total Pages</span>
                        <div class="flex items-center justify-between">
                            <button onclick="state.orderForm.pages=Math.max(1, state.orderForm.pages-1); saveState(); render()" class="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-xs hover:bg-slate-100">-</button>
                            <span class="text-xs font-extrabold">${state.orderForm.pages}</span>
                            <button onclick="state.orderForm.pages+=1; saveState(); render()" class="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-xs hover:bg-slate-100">+</button>
                        </div>
                    </div>
                    <div class="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <span class="text-[10px] font-bold text-slate-500 block mb-1">Copies</span>
                        <div class="flex items-center justify-between">
                            <button onclick="state.orderForm.copies=Math.max(1, state.orderForm.copies-1); saveState(); render()" class="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-xs hover:bg-slate-100">-</button>
                            <span class="text-xs font-extrabold">${state.orderForm.copies}</span>
                            <button onclick="state.orderForm.copies+=1; saveState(); render()" class="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-xs hover:bg-slate-100">+</button>
                        </div>
                    </div>
                </div>

                <!-- Color Mode -->
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="state.orderForm.colorMode='bw'; sounds.pop(); saveState(); render()" class="p-2.5 rounded-2xl border text-left transition ${state.orderForm.colorMode === 'bw' ? 'border-blue-600 bg-blue-50/70 shadow-xs' : 'border-slate-200'}">
                        <div class="text-xs font-bold text-slate-900">Black & White</div>
                        <div class="text-[11px] text-slate-500">RM${vendor.bwPrice.toFixed(2)} / sheet</div>
                    </button>
                    <button onclick="state.orderForm.colorMode='color'; sounds.pop(); saveState(); render()" class="p-2.5 rounded-2xl border text-left transition ${state.orderForm.colorMode === 'color' ? 'border-blue-600 bg-blue-50/70 shadow-xs' : 'border-slate-200'}">
                        <div class="text-xs font-bold text-slate-900">Full Color</div>
                        <div class="text-[11px] text-slate-500">RM${vendor.colorPrice.toFixed(2)} / sheet</div>
                    </button>
                </div>

                <!-- Duplex & Staple Finishing -->
                <div class="space-y-2 pt-1">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-800">Double-Sided (Duplex)</span>
                        <button onclick="state.orderForm.doubleSided=!state.orderForm.doubleSided; sounds.pop(); saveState(); render()" class="w-10 h-5 rounded-full transition p-0.5 ${state.orderForm.doubleSided ? 'bg-blue-600' : 'bg-slate-300'}">
                            <div class="w-4 h-4 rounded-full bg-white shadow-xs transform transition ${state.orderForm.doubleSided ? 'translate-x-5' : 'translate-x-0'}"></div>
                        </button>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-800">Corner Staple & Folder (+RM0.50)</span>
                        <button onclick="state.orderForm.stapleBind=!state.orderForm.stapleBind; sounds.pop(); saveState(); render()" class="w-10 h-5 rounded-full transition p-0.5 ${state.orderForm.stapleBind ? 'bg-blue-600' : 'bg-slate-300'}">
                            <div class="w-4 h-4 rounded-full bg-white shadow-xs transform transition ${state.orderForm.stapleBind ? 'translate-x-5' : 'translate-x-0'}"></div>
                        </button>
                    </div>
                </div>

                <!-- Auto-Delete Privacy Toggle -->
                <div class="p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <i data-lucide="shield-alert" class="w-5 h-5 text-lime-300 shrink-0"></i>
                        <div>
                            <div class="text-xs font-bold">Auto-Delete After Pick-Up</div>
                            <div class="text-[10px] text-slate-300">Wipes file from vendor app immediately</div>
                        </div>
                    </div>
                    <button onclick="state.orderForm.autoDelete=!state.orderForm.autoDelete; sounds.pop(); saveState(); render()" class="w-10 h-5 rounded-full transition p-0.5 shrink-0 ${state.orderForm.autoDelete ? 'bg-lime-400' : 'bg-slate-600'}">
                        <div class="w-4 h-4 rounded-full bg-slate-900 shadow-xs transform transition ${state.orderForm.autoDelete ? 'translate-x-5' : 'translate-x-0'}"></div>
                    </button>
                </div>

                <button onclick="state.uploadStep=2; sounds.pop(); saveState(); render()" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-sm transition active:scale-98">
                    Next: Choose Slot (Est. RM${pricing.total}) →
                </button>
            </div>
        ` : state.uploadStep === 2 ? `
            <div class="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3.5">
                <h3 class="font-extrabold text-sm text-slate-900">2. Book Slot & Pick-Up Point</h3>

                <div>
                    <label class="block text-[11px] font-bold text-slate-600 mb-1">Student Vendor</label>
                    <select onchange="selectVendorAndBook(parseInt(this.value)); state.uploadStep=2; render();" class="w-full p-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50">
                        ${state.vendors.map(v => `<option value="${v.id}" ${v.id === vendor.id ? 'selected' : ''}>${v.name} (${v.code}) — RM${v.bwPrice.toFixed(2)}/pg (${v.rating}★)</option>`).join('')}
                    </select>
                </div>

                <div>
                    <label class="block text-[11px] font-bold text-slate-600 mb-1.5">Available 24/7 Slots</label>
                    <div class="space-y-1.5">
                        ${vendor.slots.map(s => `
                            <button onclick="state.orderForm.slot='${s}'; sounds.pop(); saveState(); render()" class="w-full p-2.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition ${state.orderForm.slot === s ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 text-slate-700'}">
                                <span>${s}</span>
                                ${state.orderForm.slot === s ? '<i data-lucide="check-circle-2" class="w-4 h-4 text-blue-600"></i>' : ''}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <label class="block text-[11px] font-bold text-slate-600 mb-1">Flexible Pick-Up Location</label>
                    <select onchange="state.orderForm.pickupPoint=this.value; saveState()" class="w-full p-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50">
                        <option value="${vendor.college} Lobby">${vendor.college} Lobby</option>
                        <option value="Hostel Room Doorstep (${vendor.code})">Hostel Room Doorstep (${vendor.code})</option>
                        <option value="Neutral Point: Student Pavilion">Neutral Point: Student Pavilion</option>
                        <option value="Neutral Point: UNIMAS Library Entrance">Neutral Point: UNIMAS Library Entrance</option>
                    </select>
                </div>

                <div>
                    <label class="block text-[11px] font-bold text-slate-600 mb-1">Note to Vendor (Optional)</label>
                    <input type="text" value="${state.orderForm.notes}" oninput="state.orderForm.notes=this.value; saveState()" placeholder="e.g., Print slide 1-14 only, meet at ground floor..." class="w-full p-2.5 rounded-2xl border border-slate-200 text-xs bg-slate-50">
                </div>

                <div class="flex gap-2 pt-1">
                    <button onclick="state.uploadStep=1; sounds.pop(); render()" class="px-4 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl">Back</button>
                    <button onclick="state.uploadStep=3; sounds.pop(); render()" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-sm active:scale-98">
                        Next: Escrow Pay (RM${pricing.total}) →
                    </button>
                </div>
            </div>
        ` : `
            <div class="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3.5">
                <div class="flex items-center justify-between">
                    <h3 class="font-extrabold text-sm text-slate-900">3. Escrow Checkout</h3>
                    <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md">100% Protected</span>
                </div>

                <!-- Payment Method Selector -->
                <div class="grid grid-cols-2 gap-2">
                    ${['DuitNow QR', 'Campus E-Wallet'].map(method => `
                        <button onclick="state.orderForm.paymentMethod='${method}'; sounds.pop(); saveState(); render()" class="p-2.5 rounded-2xl border text-left transition ${state.orderForm.paymentMethod === method ? 'border-pink-500 bg-pink-50/60 shadow-xs' : 'border-slate-200'}">
                            <div class="text-xs font-extrabold text-slate-900">${method}</div>
                            <div class="text-[10px] text-slate-500">${method === 'DuitNow QR' ? 'Instant Bank / TNG' : 'Bal: RM' + state.walletBalance.toFixed(2)}</div>
                        </button>
                    `).join('')}
                </div>

                <!-- Receipt Breakdown -->
                <div class="bg-slate-50 p-3 rounded-2xl space-y-1.5 text-xs border border-slate-100">
                    <div class="flex justify-between text-slate-600">
                        <span>Print (${pricing.effectiveSheets} sheets × ${state.orderForm.copies} × RM${pricing.rate.toFixed(2)})</span>
                        <span class="font-semibold text-slate-800">RM${pricing.printCost}</span>
                    </div>
                    ${state.orderForm.stapleBind ? `
                    <div class="flex justify-between text-slate-600">
                        <span>Staple & Folder Finishing</span>
                        <span class="font-semibold text-slate-800">RM${pricing.finishingCost}</span>
                    </div>` : ''}
                    <div class="flex justify-between text-slate-600">
                        <span>Platform & Reprint Guarantee</span>
                        <span class="font-semibold text-slate-800">RM${pricing.platformFee}</span>
                    </div>
                    <div class="border-t border-slate-200 pt-1.5 flex justify-between font-extrabold text-sm text-slate-900">
                        <span>Total Held in Escrow</span>
                        <span class="text-blue-600">RM${pricing.total}</span>
                    </div>
                </div>

                <div class="p-3 rounded-2xl border border-pink-200 bg-pink-50/40 flex items-center gap-3">
                    <div class="w-14 h-14 bg-white p-1 rounded-xl border border-pink-200 flex items-center justify-center shrink-0 shadow-xs">
                        <div id="checkout-duitnow-qr" class="w-full h-full flex items-center justify-center"></div>
                    </div>
                    <div class="text-[11px] text-slate-700 leading-snug">
                        <p class="font-bold text-pink-700">DuitNow Escrow Guarantee</p>
                        Funds stay locked in escrow until you verify print quality and tap <strong>Confirm Pick-Up</strong>.
                    </div>
                </div>

                <div class="flex gap-2">
                    <button onclick="state.uploadStep=2; sounds.pop(); render()" class="px-4 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl">Back</button>
                    <button onclick="submitOrder()" class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-sm flex items-center justify-center gap-1.5 active:scale-98">
                        <i data-lucide="shield-check" class="w-4 h-4"></i>
                        Pay RM${pricing.total} & Print
                    </button>
                </div>
            </div>
        `}
    `;
}

function renderStudentOrders() {
    return `
        <div class="flex items-center justify-between px-1">
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-500">My Print Orders (${state.orders.length})</h3>
            <span class="text-[11px] text-emerald-700 font-semibold flex items-center gap-1"><i data-lucide="shield" class="w-3 h-3"></i> Reprint Guarantee</span>
        </div>

        <div class="space-y-3">
            ${state.orders.map(order => `
                <div class="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                    <div class="flex justify-between items-start gap-2">
                        <div class="overflow-hidden">
                            <div class="flex items-center gap-1.5">
                                <span class="text-[10px] font-bold text-slate-400">${order.id}</span>
                                <span class="text-[10px] font-extrabold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">PIN #${order.pickupCode}</span>
                            </div>
                            <h4 class="text-sm font-extrabold text-slate-900 truncate">${order.fileName}</h4>
                            <p class="text-[11px] text-slate-500">Vendor: <span class="font-semibold text-slate-700">${order.vendorName}</span></p>
                        </div>
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                            order.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                            order.status === 'ready' ? 'bg-lime-200 text-slate-900 animate-pulse' :
                            order.status === 'reprint_requested' ? 'bg-rose-100 text-rose-700' :
                            'bg-blue-100 text-blue-700'
                        }">
                            ${order.status === 'paid_escrow' ? 'Escrow Paid' :
                              order.status === 'printing' ? 'Printing...' :
                              order.status === 'ready' ? 'Ready Now' :
                              order.status === 'reprint_requested' ? 'Reprint Active' : 'Completed'}
                        </span>
                    </div>

                    <div class="bg-slate-50 p-2.5 rounded-2xl text-[11px] space-y-1 text-slate-600">
                        <div class="flex justify-between"><span>Slot:</span><span class="font-semibold text-slate-800">${order.slot}</span></div>
                        <div class="flex justify-between"><span>Pick-Up:</span><span class="font-semibold text-slate-800">${order.pickup}</span></div>
                        <div class="flex justify-between"><span>Escrow Total:</span><span class="font-bold text-blue-600">RM${order.total.toFixed(2)}</span></div>
                    </div>

                    <!-- Privacy Auto-Delete Status -->
                    <div class="flex items-center gap-2 text-[11px] px-3 py-2 rounded-xl ${order.fileDeleted ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-700'}">
                        <i data-lucide="${order.fileDeleted ? 'trash-2' : 'lock'}" class="w-3.5 h-3.5 shrink-0 text-emerald-600"></i>
                        <span>
                            ${order.fileDeleted
                                ? 'Privacy Verified: Document auto-deleted from vendor device.'
                                : 'Document encrypted in-app. Auto-deletes upon pick-up.'}
                        </span>
                    </div>

                    ${order.status !== 'completed' ? `
                        <div class="flex gap-2">
                            <button onclick="openVendorChat(${order.vendorId})" class="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl flex items-center gap-1 transition">
                                <i data-lucide="message-circle" class="w-4 h-4"></i> Chat
                            </button>
                            <button onclick="openPickupVerificationModal('${order.id}')" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center justify-center gap-1.5 active:scale-95">
                                <i data-lucide="qr-code" class="w-4 h-4"></i> Verify Pick-Up
                            </button>
                        </div>
                    ` : `
                        <div class="flex items-center justify-between pt-1">
                            <span class="text-[11px] text-slate-500">Escrow released ✓</span>
                            ${!order.rated ? `
                                <button onclick="openRatingModal('${order.id}')" class="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl flex items-center gap-1 transition">
                                    <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-500 text-amber-500"></i> Rate Vendor
                                </button>
                            ` : `<span class="text-xs font-bold text-amber-600">Rated ${order.ratingGiven || 5}.0 ★</span>`}
                        </div>
                    `}
                </div>
            `).join('')}
        </div>
    `;
}

function renderStudentChat() {
    const activeVendor = state.vendors.find(v => v.id === state.activeChatVendorId) || state.vendors[0];
    const thread = state.chats[activeVendor.id] || [];

    return `
        <!-- Vendor Thread Switcher -->
        <div class="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            ${state.vendors.map(v => `
                <button onclick="state.activeChatVendorId=${v.id}; sounds.pop(); saveState(); render()" class="px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition flex items-center gap-1.5 ${state.activeChatVendorId === v.id ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'}">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    ${v.name} (${v.code})
                </button>
            `).join('')}
        </div>

        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[490px] overflow-hidden">
            <!-- Chat Header -->
            <div class="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">${activeVendor.name.slice(0, 2).toUpperCase()}</div>
                    <div>
                        <div class="text-xs font-bold text-slate-900 flex items-center gap-1">
                            ${activeVendor.name} <i data-lucide="badge-check" class="w-3.5 h-3.5 text-blue-600"></i>
                        </div>
                        <div class="text-[10px] text-emerald-600 font-semibold">${activeVendor.college}</div>
                    </div>
                </div>
                <button onclick="selectVendorAndBook(${activeVendor.id})" class="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-[10px] font-extrabold rounded-lg transition">
                    + Print Here
                </button>
            </div>

            <!-- Messages -->
            <div class="flex-1 p-3.5 overflow-y-auto space-y-2.5 bg-slate-50/40">
                ${thread.map(m => `
                    <div class="flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}">
                        <div class="max-w-[82%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                            m.sender === 'student'
                                ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                        }">
                            ${m.text}
                        </div>
                        <span class="text-[9px] text-slate-400 mt-0.5 px-1">${m.time}</span>
                    </div>
                `).join('')}
            </div>

            <!-- Quick Replies -->
            <div class="px-2.5 pt-2 bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
                ${['On my way down!', 'Can you staple it?', 'Meet at lobby?'].map(qr => `
                    <button onclick="sendChatMessage('${qr}')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[10px] font-bold whitespace-nowrap transition">
                        ${qr}
                    </button>
                `).join('')}
            </div>

            <!-- Input -->
            <div class="p-2.5 bg-white flex gap-2">
                <input id="chat-input" type="text" placeholder="Message ${activeVendor.name}..." onkeydown="if(event.key==='Enter') sendChatMessage()" class="flex-1 bg-slate-100 rounded-2xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button onclick="sendChatMessage()" class="w-9 h-9 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 active:scale-95 transition">
                    <i data-lucide="send" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `;
}

// --- RENDER VENDOR VIEWS ---
function renderVendorDashboard() {
    return `
        <!-- Vendor Online Status Card -->
        <div class="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
                <div class="flex items-center gap-1.5 mb-0.5">
                    <span class="px-2 py-0.5 bg-lime-200 text-slate-900 text-[10px] font-extrabold rounded-md flex items-center gap-1"><i data-lucide="award" class="w-3 h-3"></i> TOP VENDOR</span>
                    <span class="text-[11px] font-semibold text-slate-500">4.9 ★ (42 jobs)</span>
                </div>
                <h3 class="text-sm font-extrabold text-slate-900">Late-Night Printing Desk</h3>
                <p class="text-[11px] text-slate-500">${state.vendorOnline ? 'Accepting student print jobs now' : 'Offline — slots paused'}</p>
            </div>
            <button onclick="toggleVendorOnline()" class="px-3.5 py-2 rounded-2xl font-bold text-xs transition ${state.vendorOnline ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700'}">
                ${state.vendorOnline ? 'ONLINE' : 'OFFLINE'}
            </button>
        </div>

        <!-- Earnings Summary -->
        <div class="grid grid-cols-2 gap-2.5">
            <div class="bg-slate-900 text-white p-3.5 rounded-2xl shadow-sm">
                <span class="text-[10px] text-slate-400 uppercase font-bold">Total Earned</span>
                <div class="text-xl font-extrabold text-lime-300 mt-0.5">RM${state.vendorEarnings.toFixed(2)}</div>
                <span class="text-[10px] text-slate-400">From spare printer capacity</span>
            </div>
            <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
                <span class="text-[10px] text-slate-400 uppercase font-bold">Active Queue</span>
                <div class="text-xl font-extrabold text-blue-600 mt-0.5">${state.orders.filter(o => o.status !== 'completed').length} Jobs</div>
                <span class="text-[10px] text-slate-500">Escrow secured</span>
            </div>
        </div>

        <!-- Incoming Print Jobs -->
        <div>
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 px-1">Student Print Queue</h4>
            <div class="space-y-2.5">
                ${state.orders.map(order => `
                    <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5">
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="text-[10px] font-bold text-blue-600">${order.studentName} • PIN #${order.pickupCode}</span>
                                <h5 class="text-xs font-extrabold text-slate-900">${order.fileName}</h5>
                                <p class="text-[11px] text-slate-500">${order.pages} pages • ${order.colorMode.toUpperCase()} • ${order.slot}</p>
                            </div>
                            <span class="text-xs font-extrabold text-emerald-700">+RM${(order.total - 0.20).toFixed(2)}</span>
                        </div>

                        ${order.status === 'reprint_requested' ? `
                            <div class="p-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 font-semibold flex items-center gap-1.5">
                                <i data-lucide="alert-circle" class="w-4 h-4 text-rose-600 shrink-0"></i>
                                <span>Reprint Requested: ${order.reprintReason}</span>
                            </div>
                        ` : ''}

                        <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span class="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-600"></i>
                                ${order.fileDeleted ? 'Auto-deleted' : 'Encrypted viewer only'}
                            </span>

                            ${order.status === 'paid_escrow' || order.status === 'reprint_requested' ? `
                                <button onclick="advanceOrderStatus('${order.id}')" class="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition">Start Print</button>
                            ` : order.status === 'printing' ? `
                                <button onclick="advanceOrderStatus('${order.id}')" class="px-3 py-1.5 bg-pink-600 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition">Mark Ready</button>
                            ` : order.status === 'ready' ? `
                                <span class="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                                    <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                    Awaiting PIN Handover
                                </span>
                            ` : `
                                <span class="text-[11px] font-bold text-emerald-600">Escrow Released ✓</span>
                            `}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderVendorSlots() {
    return `
        <div class="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div>
                <h3 class="text-sm font-extrabold text-slate-900">Manage 24/7 Availability Slots</h3>
                <p class="text-[11px] text-slate-500">Toggle slots when campus shops are closed.</p>
            </div>
            <div class="space-y-2">
                ${state.vendorSlots.map((slot, idx) => `
                    <div class="p-3 rounded-2xl border ${slot.active ? 'border-blue-200 bg-blue-50/40' : 'border-slate-200'} flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-800">${slot.time}</span>
                        <button onclick="toggleSlot(${idx})" class="w-11 h-6 rounded-full transition p-0.5 ${slot.active ? 'bg-blue-600' : 'bg-slate-300'}">
                            <div class="w-5 h-5 rounded-full bg-white shadow-xs transform transition ${slot.active ? 'translate-x-5' : 'translate-x-0'}"></div>
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Your Rates (RM0.15 – RM0.25/pg)</h4>
            <div class="flex justify-between text-xs py-1.5 border-b border-slate-100">
                <span class="text-slate-600">Black & White (A4 80gsm)</span>
                <span class="font-extrabold text-slate-900">RM0.15 / sheet</span>
            </div>
            <div class="flex justify-between text-xs py-1.5">
                <span class="text-slate-600">Full Color</span>
                <span class="font-extrabold text-slate-900">RM0.50 / sheet</span>
            </div>
        </div>
    `;
}

// --- MASTER RENDER ---
function render() {
    const content = document.getElementById('app-content');
    const nav = document.getElementById('bottom-nav');
    if (!content || !nav) return;

    if (state.role === 'student') {
        if (state.studentTab === 'home') content.innerHTML = renderStudentHome();
        else if (state.studentTab === 'upload') content.innerHTML = renderStudentUpload();
        else if (state.studentTab === 'orders') content.innerHTML = renderStudentOrders();
        else if (state.studentTab === 'chat') content.innerHTML = renderStudentChat();

        const activeCount = state.orders.filter(o => o.status !== 'completed').length;

        nav.innerHTML = `
            <button onclick="setStudentTab('home')" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${state.studentTab === 'home' ? 'text-blue-600 bg-blue-50/70 font-bold' : 'text-slate-400 font-medium'}">
                <i data-lucide="compass" class="w-5 h-5"></i>
                <span class="text-[10px]">Nearby</span>
            </button>
            <button onclick="setStudentTab('upload')" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${state.studentTab === 'upload' ? 'text-blue-600 bg-blue-50/70 font-bold' : 'text-slate-400 font-medium'}">
                <i data-lucide="plus-circle" class="w-5 h-5"></i>
                <span class="text-[10px]">Print</span>
            </button>
            <button onclick="setStudentTab('orders')" class="relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${state.studentTab === 'orders' ? 'text-blue-600 bg-blue-50/70 font-bold' : 'text-slate-400 font-medium'}">
                <i data-lucide="file-check" class="w-5 h-5"></i>
                <span class="text-[10px]">Orders</span>
                ${activeCount > 0 ? `<span class="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">${activeCount}</span>` : ''}
            </button>
            <button onclick="setStudentTab('chat')" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${state.studentTab === 'chat' ? 'text-blue-600 bg-blue-50/70 font-bold' : 'text-slate-400 font-medium'}">
                <i data-lucide="message-square" class="w-5 h-5"></i>
                <span class="text-[10px]">Chat</span>
            </button>
        `;
    } else {
        if (state.vendorTab === 'dashboard') content.innerHTML = renderVendorDashboard();
        else if (state.vendorTab === 'slots') content.innerHTML = renderVendorSlots();

        nav.innerHTML = `
            <button onclick="setVendorTab('dashboard')" class="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition ${state.vendorTab === 'dashboard' ? 'text-pink-600 bg-pink-50 font-bold' : 'text-slate-400 font-medium'}">
                <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
                <span class="text-[10px]">Print Queue</span>
            </button>
            <button onclick="setVendorTab('slots')" class="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition ${state.vendorTab === 'slots' ? 'text-pink-600 bg-pink-50 font-bold' : 'text-slate-400 font-medium'}">
                <i data-lucide="calendar-clock" class="w-5 h-5"></i>
                <span class="text-[10px]">24/7 Slots</span>
            </button>
        `;
    }

    // Dynamic QR generation if checkout step 3 is visible
    if (state.role === 'student' && state.studentTab === 'upload' && state.uploadStep === 3) {
        setTimeout(() => {
            const qrBox = document.getElementById('checkout-duitnow-qr');
            if (qrBox && typeof QRCode !== 'undefined') {
                qrBox.innerHTML = '';
                new QRCode(qrBox, {
                    text: `DUITNOW:UNIMAS:PRINTSWIFT:ESCROW:RM${calculateOrderTotal().total}`,
                    width: 48,
                    height: 48,
                    colorDark: '#be185d',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.L
                });
            }
        }, 50);
    }

    lucide.createIcons();
}

// Window initialization
window.addEventListener('DOMContentLoaded', () => {
    render();
});
