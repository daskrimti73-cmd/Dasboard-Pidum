/* ============================================
   WNA DETAIL - JAVASCRIPT
   Detail table pages for WNA cards:
   - tersangka-wna: all WNA suspects
   - negara-asal: by country (Negara, Pria, Wanita, Total)
   - laki-laki: male suspects only
   - perempuan: female suspects only
   ============================================ */

// ---- All countries for dropdown ----
const ALL_COUNTRIES = [
    'Afghanistan','Afrika Selatan','Albania','Aljazair','Amerika Serikat','Andorra','Angola',
    'Antigua dan Barbuda','Arab Saudi','Argentina','Armenia','Australia','Austria','Azerbaijan',
    'Bahama','Bahrain','Bangladesh','Barbados','Belanda','Belarus','Belgia','Belize','Benin',
    'Bhutan','Bolivia','Bosnia dan Herzegovina','Botswana','Brasil','Brunei Darussalam','Bulgaria',
    'Burkina Faso','Burundi','Chad','Ceko','Chili','Denmark','Djibouti','Dominika','Ekuador',
    'El Salvador','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Filipina','Finlandia',
    'Gabon','Gambia','Georgia','Ghana','Grenada','Guatemala','Guinea','Guinea-Bissau',
    'Guinea Khatulistiwa','Guyana','Haiti','Honduras','Hong Kong','Hungaria','India','Indonesia',
    'Inggris','Irak','Iran','Irlandia','Islandia','Israel','Italia','Jamaika','Jepang','Jerman',
    'Kamboja','Kamerun','Kanada','Kazakhstan','Kenya','Kepulauan Marshall','Kepulauan Solomon',
    'Kirgistan','Kiribati','Kolombia','Komoro','Korea Selatan','Korea Utara','Kosovo','Kosta Rika',
    'Kroasia','Kuba','Kuwait','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein',
    'Lithuania','Luksemburg','Madagaskar','Makedonia Utara','Maladewa','Malawi','Malaysia','Mali',
    'Malta','Maroko','Mauritania','Mauritius','Meksiko','Mesir','Mikronesia','Moldova','Monako',
    'Mongolia','Montenegro','Mozambik','Myanmar','Namibia','Nauru','Nepal','Niger','Nigeria',
    'Nikaragua','Norwegia','Oman','Pakistan','Palau','Palestina','Panama','Pantai Gading',
    'Papua Nugini','Paraguay','Peru','Polandia','Portugal','Prancis','Qatar',
    'Republik Afrika Tengah','Republik Demokratik Kongo','Republik Dominika','Republik Kongo',
    'Rumania','Rusia','Rwanda','Saint Kitts dan Nevis','Saint Lucia',
    'Saint Vincent dan Grenadines','Samoa','San Marino','Sao Tome dan Principe','Selandia Baru',
    'Senegal','Serbia','Seychelles','Sierra Leone','Singapura','Siprus','Slovakia','Slovenia',
    'Somalia','Spanyol','Sri Lanka','Sudan','Sudan Selatan','Suriname','Suriah','Swedia','Swiss',
    'Tajikistan','Taiwan','Tanzania','Thailand','Tiongkok','Timor Leste','Togo','Tonga',
    'Trinidad dan Tobago','Tunisia','Turki','Turkmenistan','Tuvalu','Uganda','Ukraina',
    'Uni Emirat Arab','Uruguay','Uzbekistan','Vanuatu','Vatikan','Venezuela','Vietnam','Yaman',
    'Yordania','Yunani','Zambia','Zimbabwe'
];

const SATKER_LIST = [
    'Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun',
    'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'
];

const TINDAK_PIDANA_OPTIONS = [
    'DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E',
    'MNEGTIBUM DAN TPUL', 'NARKOTIKA', 'OHARDA', 'TERORISME'
];

const JENIS_KELAMIN_OPTIONS = ['Laki-laki', 'Perempuan'];

