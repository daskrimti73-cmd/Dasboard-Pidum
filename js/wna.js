/* ============================================
   WNA - JAVASCRIPT
   Pie chart (countries with flags), horizontal bar (klasifikasi),
   trend line chart, bar chart by tindak pidana
   ============================================ */

const BULAN_NAMES_WNA = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const TINDAK_PIDANA_LIST_WNA = [
    'DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT E'
];

// ---- Country list (All 197 countries of the world 2026, sorted A-Z in Bahasa Indonesia) ----
const COUNTRY_LIST = [
    { code: 'AF', name: 'Afghanistan' },
    { code: 'ZA', name: 'Afrika Selatan' },
    { code: 'AL', name: 'Albania' },
    { code: 'DZ', name: 'Aljazair' },
    { code: 'US', name: 'Amerika Serikat' },
    { code: 'AD', name: 'Andorra' },
    { code: 'AO', name: 'Angola' },
    { code: 'AG', name: 'Antigua dan Barbuda' },
    { code: 'SA', name: 'Arab Saudi' },
    { code: 'AR', name: 'Argentina' },
    { code: 'AM', name: 'Armenia' },
    { code: 'AU', name: 'Australia' },
    { code: 'AT', name: 'Austria' },
    { code: 'AZ', name: 'Azerbaijan' },
    { code: 'BS', name: 'Bahama' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'BB', name: 'Barbados' },
    { code: 'NL', name: 'Belanda' },
    { code: 'BY', name: 'Belarus' },
    { code: 'BE', name: 'Belgia' },
    { code: 'BZ', name: 'Belize' },
    { code: 'BJ', name: 'Benin' },
    { code: 'BT', name: 'Bhutan' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'BA', name: 'Bosnia dan Herzegovina' },
    { code: 'BW', name: 'Botswana' },
    { code: 'BR', name: 'Brasil' },
    { code: 'BN', name: 'Brunei Darussalam' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'BI', name: 'Burundi' },
    { code: 'TD', name: 'Chad' },
    { code: 'CZ', name: 'Ceko' },
    { code: 'CL', name: 'Chili' },
    { code: 'DK', name: 'Denmark' },
    { code: 'DJ', name: 'Djibouti' },
    { code: 'DM', name: 'Dominika' },
    { code: 'EC', name: 'Ekuador' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'ER', name: 'Eritrea' },
    { code: 'EE', name: 'Estonia' },
    { code: 'SZ', name: 'Eswatini' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'PH', name: 'Filipina' },
    { code: 'FI', name: 'Finlandia' },
    { code: 'GA', name: 'Gabon' },
    { code: 'GM', name: 'Gambia' },
    { code: 'GE', name: 'Georgia' },
    { code: 'GH', name: 'Ghana' },
    { code: 'GD', name: 'Grenada' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'GN', name: 'Guinea' },
    { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GQ', name: 'Guinea Khatulistiwa' },
    { code: 'GY', name: 'Guyana' },
    { code: 'HT', name: 'Haiti' },
    { code: 'HN', name: 'Honduras' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'HU', name: 'Hungaria' },
    { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'GB', name: 'Inggris' },
    { code: 'IQ', name: 'Irak' },
    { code: 'IR', name: 'Iran' },
    { code: 'IE', name: 'Irlandia' },
    { code: 'IS', name: 'Islandia' },
    { code: 'IL', name: 'Israel' },
    { code: 'IT', name: 'Italia' },
    { code: 'JM', name: 'Jamaika' },
    { code: 'JP', name: 'Jepang' },
    { code: 'DE', name: 'Jerman' },
    { code: 'KH', name: 'Kamboja' },
    { code: 'CM', name: 'Kamerun' },
    { code: 'CA', name: 'Kanada' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'KE', name: 'Kenya' },
    { code: 'MH', name: 'Kepulauan Marshall' },
    { code: 'SB', name: 'Kepulauan Solomon' },
    { code: 'KG', name: 'Kirgistan' },
    { code: 'KI', name: 'Kiribati' },
    { code: 'CO', name: 'Kolombia' },
    { code: 'KM', name: 'Komoro' },
    { code: 'KR', name: 'Korea Selatan' },
    { code: 'KP', name: 'Korea Utara' },
    { code: 'XK', name: 'Kosovo' },
    { code: 'CR', name: 'Kosta Rika' },
    { code: 'HR', name: 'Kroasia' },
    { code: 'CU', name: 'Kuba' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'LA', name: 'Laos' },
    { code: 'LV', name: 'Latvia' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'LS', name: 'Lesotho' },
    { code: 'LR', name: 'Liberia' },
    { code: 'LY', name: 'Libya' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LU', name: 'Luksemburg' },
    { code: 'MG', name: 'Madagaskar' },
    { code: 'MK', name: 'Makedonia Utara' },
    { code: 'MV', name: 'Maladewa' },
    { code: 'MW', name: 'Malawi' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'ML', name: 'Mali' },
    { code: 'MT', name: 'Malta' },
    { code: 'MA', name: 'Maroko' },
    { code: 'MR', name: 'Mauritania' },
    { code: 'MU', name: 'Mauritius' },
    { code: 'MX', name: 'Meksiko' },
    { code: 'EG', name: 'Mesir' },
    { code: 'FM', name: 'Mikronesia' },
    { code: 'MD', name: 'Moldova' },
    { code: 'MC', name: 'Monako' },
    { code: 'MN', name: 'Mongolia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MZ', name: 'Mozambik' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'NA', name: 'Namibia' },
    { code: 'NR', name: 'Nauru' },
    { code: 'NP', name: 'Nepal' },
    { code: 'NE', name: 'Niger' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'NI', name: 'Nikaragua' },
    { code: 'NO', name: 'Norwegia' },
    { code: 'OM', name: 'Oman' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'PW', name: 'Palau' },
    { code: 'PS', name: 'Palestina' },
    { code: 'PA', name: 'Panama' },
    { code: 'CI', name: 'Pantai Gading' },
    { code: 'PG', name: 'Papua Nugini' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'PE', name: 'Peru' },
    { code: 'PL', name: 'Polandia' },
    { code: 'PT', name: 'Portugal' },
    { code: 'FR', name: 'Prancis' },
    { code: 'QA', name: 'Qatar' },
    { code: 'CF', name: 'Republik Afrika Tengah' },
    { code: 'CD', name: 'Republik Demokratik Kongo' },
    { code: 'DO', name: 'Republik Dominika' },
    { code: 'CG', name: 'Republik Kongo' },
    { code: 'RO', name: 'Rumania' },
    { code: 'RU', name: 'Rusia' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'KN', name: 'Saint Kitts dan Nevis' },
    { code: 'LC', name: 'Saint Lucia' },
    { code: 'VC', name: 'Saint Vincent dan Grenadines' },
    { code: 'WS', name: 'Samoa' },
    { code: 'SM', name: 'San Marino' },
    { code: 'ST', name: 'Sao Tome dan Principe' },
    { code: 'NZ', name: 'Selandia Baru' },
    { code: 'SN', name: 'Senegal' },
    { code: 'RS', name: 'Serbia' },
    { code: 'SC', name: 'Seychelles' },
    { code: 'SL', name: 'Sierra Leone' },
    { code: 'SG', name: 'Singapura' },
    { code: 'CY', name: 'Siprus' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'SO', name: 'Somalia' },
    { code: 'ES', name: 'Spanyol' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'SD', name: 'Sudan' },
    { code: 'SS', name: 'Sudan Selatan' },
    { code: 'SR', name: 'Suriname' },
    { code: 'SY', name: 'Suriah' },
    { code: 'SE', name: 'Swedia' },
    { code: 'CH', name: 'Swiss' },
    { code: 'TJ', name: 'Tajikistan' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'TH', name: 'Thailand' },
    { code: 'CN', name: 'Tiongkok' },
    { code: 'TL', name: 'Timor Leste' },
    { code: 'TG', name: 'Togo' },
    { code: 'TO', name: 'Tonga' },
    { code: 'TT', name: 'Trinidad dan Tobago' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'TR', name: 'Turki' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'TV', name: 'Tuvalu' },
    { code: 'UG', name: 'Uganda' },
    { code: 'UA', name: 'Ukraina' },
    { code: 'AE', name: 'Uni Emirat Arab' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'VA', name: 'Vatikan' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'YE', name: 'Yaman' },
    { code: 'JO', name: 'Yordania' },
    { code: 'GR', name: 'Yunani' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' }
];

// Helper: get flag image URL from flagcdn.com
function getFlagImg(code, size) {
    size = size || 24;
    const w = size;
    const h = Math.round(size * 0.75);
    return `https://flagcdn.com/w${w}/${code.toLowerCase()}.png`;
}

// ---- Pie chart color palette ----
const PIE_COLORS = [
    '#3498db', '#e67e22', '#2ecc71', '#e74c3c', '#9b59b6',
    '#1abc9c', '#f39c12', '#d35400', '#c0392b', '#8e44ad'
];

// ---- State ----
let negaraData = [];       // [{ code, name, flag, jumlah }]
let klasifikasiData = [];  // [{ nama, jumlah }]
let chartPie = null;
let chartKlasifikasi = null;
let chartTrend = null;
let chartDir = null;

// ---- Chart colors ----
const lineColor = {
    borderColor: 'rgba(15, 52, 96, 1)',
    backgroundColor: 'rgba(15, 52, 96, 0.1)',
    pointBg: 'rgba(15, 52, 96, 1)',
    pointBorder: '#fff'
};
const barBg = [
    'rgba(15, 52, 96, 0.85)', 'rgba(15, 52, 96, 0.75)', 'rgba(15, 52, 96, 0.65)',
    'rgba(15, 52, 96, 0.55)', 'rgba(15, 52, 96, 0.45)', 'rgba(15, 52, 96, 0.80)',
    'rgba(15, 52, 96, 0.70)', 'rgba(15, 52, 96, 0.60)'
];
const barHover = [
    'rgba(15, 52, 96, 1)', 'rgba(15, 52, 96, 0.9)', 'rgba(15, 52, 96, 0.8)',
    'rgba(15, 52, 96, 0.7)', 'rgba(15, 52, 96, 0.6)', 'rgba(15, 52, 96, 0.95)',
    'rgba(15, 52, 96, 0.85)', 'rgba(15, 52, 96, 0.75)'
];

// Horizontal bar green palette for klasifikasi
const klasifikasiColors = [
    '#27ae60', '#2ecc71', '#1abc9c', '#16a085', '#27ae60',
    '#2ecc71', '#1abc9c', '#16a085', '#27ae60', '#2ecc71'
];

// ---- Storage key ----
function getWnaStorageKey() {
    const w = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t = document.getElementById('filterTahun')?.value || '';
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    return `wna_${w}_${s1}_${s2}_${t}_${b1}_${b2}`;
}

// ---- Month range ----
function getMonthRangeWna() {
    const b1 = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const b2 = parseInt(document.getElementById('filterBulan2')?.value || '12');
    const months = [];
    for (let i = b1; i <= b2; i++) {
        months.push({ index: i, name: BULAN_NAMES_WNA[i - 1] });
    }
    return months;
}

// ============================================
// INITIALIZE
// ============================================
function initWna() {
    populateNegaraSelect();
    generateMonthlyInputs();
    generateDirInputs();
    loadAllData();
    initAllCharts();
}

// ---- Populate country dropdown ----
function populateNegaraSelect() {
    const sel = document.getElementById('negaraSelect');
    if (!sel) return;
    sel.innerHTML = '<option value="">-- Pilih Negara --</option>';
    COUNTRY_LIST.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.code;
        opt.textContent = c.name;
        sel.appendChild(opt);
    });
}

// ---- Generate monthly inputs ----
function generateMonthlyInputs() {
    const grid = document.getElementById('trenMonthlyGrid');
    if (!grid) return;
    const months = getMonthRangeWna();
    grid.innerHTML = '';
    months.forEach(m => {
        const div = document.createElement('div');
        div.className = 'month-input-group';
        div.innerHTML = `
            <label>${m.name}</label>
            <input type="number" id="monthly-tren-${m.index}" placeholder="0" min="0"
                   oninput="onMonthlyInput()">
        `;
        grid.appendChild(div);
    });
}

// ---- Generate direktorat inputs ----
function generateDirInputs() {
    const grid = document.getElementById('wnaDirGrid');
    if (!grid) return;
    grid.innerHTML = '';
    TINDAK_PIDANA_LIST_WNA.forEach((dir, idx) => {
        const div = document.createElement('div');
        div.className = 'dir-input-group';
        div.innerHTML = `
            <label>${dir}</label>
            <input type="number" id="dir-wna-${idx}" placeholder="0" min="0"
                   oninput="onDirInput()">
        `;
        grid.appendChild(div);
    });
}

// ============================================
// NEGARA (COUNTRY) MANAGEMENT
// ============================================
function addNegara() {
    const sel = document.getElementById('negaraSelect');
    const jml = document.getElementById('negaraJumlah');
    const code = sel.value;
    const jumlah = parseInt(jml.value) || 0;

    if (!code) { showToast('Pilih negara terlebih dahulu', 'error'); return; }
    if (jumlah <= 0) { showToast('Masukkan jumlah yang valid', 'error'); return; }

    // Check if already exists
    const existing = negaraData.find(n => n.code === code);
    if (existing) {
        existing.jumlah = jumlah;
    } else {
        const country = COUNTRY_LIST.find(c => c.code === code);
        negaraData.push({ code: country.code, name: country.name, jumlah });
    }

    sel.value = '';
    jml.value = '';
    renderNegaraList();
    updatePieChart();
    updateNegaraCount();
    markUnsaved();
}

function removeNegara(code) {
    negaraData = negaraData.filter(n => n.code !== code);
    renderNegaraList();
    updatePieChart();
    updateNegaraCount();
    markUnsaved();
}

function renderNegaraList() {
    const list = document.getElementById('negaraList');
    if (!list) return;
    if (negaraData.length === 0) {
        list.innerHTML = '<div class="empty-list">Belum ada negara ditambahkan</div>';
        return;
    }
    const total = negaraData.reduce((s, n) => s + n.jumlah, 0);
    list.innerHTML = negaraData.map(n => {
        const pct = total > 0 ? ((n.jumlah / total) * 100).toFixed(1) : '0.0';
        const flagUrl = getFlagImg(n.code, 40);
        return `
            <div class="negara-item">
                <img src="${flagUrl}" alt="${n.name}" class="negara-flag-img" onerror="this.style.display='none'">
                <span class="negara-name">${n.name}</span>
                <span class="negara-count">${n.jumlah} <small>(${pct}%)</small></span>
                <button class="btn-remove" onclick="removeNegara('${n.code}')" title="Hapus">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');
}

function updateNegaraCount() {
    const uniqueCount = negaraData.length;
    const el = document.getElementById('wna-negara');
    if (el) el.value = uniqueCount;
}

// ============================================
// KLASIFIKASI PERKARA MANAGEMENT
// ============================================
function addKlasifikasi() {
    const namaEl = document.getElementById('klasifikasiNama');
    const jmlEl = document.getElementById('klasifikasiJumlah');
    const nama = namaEl.value.trim();
    const jumlah = parseInt(jmlEl.value) || 0;

    if (!nama) { showToast('Masukkan nama tindak pidana', 'error'); return; }
    if (jumlah <= 0) { showToast('Masukkan jumlah yang valid', 'error'); return; }

    // Check existing
    const existing = klasifikasiData.find(k => k.nama.toLowerCase() === nama.toLowerCase());
    if (existing) {
        existing.jumlah = jumlah;
    } else {
        if (klasifikasiData.length >= 10) {
            showToast('Maksimal 10 klasifikasi', 'error');
            return;
        }
        klasifikasiData.push({ nama, jumlah });
    }

    namaEl.value = '';
    jmlEl.value = '';
    renderKlasifikasiList();
    updateKlasifikasiChart();
    markUnsaved();
}

function removeKlasifikasi(idx) {
    klasifikasiData.splice(idx, 1);
    renderKlasifikasiList();
    updateKlasifikasiChart();
    markUnsaved();
}

function renderKlasifikasiList() {
    const list = document.getElementById('klasifikasiList');
    if (!list) return;
    if (klasifikasiData.length === 0) {
        list.innerHTML = '<div class="empty-list">Belum ada klasifikasi ditambahkan</div>';
        return;
    }
    list.innerHTML = klasifikasiData.map((k, idx) => `
        <div class="klasifikasi-item">
            <span class="klasifikasi-name">${k.nama}</span>
            <span class="klasifikasi-count">${k.jumlah}</span>
            <button class="btn-remove" onclick="removeKlasifikasi(${idx})" title="Hapus">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// ============================================
// TOGGLE ACCORDION
// ============================================
function toggleAccordion(section) {
    const bodyMap = { negara: 'monthlyNegara', klasifikasi: 'monthlyKlasifikasi', tren: 'monthlyTren', dirWna: 'monthlyDirWna' };
    const toggleMap = { negara: 'toggleNegara', klasifikasi: 'toggleKlasifikasi', tren: 'toggleTren', dirWna: 'toggleDirWna' };
    const body = document.getElementById(bodyMap[section]);
    const icon = document.getElementById(toggleMap[section]);
    if (body) {
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? 'block' : 'none';
        if (icon) icon.classList.toggle('rotated', isHidden);
    }
}

// ============================================
// EVENT HANDLERS
// ============================================
function onDataInput() { markUnsaved(); }
function onMonthlyInput() { markUnsaved(); updateTrendChart(); }
function onDirInput() { markUnsaved(); updateDirChart(); }

// ============================================
// CHARTS
// ============================================
function initAllCharts() {
    // 1. Pie chart
    const pieCanvas = document.getElementById('chartNegaraPie');
    if (pieCanvas) {
        chartPie = new Chart(pieCanvas.getContext('2d'), {
            type: 'pie',
            data: { labels: [], datasets: [{ data: [] }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 15, font: { size: 12 }, usePointStyle: true, pointStyle: 'circle' }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26,26,46,0.9)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function (ctx) {
                                const label = ctx.label || '';
                                const value = ctx.parsed;
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                                return `${label}: Jumlah: ${value} | Persen: ${pct}%`;
                            }
                        }
                    }
                }
            }
        });
        updatePieChart();
    }

    // 2. Horizontal bar (klasifikasi)
    const klasCanvas = document.getElementById('chartKlasifikasiBar');
    if (klasCanvas) {
        chartKlasifikasi = new Chart(klasCanvas.getContext('2d'), {
            type: 'bar',
            data: { labels: [], datasets: [{ data: [] }] },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(26,26,46,0.95)',
                        padding: 14,
                        cornerRadius: 8,
                        titleFont: { size: 13, weight: '700' },
                        bodyFont: { size: 12 },
                        maxWidth: 350,
                        callbacks: {
                            title: function (items) {
                                if (!items.length) return '';
                                var idx = items[0].dataIndex;
                                var fullText = chartKlasifikasi._fullLabels ? chartKlasifikasi._fullLabels[idx] : items[0].label;
                                // Split long text into multiple lines (max 40 chars per line)
                                var lines = [];
                                var words = fullText.split(' ');
                                var currentLine = '';
                                for (var i = 0; i < words.length; i++) {
                                    var testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
                                    if (testLine.length > 40 && currentLine) {
                                        lines.push(currentLine);
                                        currentLine = words[i];
                                    } else {
                                        currentLine = testLine;
                                    }
                                }
                                if (currentLine) lines.push(currentLine);
                                return lines;
                            },
                            label: function (ctx) {
                                return 'Jumlah: ' + ctx.parsed.x;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Jumlah', font: { size: 11, weight: '700' } },
                        grid: { color: 'rgba(0,0,0,0.06)' },
                        ticks: { precision: 0 }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 10, weight: '600' } }
                    }
                }
            }
        });
        updateKlasifikasiChart();
    }

    // 3. Trend line
    const trendCanvas = document.getElementById('chartWnaTrend');
    if (trendCanvas) {
        chartTrend = new Chart(trendCanvas.getContext('2d'), {
            type: 'line',
            data: { labels: [], datasets: [{ data: [] }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: (document.getElementById('filterTahun')?.value || '2026'),
                        font: { size: 14, weight: '600' },
                        color: '#2c3e50'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26,26,46,0.9)', padding: 12, cornerRadius: 8,
                        callbacks: { label: ctx => `Jumlah: ${ctx.parsed.y}` }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Bulan', font: { size: 12, weight: '600' } }, grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { precision: 0 } }
                },
                elements: { line: { tension: 0.3 }, point: { radius: 6, hoverRadius: 8, borderWidth: 3 } }
            }
        });
        updateTrendChart();
    }

    // 4. Bar chart (tindak pidana)
    const dirCanvas = document.getElementById('chartWnaDir');
    if (dirCanvas) {
        chartDir = new Chart(dirCanvas.getContext('2d'), {
            type: 'bar',
            data: { labels: [], datasets: [{ data: [] }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(26,26,46,0.9)', padding: 12, cornerRadius: 8,
                        callbacks: { label: ctx => `Jumlah: ${ctx.parsed.y}` }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 10, weight: '600' }, maxRotation: 45, minRotation: 30 } },
                    y: { beginAtZero: true, title: { display: true, text: 'JUMLAH', font: { size: 11, weight: '700' } }, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { precision: 0 } }
                }
            }
        });
        updateDirChart();
    }
}

