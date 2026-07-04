"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";


const DUMMY_CLASSES = [
  { id: 1, kode: "EDV8X2A", nama: "X Rekayasa Perangkat Lunak B", mapel: "Dasar Pemrogr...", guruModel: "Desi Suryani", observers: ["A","B","C"], colors: ["#2563EB","#10b981","#f59e0b"], tanggal: "04 Jul 2023", status: "akan" },
  { id: 2, kode: "EDV9Y3B", nama: "XI Teknik Mekatronika C",       mapel: "Robotika",        guruModel: "Bagus Nugroho", observers: ["D","E"],       colors: ["#8b5cf6","#ef4444"],             tanggal: "29 Jun 2023", status: "akan" },
  { id: 3, kode: "EDV2Z1C", nama: "XII Multimedia A",              mapel: "Videografi",      guruModel: "Putra Pratama", observers: ["F","G","H"],   colors: ["#2563EB","#10b981","#f59e0b"],   tanggal: "23 Jun 2023", status: "belum" },
  { id: 4, kode: "EDV5W4D", nama: "X Rekayasa Perangkat Lunak B",  mapel: "Dasar Pemrogr...", guruModel: "Susi Pungitasari", observers: ["I","J"],  colors: ["#ef4444","#8b5cf6"],            tanggal: "15 Jun 2023", status: "selesai" },
];

const DUMMY_NOTIF = [
  { id: 1, initial: "LA", color: "#2563EB", nama: "Lusia Alexander", aksi: "bergabung sebagai Observer",        waktu: "5 menit lalu" },
  { id: 2, initial: "AW", color: "#10b981", nama: "Amy Wilson",      aksi: "mengumpulkan hasil penilaian",     waktu: "1 jam lalu" },
  { id: 3, initial: "MM", color: "#8b5cf6", nama: "Martin McKinney", aksi: "mengundang sebagai Observer",      waktu: "19 Mei 2023" },
  { id: 4, initial: "KM", color: "#f59e0b", nama: "Kathryn Murphy",  aksi: "mengundang sebagai Observer",      waktu: "27 April 2023" },
];

