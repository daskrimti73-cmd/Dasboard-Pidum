/* ============================================
   EKSEKUSI - JAVASCRIPT
   Charts, data management, auto-update logic
   4 cards: P-48, BA-17, Denda, Biaya Perkara
   4 trend charts + 2 bar charts
   ============================================ */

const BULAN_NAMES_EKS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Tindak Pidana list per section
function getTindakPidanaListEks(key) {
    return getDirektoratList('eks_' + key);
}

// ---- Get active tindak pidana list filtered by current month's excluded dirs ----
function getActiveTindakPidanaListEks(key) {
    const fullList = getTindakPidanaListEks(key);
    const bulan = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulan);
    if (bulan !== bulanAkhir) return fullList; // combined mode: show all
    const excluded = getExcludedDirsForMonth(getEksekusiStorageKey(), key, bulan);
    return fullList.filter(d => !excluded.includes(d));
}

// Card field IDs
const CARD_FIELDS = ['eks-p48', 'eks-ba17', 'eks-denda', 'eks-biaya'];

// Trend chart configs (all 4 cards have trend charts)
// isCurrency = true → large monetary values with dot-separator formatting
const TREND_CHARTS = {
    p48: { canvasId: 'chartP48Trend', monthlyGrid: 'p48MonthlyGrid', chart: null, label: 'P-48', isCurrency: false },
    ba17: { canvasId: 'chartBa17Trend', monthlyGrid: 'ba17MonthlyGrid', chart: null, label: 'BA-17', isCurrency: false },
    denda: { canvasId: 'chartDendaTrend', monthlyGrid: 'dendaMonthlyGrid', chart: null, label: 'Denda', isCurrency: true },
    biaya: { canvasId: 'chartBiayaTrend', monthlyGrid: 'biayaMonthlyGrid', chart: null, label: 'Biaya Perkara', isCurrency: true }
};

// Bar chart configs (only P-48 and BA-17 have bar charts)
const DIR_CHARTS = {
    p48: { canvasId: 'chartP48Dir', dirGrid: 'p48DirGrid', chart: null, label: 'P-48' },
    ba17: { canvasId: 'chartBa17Dir', dirGrid: 'ba17DirGrid', chart: null, label: 'BA-17' }
};

// ---- Chart color palette ----
const chartColorsEks = {
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
            'rgba(15, 52, 96, 0.70)',
            'rgba(15, 52, 96, 0.60)'
        ],
        hoverBg: [
            'rgba(15, 52, 96, 1)',
            'rgba(15, 52, 96, 0.9)',
            'rgba(15, 52, 96, 0.8)',
            'rgba(15, 52, 96, 0.7)',
            'rgba(15, 52, 96, 0.6)',
            'rgba(15, 52, 96, 0.95)',
            'rgba(15, 52, 96, 0.85)',
            'rgba(15, 52, 96, 0.75)'
        ]
    }
};

let combinedDirDataEks = {}; // holds merged dirValues per key when viewing combined months

// ---- Storage key ----
function getEksekusiStorageKey() {
    return buildStorageKey('eksekusi');
}

// ---- Month range from filter ----
function getMonthRangeEks(section) {
    return getChartMonthRange(section);
}

// ---- Page-specific: rebuild monthly UI when months change ----
function rebuildMonthlyUI() {
    saveAllData(true);
    Object.keys(TREND_CHARTS).forEach(key => {
        generateMonthlyInputs(key, TREND_CHARTS[key].monthlyGrid);
    });
    loadAllData();
    Object.keys(TREND_CHARTS).forEach(key => updateTrendChart(key));
}

// ---- Initialize ----
function initEksekusi() {
    Object.keys(TREND_CHARTS).forEach(key => {
        generateMonthlyInputs(key, TREND_CHARTS[key].monthlyGrid);
    });
    Object.keys(DIR_CHARTS).forEach(key => {
        generateDirInputs(key, DIR_CHARTS[key].dirGrid);
    });
    loadAllData();
    initAllCharts();
    renderAllDirektoratTags();
}

