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

// ---- Storage key ----
function getUpayaHukumStorageKey() {
    const w = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t = document.getElementById('filterTahun')?.value || '';
    return `upayahukum_${w}_${s1}_${s2}_${t}`;
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
        const visible = isMonthVisible(m.index, section);
        div.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <label style="margin:0;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:${visible ? '#2c3e50' : '#adb5bd'};">${m.name}</label>
                <div style="display:flex;gap:4px;">
                    <button type="button" class="btn-hapus-bulan" title="${visible ? 'Sembunyikan dari grafik' : 'Tampilkan di grafik'}" onclick="event.preventDefault();event.stopPropagation();handleToggleVisibility(${m.index},'${section}')"
                        style="${visible ? '' : 'background:#e2e8f0;color:#64748b;border-color:#cbd5e1;'}">
                        <i class="fas ${visible ? 'fa-eye' : 'fa-eye-slash'}"></i>
                    </button>
                    <button type="button" class="btn-hapus-bulan" title="Hapus ${m.name}" onclick="event.preventDefault();event.stopPropagation();handleDeleteBulan(${m.index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <input type="number" id="monthly-${section}-${m.index}" placeholder="0" min="0"
                   style="${visible ? '' : 'opacity:0.5;background:#f1f5f9;'}"
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

    // Gunakan direktorat list yang sesuai dengan section
    const dirList = getDirektoratMapUH(section);

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
}

function onMonthlyInputUH(section) {
    markUnsaved();
    updateTrendChartUH(section);
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

    // Gunakan direktorat list yang sesuai dengan section
    const dirList = getDirektoratMapUH(section);

    const values = dirList.map((_, idx) => {
        const input = document.getElementById(`dir-${section}-${idx}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    // Generate enough colors for dynamic list
    const bgColors = dirList.map((_, i) => chartColorsUH.bar.backgroundColor[i % chartColorsUH.bar.backgroundColor.length]);
    const hoverColors = dirList.map((_, i) => chartColorsUH.bar.hoverBg[i % chartColorsUH.bar.hoverBg.length]);

    // Update chart (bar chart for both banding & kasasi)
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
// SAVE & LOAD
// ============================================

function saveAllData(silent) {
    const allData = { savedAt: new Date().toISOString() };

    Object.keys(SECTIONS_UH).forEach(sec => {
        // Card values
        allData[`${sec}Cards`] = {};
        SECTIONS_UH[sec].fields.forEach(id => {
            const input = document.getElementById(id);
            if (input) allData[`${sec}Cards`][id] = input.value;
        });

        // Monthly values
        allData[`${sec}Monthly`] = {};
        getSelectedMonths().forEach(m => {
            const input = document.getElementById(`monthly-${sec}-${m.index}`);
            if (input) allData[`${sec}Monthly`][m.index] = input.value;
        });

        // Dir values (keyed by label for banding, index for kasasi)
        allData[`${sec}Dir`] = {};
        const dirList = getDirektoratMapUH(sec);
        dirList.forEach((dir, idx) => {
            const input = document.getElementById(`dir-${sec}-${idx}`);
            if (input) {
                const key = sec === 'kasasi' ? idx : dir;
                allData[`${sec}Dir`][key] = input.value;
            }
        });
    });

    try {
        localStorage.setItem(getUpayaHukumStorageKey(), JSON.stringify(allData));
        if (!silent) showToast('Semua data berhasil disimpan!', 'success');
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
    const saved = localStorage.getItem(getUpayaHukumStorageKey());
    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        Object.keys(SECTIONS_UH).forEach(sec => {
            if (data[`${sec}Cards`]) {
                Object.keys(data[`${sec}Cards`]).forEach(id => {
                    const input = document.getElementById(id);
                    if (input) input.value = data[`${sec}Cards`][id];
                });
            }
            if (data[`${sec}Monthly`]) {
                Object.keys(data[`${sec}Monthly`]).forEach(idx => {
                    const input = document.getElementById(`monthly-${sec}-${idx}`);
                    if (input) input.value = data[`${sec}Monthly`][idx];
                });
            }
            if (data[`${sec}Dir`]) {
                const dirList = getDirektoratMapUH(sec);
                const keys = Object.keys(data[`${sec}Dir`]);
                const isLabelBased = sec !== 'kasasi' && keys.length > 0 && isNaN(parseInt(keys[0]));
                if (isLabelBased) {
                    dirList.forEach((dir, idx) => {
                        const input = document.getElementById(`dir-${sec}-${idx}`);
                        if (input && data[`${sec}Dir`][dir]) input.value = data[`${sec}Dir`][dir];
                    });
                } else {
                    keys.forEach(idx => {
                        const input = document.getElementById(`dir-${sec}-${idx}`);
                        if (input) input.value = data[`${sec}Dir`][idx];
                    });
                }
            }
        });
    } catch (e) {
        console.error('Load error:', e);
    }
}

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
        const dirList = getDirektoratMapUH(sec);
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
    // NOTE: Admin harus klik "Simpan" sebelum ganti tahun agar data tersimpan

    // Sync Bulan Awal/Akhir to localStorage
    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);
    const visibleList = [bulanAwal];
    if (bulanAkhir !== bulanAwal) visibleList.push(bulanAkhir);
    saveVisibleBulanList(visibleList);

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
        const dirList = getDirektoratMapUH(sec);
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

    showToast('Filter telah direset', 'success');
}

// ============================================
// DIREKTORAT MANAGEMENT UI
// ============================================
function renderDirektoratTags() {
    const container = document.getElementById('direktoratTagsContainer');
    if (!container) return;
    const list = getDirektoratBanding();
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
    if (addDirektorat(val, 'uh_banding')) {
        showToast('Kategori "' + val + '" berhasil ditambahkan (Banding)', 'success');
        input.value = '';
        renderDirektoratTags();
        rebuildDirektoratUI('banding');
    } else {
        showToast('Kategori sudah ada atau tidak valid', 'error');
    }
}

function handleDeleteDirektorat(label) {
    if (!confirm('Hapus kategori "' + label + '" dari daftar Banding?')) return;
    if (deleteDirektorat(label, 'uh_banding')) {
        showToast('Kategori "' + label + '" berhasil dihapus (Banding)', 'success');
        renderDirektoratTags();
        rebuildDirektoratUI('banding');
    } else {
        showToast('Tidak dapat menghapus kategori terakhir', 'error');
    }
}

// ---- Kasasi Direktorat Management ----
function renderDirektoratKasasiTags() {
    const container = document.getElementById('direktoratKasasiTagsContainer');
    if (!container) return;
    const dirs = getDirektoratKasasi();
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
    if (addDirektorat(val, 'uh_kasasi')) {
        showToast('Kategori "' + val + '" berhasil ditambahkan (Kasasi)', 'success');
        input.value = '';
        renderDirektoratKasasiTags();
        rebuildDirektoratUI('kasasi');
    } else {
        showToast('Kategori sudah ada atau tidak valid', 'error');
    }
}

function handleDeleteDirektoratKasasi(label) {
    if (!confirm('Hapus kategori "' + label + '" dari daftar Kasasi?')) return;
    if (deleteDirektorat(label, 'uh_kasasi')) {
        showToast('Kategori "' + label + '" berhasil dihapus (Kasasi)', 'success');
        renderDirektoratKasasiTags();
        rebuildDirektoratUI('kasasi');
    } else {
        showToast('Tidak dapat menghapus kategori terakhir', 'error');
    }
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