const BADGE = {
  akan:    { label: "Akan Datang",  cls: "bg-blue-100 text-blue-600" },
  belum:   { label: "Belum Dimulai",cls: "bg-yellow-100 text-yellow-600" },
  selesai: { label: "Selesai",      cls: "bg-green-100 text-green-700" },
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser]   = useState(null);
  const [clock, setClock] = useState({ tgl: "", jam: "" });
  const [search, setSearch] = useState("");
  
  // TAMBAHKAN STATE BARU INI UNTUK MENAMPUNG KELAS
  const [classList, setClassList] = useState([]);

 
  useEffect(() => {
    // Cek User Login
    const data = localStorage.getItem("user");
    if (!data) { router.push("/"); return; }
    setUser(JSON.parse(data));

    // Ambil data dari Supabase
    async function fetchClasses() {
      const { data: dbClasses, error } = await supabase
        .from('classes')
        .select('*')
        .order('id', { ascending: false }); // Biar kelas terbaru ada di atas

      if (error) {
        console.error("Error ngambil data:", error);
      } else {
        // Gabungkan data asli Supabase dengan DUMMY_CLASSES
        setClassList([...dbClasses, ...DUMMY_CLASSES]);
      }
    }
    
    fetchClasses();
  }, []);

  useEffect(() => {
    function tick() {
      const now = new Date();
      const days   = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
      const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
      setClock({
        tgl: `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
        jam: `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`,
      });
    }
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  if (!user) return null;

  // UBAH INI
  const filtered = classList.filter(c =>
    c.nama.toLowerCase().includes(search.toLowerCase()) ||
    c.guruModel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#EFF3FB]" style={{fontFamily:"'Segoe UI',sans-serif"}}>

      {/* ── SIDEBAR ── */}
      <aside className="w-[220px] min-h-screen bg-white flex flex-col shadow-md flex-shrink-0">

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-100">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base">E</div>
          <div>
            <div className="font-bold text-sm text-slate-800">Edvisor</div>
            <div className="text-xs text-slate-400">Lesson Study</div>
          </div>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center px-5 py-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-xl mb-2">
            {user.name?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
          </div>
          <div className="font-semibold text-sm text-slate-800">{user.name}</div>
          <div className="text-xs text-slate-400 mt-0.5">{user.role === "guru_model" ? "Guru Model" : "Observer"}</div>
          <div className="text-xs text-slate-400">{user.email}</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {[
            { label: "Beranda",    icon: "🏠", active: true,  action: () => {} },
            { label: "Buat Kelas", icon: "➕", active: false, action: () => router.push("/dashboard/buat-kelas") },
            { label: "Observer",   icon: "👁️", active: false, action: () => alert("Halaman Observer") },
            { label: "Bantuan",    icon: "❓", active: false, action: () => alert("Halaman Bantuan") },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all ${
                item.active
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-[#EFF3FB] hover:text-blue-600"
              }`}
            >
              <span className="w-5 text-center text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-5 py-4 border-t border-slate-100">
          <button
            onClick={() => { localStorage.clear(); router.push("/"); }}
            className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg w-full transition"
          >
            🚪 Keluar
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 px-8 py-7 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-400 mt-0.5">Selamat datang kembali, {user.name}!</p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <div>{clock.tgl}</div>
            <div className="text-xl font-bold text-blue-600 mt-0.5">{clock.jam}</div>
          </div>
        </div>

        {/* Security Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl px-5 py-3.5 flex items-center gap-3 mb-6 text-sm font-semibold">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
          🔒 Koneksi Aman · Sesi Terenkripsi SSL · Data Anda Terlindungi
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: "📋", num: 12, label: "Lesson Study", bg: "bg-blue-50" },
            { icon: "👨‍🏫", num: 7,  label: "Guru Model",   bg: "bg-green-50" },
            { icon: "👁️", num: 5,  label: "Observer",     bg: "bg-orange-50" },
          ].map(c => (
            <button key={c.label} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all text-left w-full">
              <div className={`w-12 h-12 ${c.bg} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0`}>{c.icon}</div>
              <div>
                <div className="text-3xl font-extrabold text-slate-800 leading-none">{c.num}</div>
                <div className="text-xs text-slate-400 mt-1">{c.label}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Shortcut */}
        <div className="grid grid-cols-2 gap-3.5 mb-6">
          <button
            onClick={() => router.push("/dashboard/buat-kelas")}
            className="bg-white rounded-xl p-4 flex items-center gap-3.5 border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all text-slate-500 text-sm font-medium"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">➕</div>
            <div className="text-left">
              <div className="font-bold text-slate-800 text-sm mb-0.5">Buat Kelas Baru</div>
              <div className="text-xs text-slate-400">Buat sesi Lesson Study baru</div>
            </div>
          </button>
          <button
            onClick={() => alert("Halaman hasil observasi")}
            className="bg-white rounded-xl p-4 flex items-center gap-3.5 border-2 border-dashed border-slate-200 hover:border-green-500 hover:bg-green-50 hover:text-green-600 transition-all text-slate-500 text-sm font-medium"
          >
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">📊</div>
            <div className="text-left">
              <div className="font-bold text-slate-800 text-sm mb-0.5">Lihat Hasil Observasi</div>
              <div className="text-xs text-slate-400">Review penilaian observer</div>
            </div>
          </button>
        </div>

        {/* Bottom Grid */}
        <div className="grid gap-5" style={{gridTemplateColumns:"1fr 300px"}}>

          {/* Kiri */}
          <div>
            {/* Jadwal */}
            <div className="font-bold text-slate-800 text-sm mb-3">Jadwal Terdekat</div>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white flex justify-between items-center mb-5 cursor-pointer hover:opacity-95 transition">
              <div>
                <div className="text-xs opacity-75 mb-2">📅 24 Maret 2023 &nbsp; ⏰ 08.00 – 08.30</div>
                <div className="text-lg font-bold mb-1">Kelas X Rekayasa Perangkat Lunak B</div>
                <div className="text-xs opacity-75 mb-3">SMK Negeri 1 Malang</div>
                <div className="flex items-center gap-1">
                  {["EE","BS","DP","RN"].map((i,idx) => (
                    <div key={idx} className="w-7 h-7 rounded-full border-2 border-white/40 flex items-center justify-center text-xs font-bold"
                      style={{background:["#f59e0b","#10b981","#8b5cf6","#ef4444"][idx], marginLeft: idx > 0 ? "-6px" : "0"}}>{i}</div>
                  ))}
                  <span className="text-xs opacity-75 ml-2">Guru Model &amp; Observer</span>
                </div>
              </div>
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg flex-shrink-0">›</div>
            </div>

            {/* Aktivitas */}
            <div className="flex justify-between items-center mb-3">
              <div className="font-bold text-slate-800 text-sm">Aktivitas Saya</div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-400">
                🔍
                <input
                  className="outline-none text-slate-700 text-xs bg-transparent"
                  placeholder="Cari kelas..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {/* TAMBAHKAN "Kode" DI DALAM ARRAY INI */}
                  {["Nama Kelas", "Kode", "Mata Pelajaran", "Guru Model", "Observer", "Tanggal", "Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{c.nama}</td>
                    
                    {/* RENDER KODE KELAS DI SINI */}
                    <td className="px-4 py-3 text-sm font-bold font-mono text-blue-600">{c.kode || "EDV---"}</td>
                    
                    <td className="px-4 py-3 text-sm text-slate-500">{c.mapel}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-700">{c.guruModel}</td>
                    <td className="px-4 py-3">
                      <div className="flex">
                        {c.observers.map((o, j) => (
                          <div key={j} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                            style={{background: c.colors[j], marginLeft: j > 0 ? "-6px" : "0"}}>{o}</div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{c.tanggal}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${BADGE[c.status].cls}`}>
                        {BADGE[c.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Notifikasi */}
          <div className="bg-white rounded-2xl p-4 shadow-sm self-start">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-bold text-slate-800">🔔 Notifikasi</div>
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">4</div>
            </div>
            {DUMMY_NOTIF.map(n => (
              <div key={n.id} className="flex gap-2.5 py-2.5 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50 rounded-lg px-1 transition">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background: n.color}}>{n.initial}</div>
                <div>
                  <div className="text-xs text-slate-600 leading-relaxed"><strong>{n.nama}</strong> {n.aksi}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{n.waktu}</div>
                </div>
              </div>
            ))}
            <div className="text-center mt-3 text-xs text-blue-600 font-semibold cursor-pointer">Lihat Selengkapnya →</div>
          </div>

        </div>
      </main>
    </div>
  );
}