// ---- Generate monthly inputs ----
function generateMonthlyInputs(key, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const months = getSelectedMonths(); // Show ALL months in input
    const isCurrency = TREND_CHARTS[key]?.isCurrency || false;
    grid.innerHTML = '';
    months.forEach(m => {
        const div = document.createElement('div');
        div.className = 'month-input-group';
        const headerHtml = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <label style="margin:0;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#2c3e50;">${m.name}</label>
            </div>`;
        if (isCurrency) {
            div.innerHTML = headerHtml + `
                <input type="text" id="monthly-${key}-${m.index}" placeholder="0" inputmode="numeric"
                       oninput="formatCurrencyInput(this); onMonthlyInput('${key}')">
            `;
        } else {
            div.innerHTML = headerHtml + `
                <input type="number" id="monthly-${key}-${m.index}" placeholder="0" min="0"
                       oninput="onMonthlyInput('${key}')">
            `;
        }
        grid.appendChild(div);
    });
}

// ---- Generate direktorat inputs (dynamic) ----
function generateDirInputs(key, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    const tpList = getActiveTindakPidanaListEks(key);
    tpList.forEach((dir, idx) => {
        const div = document.createElement('div');
        div.className = 'dir-input-group';
        div.innerHTML = `
            <label>${dir}</label>
            <input type="number" id="dir-${key}-${idx}" placeholder="0" min="0"
                   oninput="onDirInput('${key}')">
        `;
        grid.appendChild(div);
    });
}

// ---- Toggle accordion ----
function toggleAccordion(section) {
    const bodyMap = {
        p48: 'monthlyP48', ba17: 'monthlyBa17', denda: 'monthlyDenda', biaya: 'monthlyBiaya',
        p48Dir: 'monthlyP48Dir', ba17Dir: 'monthlyBa17Dir'
    };
    const toggleMap = {
        p48: 'toggleP48', ba17: 'toggleBa17', denda: 'toggleDenda', biaya: 'toggleBiaya',
        p48Dir: 'toggleP48Dir', ba17Dir: 'toggleBa17Dir'
    };

    const body = document.getElementById(bodyMap[section]);
    const icon = document.getElementById(toggleMap[section]);

    if (body) {
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? 'block' : 'none';
        if (icon) icon.classList.toggle('rotated', isHidden);
    }
}

// ---- Event handlers ----
function onDataInput() {
    markUnsaved();
    // Card inputs do NOT update the trend chart - only monthly inputs do
}

function onMonthlyInput(key) {
    markUnsaved();
    updateTrendChart(key);
    // No sync to card - they are completely independent
}

function onDirInput(key) {
    markUnsaved();
    updateDirChart(key);
}

// ---- Helper: format number Indonesian style (1.350.097.500) ----
function formatRupiah(val) {
    return val.toLocaleString('id-ID');
}

// ---- Helper: parse formatted string back to number (strip dots) ----
function parseCurrencyInput(str) {
    if (!str) return 0;
    // Remove all dots (thousands separator) then parse
    const cleaned = str.toString().replace(/\./g, '').replace(/,/g, '');
    return parseFloat(cleaned) || 0;
}

// ---- Helper: auto-format input with dot thousands separator ----
function formatCurrencyInput(input) {
    // Get cursor position
    const pos = input.selectionStart;
    const oldLen = input.value.length;
    // Strip non-digit
    let raw = input.value.replace(/\D/g, '');
    // Format with dots
    if (raw.length > 0) {
        input.value = parseInt(raw, 10).toLocaleString('id-ID');
    } else {
        input.value = '';
    }
    // Restore cursor
    const newLen = input.value.length;
    const diff = newLen - oldLen;
    input.setSelectionRange(pos + diff, pos + diff);
}

// ---- Chart options ----
function getLineOpts(isCurrency) {
    const opts = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: (document.getElementById('filterTahun')?.value || new Date().getFullYear()).toString(),
                font: { size: 14, weight: '600' },
                color: '#2c3e50'
            },
            tooltip: {
                backgroundColor: 'rgba(26,26,46,0.9)',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: ctx => isCurrency
                        ? `Jumlah: ${formatRupiah(ctx.parsed.y)}`
                        : `Jumlah: ${ctx.parsed.y.toLocaleString('id-ID')}`
                }
            }
        },
        scales: {
            x: { title: { display: true, text: 'Bulan', font: { size: 12, weight: '600' } }, grid: { display: false } },
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.06)' },
                ticks: isCurrency
                    ? { callback: v => formatRupiah(v) }
                    : { precision: 0 }
            }
        },
        elements: { line: { tension: 0.3 }, point: { radius: 6, hoverRadius: 8, borderWidth: 3 } }
    };
    return opts;
}

function getBarOpts() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(26,26,46,0.9)',
                padding: 12,
                cornerRadius: 8,
                callbacks: { label: ctx => `Jumlah: ${ctx.parsed.y}` }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10, weight: '600' }, maxRotation: 45, minRotation: 30 } },
            y: { beginAtZero: true, title: { display: true, text: 'JUMLAH', font: { size: 11, weight: '700' } }, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { precision: 0 } }
        }
    };
}

// ---- Init all charts ----
function initAllCharts() {
    // Trend charts (4)
    Object.keys(TREND_CHARTS).forEach(key => {
        const canvas = document.getElementById(TREND_CHARTS[key].canvasId);
        if (canvas) {
            TREND_CHARTS[key].chart = new Chart(canvas.getContext('2d'), {
                type: 'line',
                data: { labels: [], datasets: [{ data: [] }] },
                options: getLineOpts(TREND_CHARTS[key].isCurrency)
            });
        }
        updateTrendChart(key);
    });

    // Bar charts (2)
    Object.keys(DIR_CHARTS).forEach(key => {
        const canvas = document.getElementById(DIR_CHARTS[key].canvasId);
        if (canvas) {
            DIR_CHARTS[key].chart = new Chart(canvas.getContext('2d'), {
                type: 'bar',
                data: { labels: [], datasets: [{ data: [] }] },
                options: getBarOpts()
            });
        }
        updateDirChart(key);
    });
}

// ---- Update trend chart ----
function updateTrendChart(key) {
    const cfg = TREND_CHARTS[key];
    if (!cfg || !cfg.chart) return;

    const months = getMonthRangeEks(key);
    const labels = months.map(m => m.name);
    const values = months.map(m => {
        const input = document.getElementById(`monthly-${key}-${m.index}`);
        if (!input) return 0;
        return cfg.isCurrency ? parseCurrencyInput(input.value) : (parseFloat(input.value) || 0);
    });

    cfg.chart.data.labels = labels;
    cfg.chart.data.datasets = [{
        label: cfg.label,
        data: values,
        borderColor: chartColorsEks.line.borderColor,
        backgroundColor: chartColorsEks.line.backgroundColor,
        pointBackgroundColor: chartColorsEks.line.pointBg,
        pointBorderColor: chartColorsEks.line.pointBorder,
        fill: true,
        borderWidth: 3
    }];

    const year = document.getElementById('filterTahun')?.value || new Date().getFullYear();
    cfg.chart.options.plugins.title.text = year.toString();
    // Re-apply currency formatting for Y-axis ticks
    if (cfg.isCurrency) {
        cfg.chart.options.scales.y.ticks = { callback: v => formatRupiah(v) };
    }
    cfg.chart.update('none');
}

// ---- Update dir chart ----
function updateDirChart(key) {
    const cfg = DIR_CHARTS[key];
    if (!cfg || !cfg.chart) return;

    // Always read from input elements so chart reflects user's current input
    const tpList = getActiveTindakPidanaListEks(key);
    const paired = tpList.map((dir, idx) => {
        const input = document.getElementById(`dir-${key}-${idx}`);
        return { label: dir, value: input ? (parseInt(input.value) || 0) : 0 };
    }).filter(p => p.value > 0);
    const labels = paired.map(p => p.label);
    const values = paired.map(p => p.value);

    const bgColors = [];
    const hoverColors = [];
    for (let i = 0; i < labels.length; i++) {
        bgColors.push(chartColorsEks.bar.backgroundColor[i % chartColorsEks.bar.backgroundColor.length]);
        hoverColors.push(chartColorsEks.bar.hoverBg[i % chartColorsEks.bar.hoverBg.length]);
    }

    cfg.chart.data.labels = labels;
    cfg.chart.data.datasets = [{
        label: 'Jumlah',
        data: values,
        backgroundColor: bgColors,
        hoverBackgroundColor: hoverColors,
        borderRadius: 4,
        borderSkipped: false,
        barPercentage: 0.7
    }];

    cfg.chart.update('none');
}

// ============================================
// SAVE & LOAD
// ============================================

function saveAllData(silent) {
    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);
    if (bulanAwal !== bulanAkhir) { if (!silent) showToast('Untuk menyimpan data, Bulan Awal dan Bulan Akhir harus sama.', 'error'); return; }
    const bulan = bulanAwal;
    const monthData = { cards: {} };
    CARD_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) monthData.cards[id] = el.value; });
    Object.keys(DIR_CHARTS).forEach(key => {
        monthData[key + 'Dir'] = {};
        getActiveTindakPidanaListEks(key).forEach((dir, idx) => { const el = document.getElementById('dir-' + key + '-' + idx); if (el) monthData[key + 'Dir'][dir] = el.value; });
    });
    const storageKey = getEksekusiStorageKey();
    let existing = {}; try { const s = localStorage.getItem(storageKey); if (s) existing = JSON.parse(s); } catch (e) { }
    if (!existing.perBulan) existing.perBulan = {};
    const prevExcluded = existing.perBulan[bulan]?.excludedDirs || {};
    existing.perBulan[bulan] = monthData;
    existing.perBulan[bulan].excludedDirs = prevExcluded;

    // Save monthly trend inputs SEPARATELY for ALL months
    Object.keys(TREND_CHARTS).forEach(key => {
        for (let m = 1; m <= 12; m++) {
            if (m === bulan) continue;
            const el = document.getElementById('monthly-' + key + '-' + m);
            if (!el) continue;
            if (!existing.perBulan[m]) existing.perBulan[m] = { cards: {} };
            existing.perBulan[m]['trend_' + key] = el.value;
        }
    });

    existing.savedAt = new Date().toISOString();
    try {
        localStorage.setItem(storageKey, JSON.stringify(existing));
        const nb = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][bulan - 1];
        if (!silent) showToast('Data bulan ' + nb + ' berhasil disimpan!', 'success');
        hasUnsaved = false;
        // Refresh charts after save
        Object.keys(DIR_CHARTS).forEach(key => updateDirChart(key));
        const btn = document.getElementById('btnSave');
        if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Tersimpan'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-save"></i> Simpan Semua Data'; }, 2000); }
    } catch (e) { showToast('Gagal menyimpan data!', 'error'); }
}

function loadAllData() {
    combinedDirDataEks = {}; // reset

    // Clear all fields first
    CARD_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    Object.keys(DIR_CHARTS).forEach(key => { const dl = getActiveTindakPidanaListEks(key); dl.forEach((d, i) => { const el = document.getElementById('dir-' + key + '-' + i); if (el) el.value = ''; }); });

    const saved = localStorage.getItem(getEksekusiStorageKey());
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        const bA = parseInt(document.getElementById('filterBulan1')?.value || '1');
        const bB = parseInt(document.getElementById('filterBulan2')?.value || bA);
        const start = Math.min(bA, bB), end = Math.max(bA, bB);
        if (data.perBulan) {
            const sumC = {};
            const sumD = {};
            Object.keys(DIR_CHARTS).forEach(k => { sumD[k] = {}; });
            for (let m = start; m <= end; m++) {
                const md = data.perBulan[m]; if (!md) continue;
                _sumE(sumC, md.cards);
                Object.keys(DIR_CHARTS).forEach(k => { _sumE(sumD[k], md[k + 'Dir']); });
            }
            CARD_FIELDS.forEach(id => { const el = document.getElementById(id); if (el && sumC[id] !== undefined) el.value = sumC[id]; });
            Object.keys(DIR_CHARTS).forEach(key => {
                const dl = getActiveTindakPidanaListEks(key), ks = Object.keys(sumD[key]), isL = ks.length > 0 && isNaN(parseInt(ks[0]));
                if (start !== end) combinedDirDataEks[key] = sumD[key];
                if (isL) { dl.forEach((d, i) => { const el = document.getElementById('dir-' + key + '-' + i); if (el && sumD[key][d] !== undefined) el.value = sumD[key][d]; }); }
                else { ks.forEach(i => { const el = document.getElementById('dir-' + key + '-' + i); if (el) el.value = sumD[key][i]; }); }
            });
            Object.keys(TREND_CHARTS).forEach(key => {
                for (let m = 1; m <= 12; m++) {
                    const md = data.perBulan[m];
                    const el = document.getElementById('monthly-' + key + '-' + m);
                    if (el) {
                        let val = (md && md['trend_' + key] !== undefined ? md['trend_' + key] : (md && md.cards && md.cards[key])) || '';
                        if (TREND_CHARTS[key]?.isCurrency && val) { const raw = String(val).replace(/\D/g, ''); if (raw.length > 0) val = parseInt(raw, 10).toLocaleString('id-ID'); }
                        el.value = val;
                    }
                }
            });
            return;
        }
        // Legacy
        if (data.cards) { Object.keys(data.cards).forEach(id => { const el = document.getElementById(id); if (el) el.value = data.cards[id]; }); }
        Object.keys(TREND_CHARTS).forEach(key => {
            if (data[key + 'Monthly']) {
                Object.keys(data[key + 'Monthly']).forEach(idx => {
                    const el = document.getElementById('monthly-' + key + '-' + idx);
                    if (el) { el.value = data[key + 'Monthly'][idx]; if (TREND_CHARTS[key]?.isCurrency && el.value) { const raw = el.value.replace(/\D/g, ''); if (raw.length > 0) el.value = parseInt(raw, 10).toLocaleString('id-ID'); } }
                });
            }
        });
        Object.keys(DIR_CHARTS).forEach(key => {
            if (data[key + 'Dir']) {
                const dl = getActiveTindakPidanaListEks(key), ks = Object.keys(data[key + 'Dir']), isL = ks.length > 0 && isNaN(parseInt(ks[0]));
                if (isL) { dl.forEach((d, i) => { const el = document.getElementById('dir-' + key + '-' + i); if (el && data[key + 'Dir'][d] !== undefined) el.value = data[key + 'Dir'][d]; }); }
                else { ks.forEach(i => { const el = document.getElementById('dir-' + key + '-' + i); if (el) el.value = data[key + 'Dir'][i]; }); }
            }
        });
    } catch (e) { console.error('Load error:', e); }
}
function _sumE(t, s) { if (!s) return; Object.keys(s).forEach(k => { t[k] = ((parseInt(t[k]) || 0) + (parseInt(s[k]) || 0)).toString(); }); }

function resetAllData() {
    if (!confirm('Apakah Anda yakin ingin mengosongkan semua data di halaman ini?')) return;

    CARD_FIELDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    Object.keys(TREND_CHARTS).forEach(key => {
        getSelectedMonths().forEach(m => {
            const el = document.getElementById(`monthly-${key}-${m.index}`);
            if (el) el.value = '';
        });
        updateTrendChart(key);
    });

    Object.keys(DIR_CHARTS).forEach(key => {
        const tpListReset = getActiveTindakPidanaListEks(key);
        tpListReset.forEach((_, idx) => {
            const el = document.getElementById(`dir-${key}-${idx}`);
            if (el) el.value = '';
        });
        updateDirChart(key);
    });

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
    Object.keys(TREND_CHARTS).forEach(key => {
        generateMonthlyInputs(key, TREND_CHARTS[key].monthlyGrid);
    });

    // Clear ALL inputs before loading new year data
    Object.keys(TREND_CHARTS).forEach(key => {
        TREND_CHARTS[key].fields.forEach(id => {
            const el = document.getElementById(id); if (el) el.value = '';
        });
        getSelectedMonths().forEach(m => {
            const el = document.getElementById(`monthly-${key}-${m.index}`);
            if (el) el.value = '';
        });
    });

    // Load saved data for new year
    loadAllData();
    Object.keys(TREND_CHARTS).forEach(key => updateTrendChart(key));
    Object.keys(DIR_CHARTS).forEach(key => updateDirChart(key));
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

    CARD_FIELDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    Object.keys(TREND_CHARTS).forEach(key => {
        generateMonthlyInputs(key, TREND_CHARTS[key].monthlyGrid);
        updateTrendChart(key);
    });
    Object.keys(DIR_CHARTS).forEach(key => updateDirChart(key));

    clearTempFilter();
    showToast('Filter telah direset', 'success');
}

// ============================================
// DIREKTORAT MANAGEMENT UI (per-section)
// ============================================

function renderDirektoratTags(key) {
    const container = document.getElementById('direktoratTagsContainer_' + key);
    if (!container) return;
    const list = getActiveTindakPidanaListEks(key);
    container.innerHTML = '';
    list.forEach(dir => {
        const tag = document.createElement('span');
        tag.className = 'year-tag';
        tag.textContent = dir + ' ';
        const btn = document.createElement('button');
        btn.className = 'year-tag-delete';
        btn.title = 'Hapus ' + dir;
        btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        btn.addEventListener('click', function () { handleDeleteDirektorat(key, dir); });
        tag.appendChild(btn);
        container.appendChild(tag);
    });
}

function renderAllDirektoratTags() {
    Object.keys(DIR_CHARTS).forEach(key => renderDirektoratTags(key));
}

function handleAddDirektorat(key) {
    const input = document.getElementById('inputDirektoratBaru_' + key);
    if (!input) return;
    const val = input.value.trim();
    if (!val) { showToast('Masukkan nama kategori tindak pidana', 'error'); return; }

    const bulan = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const storageKey = getEksekusiStorageKey();

    // Add to global list (if not already there)
    addDirektorat(val, 'eks_' + key);

    // Un-exclude for current month (in case it was previously excluded)
    unexcludeDirForMonth(storageKey, key, val, bulan);

    showToast('Kategori "' + val + '" berhasil ditambahkan', 'success');
    input.value = '';
    renderDirektoratTags(key);
    rebuildSectionUI(key);
}

function handleDeleteDirektorat(key, label) {
    // Auto-save current unsaved data before delete & reload
    saveAllData(true);

    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);

    if (bulanAwal !== bulanAkhir) {
        showToast('Untuk menghapus kategori, Bulan Awal dan Bulan Akhir harus sama.', 'error');
        return;
    }

    const bulan = bulanAwal;
    const namaBulan = BULAN_NAMES_EKS[bulan - 1] || bulan;

    if (!confirm('Hapus kategori "' + label + '" dari bulan ' + namaBulan + '?')) return;

    const storageKey = getEksekusiStorageKey();
    excludeDirForMonth(storageKey, key, label, bulan);

    showToast('Kategori "' + label + '" berhasil dihapus dari bulan ' + namaBulan, 'success');
    renderDirektoratTags(key);
    rebuildSectionUI(key);
}

function rebuildSectionUI(key) {
    generateDirInputs(key, DIR_CHARTS[key].dirGrid);
    loadAllData();
    updateDirChart(key);
}
