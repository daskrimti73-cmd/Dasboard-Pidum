/* ============================================
   KORBAN - JAVASCRIPT
   2 Cards (Perempuan, Anak),
   2 horizontal bar charts (Top 10 Perkara),
   2 trend line charts (per bulan),
   Data table with CRUD
   ============================================ */

const BULAN_NAMES_KB = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const JENIS_KELAMIN_OPTIONS_KB = ['Perempuan', 'Anak'];

const TINDAK_PIDANA_OPTIONS_KB = [
    'Tindak Pidana Kesusilaan', 'Tindak Pidana Penggelapan', 'Tindak Pidana Pencurian',
    'TINDAK PIDANA LALU LINTAS', 'Tindak Pidana Kesehatan', 'Tindak Pidana Perbuatan Tidak Menyenangkan',
    'Tindak Pidana Ketenagakerjaan', 'Tindak Pidana Pemalsuan', 'OHARDA', 'NARKOTIKA',
    'Tindak Pidana Penganiayaan', 'Tindak Pidana Penipuan', 'Tindak Pidana Pengrusakan'
];

const SATKER_LIST_KB = [
    'Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun',
    'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas',
    'Kejari Berau', 'Kejari Minahasa Utara', 'Kejari Maluku Tengah'
];

// ---- Table columns ----
// showInTable: false = only shown in form & detail preview modal (not in table grid)
const TABLE_COLUMNS = [
    { key: 'nomor_spdp', label: 'Nomor SPDP', type: 'text', width: '15%', showInTable: false },
    { key: 'tanggal_terima_spdp', label: 'Tanggal Terima SPDP', type: 'date', width: '12%', showInTable: false },
    { key: 'nama', label: 'Nama', type: 'text', width: '18%' },
    { key: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', options: JENIS_KELAMIN_OPTIONS_KB, width: '10%' },
    { key: 'umur', label: 'Umur', type: 'number', width: '7%' },
    { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: TINDAK_PIDANA_OPTIONS_KB, width: '18%' },
    { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '18%' },
    { key: 'satker', label: 'Satker', type: 'select', options: SATKER_LIST_KB, width: '14%' }
];

// Columns visible in the table grid only
const VISIBLE_TABLE_COLUMNS = TABLE_COLUMNS.filter(c => c.showInTable !== false);

// ---- Chart colors ----
const barColorsPerempuan = [
    '#f59e0b', '#f7b731', '#f5c542', '#f9d56e', '#fce588',
    '#f59e0b', '#f7b731', '#f5c542', '#f9d56e', '#fce588'
];
const barColorsAnak = [
    'rgba(15, 52, 96, 0.85)', 'rgba(15, 52, 96, 0.75)', 'rgba(15, 52, 96, 0.65)',
    'rgba(15, 52, 96, 0.55)', 'rgba(15, 52, 96, 0.45)', 'rgba(15, 52, 96, 0.80)',
    'rgba(15, 52, 96, 0.70)', 'rgba(15, 52, 96, 0.60)', 'rgba(15, 52, 96, 0.50)',
    'rgba(15, 52, 96, 0.40)'
];

const lineColorKb = {
    borderColor: 'rgba(15, 52, 96, 1)',
    backgroundColor: 'rgba(15, 52, 96, 0.1)',
    pointBg: 'rgba(15, 52, 96, 1)',
    pointBorder: '#fff'
};

// ---- State ----
let perkaraPerempuanData = []; // [{ nama, jumlah }]
let perkaraAnakData = [];      // [{ nama, jumlah }]

let chartPerempuanBar = null;
let chartAnakBar = null;
let chartPerempuanTrend = null;
let chartAnakTrend = null;

// Table state
let tableData = [];
let filteredData = [];
let currentPage = 1;
let rowsPerPage = 10;
let editingIndex = -1;
let deleteIndex = -1;
let sortColumn = -1;
let sortDirection = 'asc';

// ---- Storage key ----
function getKorbanStorageKey() {
    const w = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t = document.getElementById('filterTahun')?.value || '';
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    return `korban_${w}_${s1}_${s2}_${t}_${b1}_${b2}`;
}

function getKorbanTableKey() {
    const w = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t = document.getElementById('filterTahun')?.value || '';
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    return `korban_table_${w}_${s1}_${s2}_${t}_${b1}_${b2}`;
}

// ---- Month range ----
function getMonthRangeKb() {
    const b1 = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const b2 = parseInt(document.getElementById('filterBulan2')?.value || '12');
    const months = [];
    for (let i = b1; i <= b2; i++) {
        months.push({ index: i, name: BULAN_NAMES_KB[i - 1] });
    }
    return months;
}

// ============================================
// INITIALIZE
// ============================================
function initKorban() {
    generateMonthlyInputsPerempuan();
    generateMonthlyInputsAnak();
    loadAllData();
    initAllCharts();
    loadTableData();
    renderTableHead();
    filterTable();
}

// ---- Generate monthly inputs for Perempuan ----
function generateMonthlyInputsPerempuan() {
    const grid = document.getElementById('trenPerempuanGrid');
    if (!grid) return;
    const months = getMonthRangeKb();
    grid.innerHTML = '';
    months.forEach(m => {
        const div = document.createElement('div');
        div.className = 'month-input-group';
        div.innerHTML = `
            <label>${m.name}</label>
            <input type="number" id="monthly-perempuan-${m.index}" placeholder="0" min="0"
                   oninput="onMonthlyPerempuanInput()">
        `;
        grid.appendChild(div);
    });
}

// ---- Generate monthly inputs for Anak ----
function generateMonthlyInputsAnak() {
    const grid = document.getElementById('trenAnakGrid');
    if (!grid) return;
    const months = getMonthRangeKb();
    grid.innerHTML = '';
    months.forEach(m => {
        const div = document.createElement('div');
        div.className = 'month-input-group';
        div.innerHTML = `
            <label>${m.name}</label>
            <input type="number" id="monthly-anak-${m.index}" placeholder="0" min="0"
                   oninput="onMonthlyAnakInput()">
        `;
        grid.appendChild(div);
    });
}

// ============================================
// PERKARA PEREMPUAN MANAGEMENT
// ============================================
function addPerkaraPerempuan() {
    const namaEl = document.getElementById('perkaraPerempuanNama');
    const jmlEl = document.getElementById('perkaraPerempuanJumlah');
    const nama = namaEl.value.trim();
    const jumlah = parseInt(jmlEl.value) || 0;

    if (!nama) { showToast('Masukkan nama tindak pidana', 'error'); return; }
    if (jumlah <= 0) { showToast('Masukkan jumlah yang valid', 'error'); return; }

    const existing = perkaraPerempuanData.find(p => p.nama.toLowerCase() === nama.toLowerCase());
    if (existing) {
        existing.jumlah = jumlah;
    } else {
        if (perkaraPerempuanData.length >= 10) {
            showToast('Maksimal 10 perkara', 'error');
            return;
        }
        perkaraPerempuanData.push({ nama, jumlah });
    }

    namaEl.value = '';
    jmlEl.value = '';
    renderPerkaraPerempuanList();
    updatePerempuanBarChart();
    markUnsaved();
}

function removePerkaraPerempuan(idx) {
    perkaraPerempuanData.splice(idx, 1);
    renderPerkaraPerempuanList();
    updatePerempuanBarChart();
    markUnsaved();
}

function renderPerkaraPerempuanList() {
    const list = document.getElementById('perkaraPerempuanList');
    if (!list) return;
    if (perkaraPerempuanData.length === 0) {
        list.innerHTML = '<div class="empty-list">Belum ada perkara ditambahkan</div>';
        return;
    }
    list.innerHTML = perkaraPerempuanData.map((p, idx) => `
        <div class="perkara-item">
            <span class="perkara-name">${p.nama}</span>
            <span class="perkara-count">${p.jumlah}</span>
            <button class="btn-remove" onclick="removePerkaraPerempuan(${idx})" title="Hapus">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// ============================================
// PERKARA ANAK MANAGEMENT
// ============================================
function addPerkaraAnak() {
    const namaEl = document.getElementById('perkaraAnakNama');
    const jmlEl = document.getElementById('perkaraAnakJumlah');
    const nama = namaEl.value.trim();
    const jumlah = parseInt(jmlEl.value) || 0;

    if (!nama) { showToast('Masukkan nama tindak pidana', 'error'); return; }
    if (jumlah <= 0) { showToast('Masukkan jumlah yang valid', 'error'); return; }

    const existing = perkaraAnakData.find(p => p.nama.toLowerCase() === nama.toLowerCase());
    if (existing) {
        existing.jumlah = jumlah;
    } else {
        if (perkaraAnakData.length >= 10) {
            showToast('Maksimal 10 perkara', 'error');
            return;
        }
        perkaraAnakData.push({ nama, jumlah });
    }

    namaEl.value = '';
    jmlEl.value = '';
    renderPerkaraAnakList();
    updateAnakBarChart();
    markUnsaved();
}

function removePerkaraAnak(idx) {
    perkaraAnakData.splice(idx, 1);
    renderPerkaraAnakList();
    updateAnakBarChart();
    markUnsaved();
}

function renderPerkaraAnakList() {
    const list = document.getElementById('perkaraAnakList');
    if (!list) return;
    if (perkaraAnakData.length === 0) {
        list.innerHTML = '<div class="empty-list">Belum ada perkara ditambahkan</div>';
        return;
    }
    list.innerHTML = perkaraAnakData.map((p, idx) => `
        <div class="perkara-item">
            <span class="perkara-name">${p.nama}</span>
            <span class="perkara-count">${p.jumlah}</span>
            <button class="btn-remove" onclick="removePerkaraAnak(${idx})" title="Hapus">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// ============================================
// TOGGLE ACCORDION
// ============================================
function toggleAccordion(section) {
    const bodyMap = {
        perkaraPerempuan: 'monthlyPerkaraPerempuan',
        perkaraAnak: 'monthlyPerkaraAnak',
        trenPerempuan: 'monthlyTrenPerempuan',
        trenAnak: 'monthlyTrenAnak'
    };
    const toggleMap = {
        perkaraPerempuan: 'togglePerkaraPerempuan',
        perkaraAnak: 'togglePerkaraAnak',
        trenPerempuan: 'toggleTrenPerempuan',
        trenAnak: 'toggleTrenAnak'
    };
    const body = document.getElementById(bodyMap[section]);
    const icon = document.getElementById(toggleMap[section]);
    if (body) {
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? 'block' : 'none';
        if (icon) icon.classList.toggle('rotated', isHidden);
    }
}

// ============================================
// EVENT HANDLERS
// ============================================
function onDataInput() { markUnsaved(); }
function onMonthlyPerempuanInput() { markUnsaved(); updatePerempuanTrendChart(); }
function onMonthlyAnakInput() { markUnsaved(); updateAnakTrendChart(); }

// ============================================
// CHARTS
// ============================================
function initAllCharts() {
    // 1. Horizontal bar - Perempuan
    const pBarCanvas = document.getElementById('chartPerempuanBar');
    if (pBarCanvas) {
        chartPerempuanBar = new Chart(pBarCanvas.getContext('2d'), {
            type: 'bar',
            data: { labels: [], datasets: [{ data: [] }] },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: makeBarTooltip()
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Jumlah', font: { size: 11, weight: '700' } },
                        grid: { color: 'rgba(0,0,0,0.06)' },
                        ticks: { precision: 0 }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 10, weight: '600' } }
                    }
                }
            }
        });
        updatePerempuanBarChart();
    }

    // 2. Horizontal bar - Anak
    const aBarCanvas = document.getElementById('chartAnakBar');
    if (aBarCanvas) {
        chartAnakBar = new Chart(aBarCanvas.getContext('2d'), {
            type: 'bar',
            data: { labels: [], datasets: [{ data: [] }] },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: makeBarTooltip()
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Jumlah', font: { size: 11, weight: '700' } },
                        grid: { color: 'rgba(0,0,0,0.06)' },
                        ticks: { precision: 0 }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 10, weight: '600' } }
                    }
                }
            }
        });
        updateAnakBarChart();
    }

    // 3. Trend line - Perempuan
    const pTrendCanvas = document.getElementById('chartPerempuanTrend');
    if (pTrendCanvas) {
        chartPerempuanTrend = new Chart(pTrendCanvas.getContext('2d'), {
            type: 'line',
            data: { labels: [], datasets: [{ data: [] }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: (document.getElementById('filterTahun')?.value || '2026'),
                        font: { size: 14, weight: '600' },
                        color: '#2c3e50'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26,26,46,0.9)', padding: 12, cornerRadius: 8,
                        callbacks: { label: ctx => `Jumlah: ${ctx.parsed.y}` }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Bulan', font: { size: 12, weight: '600' } }, grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { precision: 0 } }
                },
                elements: { line: { tension: 0.3 }, point: { radius: 6, hoverRadius: 8, borderWidth: 3 } }
            }
        });
        updatePerempuanTrendChart();
    }

    // 4. Trend line - Anak
    const aTrendCanvas = document.getElementById('chartAnakTrend');
    if (aTrendCanvas) {
        chartAnakTrend = new Chart(aTrendCanvas.getContext('2d'), {
            type: 'line',
            data: { labels: [], datasets: [{ data: [] }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: (document.getElementById('filterTahun')?.value || '2026'),
                        font: { size: 14, weight: '600' },
                        color: '#2c3e50'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26,26,46,0.9)', padding: 12, cornerRadius: 8,
                        callbacks: { label: ctx => `Jumlah: ${ctx.parsed.y}` }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Bulan', font: { size: 12, weight: '600' } }, grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { precision: 0 } }
                },
                elements: { line: { tension: 0.3 }, point: { radius: 6, hoverRadius: 8, borderWidth: 3 } }
            }
        });
        updateAnakTrendChart();
    }
}

