/* ============================================
   HUKUMAN MATI - JAVASCRIPT
   3 Cards (PN, PT, MA), trend line chart,
   bar chart by tindak pidana
   ============================================ */

const BULAN_NAMES_HM = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function getTindakPidanaListHm() {
    return getDirektoratList('hm');
}

// ---- Get active tindak pidana list filtered by current month's excluded dirs ----
function getActiveTindakPidanaListHm() {
    const fullList = getMergedDirList(getHmStorageKey(), 'hm', 'tpValues');
    const bulan = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulan);
    if (bulan !== bulanAkhir) return fullList; // combined mode: show all
    const excluded = getExcludedDirsForMonth(getHmStorageKey(), 'hm', bulan);
    return fullList.filter(d => !excluded.includes(d));
}

// ---- Chart instances ----
let chartTrendHm = null;
let chartTindakPidanaHm = null;
let combinedTpData = null; // holds merged tpValues when viewing combined months
_isShowingCombinedMonths = false; // true when loaded data is from multi-month range
_loadedBulan = null; // tracks which month range the current form data belongs to
_loadedStorageKey = null; // tracks which year/satker storage key was loaded

// ---- Chart colors ----
const lineColorHm = {
    borderColor: 'rgba(15, 52, 96, 1)',
    backgroundColor: 'rgba(15, 52, 96, 0.1)',
    pointBg: 'rgba(15, 52, 96, 1)',
    pointBorder: '#fff'
};
const barBgHm = [
    'rgba(15, 52, 96, 0.85)', 'rgba(15, 52, 96, 0.75)', 'rgba(15, 52, 96, 0.65)',
    'rgba(15, 52, 96, 0.55)', 'rgba(15, 52, 96, 0.45)', 'rgba(15, 52, 96, 0.80)',
    'rgba(15, 52, 96, 0.70)', 'rgba(15, 52, 96, 0.60)'
];
const barHoverHm = [
    'rgba(15, 52, 96, 1)', 'rgba(15, 52, 96, 0.9)', 'rgba(15, 52, 96, 0.8)',
    'rgba(15, 52, 96, 0.7)', 'rgba(15, 52, 96, 0.6)', 'rgba(15, 52, 96, 0.95)',
    'rgba(15, 52, 96, 0.85)', 'rgba(15, 52, 96, 0.75)'
];

// ---- Storage key ----
function getHmStorageKey() {
    return buildStorageKey('hm');
}

// ---- Month range ----
function getMonthRangeHm(section) {
    return getChartMonthRange(section);
}

// ---- Page-specific ----
function rebuildMonthlyUI() {
    saveAllData(true);
    generateMonthlyInputsHm();
    loadAllDataHm();
    updateTrendChartHm();
}

// ============================================
// INITIALIZE
// ============================================
function initHukumanMati() {
    generateMonthlyInputsHm();
    generateTindakPidanaInputs();
    loadAllDataHm();
    initAllChartsHm();
    renderDirektoratTags();
}

