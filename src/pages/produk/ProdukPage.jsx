import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';
import MatrixHargaModal from './MatrixHargaModal';
import Icon from '../../components/common/Icon';

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
  const [matrixProduk, setMatrixProduk] = useState(null);

  const PRODUK_COLUMNS = [
    { key: 'nama', label: 'Nama' },
    { key: 'kategori', label: 'Kategori', type: 'badge' },
    { key: 'satuan', label: 'Satuan' },
    {
      key: 'harga', label: 'Harga', type: 'currency', align: 'r',
      render: row => row.tipe === 'Matriks Harga'
        ? <button type="button" className="matrix-link" onClick={() => setMatrixProduk(row)}><Icon name="grid" size={12} /> Lihat Matriks</button>
        : `Rp${Math.round(row.harga || 0).toLocaleString('id-ID')}`,
    },
    { key: 'tipe', label: 'Tipe', type: 'badge' },
  ];

  function handleSave(values) {
    if (modal.row) {
      updateRow('produk', modal.row.id, values);
      setModal(null);
    } else {
      const ids = data.produk.map(r => r.id);
      const newId = (ids.length ? Math.max(...ids) : 0) + 1;
      addRow('produk', values);
      setModal(null);
      if (values.tipe === 'Matriks Harga') setMatrixProduk({ ...values, id: newId });
    }
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
      {matrixProduk && <MatrixHargaModal produk={matrixProduk} onClose={() => setMatrixProduk(null)} />}
    </div>
  );
}
