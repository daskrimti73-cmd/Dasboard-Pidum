/* ============================================
   PRA PENUNTUTAN - JAVASCRIPT
   Charts, data management, auto-update logic
   ============================================ */

// ---- Month names ----
const BULAN_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// ---- Direktorat list ----
const DIREKTORAT_LIST = [
    'Direktorat A',
    'Direktorat B',
    'Direktorat C',
    'Direktorat D',
    'Direktorat E',
    'Mnegtibum dan TPUL'
];

// ---- Direktorat list untuk SPDP (tanpa Mnegtibum dan TPUL) ----
const DIREKTORAT_LIST_SPDP = [
    'Direktorat A',
    'Direktorat B',
    'Direktorat C',
    'Direktorat D',
    'Direktorat E'
];

// ---- Chart instances ----
let chartSpdpTrend = null;
let chartSpdpTindakPidana = null;
let chartTahap1Trend = null;
let chartTahap1TindakPidana = null;

// ---- SPDP field IDs ----
const SPDP_FIELDS = ['spdp-spdp', 'spdp-p18', 'spdp-p17', 'spdp-pengembalian', 'spdp-sp3'];

// ---- Tahap I field IDs ----
const TAHAP1_FIELDS = ['tahap1-tahap1', 'tahap1-p18', 'tahap1-p19', 'tahap1-p20', 'tahap1-p21', 'tahap1-p21a', 'tahap1-pengembalian', 'tahap1-sp3'];

// ---- Storage key builder (same logic as app.js but for pra-penuntutan) ----
function getPrapenStorageKey(prefix) {
    const wilayah = document.getElementById('filterWilayah')?.value || '';
    const satker1 = document.getElementById('filterSatker1')?.value || '';
    const satker2 = document.getElementById('filterSatker2')?.value || '';
    const tahun = document.getElementById('filterTahun')?.value || '';
    const bulan1 = document.getElementById('filterBulan1')?.value || '';
    const bulan2 = document.getElementById('filterBulan2')?.value || '';
    return `prapen_${prefix}_${wilayah}_${satker1}_${satker2}_${tahun}_${bulan1}_${bulan2}`;
}

// ---- Get month range from filter ----
function getMonthRange() {
    const b1 = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const b2 = parseInt(document.getElementById('filterBulan2')?.value || '12');
    const months = [];
    for (let i = b1; i <= b2; i++) {
        months.push({ index: i, name: BULAN_NAMES[i - 1] });
    }
    return months;
}

// ---- Initialize everything ----
function initPraPenuntutan() {
    generateMonthlyInputs('spdp', 'spdpMonthlyGrid');
    generateMonthlyInputs('tahap1', 'tahap1MonthlyGrid');
    generateDirektoratInputs('spdp', 'spdpDirGrid');
    generateDirektoratInputs('tahap1', 'tahap1DirGrid');
    loadAllData();
    initAllCharts();
}

// ---- Generate monthly input fields ----
function generateMonthlyInputs(section, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const months = getMonthRange();
    grid.innerHTML = '';

    months.forEach(m => {
        const div = document.createElement('div');
        div.className = 'month-input-group';
        div.innerHTML = `
            <label>${m.name}</label>
            <input type="number" 
                   id="monthly-${section}-${m.index}" 
                   placeholder="0" 
                   min="0"
                   oninput="onMonthlyInput('${section}')">
        `;
        grid.appendChild(div);
    });
}

// ---- Generate direktorat input fields ----
function generateDirektoratInputs(section, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = '';

    // Gunakan list yang berbeda untuk SPDP dan Tahap I
    const dirList = section === 'spdp' ? DIREKTORAT_LIST_SPDP : DIREKTORAT_LIST;

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
}

