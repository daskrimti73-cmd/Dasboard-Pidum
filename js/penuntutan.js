/* ============================================
   PENUNTUTAN - JAVASCRIPT
   Charts, data management, auto-update logic
   3 sections: Tahap II, Pelimpahan, Tuntutan
   Now with dynamic direktorat/tindak pidana
   ============================================ */

const BULAN_NAMES_P = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// ---- Get direktorat list per section ----
function getDirListForSectionP(section) {
    return getDirektoratList('penuntutan_' + section);
}

// ---- All sections config ----
const SECTIONS = {
    tahap2: {
        fields: ['tahap2-tahap2', 'tahap2-p16a', 'tahap2-t7', 'tahap2-ba4', 'tahap2-ba5', 'tahap2-skpp'],
        monthlyGrid: 'tahap2MonthlyGrid',
        dirGrid: 'tahap2DirGrid',
        trendChart: null,
        dirChart: null,
        trendCanvasId: 'chartTahap2Trend',
        dirCanvasId: 'chartTahap2Dir',
        label: 'Tahap II'
    },
    pelimpahan: {
        fields: ['pelimpahan-p29', 'pelimpahan-p30', 'pelimpahan-p33'],
        monthlyGrid: 'pelimpahanMonthlyGrid',
        dirGrid: 'pelimpahanDirGrid',
        trendChart: null,
        dirChart: null,
        trendCanvasId: 'chartPelimpahanTrend',
        dirCanvasId: 'chartPelimpahanDir',
        label: 'Pelimpahan'
    },
    tuntutan: {
        fields: ['tuntutan-p41', 'tuntutan-p42', 'tuntutan-putusan'],
        monthlyGrid: 'tuntutanMonthlyGrid',
        dirGrid: 'tuntutanDirGrid',
        trendChart: null,
        dirChart: null,
        trendCanvasId: 'chartTuntutanTrend',
        dirCanvasId: 'chartTuntutanDir',
        label: 'Tuntutan'
    }
};

