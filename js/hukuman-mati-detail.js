/* ============================================
   HUKUMAN MATI DETAIL - JAVASCRIPT
   Detail table pages for Hukuman Mati cards:
   - pengadilan-negeri
   - pengadilan-tinggi
   - mahkamah-agung
   All share the same columns:
     Nama Tersangka, No Register Perkara, No Putusan,
     Tanggal Putusan, Jenis Tindak Pidana, Jenis Perkara, Nama Satker
   ============================================ */

const SATKER_LIST_HM = [
    'Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun',
    'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'
];

const TINDAK_PIDANA_OPTIONS_HM = [
    'DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E',
    'MNEGTIBUM DAN TPUL', 'NARKOTIKA', 'OHARDA', 'TERORISME'
];

const JENIS_PERKARA_OPTIONS_HM = [
    'Biasa', 'Singkat', 'Cepat', 'Koneksitas'
];

// ---- Shared column definition ----
const HM_COLUMNS = [
    { key: 'nama_tersangka', label: 'Nama Tersangka', type: 'text', width: '16%' },
    { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '14%' },
    { key: 'no_putusan', label: 'No Putusan', type: 'text', width: '13%' },
    { key: 'tanggal_putusan', label: 'Tanggal Putusan', type: 'date', width: '12%' },
    { key: 'jenis_tindak_pidana', label: 'Jenis Tindak Pidana', type: 'select', options: TINDAK_PIDANA_OPTIONS_HM, width: '14%' },
    { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'select', options: JENIS_PERKARA_OPTIONS_HM, width: '12%' },
    { key: 'nama_satker', label: 'Nama Satker', type: 'select', options: SATKER_LIST_HM, width: '13%' }
];

// ---- Section configurations ----
const HM_SECTIONS = {
    'pengadilan-negeri': {
        title: 'PENGADILAN NEGERI',
        icon: 'fas fa-landmark',
        columns: HM_COLUMNS
    },
    'pengadilan-tinggi': {
        title: 'PENGADILAN TINGGI',
        icon: 'fas fa-university',
        columns: HM_COLUMNS
    },
    'mahkamah-agung': {
        title: 'MAHKAMAH AGUNG RI',
        icon: 'fas fa-balance-scale',
        columns: HM_COLUMNS
    }
};

// ---- State ----
let currentSection = '';
let currentConfig = null;
let tableData = [];
let filteredData = [];
let currentPage = 1;
let rowsPerPage = 10;
let editingIndex = -1;
let deleteIndex = -1;
let sortColumn = -1;
let sortDirection = 'asc';

// ---- Initialize ----
function initHmDetail() {
    const params = new URLSearchParams(window.location.search);
    currentSection = params.get('section') || 'pengadilan-negeri';
    currentConfig = HM_SECTIONS[currentSection];

    if (!currentConfig) {
        currentSection = 'pengadilan-negeri';
        currentConfig = HM_SECTIONS['pengadilan-negeri'];
    }

    setupPageInfo();
    loadTableData();
    renderTableHead();
    filterTable();
}

// ---- Setup page info ----
function setupPageInfo() {
    const cfg = currentConfig;
    document.getElementById('pageTitle').innerHTML = `<i class="${cfg.icon}" style="margin-right: 10px;"></i>${cfg.title}`;
    document.title = `${cfg.title} - Hukuman Mati - Dashboard Kejaksaan RI`;
    document.getElementById('breadcrumbTitle').textContent = cfg.title;
    document.getElementById('bannerSection').textContent = cfg.title;
    document.getElementById('tableTitle').textContent = cfg.title;
}

// ---- Storage key ----
function getStorageKeyHm() {
    const w  = document.getElementById('filterWilayah').value || '';
    const s1 = document.getElementById('filterSatker1').value || '';
    const s2 = document.getElementById('filterSatker2').value || '';
    const t  = document.getElementById('filterTahun').value || '';
    const b1 = document.getElementById('filterBulan1').value || '';
    const b2 = document.getElementById('filterBulan2').value || '';
    return `hm_detail_${currentSection}_${w}_${s1}_${s2}_${t}_${b1}_${b2}`;
}

// ---- Load/Save data ----
function loadTableData() {
    const key = getStorageKeyHm();
    const saved = localStorage.getItem(key);
    if (saved) {
        try { tableData = JSON.parse(saved); } catch (e) { tableData = []; }
    } else {
        tableData = [];
    }
}

