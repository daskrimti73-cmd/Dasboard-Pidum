/* ============================================
   UPAYA HUKUM - JAVASCRIPT
   Charts, data management, auto-update logic
   2 sections: Banding, Kasasi
   ============================================ */

const BULAN_NAMES_UH = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Direktorat list untuk Banding (hanya A, B, C, dan Narkotika)
const DIREKTORAT_BANDING = [
    'Direktorat A',
    'Direktorat B',
    'Direktorat C',
    'Narkotika'
];

// Kasasi menggunakan angka 0-5 (bukan direktorat)
const KASASI_LABELS = ['0', '1', '2', '3', '4', '5'];

// Mapping section ke direktorat list
const DIREKTORAT_MAP_UH = {
    'banding': DIREKTORAT_BANDING,
    'kasasi': KASASI_LABELS
};

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
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    return `upayahukum_${w}_${s1}_${s2}_${t}_${b1}_${b2}`;
}

// ---- Month range from filter ----
function getMonthRangeUH() {
    const b1 = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const b2 = parseInt(document.getElementById('filterBulan2')?.value || '12');
    const months = [];
    for (let i = b1; i <= b2; i++) {
        months.push({ index: i, name: BULAN_NAMES_UH[i - 1] });
    }
    return months;
}

// ---- Initialize ----
function initUpayaHukum() {
    Object.keys(SECTIONS_UH).forEach(sec => {
        generateMonthlyInputsUH(sec, SECTIONS_UH[sec].monthlyGrid);
        generateDirInputsUH(sec, SECTIONS_UH[sec].dirGrid);
    });
    loadAllData();
    initAllChartsUH();
}

