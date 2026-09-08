import { useState } from 'react';

/**
 * Modal tambah/edit generik — portir dari openFormModal() versi HTML.
 * fields: [{ key, label, type: 'text'|'select'|'textarea'|'number', options?: string[] }]
 */
export default function FormModal({ title, fields, initialValues, onSave, onClose }) {
  const [values, setValues] = useState(() => {
    const v = {};
    fields.forEach(f => { v[f.key] = initialValues?.[f.key] ?? ''; });
    return v;
  });

  function setField(key, val) {
    setValues(v => ({ ...v, [key]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(values);
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-head">
          <b>{title}</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          {fields.map(f => (
            <div className="f-field" key={f.key}>
              <label>{f.label}</label>
              {f.type === 'select' ? (
                <select value={values[f.key]} onChange={e => setField(f.key, e.target.value)}>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea value={values[f.key]} onChange={e => setField(f.key, e.target.value)} />
              ) : (
                <input
                  type={f.type === 'number' ? 'number' : 'text'}
                  value={values[f.key]}
                  onChange={e => setField(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                />
              )}
            </div>
          ))}
          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-gold">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
