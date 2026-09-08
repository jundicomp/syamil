import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { HAK_AKSES_ROLES, HAK_AKSES_MODULES } from '../../data/seedData';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';

const COLUMNS = [
  { key: 'nama', label: 'Nama' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', type: 'badge' },
  { key: 'status', label: 'Status', type: 'badge' },
];
const FIELDS = [
  { key: 'nama', label: 'Nama', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'role', label: 'Role', type: 'select', options: ['Owner', 'Admin', 'Kasir', 'Gudang', 'Marketing'] },
  { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Nonaktif'] },
  { key: 'kodeMarketing', label: 'Kode Marketing (kalau role Marketing)', type: 'text' },
];

export default function TabUser() {
  const { data, addRow, updateRow, deleteRow, hakAkses, toggleHakAkses } = useData();
  const [modal, setModal] = useState(null);

  function handleSave(values) {
    if (modal.row) updateRow('pengguna', modal.row.id, values);
    else addRow('pengguna', { kodeMarketing: '-', ...values });
    setModal(null);
  }

  return (
    <div>
      <DataTable
        title="Pengguna"
        columns={COLUMNS}
        rows={data.pengguna}
        actions={['edit', 'delete']}
        onAdd={() => setModal({ row: null })}
        onEdit={row => setModal({ row })}
        onDelete={row => deleteRow('pengguna', row.id)}
      />

      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 15, marginBottom: 4 }}>Hak Akses per Role</h3>
        <div className="page-sub" style={{ marginBottom: 12 }}>Centang modul yang boleh diakses tiap role</div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Role</th>
                {HAK_AKSES_MODULES.map(m => <th key={m}>{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {HAK_AKSES_ROLES.map(role => (
                <tr key={role}>
                  <td><b>{role}</b></td>
                  {HAK_AKSES_MODULES.map(mod => (
                    <td key={mod}>
                      <input
                        type="checkbox"
                        checked={hakAkses[role][mod]}
                        onChange={() => toggleHakAkses(role, mod)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <FormModal
          title={`${modal.row ? 'Edit' : 'Tambah'} Pengguna`}
          fields={FIELDS}
          initialValues={modal.row}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