// ---- Update pie chart ----
function updatePieChart() {
    if (!chartPie) return;
    // Sort by jumlah descending, take top 5
    const sorted = [...negaraData].sort((a, b) => b.jumlah - a.jumlah).slice(0, 5);
    const labels = sorted.map(n => n.name);
    const values = sorted.map(n => n.jumlah);
    const colors = sorted.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]);

    chartPie.data.labels = labels;
    chartPie.data.datasets = [{
        data: values,
        backgroundColor: colors,
        borderColor: '#fff',
        borderWidth: 2
    }];
    chartPie.update('none');
}

// ---- Update klasifikasi horizontal bar ----
function updateKlasifikasiChart() {
    if (!chartKlasifikasi) return;
    // Sort descending, take top 10
    var sorted = [...klasifikasiData].sort((a, b) => b.jumlah - a.jumlah).slice(0, 10);
    var fullLabels = sorted.map(k => k.nama);
    var labels = sorted.map(k => k.nama.length > 30 ? k.nama.substring(0, 27) + '...' : k.nama);
    var values = sorted.map(k => k.jumlah);
    var colors = sorted.map((_, i) => klasifikasiColors[i % klasifikasiColors.length]);

    // Store full labels for tooltip access
    chartKlasifikasi._fullLabels = fullLabels;

    chartKlasifikasi.data.labels = labels;
    chartKlasifikasi.data.datasets = [{
        label: 'Jumlah',
        data: values,
        backgroundColor: colors,
        borderRadius: 4,
        barPercentage: 0.7
    }];
    chartKlasifikasi.update('none');
}

