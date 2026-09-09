import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';

const NOTIF_COLUMNS = [
  { key: 'judul', label: 'Judul' },
  { key: 'pemicu', label: 'Pemicu' },
  { key: 'status', label: 'Status', type: 'badge' },
];
const NOTIF_FIELDS = [
  { key: 'judul', label: 'Judul', type: 'text' },
  { key: 'pemicu', label: 'Pemicu', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Nonaktif'] },
];

const AUDIT_COLUMNS = [
  { key: 'waktu', label: 'Waktu' },
  { key: 'pengguna', label: 'Pengguna' },
  { key: 'aktivitas', label: 'Aktivitas' },
];

export default function TabSistem() {
  const { data, addRow, updateRow, deleteRow } = useData();
  const [modal, setModal] = useState(null);

  function handleSave(values) {
    if (modal.row) updateRow('notifikasi', modal.row.id, values);
    else addRow('notifikasi', values);
    setModal(null);
  }

  return (
    <div>
      <DataTable
        title="Notifikasi & Pengingat"
        columns={NOTIF_COLUMNS}
        rows={data.notifikasi}
        actions={['edit', 'delete']}
        onAdd={() => setModal({ row: null })}
        onEdit={row => setModal({ row })}
        onDelete={row => deleteRow('notifikasi', row.id)}
      />

      <div style={{ marginTop: 24 }}>
        <DataTable
          title="Backup & Audit Trail"
          subtitle="Jejak aktivitas pengguna — cuma catatan, tidak bisa diubah"
          columns={AUDIT_COLUMNS}
          rows={data.auditTrail}
          actions={[]}
          dateKey="waktu"
        />
      </div>

      {modal && (
        <FormModal
          title={`${modal.row ? 'Edit' : 'Tambah'} Notifikasi`}
          fields={NOTIF_FIELDS}
          initialValues={modal.row}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