// ---- Update horizontal bar charts ----
function updatePerempuanBarChart() {
    if (!chartPerempuanBar) return;
    const sorted = [...perkaraPerempuanData].sort((a, b) => b.jumlah - a.jumlah).slice(0, 10);
    const fullLabels = sorted.map(p => p.nama);
    const labels = sorted.map(p => p.nama.length > 30 ? p.nama.substring(0, 27) + '...' : p.nama);
    const values = sorted.map(p => p.jumlah);
    const colors = sorted.map((_, i) => barColorsPerempuan[i % barColorsPerempuan.length]);

    chartPerempuanBar._fullLabels = fullLabels;
    chartPerempuanBar.data.labels = labels;
    chartPerempuanBar.data.datasets = [{
        label: 'Jumlah',
        data: values,
        backgroundColor: colors,
        borderRadius: 4,
        barPercentage: 0.7
    }];
    chartPerempuanBar.update('none');
}

function updateAnakBarChart() {
    if (!chartAnakBar) return;
    const sorted = [...perkaraAnakData].sort((a, b) => b.jumlah - a.jumlah).slice(0, 10);
    const fullLabels = sorted.map(p => p.nama);
    const labels = sorted.map(p => p.nama.length > 30 ? p.nama.substring(0, 27) + '...' : p.nama);
    const values = sorted.map(p => p.jumlah);
    const colors = sorted.map((_, i) => barColorsAnak[i % barColorsAnak.length]);

    chartAnakBar._fullLabels = fullLabels;
    chartAnakBar.data.labels = labels;
    chartAnakBar.data.datasets = [{
        label: 'Jumlah',
        data: values,
        backgroundColor: colors,
        borderRadius: 4,
        barPercentage: 0.7
    }];
    chartAnakBar.update('none');
}

