import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';

const PELANGGAN_COLUMNS = [
  { key: 'nama', label: 'Nama' },
  { key: 'kota', label: 'Kota' },
  { key: 'kontak', label: 'No. HP/WA' },
  { key: 'kategori', label: 'Kategori', type: 'badge' },
  { key: 'marketingTerkait', label: 'Marketing Terkait' },
  { key: 'alamat', label: 'Alamat' },
];
const PELANGGAN_FIELDS = [
  { key: 'nama', label: 'Nama', type: 'text' },
  { key: 'kota', label: 'Kota', type: 'text' },
  { key: 'kontak', label: 'No. HP/WA', type: 'text' },
  { key: 'kategori', label: 'Kategori', type: 'select', options: ['Bisnis', 'Ritel'] },
  { key: 'marketingTerkait', label: 'Marketing Terkait', type: 'text' },
  { key: 'alamat', label: 'Alamat', type: 'textarea' },
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
  const { data, addRow, updateRow, deleteRow } = useData();
  const [modal, setModal] = useState(null); // { key, row|null }

  const isPelanggan = tab === 'pelanggan';
  const dataKey = isPelanggan ? 'pelanggan' : 'supplier';
  const columns = isPelanggan ? PELANGGAN_COLUMNS : SUPPLIER_COLUMNS;
  const fields = isPelanggan ? PELANGGAN_FIELDS : SUPPLIER_FIELDS;

  function handleSave(values) {
    if (modal.row) updateRow(dataKey, modal.row.id, values);
    else addRow(dataKey, values);
    setModal(null);
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

      <DataTable
        title={isPelanggan ? 'Pelanggan' : 'Supplier'}
        columns={columns}
        rows={data[dataKey]}
        actions={['edit', 'delete']}
        onAdd={() => setModal({ key: dataKey, row: null })}
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
    </div>
  );
}
