"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";

export default function ObserverDashboard() {
  const router = useRouter();
  const [kode, setKode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [kelas, setKelas] = useState([]);
  const [loadingKelas, setLoadingKelas] = useState(true);
  const [user, setUser] = useState(null);

  // State untuk Hamburger Menu di layar Mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Tarik data kelas dari Supabase saat halaman dimuat
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) { router.push("/"); return; }
    setUser(JSON.parse(data));

    async function fetchKelas() {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("id", { ascending: false });
      
      if (!error && data) {
        setKelas(data);
      }
      setLoadingKelas(false);
    }
    fetchKelas();
  }, [router]);

  async function cariKelas() {
    if (!kode) return;
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("kode", kode.toUpperCase())
      .single();

    if (error || !data) {
      setErrorMsg("Kelas tidak ditemukan. Periksa kembali kode kelas.");
    } else {
      alert(`✅ Kelas "${data.nama}" ditemukan!\n\nDi tahap pengembangan selanjutnya, tombol ini akan langsung membuka halaman Lembar Instrumen Observasi untuk kelas tersebut.`);
      setKode(""); // Reset input setelah ketemu
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#EFF3FB] relative" style={{fontFamily:"'Segoe UI',sans-serif"}}>
      
      {/* ── HEADER MOBILE (Hanya Muncul di HP) ── */}
      <div className="md:hidden flex items-center justify-between bg-white px-5 py-4 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div>
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

      {/* ── SIDEBAR OBSERVER (Drawer di HP, Kolom Tetap di PC) ── */}
      <aside className={`fixed md:relative top-0 left-0 h-screen bg-white flex flex-col shadow-md flex-shrink-0 z-50 w-[220px] transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        
        <button onClick={() => setIsMenuOpen(false)} className="md:hidden absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold">
          ✕
        </button>

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
            { label: "Dashboard",  icon: "🏠", active: true,  action: () => { router.push("/observer"); setIsMenuOpen(false); } },
            { label: "Riwayat",    icon: "🕒", active: false, action: () => { router.push("/observer/riwayat"); setIsMenuOpen(false); } },
            { label: "Bantuan",    icon: "❓", active: false, action: () => { router.push("/observer/bantuan"); setIsMenuOpen(false); } },
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

      {/* ── MAIN CONTENT (min-w-0 mengunci lebar agar tabel tidak meluber) ── */}
      <main className="flex-1 min-w-0 px-5 py-6 md:px-8 md:py-7 overflow-y-auto h-screen">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Observer</h1>
          <p className="text-sm text-slate-500 mt-1">Selamat datang, siapkan instrumen observasi Anda hari ini.</p>
        </div>

        {/* Action Card: Masuk Kelas */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border-l-4 border-green-500 mb-8 flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1 w-full">
            <h2 className="text-lg font-bold text-slate-800 mb-1">Gabung Kelas Baru</h2>
            <p className="text-sm text-slate-500 mb-4">Masukkan 7 digit kode kelas dari Guru Model untuk memulai observasi.</p>
            <input 
              type="text" 
              value={kode} 
              onChange={e => setKode(e.target.value.toUpperCase())}
              placeholder="Contoh: EDV4D43"
              maxLength={7}
              className="w-full sm:max-w-sm text-lg font-mono font-bold tracking-widest border-2 border-slate-200 rounded-xl px-4 py-3 text-green-700 outline-none focus:border-green-500 transition" 
            />
            {errorMsg && <p className="text-sm text-red-500 mt-2 font-medium">{errorMsg}</p>}
          </div>
          <button 
            onClick={cariKelas}
            disabled={loading || kode.length < 3}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white transition h-fit ${loading || kode.length < 3 ? "bg-slate-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}>
            {loading ? "Mencari..." : "Masuk Kelas"}
          </button>
        </div>

        {/* Tabel Jadwal Kelas */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Daftar Kelas Tersedia</h2>
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              {kelas.length} Kelas
            </span>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-4 font-semibold">Nama Kelas</th>
                  <th className="px-5 py-4 font-semibold">Kode</th>
                  <th className="px-5 py-4 font-semibold">Guru Model</th>
                  <th className="px-5 py-4 font-semibold">Tanggal</th>
                  <th className="px-5 py-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {loadingKelas ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-400">Memuat data kelas...</td>
                  </tr>
                ) : kelas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-400">Belum ada kelas yang tersedia.</td>
                  </tr>
                ) : (
                  kelas.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50 transition group">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">{k.nama}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{k.mapel}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{k.kode}</span>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-700">{k.guruModel}</td>
                      <td className="px-5 py-4 text-slate-500">{k.tanggal}</td>
                      <td className="px-5 py-4 text-center">
                        <button onClick={() => router.push("/observer/penilaian")}
                        className="bg-green-100 text-green-700 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition">
                          Observasi </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}