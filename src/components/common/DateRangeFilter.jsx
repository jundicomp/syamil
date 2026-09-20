import { toInputDate, fromInputDate, startOfMonth, endOfMonth, startOfYear, endOfYear } from '../../utils/dateUtils';

export default function DateRangeFilter({ from, to, onChange }) {
  const today = new Date();

  function setPreset(f, t) {
    onChange({ from: f, to: t });
  }
  function lastMonth() {
    const d = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return [startOfMonth(d), endOfMonth(d)];
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
      <div className="f-field" style={{ margin: 0 }}>
        <input
          type="date"
          value={toInputDate(from)}
          onChange={e => onChange({ from: fromInputDate(e.target.value), to })}
          style={{ padding: '7px 9px', fontSize: 11.5 }}
        />
      </div>
      <span style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>s/d</span>
      <div className="f-field" style={{ margin: 0 }}>
        <input
          type="date"
          value={toInputDate(to)}
          onChange={e => onChange({ from, to: fromInputDate(e.target.value) })}
          style={{ padding: '7px 9px', fontSize: 11.5 }}
        />
      </div>
      <button type="button" className="btn-outline" style={{ padding: '6px 11px', fontSize: 11 }} onClick={() => setPreset(startOfMonth(today), endOfMonth(today))}>Bulan Ini</button>
      <button type="button" className="btn-outline" style={{ padding: '6px 11px', fontSize: 11 }} onClick={() => setPreset(...lastMonth())}>Bulan Lalu</button>
      <button type="button" className="btn-outline" style={{ padding: '6px 11px', fontSize: 11 }} onClick={() => setPreset(startOfYear(today), endOfYear(today))}>Tahun Ini</button>
      {(from || to) && (
        <button type="button" className="btn-outline" style={{ padding: '6px 11px', fontSize: 11, color: 'var(--danger)' }} onClick={() => setPreset(null, null)}>✕ Reset</button>
      )}
    </div>
  );
}
