/* ============================================
   SUPABASE SYNC - Auto-sync localStorage to Supabase
   Include this script BEFORE all other scripts.
   It transparently syncs data so all existing code
   continues to work with localStorage but data also 
   goes to/from Supabase for cross-origin access.
   ============================================ */

const _SB_URL = 'https://iudtxznbakaqzygpkaxf.supabase.co';
const _SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1ZHR4em5iYWthcXp5Z3BrYXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODQ3MjIsImV4cCI6MjA4NTY2MDcyMn0.eF_idmb2tF_SJtOJ7Sf9ipcT7w5Zhxt30uzMqtptxmc';
const _SB_TABLE = 'cms_pidum_data';
const _SB_HEADERS = {
    'apikey': _SB_KEY,
    'Authorization': 'Bearer ' + _SB_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
};

// Keys that should be synced to Supabase (CMS-related keys only)
function _shouldSync(key) {
    if (!key) return false;
    return key.startsWith('pidum_') ||
        key.startsWith('cms_') ||
        key.startsWith('prapenuntutan_') ||
        key.startsWith('penuntutan_') ||
        key.startsWith('upaya_hukum_') ||
        key.startsWith('eksekusi_') ||
        key.startsWith('wna_') ||
        key.startsWith('hukuman_mati_') ||
        key.startsWith('korban_') ||
        key.startsWith('tppu_') ||
        key.startsWith('detail_');
}

// Save to Supabase (fire and forget)
function _sbSave(key, value) {
    if (!_shouldSync(key)) return;
    try {
        fetch(_SB_URL + '/rest/v1/' + _SB_TABLE, {
            method: 'POST',
            headers: _SB_HEADERS,
            body: JSON.stringify({
                storage_key: key,
                data_json: value,
                updated_at: new Date().toISOString()
            })
        }).catch(() => { });
    } catch (e) { }
}

// Delete from Supabase
function _sbDelete(key) {
    if (!_shouldSync(key)) return;
    try {
        fetch(_SB_URL + '/rest/v1/' + _SB_TABLE + '?storage_key=eq.' + encodeURIComponent(key), {
            method: 'DELETE',
            headers: { 'apikey': _SB_KEY, 'Authorization': 'Bearer ' + _SB_KEY }
        }).catch(() => { });
    } catch (e) { }
}

// Override localStorage.setItem to also save to Supabase
const _originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function (key, value) {
    _originalSetItem(key, value);
    _sbSave(key, value);
};

// Override localStorage.removeItem to also delete from Supabase
const _originalRemoveItem = localStorage.removeItem.bind(localStorage);
localStorage.removeItem = function (key) {
    _originalRemoveItem(key);
    _sbDelete(key);
};

// Hydrate localStorage from Supabase on page load
// This fetches ALL CMS data from Supabase and writes to localStorage
// so all existing code can read from localStorage as usual
async function _hydrateFromSupabase() {
    try {
        const res = await fetch(
            _SB_URL + '/rest/v1/' + _SB_TABLE + '?select=storage_key,data_json&limit=500',
            { headers: { 'apikey': _SB_KEY, 'Authorization': 'Bearer ' + _SB_KEY } }
        );
        if (res.ok) {
            const rows = await res.json();
            if (rows && rows.length > 0) {
                rows.forEach(row => {
                    if (row.storage_key && row.data_json) {
                        // Write to localStorage without triggering Supabase save again
                        _originalSetItem(row.storage_key, row.data_json);
                    }
                });
                console.log('Supabase sync: hydrated', rows.length, 'records');
            }
        }
    } catch (e) {
        console.warn('Supabase hydrate failed:', e);
    }
}

// Run hydration on page load
_hydrateFromSupabase();