// ---- Generate monthly inputs ----
function generateMonthlyInputsHm() {
    const grid = document.getElementById('trenMonthlyGrid');
    if (!grid) return;
    const months = getSelectedMonths(); // Show ALL months in input
    grid.innerHTML = '';
    months.forEach(m => {
        const div = document.createElement('div');
        div.className = 'month-input-group';
        div.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <label style="margin:0;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#2c3e50;">${m.name}</label>
            </div>
            <input type="number" id="monthly-tren-${m.index}" placeholder="0" min="0"
                   oninput="onMonthlyInputHm()">
        `;
        grid.appendChild(div);
    });
}

// ---- Generate tindak pidana inputs ----
function generateTindakPidanaInputs() {
    const grid = document.getElementById('tindakPidanaGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const tpList = getActiveTindakPidanaListHm();
    tpList.forEach((tp, idx) => {
        const div = document.createElement('div');
        div.className = 'dir-input-group';
        div.innerHTML = `
            <label>${tp}</label>
            <input type="number" id="tp-hm-${idx}" placeholder="0" min="0"
                   oninput="onTpInputHm()">
        `;
        grid.appendChild(div);
    });
}

// ============================================
// TOGGLE ACCORDION
// ============================================
function toggleAccordion(section) {
    const bodyMap = { tren: 'monthlyTren', tindakPidana: 'monthlyTindakPidana' };
    const toggleMap = { tren: 'toggleTren', tindakPidana: 'toggleTindakPidana' };
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
function onDataInput() {
    markUnsaved();
    // Card inputs do NOT update the trend chart - only monthly inputs do
}
function onMonthlyInputHm() {
    markUnsaved();
    updateTrendChartHm();
    // No sync to card - they are completely independent
}
function onTpInputHm() { markUnsaved(); updateTpChartHm(); }

// ============================================
// CHARTS
// ============================================
function initAllChartsHm() {
    // 1. Trend line chart
    const trendCanvas = document.getElementById('chartHmTrend');
    if (trendCanvas) {
        chartTrendHm = new Chart(trendCanvas.getContext('2d'), {
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
        updateTrendChartHm();
    }

    // 2. Bar chart (tindak pidana)
    const tpCanvas = document.getElementById('chartHmTindakPidana');
    if (tpCanvas) {
        chartTindakPidanaHm = new Chart(tpCanvas.getContext('2d'), {
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
        updateTpChartHm();
    }
}

// ---- Update trend chart ----
function updateTrendChartHm() {
    if (!chartTrendHm) return;
    const months = getMonthRangeHm('tren');
    const labels = months.map(m => m.name);
    const values = months.map(m => {
        const input = document.getElementById(`monthly-tren-${m.index}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    chartTrendHm.data.labels = labels;
    chartTrendHm.data.datasets = [{
        label: 'Hukuman Mati',
        data: values,
        borderColor: lineColorHm.borderColor,
        backgroundColor: lineColorHm.backgroundColor,
        pointBackgroundColor: lineColorHm.pointBg,
        pointBorderColor: lineColorHm.pointBorder,
        fill: true,
        borderWidth: 3
    }];

    const year = document.getElementById('filterTahun')?.value || new Date().getFullYear();
    chartTrendHm.options.plugins.title.text = year.toString();
    chartTrendHm.update('none');
}

// ---- Update tindak pidana bar chart ----
function updateTpChartHm() {
    if (!chartTindakPidanaHm) return;

    // Always read from input elements so chart reflects user's current input
    const tpList = getActiveTindakPidanaListHm();
    const paired = tpList.map((dir, idx) => {
        const input = document.getElementById(`tp-hm-${idx}`);
        return { label: dir, value: input ? (parseInt(input.value) || 0) : 0 };
    }).filter(p => p.value > 0);
    const labels = paired.map(p => p.label);
    const values = paired.map(p => p.value);

    const bgColors = labels.map((_, i) => barBgHm[i % barBgHm.length]);
    const hoverColors = labels.map((_, i) => barHoverHm[i % barHoverHm.length]);

    chartTindakPidanaHm.data.labels = labels;
    chartTindakPidanaHm.data.datasets = [{
        label: 'Jumlah',
        data: values,
        backgroundColor: bgColors,
        hoverBackgroundColor: hoverColors,
        borderRadius: 4,
        borderSkipped: false,
        barPercentage: 0.7
    }];
    chartTindakPidanaHm.update('none');
}

// ============================================
// SAVE & LOAD
// ============================================
function saveAllData(silent) {
    if (_isShowingCombinedMonths) { if (!silent) showToast('Untuk menyimpan data, Bulan Awal dan Bulan Akhir harus sama.', 'error'); return; }
    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);
    if (_loadedBulan && (bulanAwal !== _loadedBulan.start || bulanAkhir !== _loadedBulan.end)) return;
    if (_loadedStorageKey && getHmStorageKey() !== _loadedStorageKey) return;
    if (bulanAwal !== bulanAkhir) { if (!silent) showToast('Untuk menyimpan data, Bulan Awal dan Bulan Akhir harus sama.', 'error'); return; }
    const bulan = bulanAwal;
    const monthData = { cards: {}, tpValues: {} };
    ['hm-pn', 'hm-pt', 'hm-ma'].forEach(id => { const el = document.getElementById(id); if (el) monthData.cards[id] = el.value; });
    getActiveTindakPidanaListHm().forEach((tp, idx) => { const el = document.getElementById('tp-hm-' + idx); if (el) monthData.tpValues[tp] = el.value; });
    const storageKey = getHmStorageKey();
    let existing = {}; try { const s = localStorage.getItem(storageKey); if (s) existing = JSON.parse(s); } catch (e) { }
    if (!existing.perBulan) existing.perBulan = {};
    const prevExcluded = existing.perBulan[bulan]?.excludedDirs || {};
    existing.perBulan[bulan] = monthData;
    existing.perBulan[bulan].excludedDirs = prevExcluded;

    // Save monthly trend inputs SEPARATELY for ALL months (independent from card data)
    for (let m = 1; m <= 12; m++) {
        const el = document.getElementById('monthly-tren-' + m);
        if (!el) continue;
        if (!existing.perBulan[m]) existing.perBulan[m] = { cards: {}, tpValues: {} };
        existing.perBulan[m].trendValue = el.value;
    }

    existing.savedAt = new Date().toISOString();
    try {
        localStorage.setItem(storageKey, JSON.stringify(existing));
        const nb = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][bulan - 1];
        if (!silent) {
            showToast('Data bulan ' + nb + ' berhasil disimpan!', 'success'); hasUnsaved = false;
            // Refresh charts after save
            updateTpChartHm();
            const btn = document.getElementById('btnSave'); if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Tersimpan'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-save"></i> Simpan Semua Data'; }, 2000); }
        }
    } catch (e) { showToast('Gagal menyimpan data!', 'error'); }
}

