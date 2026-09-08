import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';

const COLUMNS = [
  { key: 'namaKampanye', label: 'Nama Kampanye' },
  { key: 'channel', label: 'Channel' },
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'status', label: 'Status', type: 'badge' },
];
const FIELDS = [
  { key: 'namaKampanye', label: 'Nama Kampanye', type: 'text' },
  { key: 'channel', label: 'Channel', type: 'text' },
  { key: 'tanggal', label: 'Tanggal', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Berjalan', 'Selesai'] },
];

export default function KampanyePage() {
  const { data, addRow, updateRow, deleteRow } = useData();
  const [modal, setModal] = useState(null);

  function handleSave(values) {
    if (modal.row) updateRow('kampanye', modal.row.id, values);
    else addRow('kampanye', values);
    setModal(null);
  }

  return (
    <div>
      <DataTable
        title="Kampanye Pelanggan"
        columns={COLUMNS}
        rows={data.kampanye}
        actions={['edit', 'delete']}
        onAdd={() => setModal({ row: null })}
        onEdit={row => setModal({ row })}
        onDelete={row => deleteRow('kampanye', row.id)}
      />
      {modal && (
        <FormModal
          title={`${modal.row ? 'Edit' : 'Tambah'} Kampanye`}
          fields={FIELDS}
          initialValues={modal.row}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
