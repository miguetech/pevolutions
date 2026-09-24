export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Admin Bar */}
      <header className="border-b border-white/10 bg-gray-900/90 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <h1 className="text-lg font-black tracking-tight uppercase flex items-center gap-2">
              PEvolutions <span className="text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">Admin Suite</span>
            </h1>
            <p className="text-xs text-gray-400">Server & Player Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/account"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <span>←</span> Volver a Mi Cuenta
          </a>
          <a
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-all"
          >
            Web Principal
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black italic tracking-wide">PANEL DE CONTROL</h2>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ● Sistema Operativo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/80 border border-white/5 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Cuentas</h3>
              <span className="text-xl">👥</span>
            </div>
            <p className="text-3xl font-black text-white">6</p>
            <p className="text-[11px] text-gray-400 mt-2">Cuentas registradas en la DB</p>
          </div>

          <div className="bg-gray-800/80 border border-white/5 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Usuarios Online</h3>
              <span className="text-xl">⚡</span>
            </div>
            <p className="text-3xl font-black text-amber-400">Activo</p>
            <p className="text-[11px] text-gray-400 mt-2">Servidor sincronizado</p>
          </div>

          <div className="bg-gray-800/80 border border-white/5 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Personajes Creados</h3>
              <span className="text-xl">🎮</span>
            </div>
            <p className="text-3xl font-black text-brand-accent">En línea</p>
            <p className="text-[11px] text-gray-400 mt-2">Base de datos lista</p>
          </div>
        </div>
      </main>
    </div>
  );
}