function loadAllDataHm() {
    combinedTpData = null; // reset
    _isShowingCombinedMonths = false; // reset
    _loadedBulan = null;
    _loadedStorageKey = null;

    // Clear all fields first
    ['hm-pn', 'hm-pt', 'hm-ma'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const tpL = getActiveTindakPidanaListHm(); tpL.forEach((tp, i) => { const el = document.getElementById('tp-hm-' + i); if (el) el.value = ''; });

    const saved = localStorage.getItem(getHmStorageKey());
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        const bA = parseInt(document.getElementById('filterBulan1')?.value || '1');
        const bB = parseInt(document.getElementById('filterBulan2')?.value || bA);
        const start = Math.min(bA, bB), end = Math.max(bA, bB);
        _isShowingCombinedMonths = (start !== end);
        _loadedBulan = { start, end };
        _loadedStorageKey = getHmStorageKey();
        if (data.perBulan) {
            const sumC = {}, sumTp = {};
            for (let m = start; m <= end; m++) { const md = data.perBulan[m]; if (!md) continue; _sumHM(sumC, md.cards); _sumHM(sumTp, md.tpValues); }
            ['hm-pn', 'hm-pt', 'hm-ma'].forEach(id => { const el = document.getElementById(id); if (el && sumC[id] !== undefined) el.value = sumC[id]; });
            if (start !== end) combinedTpData = sumTp;
            const tpList = getActiveTindakPidanaListHm(), ks = Object.keys(sumTp), isL = ks.length > 0 && isNaN(parseInt(ks[0]));
            if (isL) { tpList.forEach((tp, i) => { const el = document.getElementById('tp-hm-' + i); if (el && sumTp[tp] !== undefined) el.value = sumTp[tp]; }); }
            else { ks.forEach(i => { const el = document.getElementById('tp-hm-' + i); if (el) el.value = sumTp[i]; }); }
            // Load trend values independently (use trendValue if available, fallback to cards['hm-pn'])
            for (let m = 1; m <= 12; m++) { const md = data.perBulan[m]; const el = document.getElementById('monthly-tren-' + m); if (el) el.value = (md && md.trendValue !== undefined ? md.trendValue : (md && md.cards && md.cards['hm-pn'])) || ''; }
            return;
        }
        if (data.cards) { Object.keys(data.cards).forEach(id => { const el = document.getElementById(id); if (el) el.value = data.cards[id]; }); }
        if (data.trenMonthly) { Object.keys(data.trenMonthly).forEach(idx => { const el = document.getElementById('monthly-tren-' + idx); if (el) el.value = data.trenMonthly[idx]; }); }
        if (data.tpValues) {
            const tpList = getActiveTindakPidanaListHm(), ks = Object.keys(data.tpValues), isL = ks.length > 0 && isNaN(parseInt(ks[0]));
            if (isL) { tpList.forEach((tp, i) => { const el = document.getElementById('tp-hm-' + i); if (el && data.tpValues[tp] !== undefined) el.value = data.tpValues[tp]; }); }
            else { ks.forEach(i => { const el = document.getElementById('tp-hm-' + i); if (el) el.value = data.tpValues[i]; }); }
        }
    } catch (e) { console.error('Load error:', e); }
}
function _sumHM(t, s) { if (!s) return; Object.keys(s).forEach(k => { t[k] = ((parseInt(t[k]) || 0) + (parseInt(s[k]) || 0)).toString(); }); }

