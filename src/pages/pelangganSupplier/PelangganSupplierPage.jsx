import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotify } from '../../context/NotificationContext';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';
import KartuPiutangModal from './KartuPiutangModal';

const PELANGGAN_COLUMNS = [
  { key: 'nama', label: 'Nama' },
  { key: 'kota', label: 'Kota' },
  { key: 'kontak', label: 'No. HP/WA' },
  { key: 'kategori', label: 'Kategori', type: 'badge' },
  { key: 'batasKredit', label: 'Batas Kredit', type: 'currency', align: 'r' },
  { key: 'marketingTerkait', label: 'Marketing Terkait' },
  { key: 'alamat', label: 'Alamat' },
];

const SUPPLIER_COLUMNS = [
  { key: 'nama', label: 'Nama' },
  { key: 'pic', label: 'PIC' },
  { key: 'tipeSupplier', label: 'Tipe', type: 'badge' },
  { key: 'kategoriBahan', label: 'Supplier Bahan', type: 'badge' },
  { key: 'kota', label: 'Kota' },
  { key: 'kontak', label: 'No. HP/WA' },
  { key: 'alamat', label: 'Alamat' },
];
const SUPPLIER_FIELDS = [
  { key: 'nama', label: 'Nama', type: 'text' },
  { key: 'pic', label: 'PIC', type: 'text' },
  { key: 'tipeSupplier', label: 'Tipe Supplier', type: 'select', options: ['Badan Usaha', 'Perorangan'] },
  { key: 'kategoriBahan', label: 'Supplier Bahan', type: 'text' },
  { key: 'kota', label: 'Kota', type: 'text' },
  { key: 'kontak', label: 'No. HP/WA', type: 'text' },
  { key: 'alamat', label: 'Alamat', type: 'textarea' },
];

export default function PelangganSupplierPage() {
  const [tab, setTab] = useState('pelanggan');
  const { data, addRow, updateRow, deleteRow, pelangganKategoriList, addPelangganKategori } = useData();
  const { promptDialog, notifyError } = useNotify();
  const [modal, setModal] = useState(null); // { key, row|null }
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [riwayatPelanggan, setRiwayatPelanggan] = useState(null);

  const isPelanggan = tab === 'pelanggan';
  const dataKey = isPelanggan ? 'pelanggan' : 'supplier';
  const columns = isPelanggan ? PELANGGAN_COLUMNS : SUPPLIER_COLUMNS;

  const pelangganFields = [
    { key: 'nama', label: 'Nama', type: 'text' },
    { key: 'kota', label: 'Kota', type: 'text' },
    { key: 'kontak', label: 'No. HP/WA', type: 'text' },
    { key: 'kategori', label: 'Kategori', type: 'select', options: pelangganKategoriList },
    { key: 'batasKredit', label: 'Batas Kredit (Rp, 0 = tanpa batas)', type: 'number' },
    { key: 'marketingTerkait', label: 'Marketing Terkait', type: 'text' },
    { key: 'alamat', label: 'Alamat', type: 'textarea' },
  ];
  const fields = isPelanggan ? pelangganFields : SUPPLIER_FIELDS;

  const pelangganRows = kategoriFilter === 'Semua' ? data.pelanggan : data.pelanggan.filter(p => p.kategori === kategoriFilter);
  const rows = isPelanggan ? pelangganRows : data.supplier;

  function handleSave(values) {
    if (modal.row) updateRow(dataKey, modal.row.id, values);
    else addRow(dataKey, values);
    setModal(null);
  }

  async function handleTambahKategori() {
    const nama = await promptDialog('Nama kategori pelanggan baru (mis. Grosir, VIP, Instansi):');
    if (nama === null) return;
    if (!nama.trim()) { notifyError('Nama kategori wajib diisi.'); return; }
    addPelangganKategori(nama.trim());
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Pelanggan &amp; Supplier</h2>
          <div className="page-sub">Data mitra bisnis — pembeli &amp; pemasok</div>
        </div>
      </div>
      <div className="subtab-switch">
        <button className={isPelanggan ? 'active' : ''} onClick={() => setTab('pelanggan')}>Pelanggan</button>
        <button className={!isPelanggan ? 'active' : ''} onClick={() => setTab('supplier')}>Supplier</button>
      </div>

      {isPelanggan && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0 14px' }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-soft)' }}>Filter Kategori</label>
          <select value={kategoriFilter} onChange={e => setKategoriFilter(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="Semua">Semua Kategori</option>
            {pelangganKategoriList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <button type="button" className="btn-outline" style={{ padding: '6px 11px', fontSize: 11 }} onClick={handleTambahKategori}>+ Kategori Baru</button>
          {kategoriFilter !== 'Semua' && <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{pelangganRows.length} pelanggan · Excel/PDF ikut kategori terpilih</span>}
        </div>
      )}

      <DataTable
        title={isPelanggan ? 'Pelanggan' : 'Supplier'}
        columns={columns}
        rows={rows}
        actions={isPelanggan ? ['view', 'edit', 'delete'] : ['edit', 'delete']}
        onAdd={() => setModal({ key: dataKey, row: null })}
        onView={row => setRiwayatPelanggan(row)}
        onEdit={row => setModal({ key: dataKey, row })}
        onDelete={row => deleteRow(dataKey, row.id)}
      />

      {modal && (
        <FormModal
          title={`${modal.row ? 'Edit' : 'Tambah'} ${isPelanggan ? 'Pelanggan' : 'Supplier'}`}
          fields={fields}
          initialValues={modal.row}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {riwayatPelanggan && <KartuPiutangModal pelanggan={riwayatPelanggan} onClose={() => setRiwayatPelanggan(null)} />}
    </div>
  );
}
