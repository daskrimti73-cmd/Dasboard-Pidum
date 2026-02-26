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

const TINDAK_PIDANA_LIST_EKS = [
    'DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C',
    'DIREKTORAT E', 'MNEGTIBUM DAN TPUL', 'NARKOTIKA',
    'OHARDA', 'TERORISME'
];

// Card field IDs
const CARD_FIELDS = ['eks-p48', 'eks-ba17', 'eks-denda', 'eks-biaya'];

// Trend chart configs (all 4 cards have trend charts)
// isCurrency = true → large monetary values with dot-separator formatting
const TREND_CHARTS = {
    p48:   { canvasId: 'chartP48Trend',   monthlyGrid: 'p48MonthlyGrid',   chart: null, label: 'P-48',          isCurrency: false },
    ba17:  { canvasId: 'chartBa17Trend',  monthlyGrid: 'ba17MonthlyGrid',  chart: null, label: 'BA-17',         isCurrency: false },
    denda: { canvasId: 'chartDendaTrend', monthlyGrid: 'dendaMonthlyGrid', chart: null, label: 'Denda',         isCurrency: true },
    biaya: { canvasId: 'chartBiayaTrend', monthlyGrid: 'biayaMonthlyGrid', chart: null, label: 'Biaya Perkara', isCurrency: true }
};

