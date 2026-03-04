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

// ---- Get month range from filter (for charts - only visible months) ----
function getMonthRange() {
    return getChartMonthRange();
}

// ---- Get all selected months (for input section - all months admin added) ----
function getAllInputMonths() {
    return getSelectedMonths();
}

// ---- Page-specific: rebuild monthly inputs/charts when months change ----
function rebuildMonthlyUI() {
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

// ---- Generate monthly input fields with delete button ----
function generateMonthlyInputs(section, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const months = getSelectedMonths(); // Show ALL months in input (not just visible)
    grid.innerHTML = '';

    months.forEach(m => {
        const div = document.createElement('div');
        div.className = 'month-input-group';
        const visible = isMonthVisible(m.index);
        div.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <label style="margin:0;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:${visible ? '#2c3e50' : '#adb5bd'};">${m.name}</label>
                <div style="display:flex;gap:4px;">
                    <button type="button" class="btn-hapus-bulan" title="${visible ? 'Sembunyikan dari grafik' : 'Tampilkan di grafik'}" onclick="event.preventDefault();event.stopPropagation();handleToggleVisibility(${m.index})"
                        style="${visible ? '' : 'background:#e2e8f0;color:#64748b;border-color:#cbd5e1;'}">
                        <i class="fas ${visible ? 'fa-eye' : 'fa-eye-slash'}"></i>
                    </button>
                    <button type="button" class="btn-hapus-bulan" title="Hapus ${m.name}" onclick="event.preventDefault();event.stopPropagation();handleDeleteBulan(${m.index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <input type="number" 
                   id="monthly-${section}-${m.index}" 
                   placeholder="0" 
                   min="0"
                   style="${visible ? '' : 'opacity:0.5;background:#f1f5f9;'}"
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
    const months = getMonthRange(); // Uses visible months only
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
    const dirList = getDirListForSection(section);
    const labels = dirList;
    const values = dirList.map((_, idx) => {
        const input = document.getElementById(`dir-${section}-${idx}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    const chart = section === 'spdp' ? chartSpdpTindakPidana : chartTahap1TindakPidana;
    if (!chart) return;

    // Generate enough colors
    const bgColors = [];
    const hoverColors = [];
    for (let i = 0; i < dirList.length; i++) {
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
        btn.innerHTML = '<i class="fas fa-times"></i>';
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

function saveAllData() {
    const dirList = getDirListForSection('spdp');

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

    // Save direktorat SPDP (keyed by label for persistence)
    const spdpDir = {};
    dirList.forEach((dir, idx) => {
        const input = document.getElementById(`dir-spdp-${idx}`);
        if (input) spdpDir[dir] = input.value;
    });

    // Save direktorat Tahap I (keyed by label for persistence)
    const tahap1DirList = getDirListForSection('tahap1');
    const tahap1Dir = {};
    tahap1DirList.forEach((dir, idx) => {
        const input = document.getElementById(`dir-tahap1-${idx}`);
        if (input) tahap1Dir[dir] = input.value;
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

        // Restore direktorat SPDP (keyed by label)
        if (data.spdpDir) {
            const dirList = getDirListForSection('spdp');
            // Check if data uses label-based keys (new) or index-based keys (old)
            const keys = Object.keys(data.spdpDir);
            const isLabelBased = keys.length > 0 && isNaN(parseInt(keys[0]));

            if (isLabelBased) {
                dirList.forEach((dir, idx) => {
                    const input = document.getElementById(`dir-spdp-${idx}`);
                    if (input && data.spdpDir[dir]) input.value = data.spdpDir[dir];
                });
            } else {
                // Old format: index-based
                Object.keys(data.spdpDir).forEach(idx => {
                    const input = document.getElementById(`dir-spdp-${idx}`);
                    if (input) input.value = data.spdpDir[idx];
                });
            }
        }

        // Restore direktorat Tahap I (keyed by label)
        if (data.tahap1Dir) {
            const dirList = getDirListForSection('tahap1');
            const keys = Object.keys(data.tahap1Dir);
            const isLabelBased = keys.length > 0 && isNaN(parseInt(keys[0]));

            if (isLabelBased) {
                dirList.forEach((dir, idx) => {
                    const input = document.getElementById(`dir-tahap1-${idx}`);
                    if (input && data.tahap1Dir[dir]) input.value = data.tahap1Dir[dir];
                });
            } else {
                Object.keys(data.tahap1Dir).forEach(idx => {
                    const input = document.getElementById(`dir-tahap1-${idx}`);
                    if (input) input.value = data.tahap1Dir[idx];
                });
            }
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
    // Read Bulan Awal/Akhir from filter dropdowns
    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);
    const start = Math.min(bulanAwal, bulanAkhir);
    const end = Math.max(bulanAwal, bulanAkhir);

    // Only update VISIBLE list (chart display) - do NOT change admin's selected months
    const visibleList = [];
    for (let i = start; i <= end; i++) visibleList.push(i);
    saveVisibleBulanList(visibleList);

    console.log('[applyFilters] Bulan range:', start, '-', end);
    console.log('[applyFilters] Visible list saved:', visibleList);
    console.log('[applyFilters] Selected (admin) months:', getSelectedBulanList());
    console.log('[applyFilters] Visible months for chart:', getVisibleBulanList());

    // Regenerate monthly grids to update eye icon states
    generateMonthlyInputs('spdp', 'spdpMonthlyGrid');
    generateMonthlyInputs('tahap1', 'tahap1MonthlyGrid');

    // Load saved data for new filter combo
    loadAllData();

    // Update charts (will use visible months only)
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

    showToast('Filter telah direset', 'success');
}
