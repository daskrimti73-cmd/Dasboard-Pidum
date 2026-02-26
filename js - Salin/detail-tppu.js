/* ============================================
   DETAIL TPPU - JAVASCRIPT
   Filtered table view for TPPU / TPA
   Full CRUD on detail page
   ============================================ */

// ---- Satker list for select field ----
const SATKER_LIST_TPPU = [
    'Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun',
    'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'
];

// ---- All columns (for storage/modals) ----
const ALL_COLUMNS = [
    { key: 'jenis', label: 'Jenis', type: 'hidden' },
    { key: 'no_berkas', label: 'No. Berkas', type: 'text', width: '22%' },
    { key: 'tgl_berkas', label: 'Tgl Berkas', type: 'date', width: '12%' },
    { key: 'no_pengantar', label: 'No. Pengantar', type: 'text', width: '20%' },
    { key: 'undang_undang', label: 'Undang-Undang', type: 'text', width: '18%' },
    { key: 'pasal', label: 'Pasal', type: 'text', width: '14%' },
    { key: 'satker', label: 'Satker', type: 'select', options: SATKER_LIST_TPPU, width: '14%' }
];

// ---- Visible table columns (exclude hidden jenis) ----
const DETAIL_COLUMNS = ALL_COLUMNS.filter(c => c.type !== 'hidden');

// ---- State ----
let jenisFilter = '';  // 'TPPU' or 'TPA'
let allTableData = [];   // all rows (both TPPU and TPA)
let filteredData = [];   // rows matching jenisFilter + search
let currentPage = 1;
let rowsPerPage = 10;
let sortColumn = -1;
let sortDirection = 'asc';
let editingIndex = -1;   // index in allTableData
let deleteIndex = -1;

// ============================================
// INITIALIZE
// ============================================
function initDetailTppu() {
    const params = new URLSearchParams(window.location.search);
    jenisFilter = (params.get('jenis') || 'TPPU').toUpperCase();

    setSelectVal('filterWilayah', params.get('w'));
    setSelectVal('filterSatker1', params.get('s1'));
    setSelectVal('filterSatker2', params.get('s2'));
    setSelectVal('filterTahun', params.get('t'));
    setSelectVal('filterBulan1', params.get('b1'));
    setSelectVal('filterBulan2', params.get('b2'));

    const titleEl = document.getElementById('breadcrumbTitle');
    if (titleEl) titleEl.textContent = `Detail ${jenisFilter}`;

    document.title = `Detail ${jenisFilter} - Dashboard Kejaksaan RI`;

    loadData();
    renderTableHead();
    filterTable();
}

function setSelectVal(id, val) {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
}

// ============================================
// DATA (localStorage)
// ============================================
function getTableStorageKey() {
    const w  = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t  = document.getElementById('filterTahun')?.value || '';
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    return `tppu_${w}_${s1}_${s2}_${t}_${b1}_${b2}_table`;
}

function loadData() {
    const saved = localStorage.getItem(getTableStorageKey());
    if (saved) {
        try { allTableData = JSON.parse(saved); } catch (e) { allTableData = []; }
    } else {
        allTableData = [];
    }
}

function saveData() {
    try { localStorage.setItem(getTableStorageKey(), JSON.stringify(allTableData)); } catch (e) { console.error('Save error:', e); }
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
    html += '<th class="th-actions" style="width:100px">Aksi</th>';
    html += '</tr>';
    thead.innerHTML = html;
}

