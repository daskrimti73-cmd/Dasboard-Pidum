/* ============================================
   PRA PENUNTUTAN - JAVASCRIPT
   Charts, data management, auto-update logic
   Now with dynamic direktorat/tindak pidana
   ============================================ */

// ---- Month names ----
const BULAN_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// ---- Get current direktorat list per section ----
function getDirListForSection(section) {
    return getDirektoratList('pra_' + section);
}

// ---- Chart instances ----
let chartSpdpTrend = null;
let chartSpdpTindakPidana = null;
let chartTahap1Trend = null;
let chartTahap1TindakPidana = null;
let combinedDirData = {}; // holds merged dirValues per section when viewing combined months

// ---- SPDP field IDs ----
const SPDP_FIELDS = ['spdp-spdp', 'spdp-p18', 'spdp-p17', 'spdp-pengembalian', 'spdp-sp3'];

// ---- Tahap I field IDs ----
const TAHAP1_FIELDS = ['tahap1-tahap1', 'tahap1-p18', 'tahap1-p19', 'tahap1-p20', 'tahap1-p21', 'tahap1-p21a', 'tahap1-pengembalian', 'tahap1-sp3'];

// ---- Storage key builder (same logic as app.js but for pra-penuntutan) ----
function getPrapenStorageKey(prefix) {
    return buildStorageKey('prapen_' + prefix);
}

// ---- Get month range from filter (for charts - only visible months) ----
function getMonthRange(section) {
    return getChartMonthRange(section);
}

// ---- Get all selected months (for input section - all months admin added) ----
function getAllInputMonths() {
    return getSelectedMonths();
}

// ---- Page-specific: rebuild monthly inputs/charts when months change ----
function rebuildMonthlyUI() {
    // SAVE current data first (prevents data loss when toggling visibility)
    saveAllData(true);
    generateMonthlyInputs('spdp', 'spdpMonthlyGrid');
    generateMonthlyInputs('tahap1', 'tahap1MonthlyGrid');
    loadAllData();
    updateTrendChart('spdp');
    updateTrendChart('tahap1');
}

// ---- Initialize everything ----
function initPraPenuntutan() {
    generateMonthlyInputs('spdp', 'spdpMonthlyGrid');
    generateMonthlyInputs('tahap1', 'tahap1MonthlyGrid');
    generateDirektoratInputs('spdp', 'spdpDirGrid');
    generateDirektoratInputs('tahap1', 'tahap1DirGrid');
    loadAllData();
    initAllCharts();
    renderAllDirektoratTags();
}