// ---- Chart color palette ----
const chartColorsP = {
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

// ---- Storage key ----
function getPenuntutanStorageKey() {
    const w = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t = document.getElementById('filterTahun')?.value || '';
    return `penuntutan_${w}_${s1}_${s2}_${t}`;
}

// ---- Month range from filter ----
function getMonthRangeP(section) {
    return getChartMonthRange(section);
}

// ---- Page-specific: rebuild monthly UI when months change ----
function rebuildMonthlyUI() {
    saveAllData(true);
    Object.keys(SECTIONS).forEach(sec => {
        generateMonthlyInputsP(sec, SECTIONS[sec].monthlyGrid);
    });
    loadAllData();
    Object.keys(SECTIONS).forEach(sec => updateTrendChartP(sec));
}

// ---- Initialize ----
function initPenuntutan() {
    Object.keys(SECTIONS).forEach(sec => {
        generateMonthlyInputsP(sec, SECTIONS[sec].monthlyGrid);
        generateDirInputsP(sec, SECTIONS[sec].dirGrid);
    });
    loadAllData();
    initAllChartsP();
    renderAllDirektoratTags();
}

// ---- Generate monthly inputs ----
function generateMonthlyInputsP(section, gridId) {
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
                <div style="display:flex;gap:4px;">
                    <button type="button" class="btn-hapus-bulan" title="Hapus ${m.name}" onclick="event.preventDefault();event.stopPropagation();handleDeleteBulan(${m.index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <input type="number" id="monthly-${section}-${m.index}" placeholder="0" min="0"
                   oninput="onMonthlyInputP('${section}')">
        `;
        grid.appendChild(div);
    });
}

// ---- Generate direktorat inputs (dynamic) ----
function generateDirInputsP(section, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';

    const dirList = getDirListForSectionP(section);

    dirList.forEach((dir, idx) => {
        const div = document.createElement('div');
        div.className = 'dir-input-group';
        div.innerHTML = `
            <label>${dir}</label>
            <input type="number" id="dir-${section}-${idx}" placeholder="0" min="0"
                   oninput="onDirInputP('${section}')">
        `;
        grid.appendChild(div);
    });
}

// ---- Toggle accordion ----
function toggleMonthlyDetail(section) {
    const bodyMap = {};
    const toggleMap = {};
    Object.keys(SECTIONS).forEach(sec => {
        bodyMap[sec] = `monthly${capitalize(sec)}`;
        bodyMap[sec + 'Dir'] = `monthly${capitalize(sec)}Dir`;
        toggleMap[sec] = `toggle${capitalize(sec)}`;
        toggleMap[sec + 'Dir'] = `toggle${capitalize(sec)}Dir`;
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

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ---- Event handlers ----
function onDataInput(section) {
    markUnsaved();
}

function onMonthlyInputP(section) {
    markUnsaved();
    updateTrendChartP(section);
}

function onDirInputP(section) {
    markUnsaved();
    updateDirChartP(section);
}

// ---- Chart options ----
function getLineOptsP() {
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

function getBarOptsP() {
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
function initAllChartsP() {
    Object.keys(SECTIONS).forEach(sec => {
        const trendCanvas = document.getElementById(SECTIONS[sec].trendCanvasId);
        if (trendCanvas) {
            SECTIONS[sec].trendChart = new Chart(trendCanvas.getContext('2d'), {
                type: 'line',
                data: { labels: [], datasets: [{ data: [] }] },
                options: getLineOptsP()
            });
        }

        const dirCanvas = document.getElementById(SECTIONS[sec].dirCanvasId);
        if (dirCanvas) {
            SECTIONS[sec].dirChart = new Chart(dirCanvas.getContext('2d'), {
                type: 'bar',
                data: { labels: [], datasets: [{ data: [] }] },
                options: getBarOptsP()
            });
        }

        updateTrendChartP(sec);
        updateDirChartP(sec);
    });
}

// ---- Update trend chart ----
function updateTrendChartP(section) {
    const chart = SECTIONS[section]?.trendChart;
    if (!chart) return;

    const months = getMonthRangeP(section);
    const labels = months.map(m => m.name);
    const values = months.map(m => {
        const input = document.getElementById(`monthly-${section}-${m.index}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    chart.data.labels = labels;
    chart.data.datasets = [{
        label: SECTIONS[section].label,
        data: values,
        borderColor: chartColorsP.line.borderColor,
        backgroundColor: chartColorsP.line.backgroundColor,
        pointBackgroundColor: chartColorsP.line.pointBg,
        pointBorderColor: chartColorsP.line.pointBorder,
        fill: true,
        borderWidth: 3
    }];

    const year = document.getElementById('filterTahun')?.value || new Date().getFullYear();
    chart.options.plugins.title.text = year.toString();
    chart.update('none');
}

// ---- Update dir chart ----
function updateDirChartP(section) {
    const chart = SECTIONS[section]?.dirChart;
    if (!chart) return;

    const dirList = getDirListForSectionP(section);

    const values = dirList.map((_, idx) => {
        const input = document.getElementById(`dir-${section}-${idx}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    // Generate enough colors
    const bgColors = [];
    const hoverColors = [];
    for (let i = 0; i < dirList.length; i++) {
        bgColors.push(chartColorsP.bar.backgroundColor[i % chartColorsP.bar.backgroundColor.length]);
        hoverColors.push(chartColorsP.bar.hoverBg[i % chartColorsP.bar.hoverBg.length]);
    }

    chart.data.labels = dirList;
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
    const list = getDirListForSectionP(section);
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
    Object.keys(SECTIONS).forEach(sec => renderDirektoratTags(sec));
}

function handleAddDirektorat(section) {
    const input = document.getElementById('inputDirektoratBaru_' + section);
    if (!input) return;
    const val = input.value.trim();
    if (!val) { showToast('Masukkan nama kategori tindak pidana', 'error'); return; }
    if (addDirektorat(val, 'penuntutan_' + section)) {
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
    if (deleteDirektorat(label, 'penuntutan_' + section)) {
        showToast('Kategori "' + label + '" berhasil dihapus', 'success');
        renderDirektoratTags(section);
        rebuildSectionUI(section);
    } else {
        showToast('Tidak dapat menghapus kategori terakhir', 'error');
    }
}

function rebuildSectionUI(section) {
    generateDirInputsP(section, SECTIONS[section].dirGrid);
    loadAllData();
    updateDirChartP(section);
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
    Object.keys(SECTIONS).forEach(sec => {
        monthData[sec + 'Cards'] = {};
        SECTIONS[sec].fields.forEach(id => { const el = document.getElementById(id); if (el) monthData[sec + 'Cards'][id] = el.value; });
        monthData[sec + 'Dir'] = {};
        getDirListForSectionP(sec).forEach((dir, idx) => { const el = document.getElementById('dir-' + sec + '-' + idx); if (el) monthData[sec + 'Dir'][dir] = el.value; });
    });
    const storageKey = getPenuntutanStorageKey();
    let existing = {}; try { const s = localStorage.getItem(storageKey); if (s) existing = JSON.parse(s); } catch (e) { }
    if (!existing.perBulan) existing.perBulan = {};
    existing.perBulan[bulan] = monthData;
    existing.savedAt = new Date().toISOString();
    try {
        localStorage.setItem(storageKey, JSON.stringify(existing));
        const nb = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][bulan - 1];
        if (!silent) showToast('Data bulan ' + nb + ' berhasil disimpan!', 'success');
        hasUnsaved = false;
        const btn = document.getElementById('btnSave');
        if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Tersimpan'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-save"></i> Simpan Semua Data'; }, 2000); }
    } catch (e) { showToast('Gagal menyimpan data!', 'error'); }
}

function loadAllData() {
    // Clear all fields first
    Object.keys(SECTIONS).forEach(sec => {
        SECTIONS[sec].fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        const dl = getDirListForSectionP(sec); dl.forEach((d, i) => { const el = document.getElementById('dir-' + sec + '-' + i); if (el) el.value = ''; });
    });

    const saved = localStorage.getItem(getPenuntutanStorageKey());
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        const bA = parseInt(document.getElementById('filterBulan1')?.value || '1');
        const bB = parseInt(document.getElementById('filterBulan2')?.value || bA);
        const start = Math.min(bA, bB), end = Math.max(bA, bB);
        if (data.perBulan) {
            Object.keys(SECTIONS).forEach(sec => {
                const sumC = {}, sumD = {};
                for (let m = start; m <= end; m++) { const md = data.perBulan[m]; if (!md) continue; _sumP(sumC, md[sec + 'Cards']); _sumP(sumD, md[sec + 'Dir']); }
                SECTIONS[sec].fields.forEach(id => { const el = document.getElementById(id); if (el && sumC[id] !== undefined) el.value = sumC[id]; });
                const dl = getDirListForSectionP(sec), ks = Object.keys(sumD), isL = ks.length > 0 && isNaN(parseInt(ks[0]));
                if (isL) { dl.forEach((d, i) => { const el = document.getElementById('dir-' + sec + '-' + i); if (el && sumD[d]) el.value = sumD[d]; }); }
                else { ks.forEach(i => { const el = document.getElementById('dir-' + sec + '-' + i); if (el) el.value = sumD[i]; }); }
                for (let m = 1; m <= 12; m++) { const md = data.perBulan[m]; const mf = SECTIONS[sec].fields[0]; const el = document.getElementById('monthly-' + sec + '-' + m); if (el) el.value = (md && md[sec + 'Cards'] && md[sec + 'Cards'][mf]) || ''; }
            });
            return;
        }
        // Legacy
        Object.keys(SECTIONS).forEach(sec => {
            if (data[sec + 'Cards']) { Object.keys(data[sec + 'Cards']).forEach(id => { const el = document.getElementById(id); if (el) el.value = data[sec + 'Cards'][id]; }); }
            if (data[sec + 'Monthly']) { Object.keys(data[sec + 'Monthly']).forEach(idx => { const el = document.getElementById('monthly-' + sec + '-' + idx); if (el) el.value = data[sec + 'Monthly'][idx]; }); }
            if (data[sec + 'Dir']) {
                const dl = getDirListForSectionP(sec), ks = Object.keys(data[sec + 'Dir']), isL = ks.length > 0 && isNaN(parseInt(ks[0]));
                if (isL) { dl.forEach((d, i) => { const el = document.getElementById('dir-' + sec + '-' + i); if (el && data[sec + 'Dir'][d]) el.value = data[sec + 'Dir'][d]; }); }
                else { ks.forEach(i => { const el = document.getElementById('dir-' + sec + '-' + i); if (el) el.value = data[sec + 'Dir'][i]; }); }
            }
        });
    } catch (e) { console.error('Load error:', e); }
}
function _sumP(t, s) { if (!s) return; Object.keys(s).forEach(k => { t[k] = ((parseInt(t[k]) || 0) + (parseInt(s[k]) || 0)).toString(); }); }

function resetAllData() {
    if (!confirm('Apakah Anda yakin ingin mengosongkan semua data di halaman ini?')) return;

    Object.keys(SECTIONS).forEach(sec => {
        SECTIONS[sec].fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        getSelectedMonths().forEach(m => {
            const el = document.getElementById(`monthly-${sec}-${m.index}`);
            if (el) el.value = '';
        });
        const dirList = getDirListForSectionP(sec);
        dirList.forEach((_, idx) => {
            const el = document.getElementById(`dir-${sec}-${idx}`);
            if (el) el.value = '';
        });
        updateTrendChartP(sec);
        updateDirChartP(sec);
    });

    showToast('Semua data telah dikosongkan', 'success');
}

// ---- Filters (override) ----
function applyFilters() {
    // NOTE: Admin harus klik "Simpan" sebelum ganti tahun agar data tersimpan

    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);
    // Set temporary filter (session-only, resets on page reload)
    setTempFilter(bulanAwal, bulanAkhir);

    // Regenerate inputs
    Object.keys(SECTIONS).forEach(sec => {
        generateMonthlyInputsP(sec, SECTIONS[sec].monthlyGrid);
    });

    // Clear ALL inputs before loading new year data
    Object.keys(SECTIONS).forEach(sec => {
        SECTIONS[sec].fields.forEach(id => {
            const el = document.getElementById(id); if (el) el.value = '';
        });
        getSelectedMonths().forEach(m => {
            const el = document.getElementById(`monthly-${sec}-${m.index}`);
            if (el) el.value = '';
        });
    });

    // Load saved data for new year
    loadAllData();
    Object.keys(SECTIONS).forEach(sec => {
        updateTrendChartP(sec);
        updateDirChartP(sec);
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

    Object.keys(SECTIONS).forEach(sec => {
        generateMonthlyInputsP(sec, SECTIONS[sec].monthlyGrid);
        SECTIONS[sec].fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        updateTrendChartP(sec);
        updateDirChartP(sec);
    });

    clearTempFilter();
    showToast('Filter telah direset', 'success');
}
