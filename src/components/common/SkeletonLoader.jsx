function Bar({ w, h = 12, r = 6, style }) {
  return <div className="skel-bar" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

/** Skeleton loading premium — meniru bentuk sidebar+topbar+konten, dipakai saat memuat data awal. */
export default function SkeletonLoader() {
  return (
    <div className="skel-shell">
      <div className="skel-sidebar">
        <Bar w={34} h={34} r={10} style={{ marginBottom: 28 }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skel-nav-group">
            <Bar w="60%" h={9} style={{ marginBottom: 10, opacity: .5 }} />
            <Bar w="85%" h={13} style={{ marginBottom: 8 }} />
            <Bar w="70%" h={13} style={{ marginBottom: 8 }} />
          </div>
        ))}
      </div>

      <div className="skel-main">
        <div className="skel-topbar">
          <Bar w={140} h={16} />
          <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
            <Bar w={28} h={28} r={14} />
            <Bar w={100} h={28} r={14} />
          </div>
        </div>

        <div className="skel-content">
          <Bar w={220} h={20} style={{ marginBottom: 20 }} />
          <div className="skel-stat-row">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skel-card">
                <Bar w="50%" h={9} style={{ marginBottom: 10, opacity: .6 }} />
                <Bar w="70%" h={18} />
              </div>
            ))}
          </div>
          <div className="skel-table">
            <Bar w="100%" h={38} r={10} style={{ marginBottom: 10 }} />
            {Array.from({ length: 6 }).map((_, i) => (
              <Bar key={i} w="100%" h={30} r={8} style={{ marginBottom: 8, opacity: 1 - i * 0.08 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