function resetAllData() {
    if (!confirm('Apakah Anda yakin ingin mengosongkan semua data di halaman ini?')) return;

    ['hm-pn', 'hm-pt', 'hm-ma'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    getSelectedMonths().forEach(m => {
        const el = document.getElementById(`monthly-tren-${m.index}`);
        if (el) el.value = '';
    });
    updateTrendChartHm();

    const tpList = getActiveTindakPidanaListHm();
    tpList.forEach((_, idx) => {
        const el = document.getElementById(`tp-hm-${idx}`);
        if (el) el.value = '';
    });
    updateTpChartHm();

    // Remove data from localStorage + Supabase
    const storageKey = getHmStorageKey();
    localStorage.removeItem(storageKey);
    _loadedBulan = null;
    _loadedStorageKey = null;
    _isShowingCombinedMonths = false;
    hasUnsaved = false;

    showToast('Semua data telah dikosongkan', 'success');
}

// ---- Filters ----
function applyFilters() {
    // Auto-save current unsaved data before changing filter
    saveAllData(true);

    // Sync Bulan Awal/Akhir to localStorage
    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);
    // Set temporary filter (session-only, resets on page reload)
    setTempFilter(bulanAwal, bulanAkhir);

    // Regenerate inputs
    generateMonthlyInputsHm();

    // Clear ALL inputs before loading new year data
    ['hm-pn', 'hm-pt', 'hm-ma'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
    });
    getSelectedMonths().forEach(m => {
        const el = document.getElementById(`monthly-tren-${m.index}`);
        if (el) el.value = '';
    });
    const tpList = getActiveTindakPidanaListHm();
    tpList.forEach((_, idx) => {
        const el = document.getElementById(`tp-hm-${idx}`);
        if (el) el.value = '';
    });

    // Load saved data for new year - if exists fills inputs, if not stays empty
    loadAllDataHm();
    updateTrendChartHm();
    updateTpChartHm();
    setUpdateDate();
    saveActiveFilters();
    showToast('Filter diterapkan', 'success');
}

function resetFilters() {
    document.getElementById('filterWilayah').value = 'kejati-kepri';
    document.getElementById('filterSatker1').value = '';
    document.getElementById('filterSatker2').value = '';
    document.getElementById('filterTahun').value = getTahunList()[0]?.toString() || '2026';
    document.getElementById('filterBulan1').value = '01';
    document.getElementById('filterBulan2').value = getDefaultBulanAkhir();

    saveVisibleBulanList(getSelectedBulanList());

    ['hm-pn', 'hm-pt', 'hm-ma'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    generateMonthlyInputsHm();
    updateTrendChartHm();
    updateTpChartHm();

    clearTempFilter();
    showToast('Filter telah direset', 'success');
}

// ============================================
// DIREKTORAT MANAGEMENT UI
// ============================================
function renderDirektoratTags() {
    const container = document.getElementById('direktoratTagsContainer');
    if (!container) return;
    const list = getActiveTindakPidanaListHm();
    container.innerHTML = '';
    list.forEach(dir => {
        const tag = document.createElement('span');
        tag.className = 'year-tag';
        tag.textContent = dir + ' ';
        const btn = document.createElement('button');
        btn.className = 'year-tag-delete';
        btn.title = 'Hapus ' + dir;
        btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        btn.addEventListener('click', function () { handleDeleteDirektorat(dir); });
        tag.appendChild(btn);
        container.appendChild(tag);
    });
}

function handleAddDirektorat() {
    const input = document.getElementById('inputDirektoratBaru');
    if (!input) return;
    const val = input.value.trim();
    if (!val) { showToast('Masukkan nama kategori tindak pidana', 'error'); return; }

    const bulan = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const storageKey = getHmStorageKey();

    // Add to global list (if not already there)
    addDirektorat(val, 'hm');

    // Un-exclude for current month (in case it was previously excluded)
    unexcludeDirForMonth(storageKey, 'hm', val, bulan);

    showToast('Kategori "' + val + '" berhasil ditambahkan', 'success');
    input.value = '';
    renderDirektoratTags();
    rebuildDirektoratUI();
}

function handleDeleteDirektorat(label) {
    // Auto-save current unsaved data before delete & reload
    saveAllData(true);

    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);

    if (bulanAwal !== bulanAkhir) {
        showToast('Untuk menghapus kategori, Bulan Awal dan Bulan Akhir harus sama.', 'error');
        return;
    }

    const bulan = bulanAwal;
    const namaBulan = BULAN_NAMES_HM[bulan - 1] || bulan;

    if (!confirm('Hapus kategori "' + label + '" dari bulan ' + namaBulan + '?')) return;

    const storageKey = getHmStorageKey();
    excludeDirForMonth(storageKey, 'hm', label, bulan, 'tpValues');

    showToast('Kategori "' + label + '" berhasil dihapus dari bulan ' + namaBulan, 'success');
    renderDirektoratTags();
    rebuildDirektoratUI();
}

function rebuildDirektoratUI() {
    generateTindakPidanaInputs();
    loadAllDataHm();
    updateTpChartHm();
}
