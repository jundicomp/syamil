import { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import Icon from '../../components/common/Icon';

export default function SupplierSearchSelect({ value, onChange }) {
  const { data, addRow } = useData();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [addMode, setAddMode] = useState(false);
  const [newNama, setNewNama] = useState('');
  const [newKontak, setNewKontak] = useState('');
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false); setAddMode(false); setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = data.supplier.filter(s => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return s.nama.toLowerCase().includes(term) || (s.kontak || '').includes(term) || (s.kota || '').toLowerCase().includes(term);
  });

  function selectSupplier(s) {
    onChange(s.nama);
    setOpen(false); setSearch(''); setAddMode(false);
  }
  function openAddMode() {
    setNewNama(search);
    setNewKontak('');
    setAddMode(true);
  }
  function handleSaveNew() {
    if (!newNama.trim()) { alert('Nama supplier wajib diisi.'); return; }
    addRow('supplier', { nama: newNama.trim(), kontak: newKontak.trim() || '-', kota: '-', alamat: '-', pic: '-', tipeSupplier: 'Perorangan', kategoriBahan: '-' });
    onChange(newNama.trim());
    setOpen(false); setAddMode(false); setSearch('');
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--panel-2)', border: '1px solid var(--line)', borderRadius: 9, padding: '9px 11px',
          fontSize: 12.5, color: 'var(--text)', cursor: 'pointer',
        }}
      >
        <span>{value || 'Pilih supplier...'}</span>
        <Icon name="chev" size={13} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 20,
          background: 'var(--panel)', border: '1.5px solid var(--gold)', borderRadius: 10,
          boxShadow: '0 16px 32px rgba(0,0,0,.35)', overflow: 'hidden',
        }}>
          {!addMode ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderBottom: '1px solid var(--line-soft)' }}>
                <Icon name="search" size={14} />
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari nama, kontak, atau kota..."
                  style={{ border: 'none', background: 'transparent', flex: 1, fontSize: 12.5, outline: 'none', color: 'var(--text)' }}
                />
              </div>
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: 12, fontSize: 12, color: 'var(--text-faint)' }}>Tidak ada supplier cocok.</div>
                ) : filtered.map(s => (
                  <div
                    key={s.id}
                    onClick={() => selectSupplier(s)}
                    style={{
                      padding: '9px 11px', cursor: 'pointer', borderBottom: '1px solid var(--line-soft)',
                      background: s.nama === value ? 'var(--gold-bg)' : 'transparent',
                    }}
                  >
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{s.nama}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{s.kota} · {s.kontak}</div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={openAddMode}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '11px',
                  background: 'var(--gold-bg)', border: 'none', borderTop: '1.5px dashed var(--gold)', cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--gold-deep)' }}>
                  + Tambah Supplier Baru{search.trim() ? ` "${search.trim()}"` : ''}...
                </span>
              </button>
            </>
          ) : (
            <div style={{ padding: 14 }}>
              <div className="f-field">
                <label>Nama Supplier</label>
                <input autoFocus value={newNama} onChange={e => setNewNama(e.target.value)} />
              </div>
              <div className="f-field">
                <label>Kontak</label>
                <input value={newKontak} onChange={e => setNewKontak(e.target.value)} placeholder="Opsional" />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setAddMode(false)}>Batal</button>
                <button type="button" className="btn-gold" style={{ flex: 1 }} onClick={handleSaveNew}>Simpan &amp; Pilih</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
