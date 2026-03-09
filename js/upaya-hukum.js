/* ============================================
   UPAYA HUKUM - JAVASCRIPT
   Charts, data management, auto-update logic
   2 sections: Banding, Kasasi
   ============================================ */

const BULAN_NAMES_UH = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Direktorat list untuk Banding - per-section key
function getDirektoratBanding() {
    return getDirektoratList('uh_banding');
}

// Direktorat list untuk Kasasi - per-section key
function getDirektoratKasasi() {
    return getDirektoratList('uh_kasasi');
}

// Mapping section ke direktorat list
function getDirektoratMapUH(section) {
    if (section === 'kasasi') return getDirektoratKasasi();
    return getDirektoratBanding();
}

// ---- Get active direktorat list filtered by current month's excluded dirs ----
function getActiveDirMapUH(section) {
    const fullList = getDirektoratMapUH(section);
    const bulan = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulan);
    if (bulan !== bulanAkhir) return fullList; // combined mode: show all
    const excluded = getExcludedDirsForMonth(getUpayaHukumStorageKey(), section, bulan);
    return fullList.filter(d => !excluded.includes(d));
}

// ---- All sections config ----
const SECTIONS_UH = {
    banding: {
        fields: ['banding-pengajuan', 'banding-putusan'],
        monthlyGrid: 'bandingMonthlyGrid',
        dirGrid: 'bandingDirGrid',
        trendChart: null,
        dirChart: null,
        trendCanvasId: 'chartBandingTrend',
        dirCanvasId: 'chartBandingDir',
        label: 'Banding'
    },
    kasasi: {
        fields: ['kasasi-pengajuan', 'kasasi-putusan'],
        monthlyGrid: 'kasasiMonthlyGrid',
        dirGrid: 'kasasiDirGrid',
        trendChart: null,
        dirChart: null,
        trendCanvasId: 'chartKasasiTrend',
        dirCanvasId: 'chartKasasiDir',
        label: 'Kasasi'
    }
};

// ---- Chart color palette ----
const chartColorsUH = {
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
            'rgba(15, 52, 96, 0.80)'
        ],
        hoverBg: [
            'rgba(15, 52, 96, 1)',
            'rgba(15, 52, 96, 0.9)',
            'rgba(15, 52, 96, 0.8)',
            'rgba(15, 52, 96, 0.7)',
            'rgba(15, 52, 96, 0.6)',
            'rgba(15, 52, 96, 0.95)'
        ]
    }
};

let combinedDirDataUH = {}; // holds merged dirValues per section when viewing combined months

// ---- Storage key ----
function getUpayaHukumStorageKey() {
    return buildStorageKey('upayahukum');
}

// ---- Month range from filter ----
function getMonthRangeUH(section) {
    return getChartMonthRange(section);
}

// ---- Page-specific ----
function rebuildMonthlyUI() {
    saveAllData(true);
    Object.keys(SECTIONS_UH).forEach(sec => {
        generateMonthlyInputsUH(sec, SECTIONS_UH[sec].monthlyGrid);
    });
    loadAllData();
    Object.keys(SECTIONS_UH).forEach(sec => updateTrendChartUH(sec));
}

// ---- Initialize ----
function initUpayaHukum() {
    Object.keys(SECTIONS_UH).forEach(sec => {
        generateMonthlyInputsUH(sec, SECTIONS_UH[sec].monthlyGrid);
        generateDirInputsUH(sec, SECTIONS_UH[sec].dirGrid);
    });
    loadAllData();
    initAllChartsUH();
    renderDirektoratTags();
    renderDirektoratKasasiTags();
}

