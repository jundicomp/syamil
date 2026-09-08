import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';

const COLUMNS = [
  { key: 'namaLead', label: 'Nama Lead' },
  { key: 'sumber', label: 'Sumber' },
  { key: 'kontak', label: 'Kontak' },
  { key: 'status', label: 'Status', type: 'badge' },
];
const FIELDS = [
  { key: 'namaLead', label: 'Nama Lead', type: 'text' },
  { key: 'sumber', label: 'Sumber', type: 'text' },
  { key: 'kontak', label: 'Kontak', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Deal', 'Follow Up', 'Nonaktif'] },
];

export default function LeadsPage() {
  const { data, addRow, updateRow, deleteRow } = useData();
  const [modal, setModal] = useState(null);

  function handleSave(values) {
    if (modal.row) updateRow('leads', modal.row.id, values);
    else addRow('leads', values);
    setModal(null);
  }

  return (
    <div>
      <DataTable
        title="Sumber Leads"
        columns={COLUMNS}
        rows={data.leads}
        actions={['edit', 'delete']}
        onAdd={() => setModal({ row: null })}
        onEdit={row => setModal({ row })}
        onDelete={row => deleteRow('leads', row.id)}
      />
      {modal && (
        <FormModal
          title={`${modal.row ? 'Edit' : 'Tambah'} Lead`}
          fields={FIELDS}
          initialValues={modal.row}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
