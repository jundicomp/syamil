import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';
import KartuStokModal from '../../components/common/KartuStokModal';
import StokOpnameModal from './StokOpnameModal';

const BAHAN_COLUMNS = [
  { key: 'nama', label: 'Nama' },
  { key: 'satuan', label: 'Satuan' },
  { key: 'stok', label: 'Stok Saat Ini', align: 'r' },
  { key: 'hargaBeli', label: 'Harga Beli', type: 'currency', align: 'r' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'stokMinimum', label: 'Stok Min.', align: 'r' },
];
const BAHAN_FIELDS = [
  { key: 'nama', label: 'Nama', type: 'text' },
  { key: 'satuan', label: 'Satuan', type: 'text' },
  { key: 'hargaBeli', label: 'Harga Beli', type: 'number' },
  { key: 'supplier', label: 'Supplier', type: 'text' },
  { key: 'stokMinimum', label: 'Stok Minimum', type: 'number' },
];
const OPNAME_COLUMNS = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'bahan', label: 'Bahan' },
  { key: 'stokSistem', label: 'Stok Sistem', align: 'r' },
  { key: 'stokFisik', label: 'Stok Fisik', align: 'r' },
  { key: 'selisih', label: 'Selisih', align: 'r' },
];

function TabBahanBaku() {
  const { data, addRow, updateRow, deleteRow } = useData();
  const [modal, setModal] = useState(null);
  const [kartuStokBahan, setKartuStokBahan] = useState(null);

  function handleSave(values) {
    const payload = !modal.row ? { ...values, stok: 0 } : values; // bahan baru: stok mulai 0
    if (modal.row) updateRow('bahanBaku', modal.row.id, payload);
    else addRow('bahanBaku', payload);
    setModal(null);
  }

  return (
    <div>
      <DataTable
        title="Bahan Baku"
        subtitle="Stok bertambah otomatis lewat Pembelian, atau isi manual saat edit"
        columns={BAHAN_COLUMNS}
        rows={data.bahanBaku}
        actions={['view', 'edit', 'delete']}
        onAdd={() => setModal({ row: null })}
        onEdit={row => setModal({ row })}
        onDelete={row => deleteRow('bahanBaku', row.id)}
        onView={row => setKartuStokBahan(row)}
      />
      {modal && (
        <FormModal
          title={`${modal.row ? 'Edit' : 'Tambah'} Bahan Baku`}
          fields={BAHAN_FIELDS}
          initialValues={modal.row}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {kartuStokBahan && <KartuStokModal bahan={kartuStokBahan} onClose={() => setKartuStokBahan(null)} />}
    </div>
  );
}

function TabStokOpname() {
  const { data, deleteRow } = useData();
  const [modal, setModal] = useState(null);

  return (
    <div>
      <DataTable
        title="Stok Opname"
        subtitle="Catatan hasil hitung fisik gudang — tidak otomatis mengubah Stok Sistem"
        columns={OPNAME_COLUMNS}
        rows={data.stokOpname}
        actions={['edit', 'delete']}
        onAdd={() => setModal({ row: null })}
        onEdit={row => setModal({ row })}
        onDelete={row => deleteRow('stokOpname', row.id)}
        dateKey="tanggal"
      />
      <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 12 }}>
        Ini murni catatan pembanding (audit) — kalau ada selisih, penyesuaian Stok Sistem yang sesungguhnya
        tetap harus lewat mekanisme lain (mis. Pembelian atau HPP).
      </p>
      {modal && <StokOpnameModal existingRow={modal.row} onClose={() => setModal(null)} />}
    </div>
  );
}

export default function StokPage() {
  const [tab, setTab] = useState('bahanBaku');

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Stok</h2>
          <div className="page-sub">Data bahan baku &amp; catatan opname fisik gudang</div>
        </div>
      </div>
      <div className="subtab-switch">
        <button className={tab === 'bahanBaku' ? 'active' : ''} onClick={() => setTab('bahanBaku')}>Bahan Baku</button>
        <button className={tab === 'opname' ? 'active' : ''} onClick={() => setTab('opname')}>Stok Opname</button>
      </div>

      {tab === 'bahanBaku' ? <TabBahanBaku /> : <TabStokOpname />}
    </div>
  );
}