// ---- Generate monthly inputs ----
function generateMonthlyInputsUH(section, gridId) {
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
            <input type="number" id="monthly-${section}-${m.index}" placeholder="0" min="0"
                   oninput="onMonthlyInputUH('${section}')">
        `;
        grid.appendChild(div);
    });
}

// ---- Generate direktorat inputs ----
function generateDirInputsUH(section, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';

    // Gunakan direktorat list yang sesuai dengan section (filtered by excluded)
    const dirList = getActiveDirMapUH(section);

    dirList.forEach((dir, idx) => {
        const div = document.createElement('div');
        div.className = 'dir-input-group';

        const label = dir;

        div.innerHTML = `
            <label>${label}</label>
            <input type="number" id="dir-${section}-${idx}" placeholder="0" min="0"
                   oninput="onDirInputUH('${section}')">
        `;
        grid.appendChild(div);
    });
}

// ---- Toggle accordion ----
function toggleMonthlyDetail(section) {
    const bodyMap = {};
    const toggleMap = {};
    Object.keys(SECTIONS_UH).forEach(sec => {
        bodyMap[sec] = `monthly${capitalizeUH(sec)}`;
        bodyMap[sec + 'Dir'] = `monthly${capitalizeUH(sec)}Dir`;
        toggleMap[sec] = `toggle${capitalizeUH(sec)}`;
        toggleMap[sec + 'Dir'] = `toggle${capitalizeUH(sec)}Dir`;
    });

    const bodyId = bodyMap[section];
    const toggleId = toggleMap[section];
    const body = document.getElementById(bodyId);
    const icon = document.getElementById(toggleId);

    if (body) {
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? 'block' : 'none';
        if (icon) icon.classList.toggle('rotated', isHidden);
    }
}

function capitalizeUH(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ---- Event handlers ----
function onDataInput(section) {
    markUnsaved();
    // Card inputs do NOT update the trend chart - only monthly inputs do
}

function onMonthlyInputUH(section) {
    markUnsaved();
    updateTrendChartUH(section);
    // No sync to card - they are completely independent
}

function onDirInputUH(section) {
    markUnsaved();
    updateDirChartUH(section);
}

// ---- Chart options ----
function getLineOptsUH() {
    return {
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
                callbacks: { label: ctx => `Jumlah: ${ctx.parsed.y}` }
            }
        },
        scales: {
            x: { title: { display: true, text: 'Bulan', font: { size: 12, weight: '600' } }, grid: { display: false } },
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { precision: 0 } }
        },
        elements: { line: { tension: 0.3 }, point: { radius: 6, hoverRadius: 8, borderWidth: 3 } }
    };
}

function getBarOptsUH() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        plugins: {
            legend: { display: false },
            tooltip: makeBarTooltip()
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10, weight: '600' }, maxRotation: 45, minRotation: 30 } },
            y: { beginAtZero: true, title: { display: true, text: 'JUMLAH', font: { size: 11, weight: '700' } }, grid: { color: 'rgba(0,0,0,0.06)' } }
        }
    };
}

// ---- Init all charts ----
function initAllChartsUH() {
    Object.keys(SECTIONS_UH).forEach(sec => {
        const trendCanvas = document.getElementById(SECTIONS_UH[sec].trendCanvasId);
        if (trendCanvas) {
            SECTIONS_UH[sec].trendChart = new Chart(trendCanvas.getContext('2d'), {
                type: 'line',
                data: { labels: [], datasets: [{ data: [] }] },
                options: getLineOptsUH()
            });
        }

        const dirCanvas = document.getElementById(SECTIONS_UH[sec].dirCanvasId);
        if (dirCanvas) {
            // Both Banding & Kasasi use bar chart
            SECTIONS_UH[sec].dirChart = new Chart(dirCanvas.getContext('2d'), {
                type: 'bar',
                data: { labels: [], datasets: [{ data: [] }] },
                options: getBarOptsUH(sec)
            });
        }

        updateTrendChartUH(sec);
        updateDirChartUH(sec);
    });
}

// ---- Update trend chart ----
function updateTrendChartUH(section) {
    const chart = SECTIONS_UH[section]?.trendChart;
    if (!chart) return;

    const months = getMonthRangeUH(section);
    const labels = months.map(m => m.name);
    const values = months.map(m => {
        const input = document.getElementById(`monthly-${section}-${m.index}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    chart.data.labels = labels;
    chart.data.datasets = [{
        label: SECTIONS_UH[section].label,
        data: values,
        borderColor: chartColorsUH.line.borderColor,
        backgroundColor: chartColorsUH.line.backgroundColor,
        pointBackgroundColor: chartColorsUH.line.pointBg,
        pointBorderColor: chartColorsUH.line.pointBorder,
        fill: true,
        borderWidth: 3
    }];

    const year = document.getElementById('filterTahun')?.value || new Date().getFullYear();
    chart.options.plugins.title.text = year.toString();
    chart.update('none');
}