// ---- Generate monthly input fields ----
function generateMonthlyInputs(section, gridId) {
    const grid = document.getElementById(gridId);
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
            <input type="number" 
                   id="monthly-${section}-${m.index}" 
                   placeholder="0" 
                   min="0"
                   oninput="onMonthlyInput('${section}')">
        `;
        grid.appendChild(div);
    });
}

// Handle add from secondary (alt) select dropdowns
function handleAddBulanAlt(btn) {
    const sel = btn.parentElement.querySelector('select');
    if (!sel || !sel.value) { showToast('Pilih bulan yang ingin ditambahkan', 'error'); return; }
    if (addBulanWithVisible(sel.value)) {
        const name = BULAN_NAMES_ALL[parseInt(sel.value) - 1]?.name || '';
        showToast('Bulan ' + name + ' berhasil ditambahkan', 'success');
        sel.value = '';
        rebuildMonthlyUI();
    } else {
        showToast('Bulan sudah ada dalam daftar', 'error');
    }
}

// ---- Generate direktorat input fields (dynamic) ----
function generateDirektoratInputs(section, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = '';

    const dirList = getDirListForSection(section);

    dirList.forEach((dir, idx) => {
        const div = document.createElement('div');
        div.className = 'dir-input-group';
        div.innerHTML = `
            <label>${dir}</label>
            <input type="number" 
                   id="dir-${section}-${idx}" 
                   placeholder="0" 
                   min="0"
                   oninput="onDirInput('${section}')">
        `;
        grid.appendChild(div);
    });
}

// ---- Toggle monthly/dir detail panels ----
function toggleMonthlyDetail(section) {
    const bodyMap = {
        'spdp': 'monthlySpdp',
        'spdpDir': 'monthlySpdpDir',
        'tahap1': 'monthlyTahap1',
        'tahap1Dir': 'monthlyTahap1Dir'
    };
    const toggleMap = {
        'spdp': 'toggleSpdp',
        'spdpDir': 'toggleSpdpDir',
        'tahap1': 'toggleTahap1',
        'tahap1Dir': 'toggleTahap1Dir'
    };

    const body = document.getElementById(bodyMap[section]);
    const icon = document.getElementById(toggleMap[section]);

    if (body) {
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? 'block' : 'none';
        if (icon) icon.classList.toggle('rotated', isHidden);
    }
}

// ---- On data input (card values) ----
function onDataInput(section) {
    markUnsaved();
    // Card inputs do NOT update the trend chart - only monthly inputs do
}

// ---- On monthly input: update trend chart ----
function onMonthlyInput(section) {
    markUnsaved();
    updateTrendChart(section);
    // No sync to card - they are completely independent
}

// ---- On direktorat input: update bar chart ----
function onDirInput(section) {
    markUnsaved();
    updateDirChart(section);
}

// ============================================
// CHARTS
// ============================================

const chartColors = {
    line: {
        borderColor: 'rgba(15, 52, 96, 1)',
        backgroundColor: 'rgba(15, 52, 96, 0.1)',
        pointBg: 'rgba(15, 52, 96, 1)',
        pointBorder: '#fff'
    },
    bar: {
        backgroundColor: [
            'rgba(15, 52, 96, 0.85)',
            'rgba(15, 52, 96, 0.75)',
            'rgba(15, 52, 96, 0.65)',
            'rgba(15, 52, 96, 0.55)',
            'rgba(15, 52, 96, 0.45)',
            'rgba(15, 52, 96, 0.80)',
            'rgba(26, 26, 46, 0.75)',
            'rgba(139, 0, 0, 0.70)',
            'rgba(200, 168, 85, 0.75)'
        ],
        hoverBg: [
            'rgba(15, 52, 96, 1)',
            'rgba(15, 52, 96, 0.9)',
            'rgba(15, 52, 96, 0.8)',
            'rgba(15, 52, 96, 0.7)',
            'rgba(15, 52, 96, 0.6)',
            'rgba(15, 52, 96, 0.95)',
            'rgba(26, 26, 46, 0.9)',
            'rgba(139, 0, 0, 0.85)',
            'rgba(200, 168, 85, 0.9)'
        ]
    }
};

// ---- Common chart options ----
function getLineChartOptions(titleText) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: new Date().getFullYear().toString(),
                font: { size: 14, weight: '600' },
                color: '#2c3e50'
            },
            tooltip: {
                backgroundColor: 'rgba(26,26,46,0.9)',
                titleFont: { size: 13 },
                bodyFont: { size: 13 },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (ctx) {
                        return `Jumlah: ${ctx.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: { display: true, text: 'Bulan', font: { size: 12, weight: '600' } },
                grid: { display: false }
            },
            y: {
                beginAtZero: true,
                title: { display: false },
                grid: { color: 'rgba(0,0,0,0.06)' },
                ticks: { precision: 0 }
            }
        },
        elements: {
            line: { tension: 0.3 },
            point: { radius: 6, hoverRadius: 8, borderWidth: 3 }
        }
    };
}

function getBarChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(26,26,46,0.9)',
                titleFont: { size: 13 },
                bodyFont: { size: 13 },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (ctx) {
                        return `Jumlah: ${ctx.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 10, weight: '600' },
                    maxRotation: 45,
                    minRotation: 30
                }
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: 'JUMLAH', font: { size: 11, weight: '700' } },
                grid: { color: 'rgba(0,0,0,0.06)' },
                ticks: { precision: 0 }
            }
        }
    };
}

// ---- Initialize all 4 charts ----
function initAllCharts() {
    // SPDP Trend (line chart)
    const ctxSpdpTrend = document.getElementById('chartSpdpTrend');
    if (ctxSpdpTrend) {
        chartSpdpTrend = new Chart(ctxSpdpTrend.getContext('2d'), {
            type: 'line',
            data: { labels: [], datasets: [{ data: [] }] },
            options: getLineChartOptions('Tren SPDP')
        });
    }

    // SPDP Tindak Pidana (bar chart)
    const ctxSpdpBar = document.getElementById('chartSpdpTindakPidana');
    if (ctxSpdpBar) {
        chartSpdpTindakPidana = new Chart(ctxSpdpBar.getContext('2d'), {
            type: 'bar',
            data: { labels: [], datasets: [{ data: [] }] },
            options: getBarChartOptions()
        });
    }

    // Tahap I Trend (line chart)
    const ctxT1Trend = document.getElementById('chartTahap1Trend');
    if (ctxT1Trend) {
        chartTahap1Trend = new Chart(ctxT1Trend.getContext('2d'), {
            type: 'line',
            data: { labels: [], datasets: [{ data: [] }] },
            options: getLineChartOptions('Tren Tahap I')
        });
    }

    // Tahap I Tindak Pidana (bar chart)
    const ctxT1Bar = document.getElementById('chartTahap1TindakPidana');
    if (ctxT1Bar) {
        chartTahap1TindakPidana = new Chart(ctxT1Bar.getContext('2d'), {
            type: 'bar',
            data: { labels: [], datasets: [{ data: [] }] },
            options: getBarChartOptions()
        });
    }

    // Initial chart update
    updateTrendChart('spdp');
    updateTrendChart('tahap1');
    updateDirChart('spdp');
    updateDirChart('tahap1');
}

// ---- Update Trend (line) Chart ----
function updateTrendChart(section) {
    const months = getMonthRange(section); // Uses visible months per section
    const labels = months.map(m => m.name);
    const values = months.map(m => {
        const input = document.getElementById(`monthly-${section}-${m.index}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    const chart = section === 'spdp' ? chartSpdpTrend : chartTahap1Trend;
    if (!chart) return;

    chart.data.labels = labels;
    chart.data.datasets = [{
        label: section === 'spdp' ? 'SPDP' : 'Tahap I',
        data: values,
        borderColor: chartColors.line.borderColor,
        backgroundColor: chartColors.line.backgroundColor,
        pointBackgroundColor: chartColors.line.pointBg,
        pointBorderColor: chartColors.line.pointBorder,
        fill: true,
        borderWidth: 3
    }];

    // Update year title
    const year = document.getElementById('filterTahun')?.value || new Date().getFullYear();
    chart.options.plugins.title.text = year.toString();

    chart.update('none');
}

// ---- Update Dir (bar) Chart ----
function updateDirChart(section) {
    const chart = section === 'spdp' ? chartSpdpTindakPidana : chartTahap1TindakPidana;
    if (!chart) return;
    let labels, values;

    const cd = combinedDirData[section];
    if (cd && Object.keys(cd).length > 0) {
        // Combined mode: show ALL categories from merged data (only non-zero)
        const entries = Object.entries(cd)
            .filter(([k]) => isNaN(parseInt(k)))
            .filter(([, v]) => parseInt(v) > 0);
        labels = entries.map(([k]) => k);
        values = entries.map(([, v]) => parseInt(v) || 0);
    } else {
        // Single month mode: use input elements
        const dirList = getDirListForSection(section);
        labels = dirList;
        values = dirList.map((_, idx) => {
            const input = document.getElementById(`dir-${section}-${idx}`);
            return input ? (parseInt(input.value) || 0) : 0;
        });
    }

    const bgColors = [];
    const hoverColors = [];
    for (let i = 0; i < labels.length; i++) {
        bgColors.push(chartColors.bar.backgroundColor[i % chartColors.bar.backgroundColor.length]);
        hoverColors.push(chartColors.bar.hoverBg[i % chartColors.bar.hoverBg.length]);
    }

    chart.data.labels = labels;
    chart.data.datasets = [{
        label: 'Jumlah',
        data: values,
        backgroundColor: bgColors,
        hoverBackgroundColor: hoverColors,
        borderRadius: 4,
        borderSkipped: false,
        barPercentage: 0.7
    }];

    chart.update('none');
}

// ============================================
// DIREKTORAT MANAGEMENT UI (per-section)
// ============================================