// Bar chart configs (only P-48 and BA-17 have bar charts)
const DIR_CHARTS = {
    p48:  { canvasId: 'chartP48Dir',  dirGrid: 'p48DirGrid',  chart: null, label: 'P-48' },
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

// ---- Storage key ----
function getEksekusiStorageKey() {
    const w = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t = document.getElementById('filterTahun')?.value || '';
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    return `eksekusi_${w}_${s1}_${s2}_${t}_${b1}_${b2}`;
}

// ---- Month range from filter ----
function getMonthRangeEks() {
    const b1 = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const b2 = parseInt(document.getElementById('filterBulan2')?.value || '12');
    const months = [];
    for (let i = b1; i <= b2; i++) {
        months.push({ index: i, name: BULAN_NAMES_EKS[i - 1] });
    }
    return months;
}

// ---- Initialize ----
function initEksekusi() {
    // Generate monthly inputs for all 4 trend charts
    Object.keys(TREND_CHARTS).forEach(key => {
        generateMonthlyInputs(key, TREND_CHARTS[key].monthlyGrid);
    });
    // Generate dir inputs for P-48 and BA-17 bar charts
    Object.keys(DIR_CHARTS).forEach(key => {
        generateDirInputs(key, DIR_CHARTS[key].dirGrid);
    });
    loadAllData();
    initAllCharts();
}

// ---- Generate monthly inputs ----
function generateMonthlyInputs(key, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const months = getMonthRangeEks();
    const isCurrency = TREND_CHARTS[key]?.isCurrency || false;
    grid.innerHTML = '';
    months.forEach(m => {
        const div = document.createElement('div');
        div.className = 'month-input-group';
        if (isCurrency) {
            div.innerHTML = `
                <label>${m.name}</label>
                <input type="text" id="monthly-${key}-${m.index}" placeholder="0" inputmode="numeric"
                       oninput="formatCurrencyInput(this); onMonthlyInput('${key}')">
            `;
        } else {
            div.innerHTML = `
                <label>${m.name}</label>
                <input type="number" id="monthly-${key}-${m.index}" placeholder="0" min="0"
                       oninput="onMonthlyInput('${key}')">
            `;
        }
        grid.appendChild(div);
    });
}

// ---- Generate direktorat inputs ----
function generateDirInputs(key, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    TINDAK_PIDANA_LIST_EKS.forEach((dir, idx) => {
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
}

function onMonthlyInput(key) {
    markUnsaved();
    updateTrendChart(key);
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

    const months = getMonthRangeEks();
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

    const values = TINDAK_PIDANA_LIST_EKS.map((_, idx) => {
        const input = document.getElementById(`dir-${key}-${idx}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    cfg.chart.data.labels = TINDAK_PIDANA_LIST_EKS;
    cfg.chart.data.datasets = [{
        label: 'Jumlah',
        data: values,
        backgroundColor: chartColorsEks.bar.backgroundColor,
        hoverBackgroundColor: chartColorsEks.bar.hoverBg,
        borderRadius: 4,
        borderSkipped: false,
        barPercentage: 0.7
    }];

    cfg.chart.update('none');
}

// ============================================
// SAVE & LOAD
// ============================================

function saveAllData() {
    const allData = { savedAt: new Date().toISOString() };

    // Card values
    allData.cards = {};
    CARD_FIELDS.forEach(id => {
        const input = document.getElementById(id);
        if (input) allData.cards[id] = input.value;
    });

    // Monthly values for all 4 trend charts
    Object.keys(TREND_CHARTS).forEach(key => {
        allData[`${key}Monthly`] = {};
        getMonthRangeEks().forEach(m => {
            const input = document.getElementById(`monthly-${key}-${m.index}`);
            if (input) allData[`${key}Monthly`][m.index] = input.value;
        });
    });

    // Dir values for P-48 and BA-17
    Object.keys(DIR_CHARTS).forEach(key => {
        allData[`${key}Dir`] = {};
        TINDAK_PIDANA_LIST_EKS.forEach((_, idx) => {
            const input = document.getElementById(`dir-${key}-${idx}`);
            if (input) allData[`${key}Dir`][idx] = input.value;
        });
    });

    try {
        localStorage.setItem(getEksekusiStorageKey(), JSON.stringify(allData));
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
    const saved = localStorage.getItem(getEksekusiStorageKey());
    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        // Cards
        if (data.cards) {
            Object.keys(data.cards).forEach(id => {
                const input = document.getElementById(id);
                if (input) input.value = data.cards[id];
            });
        }

        // Monthly
        Object.keys(TREND_CHARTS).forEach(key => {
            if (data[`${key}Monthly`]) {
                Object.keys(data[`${key}Monthly`]).forEach(idx => {
                    const input = document.getElementById(`monthly-${key}-${idx}`);
                    if (input) {
                        input.value = data[`${key}Monthly`][idx];
                        // Re-format currency inputs after loading
                        if (TREND_CHARTS[key]?.isCurrency && input.value) {
                            const raw = input.value.replace(/\D/g, '');
                            if (raw.length > 0) input.value = parseInt(raw, 10).toLocaleString('id-ID');
                        }
                    }
                });
            }
        });

        // Dir
        Object.keys(DIR_CHARTS).forEach(key => {
            if (data[`${key}Dir`]) {
                Object.keys(data[`${key}Dir`]).forEach(idx => {
                    const input = document.getElementById(`dir-${key}-${idx}`);
                    if (input) input.value = data[`${key}Dir`][idx];
                });
            }
        });
    } catch (e) {
        console.error('Load error:', e);
    }
}

function resetAllData() {
    if (!confirm('Apakah Anda yakin ingin mengosongkan semua data di halaman ini?')) return;

    CARD_FIELDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    Object.keys(TREND_CHARTS).forEach(key => {
        getMonthRangeEks().forEach(m => {
            const el = document.getElementById(`monthly-${key}-${m.index}`);
            if (el) el.value = '';
        });
        updateTrendChart(key);
    });

    Object.keys(DIR_CHARTS).forEach(key => {
        TINDAK_PIDANA_LIST_EKS.forEach((_, idx) => {
            const el = document.getElementById(`dir-${key}-${idx}`);
            if (el) el.value = '';
        });
        updateDirChart(key);
    });

    showToast('Semua data telah dikosongkan', 'success');
}

// ---- Filters ----
function applyFilters() {
    Object.keys(TREND_CHARTS).forEach(key => {
        generateMonthlyInputs(key, TREND_CHARTS[key].monthlyGrid);
    });
    loadAllData();
    Object.keys(TREND_CHARTS).forEach(key => updateTrendChart(key));
    Object.keys(DIR_CHARTS).forEach(key => updateDirChart(key));
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

    CARD_FIELDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    Object.keys(TREND_CHARTS).forEach(key => {
        generateMonthlyInputs(key, TREND_CHARTS[key].monthlyGrid);
        updateTrendChart(key);
    });
    Object.keys(DIR_CHARTS).forEach(key => updateDirChart(key));

    showToast('Filter telah direset', 'success');
}