// ---- Update dir chart ----
function updateDirChartUH(section) {
    const chart = SECTIONS_UH[section]?.dirChart;
    if (!chart) return;

    const dirList = getActiveDirMapUH(section);
    const paired = dirList.map((dir, idx) => {
        const input = document.getElementById(`dir-${section}-${idx}`);
        return { label: dir, value: input ? (parseInt(input.value) || 0) : 0 };
    }).filter(p => p.value > 0);
    const labels = paired.map(p => p.label);
    const values = paired.map(p => p.value);

    const bgColors = labels.map((_, i) => chartColorsUH.bar.backgroundColor[i % chartColorsUH.bar.backgroundColor.length]);
    const hoverColors = labels.map((_, i) => chartColorsUH.bar.hoverBg[i % chartColorsUH.bar.hoverBg.length]);

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
// SAVE & LOAD
// ============================================

function saveAllData(silent) {
    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);
    if (bulanAwal !== bulanAkhir) { if (!silent) showToast('Untuk menyimpan data, Bulan Awal dan Bulan Akhir harus sama.', 'error'); return; }
    const bulan = bulanAwal;
    const monthData = {};
    Object.keys(SECTIONS_UH).forEach(sec => {
        monthData[sec + 'Cards'] = {};
        SECTIONS_UH[sec].fields.forEach(id => { const el = document.getElementById(id); if (el) monthData[sec + 'Cards'][id] = el.value; });
        monthData[sec + 'Dir'] = {};
        getActiveDirMapUH(sec).forEach((dir, idx) => {
            const el = document.getElementById('dir-' + sec + '-' + idx);
            if (el) { const key = sec === 'kasasi' ? idx : dir; monthData[sec + 'Dir'][key] = el.value; }
        });
    });
    const storageKey = getUpayaHukumStorageKey();
    let existing = {}; try { const s = localStorage.getItem(storageKey); if (s) existing = JSON.parse(s); } catch (e) { }
    if (!existing.perBulan) existing.perBulan = {};
    existing.perBulan[bulan] = monthData;

    // Save monthly trend inputs SEPARATELY for ALL months
    Object.keys(SECTIONS_UH).forEach(sec => {
        for (let m = 1; m <= 12; m++) {
            if (m === bulan) continue;
            const el = document.getElementById('monthly-' + sec + '-' + m);
            if (!el) continue;
            if (!existing.perBulan[m]) existing.perBulan[m] = {};
            existing.perBulan[m]['trend_' + sec] = el.value;
        }
    });

    existing.savedAt = new Date().toISOString();
    try {
        localStorage.setItem(storageKey, JSON.stringify(existing));
        const nb = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][bulan - 1];
        if (!silent) showToast('Data bulan ' + nb + ' berhasil disimpan!', 'success');
        hasUnsaved = false;
        // Refresh charts after save
        updateDirChartUH('banding');
        updateDirChartUH('kasasi');
        const btn = document.getElementById('btnSave');
        if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Tersimpan'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-save"></i> Simpan Semua Data'; }, 2000); }
    } catch (e) { showToast('Gagal menyimpan data!', 'error'); }
}