// ---- Generate monthly inputs ----
function generateMonthlyInputsUH(section, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const months = getMonthRangeUH();
    grid.innerHTML = '';
    months.forEach(m => {
        const div = document.createElement('div');
        div.className = 'month-input-group';
        div.innerHTML = `
            <label>${m.name}</label>
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

    // Gunakan direktorat list yang sesuai dengan section
    const dirList = DIREKTORAT_MAP_UH[section] || DIREKTORAT_BANDING;

    dirList.forEach((dir, idx) => {
        const div = document.createElement('div');
        div.className = 'dir-input-group';

        // Untuk kasasi, gunakan label yang lebih deskriptif
        const label = section === 'kasasi' ? `Angka ${dir}` : dir;

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

function getBarOptsUH(section) {
    // Kasasi menggunakan horizontal bar chart
    const isHorizontal = section === 'kasasi';

    return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: isHorizontal ? 'y' : 'x', // Horizontal untuk kasasi
        plugins: {
            legend: { display: false },
            tooltip: makeBarTooltip()
        },
        scales: isHorizontal ? {
            // Horizontal bar (kasasi)
            x: {
                beginAtZero: true,
                title: { display: true, text: 'JUMLAH', font: { size: 11, weight: '700' } },
                grid: { color: 'rgba(0,0,0,0.06)' },
                ticks: { precision: 0 }
            },
            y: {
                grid: { display: false },
                ticks: { font: { size: 10, weight: '600' } }
            }
        } : {
            // Vertical bar (banding)
            x: { grid: { display: false }, ticks: { font: { size: 10, weight: '600' }, maxRotation: 45, minRotation: 30 } },
            y: { beginAtZero: true, title: { display: true, text: 'JUMLAH', font: { size: 11, weight: '700' } }, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { precision: 0 } }
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
            // Kasasi menggunakan line chart dengan sumbu X numerik
            if (sec === 'kasasi') {
                SECTIONS_UH[sec].dirChart = new Chart(dirCanvas.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: KASASI_LABELS,
                        datasets: [{
                            data: [0, 0, 0, 0, 0, 0],
                            borderColor: chartColorsUH.line.borderColor,
                            backgroundColor: 'transparent',
                            pointBackgroundColor: chartColorsUH.line.pointBg,
                            pointBorderColor: chartColorsUH.line.pointBorder,
                            borderWidth: 2,
                            tension: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: 'rgba(26,26,46,0.9)',
                                padding: 12,
                                cornerRadius: 8,
                                callbacks: {
                                    title: ctx => `Angka ${ctx[0].label}`,
                                    label: ctx => `Jumlah: ${ctx.parsed.y}`
                                }
                            }
                        },
                        scales: {
                            x: {
                                title: { display: false },
                                grid: { display: true, color: 'rgba(0,0,0,0.06)' },
                                ticks: { font: { size: 11 } }
                            },
                            y: {
                                beginAtZero: true,
                                title: { display: true, text: 'JUMLAH', font: { size: 11, weight: '700' } },
                                grid: { color: 'rgba(0,0,0,0.06)' },
                                ticks: { precision: 0, stepSize: 1.0 }
                            }
                        },
                        elements: {
                            point: { radius: 4, hoverRadius: 6 }
                        }
                    }
                });
            } else {
                // Banding menggunakan bar chart
                SECTIONS_UH[sec].dirChart = new Chart(dirCanvas.getContext('2d'), {
                    type: 'bar',
                    data: { labels: [], datasets: [{ data: [] }] },
                    options: getBarOptsUH(sec)
                });
            }
        }

        updateTrendChartUH(sec);
        if (sec !== 'kasasi') {
            updateDirChartUH(sec);
        }
    });
}

// ---- Update trend chart ----
function updateTrendChartUH(section) {
    const chart = SECTIONS_UH[section]?.trendChart;
    if (!chart) return;

    const months = getMonthRangeUH();
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
    const dirList = DIREKTORAT_MAP_UH[section] || DIREKTORAT_BANDING;

    const values = dirList.map((_, idx) => {
        const input = document.getElementById(`dir-${section}-${idx}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    // Update chart untuk kasasi (line chart)
    if (section === 'kasasi') {
        chart.data.labels = KASASI_LABELS;
        chart.data.datasets = [{
            label: 'Jumlah',
            data: values,
            borderColor: chartColorsUH.line.borderColor,
            backgroundColor: 'transparent',
            pointBackgroundColor: chartColorsUH.line.pointBg,
            pointBorderColor: chartColorsUH.line.pointBorder,
            borderWidth: 2,
            tension: 0
        }];
    } else {
        // Update chart untuk banding (bar chart)
        chart.data.labels = dirList;
        chart.data.datasets = [{
            label: 'Jumlah',
            data: values,
            backgroundColor: chartColorsUH.bar.backgroundColor,
            hoverBackgroundColor: chartColorsUH.bar.hoverBg,
            borderRadius: 4,
            borderSkipped: false,
            barPercentage: 0.7
        }];
    }

    chart.update('none');
}

// ============================================
// SAVE & LOAD
// ============================================

function saveAllData() {
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
        getMonthRangeUH().forEach(m => {
            const input = document.getElementById(`monthly-${sec}-${m.index}`);
            if (input) allData[`${sec}Monthly`][m.index] = input.value;
        });

        // Dir values
        allData[`${sec}Dir`] = {};
        const dirList = DIREKTORAT_MAP_UH[sec] || DIREKTORAT_BANDING;
        dirList.forEach((_, idx) => {
            const input = document.getElementById(`dir-${sec}-${idx}`);
            if (input) allData[`${sec}Dir`][idx] = input.value;
        });
    });

    try {
        localStorage.setItem(getUpayaHukumStorageKey(), JSON.stringify(allData));
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

    Object.keys(SECTIONS_UH).forEach(sec => {
        SECTIONS_UH[sec].fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        getMonthRangeUH().forEach(m => {
            const el = document.getElementById(`monthly-${sec}-${m.index}`);
            if (el) el.value = '';
        });
        const dirList = DIREKTORAT_MAP_UH[sec] || DIREKTORAT_BANDING;
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
    Object.keys(SECTIONS_UH).forEach(sec => {
        generateMonthlyInputsUH(sec, SECTIONS_UH[sec].monthlyGrid);
    });
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
    document.getElementById('filterBulan2').value = '02';

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