function renderTableBody() {
    const tbody = document.getElementById('tableBody');

    if (filteredData.length === 0) {
        const colSpan = DETAIL_COLUMNS.length + 1;
        tbody.innerHTML = `<tr><td colspan="${colSpan}" class="empty-row">
            Tidak ada data yang tersedia pada tabel ini
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
            if (col.type === 'date' && val) {
                const parts = val.split('-');
                if (parts.length === 3) val = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
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
    if (total === 0) { info.textContent = 'Menampilkan 0 sampai 0 dari 0 data'; return; }
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
    let html = `<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Sebelum</button>`;
    const maxV = 5;
    let sp = Math.max(1, currentPage - Math.floor(maxV / 2));
    let ep = Math.min(totalPages, sp + maxV - 1);
    if (ep - sp < maxV - 1) sp = Math.max(1, ep - maxV + 1);
    for (let i = sp; i <= ep; i++) html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
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
        const key = DETAIL_COLUMNS[colIdx].key;
        let valA = String(a[key] || '').toLowerCase();
        let valB = String(b[key] || '').toLowerCase();
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    currentPage = 1;
    renderTableBody();
}

// ---- Filter / Search ----
function filterTable() {
    const query = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();

    // Filter by jenis (TPPU / TPA)
    let jenisFiltered = allTableData.filter(row => {
        const j = (row.jenis || '').toUpperCase();
        return j === jenisFilter;
    });

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
// CRUD - Add / Edit Modal
// ============================================
function openAddModal() {
    editingIndex = -1;
    document.getElementById('modalTitle').innerHTML = `<i class="fas fa-plus-circle"></i> Tambah Data ${jenisFilter}`;
    const body = document.getElementById('modalBody');
    let html = '<div class="modal-form">';
    ALL_COLUMNS.forEach(col => {
        if (col.type === 'hidden') return; // skip jenis
        html += `<div class="form-group"><label for="field-${col.key}">${col.label}</label>`;
        if (col.type === 'select') {
            html += `<select id="field-${col.key}" class="form-control"><option value="">-- Pilih ${col.label} --</option>`;
            col.options.forEach(opt => { html += `<option value="${opt}">${opt}</option>`; });
            html += `</select>`;
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

function editRecord(index) {
    editingIndex = index;
    const record = allTableData[index];
    if (!record) return;
    document.getElementById('modalTitle').innerHTML = `<i class="fas fa-edit"></i> Edit Data ${jenisFilter}`;
    const body = document.getElementById('modalBody');
    let html = '<div class="modal-form">';
    ALL_COLUMNS.forEach(col => {
        if (col.type === 'hidden') return;
        const val = record[col.key] || '';
        html += `<div class="form-group"><label for="field-${col.key}">${col.label}</label>`;
        if (col.type === 'select') {
            html += `<select id="field-${col.key}" class="form-control"><option value="">-- Pilih ${col.label} --</option>`;
            col.options.forEach(opt => { html += `<option value="${opt}" ${val === opt ? 'selected' : ''}>${opt}</option>`; });
            html += `</select>`;
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

function saveRecord() {
    const record = {};
    let hasData = false;
    // Auto-set jenis
    record.jenis = jenisFilter;
    ALL_COLUMNS.forEach(col => {
        if (col.type === 'hidden') return;
        const el = document.getElementById(`field-${col.key}`);
        if (el) { record[col.key] = el.value.trim(); if (record[col.key]) hasData = true; }
    });
    if (!hasData) { showToast('Mohon isi minimal satu field!', 'error'); return; }
    
    const isNewRecord = editingIndex < 0;
    
    if (editingIndex >= 0) {
        allTableData[editingIndex] = record;
        showToast('Data berhasil diperbarui!', 'success');
    } else {
        allTableData.push(record);
        showToast('Data berhasil ditambahkan!', 'success');
    }
    saveData();
    
    // Sinkronisasi dengan dashboard utama - tambah 1 jika data baru
    if (isNewRecord) {
        syncWithMainDashboard(1);
    }
    
    closeModal();
    filterTable();
}

// ---- Delete ----
function deleteRecord(index) {
    deleteIndex = index;
    document.getElementById('deleteModal').classList.add('show');
}

function confirmDelete() {
    if (deleteIndex >= 0 && deleteIndex < allTableData.length) {
        allTableData.splice(deleteIndex, 1);
        saveData();
        
        // Sinkronisasi dengan dashboard utama - kurangi nilai TPPU
        syncWithMainDashboard(-1);
        
        filterTable();
        showToast('Data berhasil dihapus!', 'success');
    }
    closeDeleteModal();
}

// Fungsi untuk sinkronisasi dengan dashboard utama
function syncWithMainDashboard(delta) {
    try {
        const w  = document.getElementById('filterWilayah')?.value || '';
        const s1 = document.getElementById('filterSatker1')?.value || '';
        const s2 = document.getElementById('filterSatker2')?.value || '';
        const t  = document.getElementById('filterTahun')?.value || '';
        const b1 = document.getElementById('filterBulan1')?.value || '';
        const b2 = document.getElementById('filterBulan2')?.value || '';
        
        const mainKey = `pidum_${w}_${s1}_${s2}_${t}_${b1}_${b2}`;
        const mainData = localStorage.getItem(mainKey);
        
        if (mainData) {
            const data = JSON.parse(mainData);
            const currentVal = parseInt(data['val-tppu']) || 0;
            const newVal = Math.max(0, currentVal + delta);
            data['val-tppu'] = newVal.toString();
            localStorage.setItem(mainKey, JSON.stringify(data));
        }
    } catch (e) {
        console.error('Sync error:', e);
    }
}

// ---- Detail Preview ----
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
        html += `<tr><td class="detail-label">${col.label}</td><td class="detail-separator">:</td><td class="detail-value">${escapeHtml(String(val))}</td></tr>`;
    });
    html += '</table>';
    body.innerHTML = html;
    document.getElementById('detailModal').dataset.index = index;
    document.getElementById('detailModal').classList.add('show');
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

// ---- Modal controls ----
function closeModal() { document.getElementById('modalOverlay').classList.remove('show'); editingIndex = -1; }
function closeDeleteModal() { document.getElementById('deleteModal').classList.remove('show'); deleteIndex = -1; }
function closeDetailModal() { document.getElementById('detailModal').classList.remove('show'); }

// ---- Cari Button ----
function applyCariFilter() {
    const w  = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t  = document.getElementById('filterTahun')?.value || '';
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    const params = new URLSearchParams({ jenis: jenisFilter, w, s1, s2, t, b1, b2 });
    window.location.href = `detail-tppu.html?${params.toString()}`;
}

// ---- Utility ----
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); closeDeleteModal(); closeDetailModal(); }
});