function loadAllData() {
    combinedDirDataUH = {}; // reset

    // Clear all fields first
    Object.keys(SECTIONS_UH).forEach(sec => {
        SECTIONS_UH[sec].fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        const dl = getActiveDirMapUH(sec); dl.forEach((d, i) => { const el = document.getElementById('dir-' + sec + '-' + i); if (el) el.value = ''; });
    });

    const saved = localStorage.getItem(getUpayaHukumStorageKey());
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        const bA = parseInt(document.getElementById('filterBulan1')?.value || '1');
        const bB = parseInt(document.getElementById('filterBulan2')?.value || bA);
        const start = Math.min(bA, bB), end = Math.max(bA, bB);
        if (data.perBulan) {
            Object.keys(SECTIONS_UH).forEach(sec => {
                const sumC = {}, sumD = {};
                for (let m = start; m <= end; m++) { const md = data.perBulan[m]; if (!md) continue; _sumUH(sumC, md[sec + 'Cards']); _sumUH(sumD, md[sec + 'Dir']); }
                if (start !== end) combinedDirDataUH[sec] = sumD;
                SECTIONS_UH[sec].fields.forEach(id => { const el = document.getElementById(id); if (el && sumC[id] !== undefined) el.value = sumC[id]; });
                const dl = getActiveDirMapUH(sec), ks = Object.keys(sumD), isL = sec !== 'kasasi' && ks.length > 0 && isNaN(parseInt(ks[0]));
                if (isL) { dl.forEach((d, i) => { const el = document.getElementById('dir-' + sec + '-' + i); if (el && sumD[d] !== undefined) el.value = sumD[d]; }); }
                else { ks.forEach(i => { const el = document.getElementById('dir-' + sec + '-' + i); if (el) el.value = sumD[i]; }); }
                for (let m = 1; m <= 12; m++) { const md = data.perBulan[m]; const mf = SECTIONS_UH[sec].fields[0]; const el = document.getElementById('monthly-' + sec + '-' + m); if (el) el.value = (md && md[sec + 'Cards'] && md[sec + 'Cards'][mf]) || ''; }
            });
            return;
        }
        // Legacy
        Object.keys(SECTIONS_UH).forEach(sec => {
            if (data[sec + 'Cards']) { Object.keys(data[sec + 'Cards']).forEach(id => { const el = document.getElementById(id); if (el) el.value = data[sec + 'Cards'][id]; }); }
            if (data[sec + 'Monthly']) { Object.keys(data[sec + 'Monthly']).forEach(idx => { const el = document.getElementById('monthly-' + sec + '-' + idx); if (el) el.value = data[sec + 'Monthly'][idx]; }); }
            if (data[sec + 'Dir']) {
                const dl = getActiveDirMapUH(sec), ks = Object.keys(data[sec + 'Dir']), isL = sec !== 'kasasi' && ks.length > 0 && isNaN(parseInt(ks[0]));
                if (isL) { dl.forEach((d, i) => { const el = document.getElementById('dir-' + sec + '-' + i); if (el && data[sec + 'Dir'][d] !== undefined) el.value = data[sec + 'Dir'][d]; }); }
                else { ks.forEach(i => { const el = document.getElementById('dir-' + sec + '-' + i); if (el) el.value = data[sec + 'Dir'][i]; }); }
            }
        });
    } catch (e) { console.error('Load error:', e); }
}
function _sumUH(t, s) { if (!s) return; Object.keys(s).forEach(k => { t[k] = ((parseInt(t[k]) || 0) + (parseInt(s[k]) || 0)).toString(); }); }

