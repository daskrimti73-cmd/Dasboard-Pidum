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

// ---- Chart instances ----
let chartTrendHm = null;
let chartTindakPidanaHm = null;

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
    const w = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t = document.getElementById('filterTahun')?.value || '';
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    return `hm_${w}_${s1}_${s2}_${t}_${b1}_${b2}`;
}

// ---- Month range ----
function getMonthRangeHm() {
    return getSelectedMonths();
}

// ---- Page-specific ----
function rebuildMonthlyUI() {
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
    const months = getMonthRangeHm();
    grid.innerHTML = '';
    months.forEach(m => {
        const div = document.createElement('div');
        div.className = 'month-input-group';
        div.innerHTML = `
            <label style="display:flex;justify-content:space-between;align-items:center;">${m.name}
                <button type="button" class="year-tag-delete" title="Hapus ${m.name}" onclick="handleDeleteBulan(${m.index})"
                    style="margin-left:6px;font-size:14px;color:#dc3545;background:#fff0f0;border:1px solid #dc3545;border-radius:4px;cursor:pointer;padding:0 5px;line-height:1.4;font-weight:bold;">&times;</button>
            </label>
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
    const tpList = getTindakPidanaListHm();
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
function onDataInput() { markUnsaved(); }
function onMonthlyInputHm() { markUnsaved(); updateTrendChartHm(); }
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
    const months = getMonthRangeHm();
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
    const tpList = getTindakPidanaListHm();
    const values = tpList.map((_, idx) => {
        const input = document.getElementById(`tp-hm-${idx}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    const bgColors = tpList.map((_, i) => barBgHm[i % barBgHm.length]);
    const hoverColors = tpList.map((_, i) => barHoverHm[i % barHoverHm.length]);

    chartTindakPidanaHm.data.labels = tpList;
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
function saveAllData() {
    const allData = { savedAt: new Date().toISOString() };

    // Cards
    allData.cards = {};
    ['hm-pn', 'hm-pt', 'hm-ma'].forEach(id => {
        const el = document.getElementById(id);
        if (el) allData.cards[id] = el.value;
    });

    // Monthly trend
    allData.trenMonthly = {};
    getMonthRangeHm().forEach(m => {
        const el = document.getElementById(`monthly-tren-${m.index}`);
        if (el) allData.trenMonthly[m.index] = el.value;
    });

    // Tindak pidana values (keyed by label)
    allData.tpValues = {};
    const tpListSave = getTindakPidanaListHm();
    tpListSave.forEach((tp, idx) => {
        const el = document.getElementById(`tp-hm-${idx}`);
        if (el) allData.tpValues[tp] = el.value;
    });

    try {
        localStorage.setItem(getHmStorageKey(), JSON.stringify(allData));
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

function loadAllDataHm() {
    const saved = localStorage.getItem(getHmStorageKey());
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

        // Monthly trend
        if (data.trenMonthly) {
            Object.keys(data.trenMonthly).forEach(idx => {
                const el = document.getElementById(`monthly-tren-${idx}`);
                if (el) el.value = data.trenMonthly[idx];
            });
        }

        // Tindak pidana (support label-based and index-based)
        if (data.tpValues) {
            const tpList = getTindakPidanaListHm();
            const keys = Object.keys(data.tpValues);
            const isLabelBased = keys.length > 0 && isNaN(parseInt(keys[0]));
            if (isLabelBased) {
                tpList.forEach((tp, idx) => {
                    const el = document.getElementById(`tp-hm-${idx}`);
                    if (el && data.tpValues[tp]) el.value = data.tpValues[tp];
                });
            } else {
                keys.forEach(idx => {
                    const el = document.getElementById(`tp-hm-${idx}`);
                    if (el) el.value = data.tpValues[idx];
                });
            }
        }
    } catch (e) {
        console.error('Load error:', e);
    }
}

function resetAllData() {
    if (!confirm('Apakah Anda yakin ingin mengosongkan semua data di halaman ini?')) return;

    ['hm-pn', 'hm-pt', 'hm-ma'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    getMonthRangeHm().forEach(m => {
        const el = document.getElementById(`monthly-tren-${m.index}`);
        if (el) el.value = '';
    });
    updateTrendChartHm();

    const tpList = getTindakPidanaListHm();
    tpList.forEach((_, idx) => {
        const el = document.getElementById(`tp-hm-${idx}`);
        if (el) el.value = '';
    });
    updateTpChartHm();

    showToast('Semua data telah dikosongkan', 'success');
}

// ---- Filters ----
function applyFilters() {
    // Sync Bulan Awal/Akhir to localStorage
    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);
    const start = Math.min(bulanAwal, bulanAkhir);
    const end = Math.max(bulanAwal, bulanAkhir);
    const newList = [];
    for (let i = start; i <= end; i++) newList.push(i);
    saveSelectedBulanList(newList);

    generateMonthlyInputsHm();
    loadAllDataHm();
    updateTrendChartHm();
    updateTpChartHm();
    setUpdateDate();
    showToast('Filter diterapkan', 'success');
}

function resetFilters() {
    document.getElementById('filterWilayah').value = 'kejati-kepri';
    document.getElementById('filterSatker1').value = '';
    document.getElementById('filterSatker2').value = '';
    document.getElementById('filterTahun').value = getTahunList()[0]?.toString() || '2026';
    document.getElementById('filterBulan1').value = '01';
    document.getElementById('filterBulan2').value = getDefaultBulanAkhir();

    // Sync reset bulan to localStorage
    const bulanAkhirVal = parseInt(getDefaultBulanAkhir());
    const resetList = [];
    for (let i = 1; i <= bulanAkhirVal; i++) resetList.push(i);
    saveSelectedBulanList(resetList);

    ['hm-pn', 'hm-pt', 'hm-ma'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    generateMonthlyInputsHm();
    updateTrendChartHm();
    updateTpChartHm();

    showToast('Filter telah direset', 'success');
}

// ============================================
// DIREKTORAT MANAGEMENT UI
// ============================================
function renderDirektoratTags() {
    const container = document.getElementById('direktoratTagsContainer');
    if (!container) return;
    const list = getTindakPidanaListHm();
    container.innerHTML = '';
    list.forEach(dir => {
        const tag = document.createElement('span');
        tag.className = 'year-tag';
        tag.textContent = dir + ' ';
        const btn = document.createElement('button');
        btn.className = 'year-tag-delete';
        btn.title = 'Hapus ' + dir;
        btn.innerHTML = '&times;';
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
    if (addDirektorat(val, 'hm')) {
        showToast('Kategori "' + val + '" berhasil ditambahkan', 'success');
        input.value = '';
        renderDirektoratTags();
        rebuildDirektoratUI();
    } else {
        showToast('Kategori sudah ada atau tidak valid', 'error');
    }
}

function handleDeleteDirektorat(label) {
    if (!confirm('Hapus kategori "' + label + '" dari daftar?')) return;
    if (deleteDirektorat(label, 'hm')) {
        showToast('Kategori "' + label + '" berhasil dihapus', 'success');
        renderDirektoratTags();
        rebuildDirektoratUI();
    } else {
        showToast('Tidak dapat menghapus kategori terakhir', 'error');
    }
}

function rebuildDirektoratUI() {
    generateTindakPidanaInputs();
    loadAllDataHm();
    updateTpChartHm();
}
