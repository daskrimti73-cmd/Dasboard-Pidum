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

// Keys to EXCLUDE from sync (browser/framework keys)
function _shouldSkip(key) {
    if (!key) return true;
    // Skip auth session key and very short keys
    if (key === 'cms_auth_session') return true;
    if (key.length < 3) return true;
    return false;
}

// Override localStorage.setItem to also save to Supabase
const _originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function (key, value) {
    _originalSetItem(key, value);
    if (_shouldSkip(key)) return;
    // Fire and forget - save to Supabase in background
    try {
        fetch(_SB_URL + '/rest/v1/' + _SB_TABLE, {
            method: 'POST',
            headers: {
                'apikey': _SB_KEY,
                'Authorization': 'Bearer ' + _SB_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
                storage_key: key,
                data_json: value,
                updated_at: new Date().toISOString()
            })
        }).catch(function () { });
    } catch (e) { }
};

// Override localStorage.removeItem to also delete from Supabase
const _originalRemoveItem = localStorage.removeItem.bind(localStorage);
localStorage.removeItem = function (key) {
    _originalRemoveItem(key);
    if (_shouldSkip(key)) return;
    try {
        fetch(_SB_URL + '/rest/v1/' + _SB_TABLE + '?storage_key=eq.' + encodeURIComponent(key), {
            method: 'DELETE',
            headers: { 'apikey': _SB_KEY, 'Authorization': 'Bearer ' + _SB_KEY }
        }).catch(function () { });
    } catch (e) { }
};

// Hydrate localStorage from Supabase SYNCHRONOUSLY
// This ensures data is available before page scripts run
(function _hydrateSync() {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', _SB_URL + '/rest/v1/' + _SB_TABLE + '?select=storage_key,data_json&limit=1000', false);
        xhr.setRequestHeader('apikey', _SB_KEY);
        xhr.setRequestHeader('Authorization', 'Bearer ' + _SB_KEY);
        xhr.send(null);
        if (xhr.status === 200) {
            var rows = JSON.parse(xhr.responseText);
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].storage_key && rows[i].data_json !== null && rows[i].data_json !== undefined) {
                    _originalSetItem(rows[i].storage_key, rows[i].data_json);
                }
            }
            console.log('Supabase sync: loaded ' + rows.length + ' records');
        }
    } catch (e) {
        console.warn('Supabase hydrate failed (will use localStorage):', e.message);
    }
})();
