/* ============================================
   DETAIL KORBAN - JAVASCRIPT
   Filtered table view for Perempuan / Anak
   Reads data from korban table localStorage
   ============================================ */

// ---- Column config (same visible columns as dasti) ----
const DETAIL_COLUMNS = [
    { key: 'nama', label: 'Nama', width: '20%' },
    { key: 'jenis_kelamin', label: 'Jenis Kelamin', width: '12%' },
    { key: 'umur', label: 'Umur', width: '8%', type: 'number' },
    { key: 'tindak_pidana', label: 'Tindak Pidana', width: '18%' },
    { key: 'jenis_perkara', label: 'Jenis Perkara', width: '18%' },
    { key: 'satker', label: 'Satker', width: '14%' }
];

// All columns for detail preview modal (including hidden ones)
const ALL_COLUMNS = [
    { key: 'nomor_spdp', label: 'Nomor SPDP' },
    { key: 'tanggal_terima_spdp', label: 'Tanggal Terima SPDP', type: 'date' },
    { key: 'nama', label: 'Nama' },
    { key: 'jenis_kelamin', label: 'Jenis Kelamin' },
    { key: 'umur', label: 'Umur' },
    { key: 'tindak_pidana', label: 'Tindak Pidana' },
    { key: 'jenis_perkara', label: 'Jenis Perkara' },
    { key: 'satker', label: 'Satker' }
];

// ---- State ----
let jenisFilter = '';  // 'PEREMPUAN' or 'ANAK'
let allTableData = []; // all korban table data
let filteredData = []; // after jenis + search filter
let currentPage = 1;
let rowsPerPage = 25;
let sortColumn = -1;
let sortDirection = 'asc';

// ============================================
// INITIALIZE
// ============================================
function initDetailKorban() {
    // Read URL params
    const params = new URLSearchParams(window.location.search);
    jenisFilter = (params.get('jenis') || 'PEREMPUAN').toUpperCase();

    // Set filter dropdowns from URL params
    setSelectVal('filterWilayah', params.get('w'));
    setSelectVal('filterSatker1', params.get('s1'));
    setSelectVal('filterSatker2', params.get('s2'));
    setSelectVal('filterTahun', params.get('t'));
    setSelectVal('filterBulan1', params.get('b1'));
    setSelectVal('filterBulan2', params.get('b2'));

    // Set breadcrumb title
    const titleEl = document.getElementById('breadcrumbTitle');
    if (titleEl) {
        titleEl.textContent = `Detail Korban ${jenisFilter === 'ANAK' ? 'Anak' : 'Perempuan'}`;
    }

    // Set page title
    document.title = `Detail Korban ${jenisFilter === 'ANAK' ? 'Anak' : 'Perempuan'} - Dashboard Kejaksaan RI`;

    loadData();
    renderTableHead();
    filterTable();
}

function setSelectVal(id, val) {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
}

// ============================================
// DATA
// ============================================
function getTableStorageKey() {
    const w  = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t  = document.getElementById('filterTahun')?.value || '';
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    return `korban_table_${w}_${s1}_${s2}_${t}_${b1}_${b2}`;
}

function loadData() {
    const key = getTableStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
        try { allTableData = JSON.parse(saved); } catch (e) { allTableData = []; }
    } else {
        allTableData = [];
    }
}

// ============================================
// TABLE RENDERING
// ============================================
function renderTableHead() {
    const thead = document.getElementById('tableHead');
    let html = '<tr>';
    DETAIL_COLUMNS.forEach((col, idx) => {
        html += `<th style="width:${col.width}; cursor:pointer" onclick="sortTable(${idx})">${col.label} <i class="fas fa-sort"></i></th>`;
    });
    html += '<th class="th-actions" style="width:10%">Aksi</th></tr>';
    thead.innerHTML = html;
}

function renderTableBody() {
    const tbody = document.getElementById('tableBody');

    if (filteredData.length === 0) {
        const colSpan = DETAIL_COLUMNS.length + 1;
        tbody.innerHTML = `<tr><td colspan="${colSpan}" class="empty-row">
            <i class="fas fa-inbox"></i><br>Tidak ada data yang tersedia
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
        const globalIndex = allTableData.indexOf(row);
        const isEven = (start + idx) % 2 === 1;

        html += `<tr class="${isEven ? 'row-even' : ''}">`;
        DETAIL_COLUMNS.forEach(col => {
            let val = row[col.key] || '';
            html += `<td>${escapeHtml(String(val))}</td>`;
        });
        html += `<td class="td-actions">
            <button class="btn-detail" onclick="showDetail(${globalIndex})" title="Lihat Detail">
                Detail
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

// ============================================
// SORT
// ============================================
function sortTable(colIdx) {
    if (sortColumn === colIdx) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = colIdx;
        sortDirection = 'asc';
    }

    filteredData.sort((a, b) => {
        const key = DETAIL_COLUMNS[colIdx].key;
        const type = DETAIL_COLUMNS[colIdx].type;
        let valA = a[key] || '';
        let valB = b[key] || '';

        if (type === 'number') {
            valA = parseFloat(valA) || 0;
            valB = parseFloat(valB) || 0;
        } else {
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    currentPage = 1;
    renderTableBody();
}

// ============================================
// FILTER / SEARCH
// ============================================
function filterTable() {
    const query = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();

    // First: filter by jenis (PEREMPUAN / ANAK)
    let jenisFiltered = allTableData.filter(row => {
        const jk = (row.jenis_kelamin || '').toUpperCase();
        return jk === jenisFilter;
    });

    // Then: search filter
    if (query) {
        filteredData = jenisFiltered.filter(row => {
            return DETAIL_COLUMNS.some(col => {
                let val = row[col.key] || '';
                return String(val).toLowerCase().includes(query);
            });
        });
    } else {
        filteredData = [...jenisFiltered];
    }

    currentPage = 1;
    renderTableBody();
}

// ============================================
// DETAIL PREVIEW MODAL
// ============================================
function showDetail(index) {
    const record = allTableData[index];
    if (!record) return;

    const body = document.getElementById('detailModalBody');
    let html = '<table class="detail-preview-table">';

    ALL_COLUMNS.forEach(col => {
        let val = record[col.key] || '-';
        if (col.type === 'date' && val !== '-') {
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
    document.getElementById('detailModal').classList.add('show');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('show');
}

// ============================================
// CARI BUTTON (re-apply filters)
// ============================================
function applyCariFilter() {
    // Re-build URL with current filter values and navigate
    const w  = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t  = document.getElementById('filterTahun')?.value || '';
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    const params = new URLSearchParams({ jenis: jenisFilter, w, s1, s2, t, b1, b2 });
    window.location.href = `detail-korban.html?${params.toString()}`;
}

// ============================================
// UTILITY
// ============================================
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeDetailModal();
    }
});
