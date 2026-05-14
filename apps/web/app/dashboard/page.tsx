export default function DashboardPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top right, #1e293b 0%, #020617 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8' }}>Dashboard</h1>
        <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Em construção — migração em andamento.</p>
      </div>
    </div>
  );
}