// ---- Update trend chart ----
function updateTrendChart() {
    if (!chartTrend) return;
    const months = getMonthRangeWna();
    const labels = months.map(m => m.name);
    const values = months.map(m => {
        const input = document.getElementById(`monthly-tren-${m.index}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    chartTrend.data.labels = labels;
    chartTrend.data.datasets = [{
        label: 'Tersangka WNA',
        data: values,
        borderColor: lineColor.borderColor,
        backgroundColor: lineColor.backgroundColor,
        pointBackgroundColor: lineColor.pointBg,
        pointBorderColor: lineColor.pointBorder,
        fill: true,
        borderWidth: 3
    }];

    const year = document.getElementById('filterTahun')?.value || new Date().getFullYear();
    chartTrend.options.plugins.title.text = year.toString();
    chartTrend.update('none');
}

// ---- Update dir bar chart ----
function updateDirChart() {
    if (!chartDir) return;
    const values = TINDAK_PIDANA_LIST_WNA.map((_, idx) => {
        const input = document.getElementById(`dir-wna-${idx}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    chartDir.data.labels = TINDAK_PIDANA_LIST_WNA;
    chartDir.data.datasets = [{
        label: 'Jumlah',
        data: values,
        backgroundColor: barBg,
        hoverBackgroundColor: barHover,
        borderRadius: 4,
        borderSkipped: false,
        barPercentage: 0.7
    }];
    chartDir.update('none');
}

// ============================================
// SAVE & LOAD
// ============================================
function saveAllData() {
    const allData = { savedAt: new Date().toISOString() };

    // Cards
    allData.cards = {};
    ['wna-tersangka', 'wna-negara', 'wna-laki', 'wna-perempuan'].forEach(id => {
        const el = document.getElementById(id);
        if (el) allData.cards[id] = el.value;
    });

    // Negara data
    allData.negaraData = negaraData;

    // Klasifikasi data
    allData.klasifikasiData = klasifikasiData;

    // Monthly trend
    allData.trenMonthly = {};
    getMonthRangeWna().forEach(m => {
        const el = document.getElementById(`monthly-tren-${m.index}`);
        if (el) allData.trenMonthly[m.index] = el.value;
    });

    // Dir values
    allData.dirValues = {};
    TINDAK_PIDANA_LIST_WNA.forEach((_, idx) => {
        const el = document.getElementById(`dir-wna-${idx}`);
        if (el) allData.dirValues[idx] = el.value;
    });

    try {
        localStorage.setItem(getWnaStorageKey(), JSON.stringify(allData));
        showToast('Semua data berhasil disimpan!', 'success');
        hasUnsaved = false;
        const btn = document.getElementById('btnSave');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> Tersimpan';
            setTimeout(() => { btn.innerHTML = '<i class="fas fa-save"></i> Simpan Semua Data'; }, 2000);
        }
    } catch (e) {
        showToast('Gagal menyimpan data!', 'error');
    }
}

function loadAllData() {
    const saved = localStorage.getItem(getWnaStorageKey());
    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        // Cards
        if (data.cards) {
            Object.keys(data.cards).forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = data.cards[id];
            });
        }

        // Negara
        if (data.negaraData) {
            negaraData = data.negaraData;
            renderNegaraList();
            updateNegaraCount();
        }

        // Klasifikasi
        if (data.klasifikasiData) {
            klasifikasiData = data.klasifikasiData;
            renderKlasifikasiList();
        }

        // Monthly trend
        if (data.trenMonthly) {
            Object.keys(data.trenMonthly).forEach(idx => {
                const el = document.getElementById(`monthly-tren-${idx}`);
                if (el) el.value = data.trenMonthly[idx];
            });
        }

        // Dir
        if (data.dirValues) {
            Object.keys(data.dirValues).forEach(idx => {
                const el = document.getElementById(`dir-wna-${idx}`);
                if (el) el.value = data.dirValues[idx];
            });
        }
    } catch (e) {
        console.error('Load error:', e);
    }
}

