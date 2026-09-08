import { useState, useMemo } from 'react';
import Icon from './Icon';
import Badge from './Badge';

const PAGE_SIZE = 5;

function fmt(n) {
  return Math.round(n || 0).toLocaleString('id-ID');
}

/**
 * Tabel CRUD generik — portir dari fungsi crudHTML() versi HTML.
 * columns: [{ key, label, type?: 'currency'|'badge', align?: 'r' }]
 * actions: array dari 'view' | 'edit' | 'delete'
 */
export default function DataTable({ title, subtitle, columns, rows, actions = [], onAdd, onEdit, onDelete, onView }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(1);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let r = term
      ? rows.filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(term)))
      : rows.slice();
    if (sortKey) {
      r.sort((a, b) => {
        const va = a[sortKey], vb = b[sortKey];
        if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * sortDir;
        return String(va).localeCompare(String(vb), 'id') * sortDir;
      });
    }
    return r;
  }, [rows, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => -d);
    else { setSortKey(key); setSortDir(1); }
  }

  function renderCell(row, col) {
    const val = row[col.key];
    if (col.type === 'currency') return `Rp${fmt(val)}`;
    if (col.type === 'badge') return <Badge value={val} />;
    return val;
  }

  const ACTION_ICON = { view: 'eye', edit: 'edit', delete: 'trash' };
  const ACTION_LABEL = { view: 'Lihat', edit: 'Ubah', delete: 'Hapus' };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>{title}</h2>
          <div className="page-sub">{subtitle ?? `${rows.length} total data`}</div>
        </div>
        {onAdd && <button className="btn-gold" onClick={onAdd}>+ Tambah</button>}
      </div>

      <div className="toolbar">
        <div className="search-box2">
          <Icon name="search" size={15} />
          <input
            placeholder={`Cari ${title.toLowerCase()}...`}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="export-group">
          <button className="btn-export"><Icon name="excel" size={14} /> Excel</button>
          <button className="btn-export"><Icon name="pdf" size={14} /> PDF</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 44 }}>No</th>
              {columns.map(col => (
                <th key={col.key} className={col.align === 'r' ? 'r' : ''} onClick={() => handleSort(col.key)}>
                  {col.label}{sortKey === col.key ? (sortDir === 1 ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
              {actions.length > 0 && <th>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr><td colSpan={columns.length + 2} className="empty-row">Tidak ada data ditemukan.</td></tr>
            ) : pageRows.map((row, i) => (
              <tr key={row.id}>
                <td>{start + i + 1}</td>
                {columns.map(col => (
                  <td key={col.key} className={col.align === 'r' ? 'r' : ''}>{renderCell(row, col)}</td>
                ))}
                {actions.length > 0 && (
                  <td>
                    <div className="row-actions">
                      {actions.map(a => (
                        <button
                          key={a}
                          className={`icon-btn act-${a}`}
                          title={ACTION_LABEL[a]}
                          onClick={() => {
                            if (a === 'edit') onEdit?.(row);
                            else if (a === 'delete') { if (confirm('Hapus data ini?')) onDelete?.(row); }
                            else if (a === 'view') onView?.(row);
                          }}
                        >
                          <Icon name={ACTION_ICON[a]} size={13} />
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <div>Menampilkan {filtered.length === 0 ? 0 : start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} dari {filtered.length} data</div>
        <div className="pager-btns">
          <button className="pg-btn" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={`pg-btn ${p === safePage ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="pg-btn" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      </div>
    </div>
  );
}
