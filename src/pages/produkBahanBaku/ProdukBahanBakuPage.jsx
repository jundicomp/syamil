import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';
import KartuStokModal from '../../components/common/KartuStokModal';

const PRODUK_COLUMNS = [
  { key: 'nama', label: 'Nama' },
  { key: 'kategori', label: 'Kategori', type: 'badge' },
  { key: 'satuan', label: 'Satuan' },
  { key: 'harga', label: 'Harga', type: 'currency', align: 'r' },
  { key: 'tipe', label: 'Tipe', type: 'badge' },
];
const PRODUK_FIELDS = [
  { key: 'nama', label: 'Nama', type: 'text' },
  { key: 'kategori', label: 'Kategori', type: 'text' },
  { key: 'satuan', label: 'Satuan', type: 'text' },
  { key: 'harga', label: 'Harga', type: 'number' },
  { key: 'tipe', label: 'Tipe', type: 'select', options: ['Tetap', 'Matriks Harga'] },
];

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

export default function ProdukBahanBakuPage() {
  const [tab, setTab] = useState('produk');
  const { data, addRow, updateRow, deleteRow } = useData();
  const [modal, setModal] = useState(null);
  const [kartuStokBahan, setKartuStokBahan] = useState(null);

  const isProduk = tab === 'produk';
  const dataKey = isProduk ? 'produk' : 'bahanBaku';
  const columns = isProduk ? PRODUK_COLUMNS : BAHAN_COLUMNS;
  const fields = isProduk ? PRODUK_FIELDS : BAHAN_FIELDS;

  function handleSave(values) {
    // Bahan baru: stok mulai dari 0 (bertambah lewat modul Pembelian, atau isi manual saat edit).
    const payload = !isProduk && !modal.row ? { ...values, stok: 0 } : values;
    if (modal.row) updateRow(dataKey, modal.row.id, payload);
    else addRow(dataKey, payload);
    setModal(null);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Produk &amp; Bahan Baku</h2>
          <div className="page-sub">Data master untuk penjualan &amp; pembelian</div>
        </div>
      </div>
      <div className="subtab-switch">
        <button className={isProduk ? 'active' : ''} onClick={() => setTab('produk')}>Produk</button>
        <button className={!isProduk ? 'active' : ''} onClick={() => setTab('bahanBaku')}>Bahan Baku</button>
      </div>

      <DataTable
        title={isProduk ? 'Produk' : 'Bahan Baku'}
        columns={columns}
        rows={data[dataKey]}
        actions={isProduk ? ['edit', 'delete'] : ['view', 'edit', 'delete']}
        onAdd={() => setModal({ row: null })}
        onEdit={row => setModal({ row })}
        onDelete={row => deleteRow(dataKey, row.id)}
        onView={row => setKartuStokBahan(row)}
      />

      {modal && (
        <FormModal
          title={`${modal.row ? 'Edit' : 'Tambah'} ${isProduk ? 'Produk' : 'Bahan Baku'}`}
          fields={fields}
          initialValues={modal.row}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {kartuStokBahan && (
        <KartuStokModal bahan={kartuStokBahan} onClose={() => setKartuStokBahan(null)} />
      )}
    </div>
  );
}
