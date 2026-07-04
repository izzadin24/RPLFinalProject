"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [classList, setClassList] = useState([]);
  const [stats, setStats] = useState({ classes: 0, gurus: 0, observers: 0 });
  
  // State untuk Hamburger Menu di layar Mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State untuk fitur cari kelas
  const [search, setSearch] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) { router.push("/"); return; }
    setUser(JSON.parse(data));

    async function fetchClasses() {
      const { data: dbClasses, error } = await supabase
        .from('classes')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error("Error ngambil data:", error);
      } else {
        setClassList(dbClasses || []);
      }
    }
    
    async function fetchStats() {
      const { count: countClasses } = await supabase.from('classes').select('*', { count: 'exact', head: true });
      const { count: countGurus } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'guru_model');
      const { count: countObservers } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'observer');

      setStats({
        classes: countClasses || 0,
        gurus: countGurus || 0,
        observers: countObservers || 0
      });
    }
    
    fetchClasses();
    fetchStats();
  }, [router]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#EFF3FB] relative" style={{fontFamily:"'Segoe UI',sans-serif"}}>

      {/* ── HEADER MOBILE (Hanya Muncul di HP) ── */}
      <div className="md:hidden flex items-center justify-between bg-white px-5 py-4 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div>
          <div className="font-bold text-slate-800">Edvisor</div>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl text-slate-800 focus:outline-none">
          ☰
        </button>
      </div>

      {/* ── OVERLAY GELAP (Hanya Muncul di HP saat menu dibuka) ── */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsMenuOpen(false)}></div>
      )}

      {/* ── SIDEBAR (Drawer di HP, Kolom Tetap di PC) ── */}
      <aside className={`fixed md:relative top-0 left-0 h-screen bg-white flex flex-col shadow-md flex-shrink-0 z-50 w-[220px] transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        
        <button onClick={() => setIsMenuOpen(false)} className="md:hidden absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold">
          ✕
        </button>

        <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-100 mt-8 md:mt-0">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base">E</div>
          <div>
            <div className="font-bold text-sm text-slate-800">Edvisor</div>
            <div className="text-xs text-slate-400">Lesson Study</div>
          </div>
        </div>
        
        <div className="flex flex-col items-center px-5 py-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2 shadow-sm"
               style={{ background: user?.color || '#2563eb' }}>
            {user?.initial || "..."}
          </div>
          <div className="font-semibold text-sm text-slate-800">{user?.name || "Memuat..."}</div>
          <div className="text-xs text-slate-400">Guru Model</div>
        </div>
        
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {[
            { label: "Beranda",    icon: "🏠", active: true,  action: () => { router.push("/dashboard"); setIsMenuOpen(false); } },
            { label: "Buat Kelas", icon: "➕", active: false, action: () => { router.push("/dashboard/buat-kelas"); setIsMenuOpen(false); } },
            { label: "Observer",   icon: "👁️", active: false, action: () => { router.push("/dashboard/observer-list"); setIsMenuOpen(false); } },
            { label: "Bantuan",    icon: "❓", active: false, action: () => { router.push("/dashboard/bantuan"); setIsMenuOpen(false); } },
          ].map(item => (
            <button key={item.label} onClick={item.action}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all ${
                item.active ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-[#EFF3FB] hover:text-blue-600"
              }`}>
              <span className="w-5 text-center text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="px-5 py-4 border-t border-slate-100">
          <button onClick={() => { localStorage.clear(); router.push("/"); }}
            className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg w-full transition">
            🚪 Keluar
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT (min-w-0 mengunci lebar agar tabel tidak meluber) ── */}
      <main className="flex-1 min-w-0 px-5 py-6 md:px-8 md:py-7 overflow-y-auto h-screen">
        
        {/* Header Content */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Selamat datang kembali, {user?.name || "..."}!</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white px-4 py-3 rounded-xl border border-blue-100 shadow-sm w-fit">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">Koneksi Aman</span>
            </div>
            <div className="hidden sm:block text-slate-300">|</div>
            <p className="text-xs text-slate-500">Sesi Terenkripsi SSL • Data Anda Terlindungi</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm text-left w-full">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">📋</div>
            <div>
              <div className="text-3xl font-extrabold text-slate-800 leading-none">{stats.classes}</div>
              <div className="text-xs text-slate-400 mt-1">Lesson Study</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm text-left w-full">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">👨‍🏫</div>
            <div>
              <div className="text-3xl font-extrabold text-slate-800 leading-none">{stats.gurus}</div>
              <div className="text-xs text-slate-400 mt-1">Guru Model</div>
            </div>
          </div>

          <button onClick={() => router.push("/dashboard/observer-list")} 
            className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all text-left w-full group cursor-pointer sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">👁️</div>
            <div>
              <div className="text-3xl font-extrabold text-slate-800 leading-none">{stats.observers}</div>
              <div className="text-xs text-slate-400 mt-1 text-blue-500 font-semibold group-hover:text-blue-600">Observer ➔</div>
            </div>
          </button>
        </div>

        {/* Jadwal Terdekat */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Jadwal Terdekat</h2>
          
          {classList.length > 0 ? (
            <div className="bg-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-20 translate-x-20 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-blue-100 mb-3">
                  <span>📅 {classList[0].tanggal}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="bg-blue-500/50 px-2 py-0.5 rounded text-xs">Menunggu</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold mb-1 leading-snug">{classList[0].nama}</h3>
                <p className="text-blue-100 text-sm mb-6">{classList[0].mapel} • {classList[0].guruModel}</p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4">
                  <div className="flex -space-x-2">
                    {classList[0].observers && classList[0].observers.map((inisial, idx) => (
                      <div key={idx} 
                        className="w-9 h-9 rounded-full border-2 border-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm"
                        style={{ backgroundColor: classList[0].colors ? classList[0].colors[idx] : '#94a3b8' }}>
                        {inisial}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-blue-100">Guru Model & Observer</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <div className="text-slate-400 mb-2">📅</div>
              <div className="text-slate-500 font-medium">Belum ada jadwal kelas mendatang.</div>
            </div>
          )}
        </div>

        {/* Aktivitas Saya */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 mt-8 gap-3">
          <div className="font-bold text-slate-800 text-sm">Aktivitas Saya</div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-400 w-full sm:w-auto">
            🔍
            <input
              className="outline-none text-slate-700 text-xs bg-transparent w-full sm:w-48"
              placeholder="Cari kelas atau kode..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse whitespace-nowrap text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Nama Kelas", "Kode", "Mata Pelajaran", "Guru Model", "Observer", "Tanggal", "Status"].map(h => (
                    <th key={h} className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {classList
                  .filter(cls => 
                    (cls.nama && cls.nama.toLowerCase().includes(search.toLowerCase())) || 
                    (cls.kode && cls.kode.toLowerCase().includes(search.toLowerCase()))
                  )
                  .map(cls => (
                  <tr key={cls.id} className="hover:bg-slate-50 transition group">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{cls.nama}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{cls.mapel}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{cls.kode}</span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">{cls.guruModel}</td>
                    <td className="px-5 py-4">
                      <div className="flex -space-x-1.5">
                        {cls.observers && cls.observers.map((obs, i) => (
                          <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                            style={{ backgroundColor: cls.colors ? cls.colors[i] : '#94a3b8' }}>
                            {obs}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{cls.tanggal}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        cls.status === "selesai" ? "bg-green-100 text-green-700" :
                        cls.status === "belum"   ? "bg-orange-100 text-orange-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {cls.status === "selesai" ? "Selesai" : cls.status === "belum" ? "Berlangsung" : "Akan Datang"}
                      </span>
                    </td>
                  </tr>
                ))}
                {classList.filter(cls => 
                  (cls.nama && cls.nama.toLowerCase().includes(search.toLowerCase())) || 
                  (cls.kode && cls.kode.toLowerCase().includes(search.toLowerCase()))
                ).length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-5 py-8 text-center text-slate-400 font-medium">
                      Kelas tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}