// ---- Update trend charts ----
function updatePerempuanTrendChart() {
    if (!chartPerempuanTrend) return;
    const months = getMonthRangeKb();
    const labels = months.map(m => m.name);
    const values = months.map(m => {
        const input = document.getElementById(`monthly-perempuan-${m.index}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    chartPerempuanTrend.data.labels = labels;
    chartPerempuanTrend.data.datasets = [{
        label: 'Korban Perempuan',
        data: values,
        borderColor: lineColorKb.borderColor,
        backgroundColor: lineColorKb.backgroundColor,
        pointBackgroundColor: lineColorKb.pointBg,
        pointBorderColor: lineColorKb.pointBorder,
        fill: true,
        borderWidth: 3
    }];
    const year = document.getElementById('filterTahun')?.value || new Date().getFullYear();
    chartPerempuanTrend.options.plugins.title.text = year.toString();
    chartPerempuanTrend.update('none');
}

function updateAnakTrendChart() {
    if (!chartAnakTrend) return;
    const months = getMonthRangeKb();
    const labels = months.map(m => m.name);
    const values = months.map(m => {
        const input = document.getElementById(`monthly-anak-${m.index}`);
        return input ? (parseInt(input.value) || 0) : 0;
    });

    chartAnakTrend.data.labels = labels;
    chartAnakTrend.data.datasets = [{
        label: 'Korban Anak',
        data: values,
        borderColor: lineColorKb.borderColor,
        backgroundColor: lineColorKb.backgroundColor,
        pointBackgroundColor: lineColorKb.pointBg,
        pointBorderColor: lineColorKb.pointBorder,
        fill: true,
        borderWidth: 3
    }];
    const year = document.getElementById('filterTahun')?.value || new Date().getFullYear();
    chartAnakTrend.options.plugins.title.text = year.toString();
    chartAnakTrend.update('none');
}

// ============================================
// DATA TABLE
// ============================================
function loadTableData() {
    const key = getKorbanTableKey();
    const saved = localStorage.getItem(key);
    if (saved) {
        try { tableData = JSON.parse(saved); } catch (e) { tableData = []; }
    } else {
        tableData = [];
    }
}

function saveTableData() {
    const key = getKorbanTableKey();
    try { localStorage.setItem(key, JSON.stringify(tableData)); } catch (e) { console.error('Save error:', e); }
}

function renderTableHead() {
    const thead = document.getElementById('tableHead');
    let html = '<tr><th class="th-no" style="cursor:pointer" onclick="sortTable(-1)">No <i class="fas fa-sort"></i></th>';
    VISIBLE_TABLE_COLUMNS.forEach((col, idx) => {
        const colIdx = TABLE_COLUMNS.indexOf(col);
        html += `<th style="width:${col.width}; cursor:pointer" onclick="sortTable(${colIdx})">${col.label} <i class="fas fa-sort"></i></th>`;
    });
    html += '<th class="th-actions">Aksi</th></tr>';
    thead.innerHTML = html;
}

function renderTableBody() {
    const tbody = document.getElementById('tableBody');

    if (filteredData.length === 0) {
        const colSpan = VISIBLE_TABLE_COLUMNS.length + 2;
        tbody.innerHTML = `<tr><td colspan="${colSpan}" class="empty-row">
            <i class="fas fa-inbox"></i><br>Tidak ada data yang tersedia pada tabel ini
        </td></tr>`;
        renderPagination();
        updateTableInfo();
        return;
    }

    const start = (currentPage - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, filteredData.length);
    const pageData = filteredData.slice(start, end);

    let html = '';
    pageData.forEach((row, idx) => {
        const globalIndex = tableData.indexOf(row);
        const rowNum = start + idx + 1;
        const isEven = rowNum % 2 === 0;

        html += `<tr class="${isEven ? 'row-even' : ''}">`;
        html += `<td class="td-no">${rowNum}</td>`;

        VISIBLE_TABLE_COLUMNS.forEach(col => {
            let val = row[col.key] || '';
            html += `<td>${escapeHtml(String(val))}</td>`;
        });

        html += `<td class="td-actions">
            <button class="btn-detail" onclick="showDetail(${globalIndex})" title="Lihat Detail">
                <i class="fas fa-eye"></i> Detail
            </button>
        </td>`;
        html += '</tr>';
    });

    tbody.innerHTML = html;
    renderPagination();
    updateTableInfo();
}

function updateTableInfo() {
    const info = document.getElementById('tableInfo');
    if (!info) return;
    const total = filteredData.length;
    if (total === 0) {
        info.textContent = 'Menampilkan 0 sampai 0 dari 0 data';
        return;
    }
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, total);
    info.textContent = `Menampilkan ${start} sampai ${end} dari ${total} data`;
}

function renderPagination() {
    const pag = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    if (totalPages <= 1) {
        pag.innerHTML = `<button class="page-btn disabled" disabled>Sebelum</button><button class="page-btn active">1</button><button class="page-btn disabled" disabled>Selanjutnya</button>`;
        return;
    }

    let html = '';
    html += `<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Sebelum</button>`;

    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    html += `<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Selanjutnya</button>`;
    pag.innerHTML = html;
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTableBody();
}

function changeRowsPerPage() {
    rowsPerPage = parseInt(document.getElementById('rowsPerPage').value) || 10;
    currentPage = 1;
    renderTableBody();
}

// ---- Sort ----
function sortTable(colIdx) {
    if (sortColumn === colIdx) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = colIdx;
        sortDirection = 'asc';
    }

    filteredData.sort((a, b) => {
        let valA, valB;
        if (colIdx === -1) {
            valA = tableData.indexOf(a);
            valB = tableData.indexOf(b);
        } else {
            const key = TABLE_COLUMNS[colIdx].key;
            const type = TABLE_COLUMNS[colIdx].type;
            valA = a[key] || '';
            valB = b[key] || '';

            if (type === 'number') {
                valA = parseFloat(valA) || 0;
                valB = parseFloat(valB) || 0;
            } else {
                valA = String(valA).toLowerCase();
                valB = String(valB).toLowerCase();
            }
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    currentPage = 1;
    renderTableBody();
}

// ---- Search/Filter ----
function filterTable() {
    const query = (document.getElementById('searchInput').value || '').toLowerCase().trim();

    if (!query) {
        filteredData = [...tableData];
    } else {
        filteredData = tableData.filter(row => {
            return TABLE_COLUMNS.some(col => {
                let val = row[col.key] || '';
                return String(val).toLowerCase().includes(query);
            });
        });
    }

    currentPage = 1;
    renderTableBody();
}

// ---- Open Add Modal ----
function openAddModal() {
    editingIndex = -1;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Tambah Data Korban';

    const body = document.getElementById('modalBody');
    let html = '<div class="modal-form">';

    TABLE_COLUMNS.forEach(col => {
        html += `<div class="form-group">`;
        html += `<label for="field-${col.key}">${col.label}</label>`;

        if (col.type === 'select') {
            html += `<select id="field-${col.key}" class="form-control">`;
            html += `<option value="">-- Pilih ${col.label} --</option>`;
            col.options.forEach(opt => {
                html += `<option value="${opt}">${opt}</option>`;
            });
            html += `</select>`;
        } else if (col.type === 'number') {
            html += `<input type="number" id="field-${col.key}" class="form-control" placeholder="Masukkan ${col.label}" min="0">`;
        } else if (col.type === 'date') {
            html += `<input type="date" id="field-${col.key}" class="form-control">`;
        } else {
            html += `<input type="text" id="field-${col.key}" class="form-control" placeholder="Masukkan ${col.label}">`;
        }

        html += `</div>`;
    });

    html += '</div>';
    body.innerHTML = html;
    document.getElementById('modalOverlay').classList.add('show');
}

// ---- Edit Record ----
function editRecord(index) {
    editingIndex = index;
    const record = tableData[index];
    if (!record) return;

    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Data Korban';

    const body = document.getElementById('modalBody');
    let html = '<div class="modal-form">';

    TABLE_COLUMNS.forEach(col => {
        const val = record[col.key] || '';
        html += `<div class="form-group">`;
        html += `<label for="field-${col.key}">${col.label}</label>`;

        if (col.type === 'select') {
            html += `<select id="field-${col.key}" class="form-control">`;
            html += `<option value="">-- Pilih ${col.label} --</option>`;
            col.options.forEach(opt => {
                html += `<option value="${opt}" ${val === opt ? 'selected' : ''}>${opt}</option>`;
            });
            html += `</select>`;
        } else if (col.type === 'number') {
            html += `<input type="number" id="field-${col.key}" class="form-control" value="${escapeHtml(val)}" min="0">`;
        } else if (col.type === 'date') {
            html += `<input type="date" id="field-${col.key}" class="form-control" value="${escapeHtml(val)}">`;
        } else {
            html += `<input type="text" id="field-${col.key}" class="form-control" value="${escapeHtml(val)}">`;
        }

        html += `</div>`;
    });

    html += '</div>';
    body.innerHTML = html;
    document.getElementById('modalOverlay').classList.add('show');
}

// ---- Save Record ----
function saveRecord() {
    const record = {};
    let hasData = false;

    TABLE_COLUMNS.forEach(col => {
        const el = document.getElementById(`field-${col.key}`);
        if (el) {
            record[col.key] = el.value.trim();
            if (record[col.key]) hasData = true;
        }
    });

    if (!hasData) {
        showToast('Mohon isi minimal satu field!', 'error');
        return;
    }

    const isNewRecord = editingIndex < 0;

    if (editingIndex >= 0) {
        tableData[editingIndex] = record;
        showToast('Data berhasil diperbarui!', 'success');
    } else {
        tableData.push(record);
        showToast('Data berhasil ditambahkan!', 'success');
    }

    saveTableData();

    // Sinkronisasi dengan dashboard utama - tambah 1 jika data baru
    if (isNewRecord) {
        syncWithMainDashboard(1);
    }

    closeModal();
    filterTable();
}

// ---- Delete Record ----
function deleteRecord(index) {
    deleteIndex = index;
    document.getElementById('deleteModal').classList.add('show');
}

function confirmDelete() {
    if (deleteIndex >= 0 && deleteIndex < tableData.length) {
        tableData.splice(deleteIndex, 1);
        saveTableData();

        // Sinkronisasi dengan dashboard utama - kurangi nilai korban
        syncWithMainDashboard(-1);

        filterTable();
        showToast('Data berhasil dihapus!', 'success');
    }
    closeDeleteModal();
}

// Fungsi untuk sinkronisasi dengan dashboard utama
function syncWithMainDashboard(delta) {
    try {
        const w = document.getElementById('filterWilayah')?.value || '';
        const s1 = document.getElementById('filterSatker1')?.value || '';
        const s2 = document.getElementById('filterSatker2')?.value || '';
        const t = document.getElementById('filterTahun')?.value || '';
        const b1 = document.getElementById('filterBulan1')?.value || '';
        const b2 = document.getElementById('filterBulan2')?.value || '';

        const mainKey = `pidum_${w}_${s1}_${s2}_${t}_${b1}_${b2}`;
        const mainData = localStorage.getItem(mainKey);

        if (mainData) {
            const data = JSON.parse(mainData);
            const currentVal = parseInt(data['val-korban']) || 0;
            const newVal = Math.max(0, currentVal + delta);
            data['val-korban'] = newVal.toString();
            localStorage.setItem(mainKey, JSON.stringify(data));
        }
    } catch (e) {
        console.error('Sync error:', e);
    }
}

// ---- Modal controls ----
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    editingIndex = -1;
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    deleteIndex = -1;
}

// ---- Detail Preview Modal ----
function showDetail(index) {
    const record = tableData[index];
    if (!record) return;

    const body = document.getElementById('detailModalBody');
    let html = '<table class="detail-preview-table">';

    TABLE_COLUMNS.forEach(col => {
        let val = record[col.key] || '-';
        if (col.type === 'date' && val !== '-') {
            // Format date from YYYY-MM-DD to DD-MM-YYYY
            const parts = val.split('-');
            if (parts.length === 3) val = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        html += `<tr>
            <td class="detail-label">${col.label}</td>
            <td class="detail-separator">:</td>
            <td class="detail-value">${escapeHtml(String(val))}</td>
        </tr>`;
    });

    html += '</table>';
    body.innerHTML = html;

    // Store current detail index for edit/delete from detail modal
    document.getElementById('detailModal').dataset.index = index;
    document.getElementById('detailModal').classList.add('show');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('show');
}

function editFromDetail() {
    const index = parseInt(document.getElementById('detailModal').dataset.index);
    closeDetailModal();
    editRecord(index);
}

function deleteFromDetail() {
    const index = parseInt(document.getElementById('detailModal').dataset.index);
    closeDetailModal();
    deleteRecord(index);
}

// ---- Export CSV ----
function exportCSV() {
    if (tableData.length === 0) {
        showToast('Tidak ada data untuk diekspor!', 'error');
        return;
    }

    let csv = 'No,' + TABLE_COLUMNS.map(c => `"${c.label}"`).join(',') + '\n';

    tableData.forEach((row, idx) => {
        csv += (idx + 1) + ',';
        csv += TABLE_COLUMNS.map(c => {
            let val = row[c.key] || '';
            val = String(val).replace(/"/g, '""');
            return `"${val}"`;
        }).join(',');
        csv += '\n';
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Korban_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data berhasil diekspor!', 'success');
}

// ============================================
// SAVE & LOAD (Charts + Cards)
// ============================================
function saveAllData() {
    const allData = { savedAt: new Date().toISOString() };

    // Cards
    allData.cards = {};
    ['korban-perempuan', 'korban-anak'].forEach(id => {
        const el = document.getElementById(id);
        if (el) allData.cards[id] = el.value;
    });

    // Perkara data
    allData.perkaraPerempuanData = perkaraPerempuanData;
    allData.perkaraAnakData = perkaraAnakData;

    // Monthly trend - Perempuan
    allData.trenPerempuan = {};
    getMonthRangeKb().forEach(m => {
        const el = document.getElementById(`monthly-perempuan-${m.index}`);
        if (el) allData.trenPerempuan[m.index] = el.value;
    });

    // Monthly trend - Anak
    allData.trenAnak = {};
    getMonthRangeKb().forEach(m => {
        const el = document.getElementById(`monthly-anak-${m.index}`);
        if (el) allData.trenAnak[m.index] = el.value;
    });

    try {
        localStorage.setItem(getKorbanStorageKey(), JSON.stringify(allData));
        // Also save table data
        saveTableData();
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
    const saved = localStorage.getItem(getKorbanStorageKey());
    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        // Cards
        if (data.cards) {
            Object.keys(data.cards).forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = data.cards[id];
            });
        }

        // Perkara Perempuan
        if (data.perkaraPerempuanData) {
            perkaraPerempuanData = data.perkaraPerempuanData;
            renderPerkaraPerempuanList();
        }

        // Perkara Anak
        if (data.perkaraAnakData) {
            perkaraAnakData = data.perkaraAnakData;
            renderPerkaraAnakList();
        }

        // Monthly trend - Perempuan
        if (data.trenPerempuan) {
            Object.keys(data.trenPerempuan).forEach(idx => {
                const el = document.getElementById(`monthly-perempuan-${idx}`);
                if (el) el.value = data.trenPerempuan[idx];
            });
        }

        // Monthly trend - Anak
        if (data.trenAnak) {
            Object.keys(data.trenAnak).forEach(idx => {
                const el = document.getElementById(`monthly-anak-${idx}`);
                if (el) el.value = data.trenAnak[idx];
            });
        }
    } catch (e) {
        console.error('Load error:', e);
    }
}

function resetAllData() {
    if (!confirm('Apakah Anda yakin ingin mengosongkan semua data di halaman ini?')) return;

    ['korban-perempuan', 'korban-anak'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    perkaraPerempuanData = [];
    perkaraAnakData = [];
    renderPerkaraPerempuanList();
    renderPerkaraAnakList();
    updatePerempuanBarChart();
    updateAnakBarChart();

    getMonthRangeKb().forEach(m => {
        const el1 = document.getElementById(`monthly-perempuan-${m.index}`);
        const el2 = document.getElementById(`monthly-anak-${m.index}`);
        if (el1) el1.value = '';
        if (el2) el2.value = '';
    });
    updatePerempuanTrendChart();
    updateAnakTrendChart();

    // Clear table
    tableData = [];
    saveTableData();
    filterTable();

    showToast('Semua data telah dikosongkan', 'success');
}

// ---- Filters ----
function applyFilters() {
    generateMonthlyInputsPerempuan();
    generateMonthlyInputsAnak();
    loadAllData();
    updatePerempuanBarChart();
    updateAnakBarChart();
    updatePerempuanTrendChart();
    updateAnakTrendChart();
    loadTableData();
    filterTable();
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

    ['korban-perempuan', 'korban-anak'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    perkaraPerempuanData = [];
    perkaraAnakData = [];
    renderPerkaraPerempuanList();
    renderPerkaraAnakList();

    generateMonthlyInputsPerempuan();
    generateMonthlyInputsAnak();
    updatePerempuanBarChart();
    updateAnakBarChart();
    updatePerempuanTrendChart();
    updateAnakTrendChart();

    tableData = [];
    filterTable();

    showToast('Filter telah direset', 'success');
}

// ---- Utility ----
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
        closeDeleteModal();
        closeDetailModal();
    }
});

// ---- Navigate to detail-korban page ----
function goToDetailKorban(jenis, event) {
    // Cegah navigasi jika user mengklik input field
    if (event && event.target.tagName === 'INPUT') {
        return;
    }

    const w = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t = document.getElementById('filterTahun')?.value || '';
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    const params = new URLSearchParams({ jenis, w, s1, s2, t, b1, b2 });
    window.location.href = `detail-korban.html?${params.toString()}`;
}