function renderDirektoratTags(section) {
    const container = document.getElementById('direktoratTagsContainer_' + section);
    if (!container) return;
    const list = getDirListForSection(section);
    container.innerHTML = '';
    list.forEach(dir => {
        const tag = document.createElement('span');
        tag.className = 'year-tag';
        tag.textContent = dir + ' ';
        const btn = document.createElement('button');
        btn.className = 'year-tag-delete';
        btn.title = 'Hapus ' + dir;
        btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        btn.addEventListener('click', function () { handleDeleteDirektorat(section, dir); });
        tag.appendChild(btn);
        container.appendChild(tag);
    });
}

function renderAllDirektoratTags() {
    renderDirektoratTags('spdp');
    renderDirektoratTags('tahap1');
}

function handleAddDirektorat(section) {
    const input = document.getElementById('inputDirektoratBaru_' + section);
    if (!input) return;
    const val = input.value.trim();
    if (!val) { showToast('Masukkan nama kategori tindak pidana', 'error'); return; }
    if (addDirektorat(val, 'pra_' + section)) {
        showToast('Kategori "' + val + '" berhasil ditambahkan', 'success');
        input.value = '';
        renderDirektoratTags(section);
        rebuildSectionUI(section);
    } else {
        showToast('Kategori sudah ada atau tidak valid', 'error');
    }
}

function handleDeleteDirektorat(section, label) {
    if (!confirm('Hapus kategori "' + label + '" dari daftar?')) return;
    if (deleteDirektorat(label, 'pra_' + section)) {
        showToast('Kategori "' + label + '" berhasil dihapus', 'success');
        renderDirektoratTags(section);
        rebuildSectionUI(section);
    } else {
        showToast('Tidak dapat menghapus kategori terakhir', 'error');
    }
}

function rebuildSectionUI(section) {
    const gridId = section === 'spdp' ? 'spdpDirGrid' : 'tahap1DirGrid';
    generateDirektoratInputs(section, gridId);
    loadAllData();
    updateDirChart(section);
}

// ============================================
// SAVE & LOAD
// ============================================

function saveAllData(silent) {
    // Which month is admin saving? Use bulanAwal as the target month
    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);

    // Only allow saving when bulan awal = bulan akhir (single month mode)
    if (bulanAwal !== bulanAkhir) {
        if (!silent) showToast('Untuk menyimpan data, Bulan Awal dan Bulan Akhir harus sama.', 'error');
        return;
    }

    const bulan = bulanAwal;
    const dirList = getDirListForSection('spdp');

    // Collect current card values
    const spdpData = {};
    SPDP_FIELDS.forEach(id => {
        const input = document.getElementById(id);
        if (input) spdpData[id] = input.value;
    });
    const tahap1Data = {};
    TAHAP1_FIELDS.forEach(id => {
        const input = document.getElementById(id);
        if (input) tahap1Data[id] = input.value;
    });

    // Collect direktorat values
    const spdpDir = {};
    dirList.forEach((dir, idx) => {
        const input = document.getElementById(`dir-spdp-${idx}`);
        if (input) spdpDir[dir] = input.value;
    });
    const tahap1DirList = getDirListForSection('tahap1');
    const tahap1Dir = {};
    tahap1DirList.forEach((dir, idx) => {
        const input = document.getElementById(`dir-tahap1-${idx}`);
        if (input) tahap1Dir[dir] = input.value;
    });

    // Load existing data to preserve other months
    const storageKey = getPrapenStorageKey('all');
    let existing = {};
    try {
        const saved = localStorage.getItem(storageKey);
        if (saved) existing = JSON.parse(saved);
    } catch (e) { }

    if (!existing.perBulan) existing.perBulan = {};

    // Save under this specific month
    existing.perBulan[bulan] = {
        spdpCards: spdpData,
        tahap1Cards: tahap1Data,
        spdpDir: spdpDir,
        tahap1Dir: tahap1Dir
    };

    // Save monthly trend inputs SEPARATELY for ALL months
    for (let m = 1; m <= 12; m++) {
        if (!existing.perBulan[m]) existing.perBulan[m] = { spdpCards: {}, tahap1Cards: {}, spdpDir: {}, tahap1Dir: {} };
        const elSpdp = document.getElementById('monthly-spdp-' + m);
        const elTahap1 = document.getElementById('monthly-tahap1-' + m);
        if (elSpdp) existing.perBulan[m].trendSpdp = elSpdp.value;
        if (elTahap1) existing.perBulan[m].trendTahap1 = elTahap1.value;
    }

    existing.savedAt = new Date().toISOString();

    try {
        localStorage.setItem(storageKey, JSON.stringify(existing));
        const namaBulan = BULAN_NAMES[bulan - 1] || bulan;
        if (!silent) showToast('Data bulan ' + namaBulan + ' berhasil disimpan!', 'success');

        const btn = document.getElementById('btnSave');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> Tersimpan';
            setTimeout(() => { btn.innerHTML = '<i class="fas fa-save"></i> Simpan Semua Data'; }, 2000);
        }
        hasUnsaved = false;
    } catch (e) {
        showToast('Gagal menyimpan data!', 'error');
        console.error('Save error:', e);
    }
}