function saveTableData() {
    const key = getStorageKeyHm();
    try { localStorage.setItem(key, JSON.stringify(tableData)); } catch (e) { console.error('Save error:', e); }
}

// ---- Render table header ----
function renderTableHead() {
    const thead = document.getElementById('tableHead');
    let html = '<tr><th class="th-no" style="cursor:pointer" onclick="sortTable(-1)">No <i class="fas fa-sort"></i></th>';
    currentConfig.columns.forEach((col, idx) => {
        html += `<th style="width:${col.width}; cursor:pointer" onclick="sortTable(${idx})">${col.label} <i class="fas fa-sort"></i></th>`;
    });
    html += '<th class="th-actions">Aksi</th></tr>';
    thead.innerHTML = html;
}

// ---- Render table body ----
function renderTableBody() {
    const tbody = document.getElementById('tableBody');

    if (filteredData.length === 0) {
        const colSpan = currentConfig.columns.length + 2;
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

        currentConfig.columns.forEach(col => {
            let val = row[col.key] || '';
            // Format date for display
            if (col.type === 'date' && val) {
                try {
                    const d = new Date(val);
                    if (!isNaN(d.getTime())) {
                        val = d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    }
                } catch (e) { /* keep original */ }
            }
            html += `<td>${escapeHtml(String(val))}</td>`;
        });

        html += `<td class="td-actions">
            <button class="btn-icon btn-edit" onclick="editRecord(${globalIndex})" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="deleteRecord(${globalIndex})" title="Hapus">
                <i class="fas fa-trash"></i>
            </button>
        </td>`;
        html += '</tr>';
    });

    tbody.innerHTML = html;
    renderPagination();
    updateTableInfo();
}

// ---- Table info ----
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

// ---- Pagination ----
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
            const key = currentConfig.columns[colIdx].key;
            const type = currentConfig.columns[colIdx].type;
            valA = a[key] || '';
            valB = b[key] || '';

            if (type === 'number') {
                valA = parseFloat(valA) || 0;
                valB = parseFloat(valB) || 0;
            } else if (type === 'date') {
                valA = new Date(valA).getTime() || 0;
                valB = new Date(valB).getTime() || 0;
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
            return currentConfig.columns.some(col => {
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
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Tambah Data';

    const body = document.getElementById('modalBody');
    let html = '<div class="modal-form">';

    currentConfig.columns.forEach(col => {
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

    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Data';

    const body = document.getElementById('modalBody');
    let html = '<div class="modal-form">';

    currentConfig.columns.forEach(col => {
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

    currentConfig.columns.forEach(col => {
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
        
        // Sinkronisasi dengan dashboard utama - kurangi nilai hukuman mati
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
            const currentVal = parseInt(data['val-hukuman-mati']) || 0;
            const newVal = Math.max(0, currentVal + delta);
            data['val-hukuman-mati'] = newVal.toString();
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

// ---- Export CSV ----
function exportCSV() {
    if (tableData.length === 0) {
        showToast('Tidak ada data untuk diekspor!', 'error');
        return;
    }

    const cols = currentConfig.columns;
    let csv = 'No,' + cols.map(c => `"${c.label}"`).join(',') + '\n';

    tableData.forEach((row, idx) => {
        csv += (idx + 1) + ',';
        csv += cols.map(c => {
            let val = row[c.key] || '';
            if (c.type === 'date' && val) {
                try {
                    const d = new Date(val);
                    if (!isNaN(d.getTime())) {
                        val = d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    }
                } catch (e) { /* keep original */ }
            }
            val = String(val).replace(/"/g, '""');
            return `"${val}"`;
        }).join(',');
        csv += '\n';
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HukumanMati_${currentConfig.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data berhasil diekspor!', 'success');
}

// ---- Filters ----
function applyFilters() {
    loadTableData();
    filterTable();
    showToast('Filter diterapkan', 'success');
}

function resetFilters() {
    document.getElementById('filterWilayah').value = 'kejati-kepri';
    document.getElementById('filterSatker1').value = '';
    document.getElementById('filterSatker2').value = '';
    document.getElementById('filterTahun').value = getTahunList()[0]?.toString() || '2026';
    document.getElementById('filterBulan1').value = '01';
    document.getElementById('filterBulan2').value = '02';
    loadTableData();
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
    }
});