// ---- Section configurations ----
const WNA_SECTIONS = {
    'tersangka-wna': {
        title: 'TERSANGKA WNA',
        icon: 'fas fa-users',
        columns: [
            { key: 'nama_tersangka', label: 'Nama Tersangka', type: 'text', width: '18%' },
            { key: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', options: JENIS_KELAMIN_OPTIONS, width: '10%' },
            { key: 'umur', label: 'Umur', type: 'number', width: '7%' },
            { key: 'jenis_tindak_pidana', label: 'Jenis Tindak Pidana', type: 'select', options: TINDAK_PIDANA_OPTIONS, width: '14%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '20%' },
            { key: 'negara', label: 'Negara', type: 'select', options: ALL_COUNTRIES, width: '12%' },
            { key: 'satuan_kerja', label: 'Satuan Kerja', type: 'select', options: SATKER_LIST, width: '12%' }
        ]
    },
    'negara-asal': {
        title: 'TERSANGKA WNA BERDASARKAN NEGARA',
        icon: 'fas fa-flag',
        columns: [
            { key: 'negara', label: 'Negara', type: 'select', options: ALL_COUNTRIES, width: '35%' },
            { key: 'pria', label: 'Pria', type: 'number', width: '18%' },
            { key: 'wanita', label: 'Wanita', type: 'number', width: '18%' },
            { key: 'total', label: 'Total', type: 'auto', width: '18%' }
        ]
    },
    'laki-laki': {
        title: 'LAKI-LAKI',
        icon: 'fas fa-male',
        columns: [
            { key: 'nama_tersangka', label: 'Nama Tersangka', type: 'text', width: '20%' },
            { key: 'umur', label: 'Umur', type: 'number', width: '8%' },
            { key: 'jenis_tindak_pidana', label: 'Jenis Tindak Pidana', type: 'select', options: TINDAK_PIDANA_OPTIONS, width: '15%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '22%' },
            { key: 'negara', label: 'Negara', type: 'select', options: ALL_COUNTRIES, width: '14%' },
            { key: 'satuan_kerja', label: 'Satuan Kerja', type: 'select', options: SATKER_LIST, width: '14%' }
        ]
    },
    'perempuan': {
        title: 'PEREMPUAN',
        icon: 'fas fa-female',
        columns: [
            { key: 'nama_tersangka', label: 'Nama Tersangka', type: 'text', width: '20%' },
            { key: 'umur', label: 'Umur', type: 'number', width: '8%' },
            { key: 'jenis_tindak_pidana', label: 'Jenis Tindak Pidana', type: 'select', options: TINDAK_PIDANA_OPTIONS, width: '15%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '22%' },
            { key: 'negara', label: 'Negara', type: 'select', options: ALL_COUNTRIES, width: '14%' },
            { key: 'satuan_kerja', label: 'Satuan Kerja', type: 'select', options: SATKER_LIST, width: '14%' }
        ]
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
function initWnaDetail() {
    const params = new URLSearchParams(window.location.search);
    currentSection = params.get('section') || 'tersangka-wna';
    currentConfig = WNA_SECTIONS[currentSection];

    if (!currentConfig) {
        currentSection = 'tersangka-wna';
        currentConfig = WNA_SECTIONS['tersangka-wna'];
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
    document.title = `${cfg.title} - Dashboard Kejaksaan RI`;
    document.getElementById('breadcrumbTitle').textContent = cfg.title;
    document.getElementById('bannerSection').textContent = cfg.title;
    document.getElementById('tableTitle').textContent = cfg.title;
}

// ---- Storage key ----
function getStorageKeyWna() {
    const w = document.getElementById('filterWilayah').value || '';
    const s1 = document.getElementById('filterSatker1').value || '';
    const s2 = document.getElementById('filterSatker2').value || '';
    const t = document.getElementById('filterTahun').value || '';
    const b1 = document.getElementById('filterBulan1').value || '';
    const b2 = document.getElementById('filterBulan2').value || '';
    return `wna_detail_${currentSection}_${w}_${s1}_${s2}_${t}_${b1}_${b2}`;
}

// ---- Load/Save data ----
function loadTableData() {
    const key = getStorageKeyWna();
    const saved = localStorage.getItem(key);
    if (saved) {
        try { tableData = JSON.parse(saved); } catch (e) { tableData = []; }
    } else {
        tableData = [];
    }
}

function saveTableData() {
    const key = getStorageKeyWna();
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
            // Auto-compute total for negara-asal
            if (col.type === 'auto' && col.key === 'total') {
                val = (parseInt(row['pria']) || 0) + (parseInt(row['wanita']) || 0);
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
            // Sort by original index
            valA = tableData.indexOf(a);
            valB = tableData.indexOf(b);
        } else {
            const key = currentConfig.columns[colIdx].key;
            const type = currentConfig.columns[colIdx].type;
            valA = a[key] || '';
            valB = b[key] || '';

            // Auto total
            if (type === 'auto' && key === 'total') {
                valA = (parseInt(a['pria']) || 0) + (parseInt(a['wanita']) || 0);
                valB = (parseInt(b['pria']) || 0) + (parseInt(b['wanita']) || 0);
            }

            // Number sort
            if (type === 'number' || type === 'auto') {
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
            return currentConfig.columns.some(col => {
                let val = row[col.key] || '';
                if (col.type === 'auto' && col.key === 'total') {
                    val = String((parseInt(row['pria']) || 0) + (parseInt(row['wanita']) || 0));
                }
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
        if (col.type === 'auto') return; // skip auto-computed fields

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
        if (col.type === 'auto') return;

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
        if (col.type === 'auto') return;
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
        
        // Sinkronisasi dengan dashboard utama - kurangi nilai WNA
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
            const currentVal = parseInt(data['val-wna']) || 0;
            const newVal = Math.max(0, currentVal + delta);
            data['val-wna'] = newVal.toString();
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
            if (c.type === 'auto' && c.key === 'total') {
                val = String((parseInt(row['pria']) || 0) + (parseInt(row['wanita']) || 0));
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
    a.download = `WNA_${currentConfig.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
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