function loadAllData() {
    combinedDirData = {}; // reset

    // Clear all fields first so stale data from previous month doesn't remain
    SPDP_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    TAHAP1_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const _dl1 = getDirListForSection('spdp'); _dl1.forEach((d, i) => { const el = document.getElementById('dir-spdp-' + i); if (el) el.value = ''; });
    const _dl2 = getDirListForSection('tahap1'); _dl2.forEach((d, i) => { const el = document.getElementById('dir-tahap1-' + i); if (el) el.value = ''; });

    const saved = localStorage.getItem(getPrapenStorageKey('all'));
    if (!saved) return;

    try {
        const data = JSON.parse(saved);
        const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
        const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);
        const start = Math.min(bulanAwal, bulanAkhir);
        const end = Math.max(bulanAwal, bulanAkhir);

        // --- NEW PER-BULAN FORMAT ---
        if (data.perBulan) {
            // Sum cards and dir from start to end month
            const sumSpdp = {}, sumTahap1 = {}, sumSpdpDir = {}, sumTahap1Dir = {};
            for (let m = start; m <= end; m++) {
                const md = data.perBulan[m];
                if (!md) continue;
                _sumObj(sumSpdp, md.spdpCards);
                _sumObj(sumTahap1, md.tahap1Cards);
                _sumObj(sumSpdpDir, md.spdpDir);
                _sumObj(sumTahap1Dir, md.tahap1Dir);
            }
            if (start !== end) {
                combinedDirData['spdp'] = sumSpdpDir;
                combinedDirData['tahap1'] = sumTahap1Dir;
            }
            _setFields(sumSpdp, SPDP_FIELDS);
            _setFields(sumTahap1, TAHAP1_FIELDS);
            _setDir(sumSpdpDir, 'spdp');
            _setDir(sumTahap1Dir, 'tahap1');

            // Auto-fill monthly trend inputs from per-bulan card data
            // Load trend values independently
            for (let m = 1; m <= 12; m++) {
                const md = data.perBulan[m];
                const s = document.getElementById('monthly-spdp-' + m);
                const t = document.getElementById('monthly-tahap1-' + m);
                if (s) s.value = (md && md.trendSpdp !== undefined ? md.trendSpdp : (md && md.spdpCards && md.spdpCards['spdp-spdp'])) || '';
                if (t) t.value = (md && md.trendTahap1 !== undefined ? md.trendTahap1 : (md && md.tahap1Cards && md.tahap1Cards['tahap1-tahap1'])) || '';
            }
            return;
        }

        // --- LEGACY FORMAT (backward compatible) ---
        if (data.spdpCards) _setFields(data.spdpCards, SPDP_FIELDS);
        if (data.tahap1Cards) _setFields(data.tahap1Cards, TAHAP1_FIELDS);
        if (data.spdpMonthly) {
            Object.keys(data.spdpMonthly).forEach(idx => {
                const el = document.getElementById('monthly-spdp-' + idx);
                if (el) el.value = data.spdpMonthly[idx];
            });
        }
        if (data.tahap1Monthly) {
            Object.keys(data.tahap1Monthly).forEach(idx => {
                const el = document.getElementById('monthly-tahap1-' + idx);
                if (el) el.value = data.tahap1Monthly[idx];
            });
        }
        _setDir(data.spdpDir, 'spdp');
        _setDir(data.tahap1Dir, 'tahap1');
    } catch (e) { console.error('Load error:', e); }
}

