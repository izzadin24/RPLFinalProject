"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RiwayatObserver() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) { router.push("/"); return; }
    setUser(JSON.parse(data));
  }, [router]);

  // Data Dummy untuk Demo
  const dummyRiwayat = [
    { id: 1, kelas: "Matematika Dasar (EDV4D43)", guru: "Bu Karin", tanggal: "4 Juli 2026", skor: "4.8/5.0", status: "Selesai" },
    { id: 2, kelas: "Fisika Lanjutan (EDVX881)", guru: "Pak Budi", tanggal: "28 Juni 2026", skor: "4.5/5.0", status: "Selesai" },
    { id: 3, kelas: "Biologi Kelas A (EDV9M21)", guru: "Bu Siti", tanggal: "15 Juni 2026", skor: "4.2/5.0", status: "Selesai" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#EFF3FB] relative" style={{fontFamily:"'Segoe UI',sans-serif"}}>
      
      {/* ── HEADER MOBILE ── */}
      <div className="md:hidden flex items-center justify-between bg-white px-5 py-4 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div>
          <div className="font-bold text-slate-800">Edvisor</div>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl text-slate-800 focus:outline-none">
          ☰
        </button>
      </div>

      {/* ── OVERLAY GELAP ── */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsMenuOpen(false)}></div>
      )}

      {/* ── SIDEBAR OBSERVER ── */}
      <aside className={`fixed md:relative top-0 left-0 h-screen bg-white flex flex-col shadow-md flex-shrink-0 z-50 w-[220px] transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <button onClick={() => setIsMenuOpen(false)} className="md:hidden absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>

        <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-100 mt-8 md:mt-0">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-base">E</div>
          <div>
            <div className="font-bold text-sm text-slate-800">Edvisor</div>
            <div className="text-xs text-slate-400">Lesson Study</div>
          </div>
        </div>
        
        <div className="flex flex-col items-center px-5 py-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2 shadow-sm"
               style={{ background: user?.color || '#16a34a' }}>
            {user?.initial || "..."}
          </div>
          <div className="font-semibold text-sm text-slate-800">{user?.name || "Memuat..."}</div>
          <div className="text-xs text-slate-400">Observer</div>
        </div>
        
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {[
            { label: "Dashboard",  icon: "🏠", active: false, action: () => { router.push("/observer"); setIsMenuOpen(false); } },
            { label: "Riwayat",    icon: "🕒", active: true,  action: () => { router.push("/observer/riwayat"); setIsMenuOpen(false); } },
            { label: "Bantuan",    icon: "❓", active: false, action: () => { alert("Halaman Bantuan"); setIsMenuOpen(false); } },
          ].map(item => (
            <button key={item.label} onClick={item.action}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all ${
                item.active ? "bg-green-600 text-white shadow-md" : "text-slate-500 hover:bg-[#EFF3FB] hover:text-green-600"
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

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 min-w-0 px-5 py-6 md:px-8 md:py-7 overflow-y-auto h-screen">
        
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Riwayat Observasi</h1>
          <p className="text-sm text-slate-500 mt-1">Daftar kelas yang telah selesai Anda observasi.</p>
        </div>

        {/* Tabel Riwayat Dummy */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-4 font-semibold">Nama Kelas</th>
                  <th className="px-5 py-4 font-semibold">Guru Model</th>
                  <th className="px-5 py-4 font-semibold">Tanggal</th>
                  <th className="px-5 py-4 font-semibold text-center">Skor Rata-rata</th>
                  <th className="px-5 py-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {dummyRiwayat.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition group">
                    <td className="px-5 py-4 font-bold text-slate-800">{row.kelas}</td>
                    <td className="px-5 py-4 font-medium text-slate-700">{row.guru}</td>
                    <td className="px-5 py-4 text-slate-500">{row.tanggal}</td>
                    <td className="px-5 py-4 text-center font-bold text-green-600">{row.skor}</td>
                    <td className="px-5 py-4 text-center">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}