function resetAllData() {
    if (!confirm('Apakah Anda yakin ingin mengosongkan semua data di halaman ini?')) return;

    ['wna-tersangka', 'wna-negara', 'wna-laki', 'wna-perempuan'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    negaraData = [];
    klasifikasiData = [];
    renderNegaraList();
    renderKlasifikasiList();
    updatePieChart();
    updateKlasifikasiChart();

    getMonthRangeWna().forEach(m => {
        const el = document.getElementById(`monthly-tren-${m.index}`);
        if (el) el.value = '';
    });
    updateTrendChart();

    TINDAK_PIDANA_LIST_WNA.forEach((_, idx) => {
        const el = document.getElementById(`dir-wna-${idx}`);
        if (el) el.value = '';
    });
    updateDirChart();

    showToast('Semua data telah dikosongkan', 'success');
}

// ---- Filters ----
function applyFilters() {
    generateMonthlyInputs();
    loadAllData();
    updatePieChart();
    updateKlasifikasiChart();
    updateTrendChart();
    updateDirChart();
    setUpdateDate();
    showToast('Filter diterapkan', 'success');
}

function resetFilters() {
    document.getElementById('filterWilayah').value = 'kejati-kepri';
    document.getElementById('filterSatker1').value = '';
    document.getElementById('filterSatker2').value = '';
    document.getElementById('filterTahun').value = getTahunList()[0]?.toString() || '2026';
    document.getElementById('filterBulan1').value = '01';
    document.getElementById('filterBulan2').value = '02';

    ['wna-tersangka', 'wna-negara', 'wna-laki', 'wna-perempuan'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    negaraData = [];
    klasifikasiData = [];
    renderNegaraList();
    renderKlasifikasiList();

    generateMonthlyInputs();
    updatePieChart();
    updateKlasifikasiChart();
    updateTrendChart();
    updateDirChart();

    showToast('Filter telah direset', 'success');
}
