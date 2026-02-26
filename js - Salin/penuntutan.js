/* ============================================
   PENUNTUTAN - JAVASCRIPT
   Charts, data management, auto-update logic
   3 sections: Tahap II, Pelimpahan, Tuntutan
   ============================================ */

const BULAN_NAMES_P = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Direktorat list untuk Tahap II (tambah Narkotika dan Oharda)
const DIREKTORAT_TAHAP2 = [
    'Direktorat A', 'Direktorat B', 'Direktorat C',
    'Direktorat D', 'Direktorat E', 'Mnegtibum dan TPUL',
    'Narkotika', 'Oharda'
];

// Direktorat list untuk Pelimpahan (tanpa Mnegtibum dan TPUL)
const DIREKTORAT_PELIMPAHAN = [
    'Direktorat A', 'Direktorat B', 'Direktorat C',
    'Direktorat D', 'Direktorat E',
    'Narkotika', 'Oharda'
];

// Direktorat list untuk Tuntutan (tambah Narkotika, Oharda, dan Terorisme)
const DIREKTORAT_TUNTUTAN = [
    'Direktorat A', 'Direktorat B', 'Direktorat C',
    'Direktorat D', 'Direktorat E', 'Mnegtibum dan TPUL',
    'Narkotika', 'Oharda', 'Terorisme'
];

// Mapping section ke direktorat list
const DIREKTORAT_MAP = {
    'tahap2': DIREKTORAT_TAHAP2,
    'pelimpahan': DIREKTORAT_PELIMPAHAN,
    'tuntutan': DIREKTORAT_TUNTUTAN
};

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
function getPenuntutanStorageKey() {
    const w = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t = document.getElementById('filterTahun')?.value || '';
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    return `penuntutan_${w}_${s1}_${s2}_${t}_${b1}_${b2}`;
}

// ---- Month range from filter ----
function getMonthRangeP() {
    const b1 = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const b2 = parseInt(document.getElementById('filterBulan2')?.value || '12');
    const months = [];
    for (let i = b1; i <= b2; i++) {
        months.push({ index: i, name: BULAN_NAMES_P[i - 1] });
    }
    return months;
}

// ---- Initialize ----
function initPenuntutan() {
    Object.keys(SECTIONS).forEach(sec => {
        generateMonthlyInputsP(sec, SECTIONS[sec].monthlyGrid);
        generateDirInputsP(sec, SECTIONS[sec].dirGrid);
    });
    loadAllData();
    initAllChartsP();
}

// ---- Generate monthly inputs ----
function generateMonthlyInputsP(section, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const months = getMonthRangeP();
    grid.innerHTML = '';
    months.forEach(m => {
        const div = document.createElement('div');
        div.className = 'month-input-group';
        div.innerHTML = `
            <label>${m.name}</label>
            <input type="number" id="monthly-${section}-${m.index}" placeholder="0" min="0"
                   oninput="onMonthlyInputP('${section}')">
        `;
        grid.appendChild(div);
    });
}

// ---- Generate direktorat inputs ----
function generateDirInputsP(section, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    
    // Gunakan direktorat list yang sesuai dengan section
    const dirList = DIREKTORAT_MAP[section] || DIREKTORAT_TAHAP2;
    
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

    const months = getMonthRangeP();
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

    // Gunakan direktorat list yang sesuai dengan section
    const dirList = DIREKTORAT_MAP[section] || DIREKTORAT_TAHAP2;

    const values = dirList.map((_, idx) => {
        const input = document.getElementById(`dir-${section}-${idx}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    chart.data.labels = dirList;
    chart.data.datasets = [{
        label: 'Jumlah',
        data: values,
        backgroundColor: chartColorsP.bar.backgroundColor,
        hoverBackgroundColor: chartColorsP.bar.hoverBg,
        borderRadius: 4,
        borderSkipped: false,
        barPercentage: 0.7
    }];

    chart.update('none');
}

// ============================================
// SAVE & LOAD
// ============================================

function saveAllData() {
    const allData = { savedAt: new Date().toISOString() };

    Object.keys(SECTIONS).forEach(sec => {
        // Card values
        allData[`${sec}Cards`] = {};
        SECTIONS[sec].fields.forEach(id => {
            const input = document.getElementById(id);
            if (input) allData[`${sec}Cards`][id] = input.value;
        });

        // Monthly values
        allData[`${sec}Monthly`] = {};
        getMonthRangeP().forEach(m => {
            const input = document.getElementById(`monthly-${sec}-${m.index}`);
            if (input) allData[`${sec}Monthly`][m.index] = input.value;
        });

        // Dir values
        allData[`${sec}Dir`] = {};
        const dirList = DIREKTORAT_MAP[sec] || DIREKTORAT_TAHAP2;
        dirList.forEach((_, idx) => {
            const input = document.getElementById(`dir-${sec}-${idx}`);
            if (input) allData[`${sec}Dir`][idx] = input.value;
        });
    });

    try {
        localStorage.setItem(getPenuntutanStorageKey(), JSON.stringify(allData));
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
    const saved = localStorage.getItem(getPenuntutanStorageKey());
    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        Object.keys(SECTIONS).forEach(sec => {
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
                Object.keys(data[`${sec}Dir`]).forEach(idx => {
                    const input = document.getElementById(`dir-${sec}-${idx}`);
                    if (input) input.value = data[`${sec}Dir`][idx];
                });
            }
        });
    } catch (e) {
        console.error('Load error:', e);
    }
}

function resetAllData() {
    if (!confirm('Apakah Anda yakin ingin mengosongkan semua data di halaman ini?')) return;

    Object.keys(SECTIONS).forEach(sec => {
        SECTIONS[sec].fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        getMonthRangeP().forEach(m => {
            const el = document.getElementById(`monthly-${sec}-${m.index}`);
            if (el) el.value = '';
        });
        const dirList = DIREKTORAT_MAP[sec] || DIREKTORAT_TAHAP2;
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
    Object.keys(SECTIONS).forEach(sec => {
        generateMonthlyInputsP(sec, SECTIONS[sec].monthlyGrid);
    });
    loadAllData();
    Object.keys(SECTIONS).forEach(sec => {
        updateTrendChartP(sec);
        updateDirChartP(sec);
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
    document.getElementById('filterBulan2').value = '02';

    Object.keys(SECTIONS).forEach(sec => {
        generateMonthlyInputsP(sec, SECTIONS[sec].monthlyGrid);
        SECTIONS[sec].fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        updateTrendChartP(sec);
        updateDirChartP(sec);
    });

    showToast('Filter telah direset', 'success');
}