// Helper: sum numeric values from source into target object
function _sumObj(target, source) {
    if (!source) return;
    Object.keys(source).forEach(k => {
        target[k] = ((parseInt(target[k]) || 0) + (parseInt(source[k]) || 0)).toString();
    });
}
// Helper: set field values from data
function _setFields(obj, fieldIds) {
    if (!obj) return;
    fieldIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && obj[id] !== undefined) el.value = obj[id];
    });
}
// Helper: set direktorat field values
function _setDir(dirData, section) {
    if (!dirData) return;
    const dirList = getDirListForSection(section);
    const keys = Object.keys(dirData);
    const isLabel = keys.length > 0 && isNaN(parseInt(keys[0]));
    if (isLabel) {
        dirList.forEach((dir, idx) => {
            const el = document.getElementById('dir-' + section + '-' + idx);
            if (el && dirData[dir] !== undefined) el.value = dirData[dir];
        });
    } else {
        keys.forEach(idx => {
            const el = document.getElementById('dir-' + section + '-' + idx);
            if (el) el.value = dirData[idx];
        });
    }
}

function resetAllData() {
    if (!confirm('Apakah Anda yakin ingin mengosongkan semua data di halaman ini?')) return;

    // Clear SPDP cards
    SPDP_FIELDS.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });

    // Clear Tahap I cards
    TAHAP1_FIELDS.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });

    // Clear monthly inputs
    getSelectedMonths().forEach(m => {
        const s1 = document.getElementById(`monthly-spdp-${m.index}`);
        const s2 = document.getElementById(`monthly-tahap1-${m.index}`);
        if (s1) s1.value = '';
        if (s2) s2.value = '';
    });

    // Clear direktorat inputs
    const dirList = getDirListForSection('spdp');
    dirList.forEach((_, idx) => {
        const d1 = document.getElementById(`dir-spdp-${idx}`);
        if (d1) d1.value = '';
    });
    const dirList2 = getDirListForSection('tahap1');
    dirList2.forEach((_, idx) => {
        const d2 = document.getElementById(`dir-tahap1-${idx}`);
        if (d2) d2.value = '';
    });

    // Update all charts
    updateTrendChart('spdp');
    updateTrendChart('tahap1');
    updateDirChart('spdp');
    updateDirChart('tahap1');

    showToast('Semua data telah dikosongkan', 'success');
}

// ---- Apply/Reset Filters (override for this page) ----
function applyFilters() {
    // NOTE: Admin harus klik "Simpan" sebelum ganti tahun agar data tersimpan

    // Read Bulan Awal/Akhir from filter dropdowns
    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);

    // Set temporary filter (session-only, resets on page reload)
    setTempFilter(bulanAwal, bulanAkhir);

    // Regenerate monthly grids to update eye icon states
    generateMonthlyInputs('spdp', 'spdpMonthlyGrid');
    generateMonthlyInputs('tahap1', 'tahap1MonthlyGrid');

    // Clear all inputs before loading new data (for new year/filter)
    SPDP_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    TAHAP1_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    getSelectedMonths().forEach(m => {
        const s1 = document.getElementById(`monthly-spdp-${m.index}`);
        const s2 = document.getElementById(`monthly-tahap1-${m.index}`);
        if (s1) s1.value = '';
        if (s2) s2.value = '';
    });

    // Load saved data for new filter (year) - if exists, fills inputs; if not, stays empty
    loadAllData();

    // Update charts (will use visible months only)
    updateTrendChart('spdp');
    updateTrendChart('tahap1');
    updateDirChart('spdp');
    updateDirChart('tahap1');

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

    // Reset visible to show ALL admin's selected months
    saveVisibleBulanList(getSelectedBulanList());

    // Regenerate and clear
    generateMonthlyInputs('spdp', 'spdpMonthlyGrid');
    generateMonthlyInputs('tahap1', 'tahap1MonthlyGrid');

    SPDP_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    TAHAP1_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

    updateTrendChart('spdp');
    updateTrendChart('tahap1');
    updateDirChart('spdp');
    updateDirChart('tahap1');

    clearTempFilter();
    showToast('Filter telah direset', 'success');
}
