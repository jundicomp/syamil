import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';

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

export default function ProdukPage() {
  const { data, addRow, updateRow, deleteRow } = useData();
  const [modal, setModal] = useState(null);

  function handleSave(values) {
    if (modal.row) updateRow('produk', modal.row.id, values);
    else addRow('produk', values);
    setModal(null);
  }

  return (
    <div>
      <DataTable
        title="Produk"
        subtitle="Data master produk untuk transaksi penjualan — bahan baku sekarang di modul Stok"
        columns={PRODUK_COLUMNS}
        rows={data.produk}
        actions={['edit', 'delete']}
        onAdd={() => setModal({ row: null })}
        onEdit={row => setModal({ row })}
        onDelete={row => deleteRow('produk', row.id)}
      />
      {modal && (
        <FormModal
          title={`${modal.row ? 'Edit' : 'Tambah'} Produk`}
          fields={PRODUK_FIELDS}
          initialValues={modal.row}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
