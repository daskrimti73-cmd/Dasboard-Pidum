/* ============================================
   DETAIL TABLE - JAVASCRIPT
   Dynamic table management for detail pages
   SPDP, P-16, P-17, Pengembalian, SP3,
   Tahap1, P-18, P-19, P-20, P-21, P-21A,
   Pengembalian Berkas, SP3 Tahap1
   ============================================ */

// ---- Section configurations: columns per section type ----
const SECTION_CONFIG = {
    // === PRA PENUNTUTAN ===
    'spdp': {
        title: 'SPDP',
        parent: 'PRA PENUNTUTAN',
        icon: 'fas fa-folder-open',
        columns: [
            { key: 'nomor_surat', label: 'Nomor Surat', type: 'text', width: '25%' },
            { key: 'tanggal_spdp', label: 'Tanggal SPDP', type: 'date', width: '12%' },
            { key: 'nama_satker', label: 'Nama Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '14%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '14%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '25%' }
        ]
    },
    'p16': {
        title: 'P-16',
        parent: 'PRA PENUNTUTAN',
        icon: 'fas fa-file-alt',
        columns: [
            { key: 'no_p16', label: 'No. P-16', type: 'text', width: '20%' },
            { key: 'no_spdp', label: 'No. SPDP', type: 'text', width: '25%' },
            { key: 'tgl_p16', label: 'Tgl. P-16', type: 'date', width: '12%' },
            { key: 'jaksa_peneliti', label: 'Jaksa Peneliti', type: 'textarea', width: '25%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '14%' }
        ]
    },
    'p17': {
        title: 'P-17',
        parent: 'PRA PENUNTUTAN',
        icon: 'fas fa-file-alt',
        columns: [
            { key: 'no_p17', label: 'No P-17', type: 'text', width: '20%' },
            { key: 'no_spdp', label: 'No. SPDP', type: 'text', width: '25%' },
            { key: 'tgl_p17', label: 'Tgl. P-17', type: 'date', width: '12%' },
            { key: 'jaksa', label: 'Jaksa', type: 'textarea', width: '25%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '14%' }
        ]
    },
    'pengembalian': {
        title: 'Pengembalian',
        parent: 'PRA PENUNTUTAN',
        icon: 'fas fa-undo-alt',
        columns: [
            { key: 'no_pengembalian', label: 'No. Pengembalian', type: 'text', width: '20%' },
            { key: 'no_spdp', label: 'No. SPDP', type: 'text', width: '25%' },
            { key: 'tgl_spdp_kembali', label: 'Tgl. SPDP Kembali', type: 'date', width: '12%' },
            { key: 'jaksa', label: 'Jaksa', type: 'textarea', width: '25%' },
            { key: 'nama_satker', label: 'Nama Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '14%' }
        ]
    },
    'sp3': {
        title: 'SP3',
        parent: 'PRA PENUNTUTAN',
        icon: 'fas fa-ban',
        columns: [
            { key: 'no_sp3', label: 'No. SP3', type: 'text', width: '20%' },
            { key: 'no_spdp', label: 'No. SPDP', type: 'text', width: '25%' },
            { key: 'tgl_sp3', label: 'Tgl. SP3', type: 'date', width: '12%' },
            { key: 'jaksa', label: 'Jaksa', type: 'textarea', width: '25%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '14%' }
        ]
    },

    // === BERKAS TAHAP I ===
    'tahap1': {
        title: 'Tahap I',
        parent: 'PRA PENUNTUTAN > BERKAS TAHAP I',
        icon: 'fas fa-file-signature',
        columns: [
            { key: 'no_berkas', label: 'No Berkas', type: 'text', width: '18%' },
            { key: 'tgl_terima_berkas', label: 'Tgl Terima Berkas', type: 'date', width: '12%' },
            { key: 'no_spdp', label: 'No SPDP', type: 'text', width: '22%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '16%' },
            { key: 'tersangka', label: 'Tersangka', type: 'textarea', width: '16%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' }
        ]
    },
    't1-p18': {
        title: 'P-18',
        parent: 'PRA PENUNTUTAN > BERKAS TAHAP I',
        icon: 'fas fa-file-alt',
        columns: [
            { key: 'no_p18', label: 'No P-18', type: 'text', width: '16%' },
            { key: 'tgl_p18', label: 'Tgl P-18', type: 'date', width: '10%' },
            { key: 'no_berkas', label: 'No Berkas', type: 'text', width: '20%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '16%' },
            { key: 'tersangka', label: 'Tersangka', type: 'textarea', width: '16%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' }
        ]
    },
    't1-p19': {
        title: 'P-19',
        parent: 'PRA PENUNTUTAN > BERKAS TAHAP I',
        icon: 'fas fa-file-alt',
        columns: [
            { key: 'no_p19', label: 'No P-19', type: 'text', width: '16%' },
            { key: 'tgl_p19', label: 'Tgl P-19', type: 'date', width: '10%' },
            { key: 'no_berkas', label: 'No Berkas', type: 'text', width: '20%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '16%' },
            { key: 'tersangka', label: 'Tersangka', type: 'textarea', width: '16%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' }
        ]
    },
    't1-p20': {
        title: 'P-20',
        parent: 'PRA PENUNTUTAN > BERKAS TAHAP I',
        icon: 'fas fa-file-alt',
        columns: [
            { key: 'no_p20', label: 'No P-20', type: 'text', width: '16%' },
            { key: 'tgl_p20', label: 'Tgl P-20', type: 'date', width: '10%' },
            { key: 'no_berkas', label: 'No Berkas', type: 'text', width: '20%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '16%' },
            { key: 'tersangka', label: 'Tersangka', type: 'textarea', width: '16%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' }
        ]
    },
    't1-p21': {
        title: 'P-21',
        parent: 'PRA PENUNTUTAN > BERKAS TAHAP I',
        icon: 'fas fa-check-circle',
        columns: [
            { key: 'no_p21', label: 'No P-21', type: 'text', width: '16%' },
            { key: 'tgl_p21', label: 'Tgl P-21', type: 'date', width: '10%' },
            { key: 'no_berkas', label: 'No Berkas', type: 'text', width: '20%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '16%' },
            { key: 'tersangka', label: 'Tersangka', type: 'textarea', width: '16%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' }
        ]
    },
    't1-p21a': {
        title: 'P-21A',
        parent: 'PRA PENUNTUTAN > BERKAS TAHAP I',
        icon: 'fas fa-check-double',
        columns: [
            { key: 'no_p21a', label: 'No P-21A', type: 'text', width: '16%' },
            { key: 'tgl_p21a', label: 'Tgl P-21A', type: 'date', width: '10%' },
            { key: 'no_berkas', label: 'No Berkas', type: 'text', width: '20%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '16%' },
            { key: 'tersangka', label: 'Tersangka', type: 'textarea', width: '16%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' }
        ]
    },
    't1-pengembalian': {
        title: 'Pengembalian Berkas',
        parent: 'PRA PENUNTUTAN > BERKAS TAHAP I',
        icon: 'fas fa-undo-alt',
        columns: [
            { key: 'no_pengembalian', label: 'No Pengembalian Berkas', type: 'text', width: '18%' },
            { key: 'tgl_pengembalian', label: 'Tgl Pengembalian Berkas', type: 'date', width: '12%' },
            { key: 'no_berkas', label: 'No Berkas', type: 'text', width: '18%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '14%' },
            { key: 'tersangka', label: 'Tersangka', type: 'textarea', width: '14%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' }
        ]
    },
    't1-sp3': {
        title: 'SP3',
        parent: 'PRA PENUNTUTAN > BERKAS TAHAP I',
        icon: 'fas fa-ban',
        columns: [
            { key: 'no_sp3', label: 'No SP3', type: 'text', width: '18%' },
            { key: 'tgl_sp3', label: 'Tgl SP3', type: 'date', width: '12%' },
            { key: 'no_berkas', label: 'No Berkas', type: 'text', width: '18%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '14%' },
            { key: 'tersangka', label: 'Tersangka', type: 'textarea', width: '14%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' }
        ]
    },

    // === PENUNTUTAN > TAHAP II ===
    't2-tahap2': {
        title: 'Tahap II',
        parent: 'PENUNTUTAN > TAHAP II',
        parentLink: 'penuntutan.html',
        icon: 'fas fa-file-import',
        columns: [
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '20%' },
            { key: 'no_pengiriman', label: 'No Pengiriman', type: 'text', width: '18%' },
            { key: 'tgl_terima', label: 'Tgl Terima', type: 'date', width: '12%' },
            { key: 'jenis_pidana', label: 'Jenis Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '18%' },
            { key: 'satker', label: 'Satuan Kerja', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '14%' }
        ]
    },
    't2-p16a': {
        title: 'P-16A',
        parent: 'PENUNTUTAN > TAHAP II',
        parentLink: 'penuntutan.html',
        icon: 'fas fa-file-signature',
        columns: [
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '14%' },
            { key: 'no_p16a', label: 'No P-16A', type: 'text', width: '12%' },
            { key: 'tgl_p16a', label: 'Tgl P-16A', type: 'date', width: '10%' },
            { key: 'nama_jaksa', label: 'Nama Jaksa', type: 'textarea', width: '14%' },
            { key: 'nama_terdakwa', label: 'Nama Terdakwa', type: 'textarea', width: '14%' },
            { key: 'satker', label: 'Satuan Kerja', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '12%' }
        ]
    },
    't2-t7': {
        title: 'T-7',
        parent: 'PENUNTUTAN > TAHAP II',
        parentLink: 'penuntutan.html',
        icon: 'fas fa-user-lock',
        columns: [
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '14%' },
            { key: 'no_t7', label: 'No T-7', type: 'text', width: '12%' },
            { key: 'tgl_t7', label: 'Tgl T-7', type: 'date', width: '10%' },
            { key: 'nama_tersangka', label: 'Nama Tersangka', type: 'textarea', width: '14%' },
            { key: 'satker', label: 'Satuan Kerja', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '14%' },
            { key: 'jenis_tahanan', label: 'Jenis Tahanan', type: 'select', options: ['Rutan', 'Tahanan Kota', 'Tahanan Rumah'], width: '12%' }
        ]
    },
    't2-ba4': {
        title: 'BA-4',
        parent: 'PENUNTUTAN > TAHAP II',
        parentLink: 'penuntutan.html',
        icon: 'fas fa-file-contract',
        columns: [
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '16%' },
            { key: 'no_register_tahanan', label: 'No Register Tahanan', type: 'text', width: '14%' },
            { key: 'tgl_ba4', label: 'Tgl BA-4', type: 'date', width: '10%' },
            { key: 'satker', label: 'Satuan Kerja', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '14%' },
            { key: 'nama_tersangka', label: 'Nama Tersangka', type: 'textarea', width: '16%' }
        ]
    },
    't2-ba5': {
        title: 'BA-5',
        parent: 'PENUNTUTAN > TAHAP II',
        parentLink: 'penuntutan.html',
        icon: 'fas fa-box-open',
        columns: [
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '16%' },
            { key: 'no_register_bukti', label: 'No Register Bukti', type: 'text', width: '14%' },
            { key: 'tgl_ba5', label: 'Tgl BA-5', type: 'date', width: '10%' },
            { key: 'satker', label: 'Satuan Kerja', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '14%' },
            { key: 'nama_barang_bukti', label: 'Nama Barang Bukti', type: 'textarea', width: '16%' }
        ]
    },
    't2-skpp': {
        title: 'SKPP',
        parent: 'PENUNTUTAN > TAHAP II',
        parentLink: 'penuntutan.html',
        icon: 'fas fa-ban',
        columns: [
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '16%' },
            { key: 'no_p26', label: 'No P-26', type: 'text', width: '14%' },
            { key: 'tgl_p26', label: 'Tgl P-26', type: 'date', width: '10%' },
            { key: 'satker', label: 'Satuan Kerja', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '14%' },
            { key: 'nama_terdakwa', label: 'Nama Terdakwa', type: 'textarea', width: '16%' }
        ]
    },

    // === PENUNTUTAN > PELIMPAHAN ===
    'pl-p29': {
        title: 'P-29',
        parent: 'PENUNTUTAN > PELIMPAHAN',
        parentLink: 'penuntutan.html',
        icon: 'fas fa-share-square',
        columns: [
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '16%' },
            { key: 'tgl_p29', label: 'Tgl P-29', type: 'date', width: '10%' },
            { key: 'nama_jaksa', label: 'Nama Jaksa', type: 'textarea', width: '14%' },
            { key: 'terdakwa', label: 'Terdakwa', type: 'textarea', width: '14%' },
            { key: 'satker', label: 'Satuan Kerja', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '14%' }
        ]
    },
    'pl-p30': {
        title: 'P-30',
        parent: 'PENUNTUTAN > PELIMPAHAN',
        parentLink: 'penuntutan.html',
        icon: 'fas fa-file-export',
        columns: [
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '16%' },
            { key: 'tgl_p30', label: 'Tgl P-30', type: 'date', width: '10%' },
            { key: 'nama_jaksa', label: 'Nama Jaksa', type: 'textarea', width: '14%' },
            { key: 'terdakwa', label: 'Terdakwa', type: 'textarea', width: '14%' },
            { key: 'satker', label: 'Satuan Kerja', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '14%' }
        ]
    },
    'pl-p33': {
        title: 'P-33',
        parent: 'PENUNTUTAN > PELIMPAHAN',
        parentLink: 'penuntutan.html',
        icon: 'fas fa-clipboard-list',
        columns: [
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '16%' },
            { key: 'tgl_p33', label: 'Tgl P-33', type: 'date', width: '10%' },
            { key: 'nama_jaksa', label: 'Nama Jaksa', type: 'textarea', width: '14%' },
            { key: 'terdakwa', label: 'Terdakwa', type: 'textarea', width: '14%' },
            { key: 'satker', label: 'Satuan Kerja', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '14%' }
        ]
    },

    // === PENUNTUTAN > TUNTUTAN ===
    'tt-p41': {
        title: 'P-41',
        parent: 'PENUNTUTAN > TUNTUTAN',
        parentLink: 'penuntutan.html',
        icon: 'fas fa-balance-scale',
        columns: [
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '12%' },
            { key: 'no_p41', label: 'No P-41', type: 'text', width: '10%' },
            { key: 'tgl_p41', label: 'Tgl P-41', type: 'date', width: '9%' },
            { key: 'nama_jaksa', label: 'Nama Jaksa', type: 'textarea', width: '12%' },
            { key: 'tgl_baca_jpu', label: 'Tgl Baca JPU', type: 'date', width: '9%' },
            { key: 'terdakwa', label: 'Terdakwa', type: 'textarea', width: '12%' },
            { key: 'satker', label: 'Satuan Kerja', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '12%' }
        ]
    },
    'tt-p42': {
        title: 'P-42',
        parent: 'PENUNTUTAN > TUNTUTAN',
        parentLink: 'penuntutan.html',
        icon: 'fas fa-balance-scale-left',
        columns: [
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '12%' },
            { key: 'no_p42', label: 'No P-42', type: 'text', width: '10%' },
            { key: 'tgl_p42', label: 'Tgl P-42', type: 'date', width: '9%' },
            { key: 'nama_jaksa', label: 'Nama Jaksa', type: 'textarea', width: '12%' },
            { key: 'tgl_baca_rentut', label: 'Tgl Baca Rentut', type: 'date', width: '9%' },
            { key: 'terdakwa', label: 'Terdakwa', type: 'textarea', width: '12%' },
            { key: 'satker', label: 'Satuan Kerja', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '12%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '12%' }
        ]
    },
    'tt-putusan': {
        title: 'Putusan PN',
        parent: 'PENUNTUTAN > TUNTUTAN',
        parentLink: 'penuntutan.html',
        icon: 'fas fa-gavel',
        columns: [
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '12%' },
            { key: 'no_putusan', label: 'No Putusan', type: 'text', width: '10%' },
            { key: 'tgl_putusan', label: 'Tgl Putusan', type: 'date', width: '9%' },
            { key: 'pengadilan', label: 'Pengadilan', type: 'text', width: '12%' },
            { key: 'nama_jaksa', label: 'Nama Jaksa', type: 'textarea', width: '12%' },
            { key: 'terdakwa', label: 'Terdakwa', type: 'textarea', width: '12%' },
            { key: 'satker', label: 'Satuan Kerja', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '11%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'select', options: ['DIREKTORAT A', 'DIREKTORAT B', 'DIREKTORAT C', 'DIREKTORAT D', 'DIREKTORAT E', 'Mnegtibum dan TPUL'], width: '11%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '11%' }
        ]
    },

    // === UPAYA HUKUM > BANDING ===
    'uh-banding-pengajuan': {
        title: 'Pengajuan Banding',
        parent: 'UPAYA HUKUM > BANDING',
        parentLink: 'upaya-hukum.html',
        icon: 'fas fa-scale-balanced',
        columns: [
            { key: 'no_register', label: 'No. Register Perkara', type: 'text', width: '14%' },
            { key: 'no_permohonan', label: 'No. Permohonan', type: 'text', width: '12%' },
            { key: 'tgl_permohonan', label: 'Tgl Permohonan', type: 'date', width: '10%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '10%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'text', width: '14%' },
            { key: 'tersangka', label: 'Tersangka', type: 'textarea', width: '14%' },
            { key: 'jaksa', label: 'Jaksa', type: 'textarea', width: '14%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' }
        ]
    },
    'uh-banding-putusan': {
        title: 'Putusan Banding',
        parent: 'UPAYA HUKUM > BANDING',
        parentLink: 'upaya-hukum.html',
        icon: 'fas fa-gavel',
        columns: [
            { key: 'no_register', label: 'No. Register Perkara', type: 'text', width: '14%' },
            { key: 'no_putusan', label: 'No. Putusan', type: 'text', width: '12%' },
            { key: 'tgl_baca_putusan', label: 'Tgl Baca Putusan', type: 'date', width: '10%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '10%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'text', width: '14%' },
            { key: 'tersangka', label: 'Tersangka', type: 'textarea', width: '14%' },
            { key: 'jaksa', label: 'Jaksa', type: 'textarea', width: '14%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' }
        ]
    },

    // === UPAYA HUKUM > KASASI ===
    'uh-kasasi-pengajuan': {
        title: 'Pengajuan Kasasi',
        parent: 'UPAYA HUKUM > KASASI',
        parentLink: 'upaya-hukum.html',
        icon: 'fas fa-landmark',
        columns: [
            { key: 'no_register', label: 'No. Register Perkara', type: 'text', width: '14%' },
            { key: 'no_permohonan', label: 'No. Permohonan', type: 'text', width: '12%' },
            { key: 'tgl_permohonan', label: 'Tgl Permohonan', type: 'date', width: '10%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '10%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'text', width: '14%' },
            { key: 'tersangka', label: 'Tersangka', type: 'textarea', width: '14%' },
            { key: 'jaksa', label: 'Jaksa', type: 'textarea', width: '14%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' }
        ]
    },
    'uh-kasasi-putusan': {
        title: 'Putusan Kasasi',
        parent: 'UPAYA HUKUM > KASASI',
        parentLink: 'upaya-hukum.html',
        icon: 'fas fa-gavel',
        columns: [
            { key: 'no_register', label: 'No. Register Perkara', type: 'text', width: '14%' },
            { key: 'no_putusan', label: 'No. Putusan', type: 'text', width: '12%' },
            { key: 'tgl_baca_putusan', label: 'Tgl Baca Putusan', type: 'date', width: '10%' },
            { key: 'jenis_perkara', label: 'Jenis Perkara', type: 'text', width: '10%' },
            { key: 'tindak_pidana', label: 'Tindak Pidana', type: 'text', width: '14%' },
            { key: 'tersangka', label: 'Tersangka', type: 'textarea', width: '14%' },
            { key: 'jaksa', label: 'Jaksa', type: 'textarea', width: '14%' },
            { key: 'satker', label: 'Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' }
        ]
    },

    // =============== EKSEKUSI ===============
    'eks-p48': {
        title: 'P-48',
        parent: 'Pidum > Eksekusi > P-48',
        parentLink: 'eksekusi.html',
        icon: 'fas fa-gavel',
        columns: [
            { key: 'no', label: 'No', type: 'auto', width: '4%' },
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '16%' },
            { key: 'no_p48', label: 'No P-48', type: 'text', width: '12%' },
            { key: 'tgl_p48', label: 'Tgl P-48', type: 'date', width: '8%' },
            { key: 'no_putusan', label: 'No Putusan', type: 'text', width: '14%' },
            { key: 'tgl_putusan', label: 'Tgl Putusan', type: 'date', width: '8%' },
            { key: 'nama_satker', label: 'Nama Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '10%' },
            { key: 'terdakwa', label: 'Terdakwa', type: 'textarea', width: '14%' },
            { key: 'nama_jaksa', label: 'Nama Jaksa', type: 'textarea', width: '14%' }
        ]
    },
    'eks-ba17': {
        title: 'BA-17',
        parent: 'Pidum > Eksekusi > BA-17',
        parentLink: 'eksekusi.html',
        icon: 'fas fa-file-signature',
        columns: [
            { key: 'no', label: 'No', type: 'auto', width: '4%' },
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '16%' },
            { key: 'tgl_ba17', label: 'Tgl BA-17', type: 'date', width: '8%' },
            { key: 'no_putusan', label: 'No Putusan', type: 'text', width: '16%' },
            { key: 'tgl_putusan', label: 'Tgl Putusan', type: 'date', width: '8%' },
            { key: 'nama_satker', label: 'Nama Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' },
            { key: 'terdakwa', label: 'Terdakwa', type: 'textarea', width: '18%' },
            { key: 'nama_jaksa', label: 'Nama Jaksa', type: 'textarea', width: '18%' }
        ]
    },
    'eks-denda': {
        title: 'Denda',
        parent: 'Pidum > Eksekusi > Denda',
        parentLink: 'eksekusi.html',
        icon: 'fas fa-money-bill-wave',
        columns: [
            { key: 'no', label: 'No', type: 'auto', width: '4%' },
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '16%' },
            { key: 'tgl_d3', label: 'Tgl D3', type: 'date', width: '8%' },
            { key: 'no_putusan', label: 'No Putusan', type: 'text', width: '16%' },
            { key: 'tgl_putusan', label: 'Tgl Putusan', type: 'date', width: '8%' },
            { key: 'nama_satker', label: 'Nama Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' },
            { key: 'terdakwa', label: 'Terdakwa', type: 'textarea', width: '18%' },
            { key: 'denda', label: 'Denda', type: 'text', width: '10%' }
        ]
    },
    'eks-biaya': {
        title: 'Biaya Perkara',
        parent: 'Pidum > Eksekusi > Biaya Perkara',
        parentLink: 'eksekusi.html',
        icon: 'fas fa-receipt',
        columns: [
            { key: 'no', label: 'No', type: 'auto', width: '4%' },
            { key: 'no_register', label: 'No Register Perkara', type: 'text', width: '16%' },
            { key: 'tgl_d3', label: 'Tgl D3', type: 'date', width: '8%' },
            { key: 'no_putusan', label: 'No Putusan', type: 'text', width: '16%' },
            { key: 'tgl_putusan', label: 'Tgl Putusan', type: 'date', width: '8%' },
            { key: 'nama_satker', label: 'Nama Satker', type: 'select', options: ['Kejati KEP.RIAU', 'Kejari Tanjung Pinang', 'Kejari Batam', 'Kejari Karimun', 'Kejari Bintan', 'Kejari Lingga', 'Kejari Natuna', 'Kejari Kep. Anambas'], width: '12%' },
            { key: 'terdakwa', label: 'Terdakwa', type: 'textarea', width: '18%' },
            { key: 'biaya_perkara', label: 'Biaya Perkara', type: 'text', width: '10%' }
        ]
    }
};

// ---- State ----
let currentSection = '';
let currentConfig = null;
let tableData = [];
let filteredData = [];
let currentPage = 1;
const rowsPerPage = 10;
let editingIndex = -1; // -1 = adding new, >=0 = editing
let deleteIndex = -1;

// ---- Initialize ----
function initDetailTable() {
    // Read section from URL params
    const params = new URLSearchParams(window.location.search);
    currentSection = params.get('section') || 'spdp';
    currentConfig = SECTION_CONFIG[currentSection];

    if (!currentConfig) {
        currentSection = 'spdp';
        currentConfig = SECTION_CONFIG['spdp'];
    }

    // Set page info
    setupPageInfo();

    // Load data
    loadTableData();

    // Render
    renderTableHead();
    filterTable();
}

// ---- Setup page info based on section ----
function setupPageInfo() {
    const cfg = currentConfig;

    // Title
    document.getElementById('pageTitle').innerHTML = `<i class="${cfg.icon}" style="margin-right: 10px;"></i>Detail ${cfg.title}`;
    document.title = `${cfg.title} - Dashboard Kejaksaan RI`;

    // Breadcrumb - dynamic based on parentLink
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        const parentLink = cfg.parentLink || 'pra-penuntutan.html';
        let parentLabel = 'Pra Penuntutan';
        if (parentLink === 'penuntutan.html') parentLabel = 'Penuntutan';
        else if (parentLink === 'upaya-hukum.html') parentLabel = 'Upaya Hukum';
        else if (parentLink === 'eksekusi.html') parentLabel = 'Eksekusi';
        breadcrumb.innerHTML = `
            <a href="pidum.html"><i class="fas fa-arrow-left"></i> Dashboard Pidum</a>
            <span class="breadcrumb-separator">/</span>
            <a href="${parentLink}">${parentLabel}</a>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current" id="breadcrumbTitle">${cfg.title}</span>
        `;
    }

    // Banner
    document.getElementById('bannerPath').textContent = cfg.parent;
    document.getElementById('bannerSection').textContent = cfg.title;

    // Table header
    document.getElementById('tableTitle').textContent = 'WILAYAH HUKUM';
}

