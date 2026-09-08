import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';

const COLUMNS = [
  { key: 'namaPromo', label: 'Nama Promo' },
  { key: 'jenis', label: 'Jenis' },
  { key: 'nilai', label: 'Nilai', align: 'r' },
  { key: 'periode', label: 'Periode' },
  { key: 'status', label: 'Status', type: 'badge' },
];
const FIELDS = [
  { key: 'namaPromo', label: 'Nama Promo', type: 'text' },
  { key: 'jenis', label: 'Jenis', type: 'select', options: ['Persentase', 'Nominal'] },
  { key: 'nilai', label: 'Nilai', type: 'number' },
  { key: 'periode', label: 'Periode', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Berakhir'] },
];

export default function PromosiPage() {
  const { data, addRow, updateRow, deleteRow } = useData();
  const [modal, setModal] = useState(null);

  function handleSave(values) {
    if (modal.row) updateRow('promosi', modal.row.id, values);
    else addRow('promosi', values);
    setModal(null);
  }

  return (
    <div>
      <DataTable
        title="Promosi & Diskon"
        columns={COLUMNS}
        rows={data.promosi}
        actions={['edit', 'delete']}
        onAdd={() => setModal({ row: null })}
        onEdit={row => setModal({ row })}
        onDelete={row => deleteRow('promosi', row.id)}
      />
      {modal && (
        <FormModal
          title={`${modal.row ? 'Edit' : 'Tambah'} Promosi`}
          fields={FIELDS}
          initialValues={modal.row}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