function resetAllData() {
    if (!confirm('Apakah Anda yakin ingin mengosongkan semua data di halaman ini?')) return;

    Object.keys(SECTIONS_UH).forEach(sec => {
        SECTIONS_UH[sec].fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        getSelectedMonths().forEach(m => {
            const el = document.getElementById(`monthly-${sec}-${m.index}`);
            if (el) el.value = '';
        });
        const dirList = getActiveDirMapUH(sec);
        dirList.forEach((_, idx) => {
            const el = document.getElementById(`dir-${sec}-${idx}`);
            if (el) el.value = '';
        });
        updateTrendChartUH(sec);
        updateDirChartUH(sec);
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
    Object.keys(SECTIONS_UH).forEach(sec => {
        generateMonthlyInputsUH(sec, SECTIONS_UH[sec].monthlyGrid);
    });

    // Clear ALL inputs before loading new year data
    Object.keys(SECTIONS_UH).forEach(sec => {
        SECTIONS_UH[sec].fields.forEach(id => {
            const el = document.getElementById(id); if (el) el.value = '';
        });
        getSelectedMonths().forEach(m => {
            const el = document.getElementById(`monthly-${sec}-${m.index}`);
            if (el) el.value = '';
        });
        const dirList = getActiveDirMapUH(sec);
        dirList.forEach((_, idx) => {
            const el = document.getElementById(`dir-${sec}-${idx}`);
            if (el) el.value = '';
        });
    });

    // Load saved data for new year
    loadAllData();
    Object.keys(SECTIONS_UH).forEach(sec => {
        updateTrendChartUH(sec);
        updateDirChartUH(sec);
    });
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

    Object.keys(SECTIONS_UH).forEach(sec => {
        generateMonthlyInputsUH(sec, SECTIONS_UH[sec].monthlyGrid);
        SECTIONS_UH[sec].fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        updateTrendChartUH(sec);
        updateDirChartUH(sec);
    });

    clearTempFilter();
    showToast('Filter telah direset', 'success');
}

// ============================================
// DIREKTORAT MANAGEMENT UI
// ============================================
function renderDirektoratTags() {
    const container = document.getElementById('direktoratTagsContainer');
    if (!container) return;
    const list = getActiveDirMapUH('banding');
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
    const storageKey = getUpayaHukumStorageKey();

    // Add to global list (if not already there)
    addDirektorat(val, 'uh_banding');

    // Un-exclude for current month (in case it was previously excluded)
    unexcludeDirForMonth(storageKey, 'banding', val, bulan);

    showToast('Kategori "' + val + '" berhasil ditambahkan (Banding)', 'success');
    input.value = '';
    renderDirektoratTags();
    rebuildDirektoratUI('banding');
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
    const namaBulan = BULAN_NAMES_UH[bulan - 1] || bulan;

    if (!confirm('Hapus kategori "' + label + '" dari bulan ' + namaBulan + ' (Banding)?')) return;

    const storageKey = getUpayaHukumStorageKey();
    excludeDirForMonth(storageKey, 'banding', label, bulan);

    showToast('Kategori "' + label + '" berhasil dihapus dari bulan ' + namaBulan + ' (Banding)', 'success');
    renderDirektoratTags();
    rebuildDirektoratUI('banding');
}

// ---- Kasasi Direktorat Management ----
function renderDirektoratKasasiTags() {
    const container = document.getElementById('direktoratKasasiTagsContainer');
    if (!container) return;
    const dirs = getActiveDirMapUH('kasasi');
    container.innerHTML = '';
    dirs.forEach(dir => {
        const tag = document.createElement('span');
        tag.className = 'year-tag';
        tag.textContent = dir + ' ';
        const btn = document.createElement('button');
        btn.className = 'year-tag-delete';
        btn.title = 'Hapus ' + dir;
        btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        btn.addEventListener('click', function () { handleDeleteDirektoratKasasi(dir); });
        tag.appendChild(btn);
        container.appendChild(tag);
    });
}

function handleAddDirektoratKasasi() {
    const input = document.getElementById('inputDirektoratKasasiBaru');
    if (!input) return;
    const val = input.value.trim();
    if (!val) { showToast('Masukkan nama kategori tindak pidana', 'error'); return; }

    const bulan = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const storageKey = getUpayaHukumStorageKey();

    // Add to global list (if not already there)
    addDirektorat(val, 'uh_kasasi');

    // Un-exclude for current month (in case it was previously excluded)
    unexcludeDirForMonth(storageKey, 'kasasi', val, bulan);

    showToast('Kategori "' + val + '" berhasil ditambahkan (Kasasi)', 'success');
    input.value = '';
    renderDirektoratKasasiTags();
    rebuildDirektoratUI('kasasi');
}

function handleDeleteDirektoratKasasi(label) {
    // Auto-save current unsaved data before delete & reload
    saveAllData(true);

    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);

    if (bulanAwal !== bulanAkhir) {
        showToast('Untuk menghapus kategori, Bulan Awal dan Bulan Akhir harus sama.', 'error');
        return;
    }

    const bulan = bulanAwal;
    const namaBulan = BULAN_NAMES_UH[bulan - 1] || bulan;

    if (!confirm('Hapus kategori "' + label + '" dari bulan ' + namaBulan + ' (Kasasi)?')) return;

    const storageKey = getUpayaHukumStorageKey();
    excludeDirForMonth(storageKey, 'kasasi', label, bulan);

    showToast('Kategori "' + label + '" berhasil dihapus dari bulan ' + namaBulan + ' (Kasasi)', 'success');
    renderDirektoratKasasiTags();
    rebuildDirektoratUI('kasasi');
}

function rebuildDirektoratUI(section) {
    if (!section || section === 'banding') {
        generateDirInputsUH('banding', SECTIONS_UH.banding.dirGrid);
        updateDirChartUH('banding');
    }
    if (!section || section === 'kasasi') {
        generateDirInputsUH('kasasi', SECTIONS_UH.kasasi.dirGrid);
        updateDirChartUH('kasasi');
    }
    loadAllData();
}