// ---- Storage key for table data ----
function getTableStorageKey() {
    const wilayah = document.getElementById('filterWilayah')?.value || '';
    const satker1 = document.getElementById('filterSatker1')?.value || '';
    const satker2 = document.getElementById('filterSatker2')?.value || '';
    const tahun = document.getElementById('filterTahun')?.value || '';
    const bulan1 = document.getElementById('filterBulan1')?.value || '';
    const bulan2 = document.getElementById('filterBulan2')?.value || '';
    return `detail_${currentSection}_${wilayah}_${satker1}_${satker2}_${tahun}_${bulan1}_${bulan2}`;
}

// ---- Load table data from localStorage ----
function loadTableData() {
    const key = getTableStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
        try {
            tableData = JSON.parse(saved);
        } catch (e) {
            tableData = [];
        }
    } else {
        tableData = [];
    }
}

// ---- Save table data to localStorage ----
function saveTableData() {
    const key = getTableStorageKey();
    try {
        localStorage.setItem(key, JSON.stringify(tableData));
    } catch (e) {
        console.error('Save error:', e);
    }
}

// ---- Render table header ----
function renderTableHead() {
    const thead = document.getElementById('tableHead');
    let html = '<tr><th class="th-no">No</th>';
    currentConfig.columns.forEach(col => {
        html += `<th style="width:${col.width}">${col.label}</th>`;
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
            <i class="fas fa-inbox"></i><br>Belum ada data. Klik "Tambah Data" untuk menambah.
        </td></tr>`;
        renderPagination();
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
            // Format dates for display
            if (col.type === 'date' && val) {
                val = formatDate(val);
            }
            // For textarea (multi-line jaksa/tersangka), render with bullet points
            if (col.type === 'textarea' && val) {
                const lines = val.split('\n').filter(l => l.trim());
                if (lines.length > 0) {
                    val = lines.map(l => `<span class="bullet-item">&bull; ${escapeHtml(l)}</span>`).join('');
                }
            } else {
                val = escapeHtml(val);
            }
            html += `<td>${val}</td>`;
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
}

// ---- Pagination ----
function renderPagination() {
    const pag = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    if (totalPages <= 1) {
        pag.innerHTML = '';
        return;
    }

    let html = '';

    // Previous
    html += `<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Sebelumnya</button>`;

    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
        html += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) html += `<span class="page-dots">...</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += `<span class="page-dots">...</span>`;
        html += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }

    // Next
    html += `<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Selanjutnya</button>`;

    pag.innerHTML = html;
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTableBody();
}

// ---- Search/Filter ----
function filterTable() {
    const query = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();

    if (!query) {
        filteredData = [...tableData];
    } else {
        filteredData = tableData.filter(row => {
            return currentConfig.columns.some(col => {
                const val = (row[col.key] || '').toLowerCase();
                return val.includes(query);
            });
        });
    }

    currentPage = 1;
    renderTableBody();
}

// ---- Open Add Modal ----
function openAddModal() {
    editingIndex = -1;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Tambah Data ' + currentConfig.title;

    const body = document.getElementById('modalBody');
    let html = '<div class="modal-form">';

    currentConfig.columns.forEach(col => {
        html += `<div class="form-group">`;
        html += `<label for="field-${col.key}">${col.label}</label>`;

        if (col.type === 'select') {
            html += `<select id="field-${col.key}" class="form-control">`;
            html += `<option value="">-- Pilih --</option>`;
            col.options.forEach(opt => {
                html += `<option value="${opt}">${opt}</option>`;
            });
            html += `</select>`;
        } else if (col.type === 'textarea') {
            html += `<textarea id="field-${col.key}" class="form-control" rows="3" placeholder="Masukkan ${col.label} (satu per baris)"></textarea>`;
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

    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Data ' + currentConfig.title;

    const body = document.getElementById('modalBody');
    let html = '<div class="modal-form">';

    currentConfig.columns.forEach(col => {
        const val = record[col.key] || '';
        html += `<div class="form-group">`;
        html += `<label for="field-${col.key}">${col.label}</label>`;

        if (col.type === 'select') {
            html += `<select id="field-${col.key}" class="form-control">`;
            html += `<option value="">-- Pilih --</option>`;
            col.options.forEach(opt => {
                html += `<option value="${opt}" ${val === opt ? 'selected' : ''}>${opt}</option>`;
            });
            html += `</select>`;
        } else if (col.type === 'textarea') {
            html += `<textarea id="field-${col.key}" class="form-control" rows="3" placeholder="Masukkan ${col.label} (satu per baris)">${escapeHtml(val)}</textarea>`;
        } else if (col.type === 'date') {
            html += `<input type="date" id="field-${col.key}" class="form-control" value="${val}">`;
        } else {
            html += `<input type="text" id="field-${col.key}" class="form-control" value="${escapeHtml(val)}" placeholder="Masukkan ${col.label}">`;
        }

        html += `</div>`;
    });

    html += '</div>';
    body.innerHTML = html;

    document.getElementById('modalOverlay').classList.add('show');
}

// ---- Save Record (from modal) ----
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
        // Update existing
        tableData[editingIndex] = record;
        showToast('Data berhasil diperbarui!', 'success');
    } else {
        // Add new
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
        
        // Sinkronisasi dengan dashboard utama
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
            
            // Tentukan field mana yang harus diupdate berdasarkan section
            let fieldKey = '';
            const section = getSection();
            
            // Mapping section ke field dashboard
            if (section.startsWith('spdp') || section.startsWith('p16') || section.startsWith('p17') || 
                section.startsWith('pengembalian') || section.startsWith('sp3') || 
                section.startsWith('tahap1') || section.startsWith('t1-')) {
                fieldKey = 'val-pra-penuntutan';
            } else if (section.startsWith('t2-') || section.startsWith('pl-') || section.startsWith('tt-')) {
                fieldKey = 'val-penuntutan';
            } else if (section.startsWith('uh-')) {
                fieldKey = 'val-upaya-hukum';
            } else if (section.startsWith('eks-')) {
                fieldKey = 'val-eksekusi';
            }
            
            if (fieldKey && data[fieldKey] !== undefined) {
                const currentVal = parseInt(data[fieldKey]) || 0;
                const newVal = Math.max(0, currentVal + delta);
                data[fieldKey] = newVal.toString();
                localStorage.setItem(mainKey, JSON.stringify(data));
            }
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
            let val = (row[c.key] || '').replace(/"/g, '""');
            return `"${val}"`;
        }).join(',');
        csv += '\n';
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentConfig.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Data berhasil diekspor!', 'success');
}

// ---- Apply/Reset Filters ----
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

// ---- Utility: format date ----
function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (e) {
        return dateStr;
    }
}

// ---- Utility: escape HTML ----
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ---- Keyboard shortcut: Escape to close modals ----
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
        closeDeleteModal();
    }
});
