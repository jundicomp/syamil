import { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import Icon from '../../components/common/Icon';

/**
 * Dropdown pelanggan dengan pencarian + opsi "Tambah Pelanggan Baru" cepat
 * (cuma Nama & No. HP, field lain diisi default supaya bisa dilengkapi nanti
 * lewat halaman Pelanggan & Supplier).
 */
export default function CustomerSearchSelect({ value, onChange }) {
  const { data, addRow } = useData();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [addMode, setAddMode] = useState(false);
  const [newNama, setNewNama] = useState('');
  const [newHp, setNewHp] = useState('');
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

  const filtered = data.pelanggan.filter(p => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return p.nama.toLowerCase().includes(term) || (p.kontak || '').includes(term) || (p.kota || '').toLowerCase().includes(term);
  });

  function selectCustomer(p) {
    onChange(p.nama);
    setOpen(false); setSearch(''); setAddMode(false);
  }
  function openAddMode() {
    setNewNama(search);
    setNewHp('');
    setAddMode(true);
  }
  function handleSaveNew() {
    if (!newNama.trim()) { alert('Nama pelanggan wajib diisi.'); return; }
    addRow('pelanggan', { nama: newNama.trim(), kontak: newHp.trim() || '-', kota: '-', alamat: '-', kategori: 'Ritel', marketingTerkait: '-' });
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
        <span>{value || 'Pilih pelanggan...'}</span>
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
                  placeholder="Cari nama, HP, atau kota..."
                  style={{ border: 'none', background: 'transparent', flex: 1, fontSize: 12.5, outline: 'none', color: 'var(--text)' }}
                />
              </div>
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: 12, fontSize: 12, color: 'var(--text-faint)' }}>Tidak ada pelanggan cocok.</div>
                ) : filtered.map(p => (
                  <div
                    key={p.id}
                    onClick={() => selectCustomer(p)}
                    style={{
                      padding: '9px 11px', cursor: 'pointer', borderBottom: '1px solid var(--line-soft)',
                      background: p.nama === value ? 'var(--gold-bg)' : 'transparent',
                    }}
                  >
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{p.nama}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{p.kota} · {p.kontak}</div>
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
                  + Tambah Pelanggan Baru{search.trim() ? ` "${search.trim()}"` : ''}...
                </span>
              </button>
            </>
          ) : (
            <div style={{ padding: 14 }}>
              <div className="f-field">
                <label>Nama Pelanggan</label>
                <input autoFocus value={newNama} onChange={e => setNewNama(e.target.value)} />
              </div>
              <div className="f-field">
                <label>No. HP</label>
                <input value={newHp} onChange={e => setNewHp(e.target.value)} placeholder="Opsional" />
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