// ---- On monthly input: update trend chart ----
function onMonthlyInput(section) {
    markUnsaved();
    updateTrendChart(section);
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
                    label: function(ctx) {
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
                    label: function(ctx) {
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
    const months = getMonthRange();
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
    // Gunakan list yang berbeda untuk SPDP dan Tahap I
    const dirList = section === 'spdp' ? DIREKTORAT_LIST_SPDP : DIREKTORAT_LIST;
    const labels = dirList;
    const values = dirList.map((_, idx) => {
        const input = document.getElementById(`dir-${section}-${idx}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    const chart = section === 'spdp' ? chartSpdpTindakPidana : chartTahap1TindakPidana;
    if (!chart) return;

    chart.data.labels = labels;
    chart.data.datasets = [{
        label: 'Jumlah',
        data: values,
        backgroundColor: chartColors.bar.backgroundColor,
        hoverBackgroundColor: chartColors.bar.hoverBg,
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
    const keyPrefix = getPrapenStorageKey('');

    // Save SPDP card values
    const spdpData = {};
    SPDP_FIELDS.forEach(id => {
        const input = document.getElementById(id);
        if (input) spdpData[id] = input.value;
    });

    // Save Tahap I card values
    const tahap1Data = {};
    TAHAP1_FIELDS.forEach(id => {
        const input = document.getElementById(id);
        if (input) tahap1Data[id] = input.value;
    });

    // Save monthly SPDP
    const spdpMonthly = {};
    getMonthRange().forEach(m => {
        const input = document.getElementById(`monthly-spdp-${m.index}`);
        if (input) spdpMonthly[m.index] = input.value;
    });

    // Save monthly Tahap I
    const tahap1Monthly = {};
    getMonthRange().forEach(m => {
        const input = document.getElementById(`monthly-tahap1-${m.index}`);
        if (input) tahap1Monthly[m.index] = input.value;
    });

    // Save direktorat SPDP
    const spdpDir = {};
    DIREKTORAT_LIST_SPDP.forEach((_, idx) => {
        const input = document.getElementById(`dir-spdp-${idx}`);
        if (input) spdpDir[idx] = input.value;
    });

    // Save direktorat Tahap I
    const tahap1Dir = {};
    DIREKTORAT_LIST.forEach((_, idx) => {
        const input = document.getElementById(`dir-tahap1-${idx}`);
        if (input) tahap1Dir[idx] = input.value;
    });

    const allData = {
        spdpCards: spdpData,
        tahap1Cards: tahap1Data,
        spdpMonthly: spdpMonthly,
        tahap1Monthly: tahap1Monthly,
        spdpDir: spdpDir,
        tahap1Dir: tahap1Dir,
        savedAt: new Date().toISOString()
    };

    try {
        localStorage.setItem(getPrapenStorageKey('all'), JSON.stringify(allData));
        showToast('Semua data berhasil disimpan!', 'success');

        const btn = document.getElementById('btnSave');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> Tersimpan';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-save"></i> Simpan Semua Data';
            }, 2000);
        }

        hasUnsaved = false;
    } catch (e) {
        showToast('Gagal menyimpan data!', 'error');
        console.error('Save error:', e);
    }
}

function loadAllData() {
    const saved = localStorage.getItem(getPrapenStorageKey('all'));
    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        // Restore SPDP cards
        if (data.spdpCards) {
            Object.keys(data.spdpCards).forEach(id => {
                const input = document.getElementById(id);
                if (input) input.value = data.spdpCards[id];
            });
        }

        // Restore Tahap I cards
        if (data.tahap1Cards) {
            Object.keys(data.tahap1Cards).forEach(id => {
                const input = document.getElementById(id);
                if (input) input.value = data.tahap1Cards[id];
            });
        }

        // Restore monthly SPDP
        if (data.spdpMonthly) {
            Object.keys(data.spdpMonthly).forEach(idx => {
                const input = document.getElementById(`monthly-spdp-${idx}`);
                if (input) input.value = data.spdpMonthly[idx];
            });
        }

        // Restore monthly Tahap I
        if (data.tahap1Monthly) {
            Object.keys(data.tahap1Monthly).forEach(idx => {
                const input = document.getElementById(`monthly-tahap1-${idx}`);
                if (input) input.value = data.tahap1Monthly[idx];
            });
        }

        // Restore direktorat SPDP
        if (data.spdpDir) {
            Object.keys(data.spdpDir).forEach(idx => {
                const input = document.getElementById(`dir-spdp-${idx}`);
                if (input) input.value = data.spdpDir[idx];
            });
        }

        // Restore direktorat Tahap I
        if (data.tahap1Dir) {
            Object.keys(data.tahap1Dir).forEach(idx => {
                const input = document.getElementById(`dir-tahap1-${idx}`);
                if (input) input.value = data.tahap1Dir[idx];
            });
        }

    } catch (e) {
        console.error('Load error:', e);
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
    getMonthRange().forEach(m => {
        const s1 = document.getElementById(`monthly-spdp-${m.index}`);
        const s2 = document.getElementById(`monthly-tahap1-${m.index}`);
        if (s1) s1.value = '';
        if (s2) s2.value = '';
    });

    // Clear direktorat inputs
    DIREKTORAT_LIST_SPDP.forEach((_, idx) => {
        const d1 = document.getElementById(`dir-spdp-${idx}`);
        if (d1) d1.value = '';
    });
    DIREKTORAT_LIST.forEach((_, idx) => {
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
    // Regenerate monthly grids for new date range
    generateMonthlyInputs('spdp', 'spdpMonthlyGrid');
    generateMonthlyInputs('tahap1', 'tahap1MonthlyGrid');

    // Load saved data for new filter combo
    loadAllData();

    // Update charts
    updateTrendChart('spdp');
    updateTrendChart('tahap1');
    updateDirChart('spdp');
    updateDirChart('tahap1');

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

    // Regenerate and clear
    generateMonthlyInputs('spdp', 'spdpMonthlyGrid');
    generateMonthlyInputs('tahap1', 'tahap1MonthlyGrid');

    SPDP_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    TAHAP1_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

    updateTrendChart('spdp');
    updateTrendChart('tahap1');
    updateDirChart('spdp');
    updateDirChart('tahap1');

    showToast('Filter telah direset', 'success');
}
