"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";

const DUMMY_OBSERVERS = [
  { id: 1, name: "Pak Budi",  email: "budi@edvisor.com",  initial: "PB", color: "#2563EB" },
  { id: 2, name: "Bu Karin",  email: "karin@edvisor.com", initial: "BK", color: "#10b981" },
  { id: 3, name: "Pak Rendi", email: "rendi@edvisor.com", initial: "PR", color: "#8b5cf6" },
  { id: 4, name: "Bu Nanda",  email: "nanda@edvisor.com", initial: "BN", color: "#f59e0b" },
  { id: 5, name: "Pak Dimas", email: "dimas@edvisor.com", initial: "PD", color: "#ef4444" },
  { id: 6, name: "Bu Ratna",  email: "ratna@edvisor.com", initial: "BR", color: "#0ea5e9" },
];

function generateKode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let kode = "EDV";
  for (let i = 0; i < 4; i++) kode += chars[Math.floor(Math.random() * chars.length)];
  return kode;
}

export default function BuatKelas() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ini perbaikan biar nggak error Hydration
  const [kode, setKode] = useState("EDV..."); 
  
  const [namaKelas, setNamaKelas]   = useState("");
  const [mapel, setMapel]           = useState("");
  const [sekolah, setSekolah]       = useState("");
  const [tanggal, setTanggal]       = useState("");
  const [search, setSearch]         = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [copied, setCopied]         = useState(false);
  const [toast, setToast]           = useState(false);

  // Ini juga perbaikan biar kodenya random jalan pas layarnya udah siap
  useEffect(() => {
    setKode(generateKode());
  }, []);

  const filtered = DUMMY_OBSERVERS.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  function toggleObserver(id) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function copyKode() {
    navigator.clipboard.writeText(kode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Fungsi simpan ini udah nembak langsung ke Supabase
  async function simpan() {
   if (!namaKelas || !mapel || !tanggal) {
      alert("Harap isi semua field wajib (*)");
      return;
    }

    // KUNCI GEMBOK: Kalau lagi proses, tolak klik tambahan
    if (isSubmitting) return;
    
    // Aktifkan loading
    setIsSubmitting(true);
    
    const tglObj = new Date(tanggal);
    const formattedTanggal = `${tglObj.getDate()} ${tglObj.toLocaleString('id-ID', { month: 'short' })} ${tglObj.getFullYear()}`;

    const { data, error } = await supabase
      .from('classes')
      .insert([
        {
          kode: kode,
          nama: namaKelas,
          mapel: mapel,
          guruModel: "Bu Sari",
          observers: selectedObservers.map(o => o.initial),
          colors: selectedObservers.map(o => o.color),
          tanggal: formattedTanggal,
          status: "akan"
        }
      ]);

    if (error) {
      console.error("Error nyimpen data:", error);
      alert("Gagal menyimpan ke database Supabase!");
      setIsSubmitting(false); // Buka gembok lagi kalau ternyata error
      return;
    }

    setToast(true);
    // Gak perlu setIsSubmitting(false) di sini karena halamannya toh bakal pindah
    setTimeout(() => { setToast(false); router.push("/dashboard"); }, 1800);
  }

  const selectedObservers = DUMMY_OBSERVERS.filter(o => selectedIds.has(o.id));

  return (
    <div className="flex min-h-screen bg-[#EFF3FB]" style={{fontFamily:"'Segoe UI',sans-serif"}}>

      {/* ── SIDEBAR ── */}
      <aside className="w-[220px] min-h-screen bg-white flex flex-col shadow-md flex-shrink-0">
        <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-100">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base">E</div>
          <div>
            <div className="font-bold text-sm text-slate-800">Edvisor</div>
            <div className="text-xs text-slate-400">Lesson Study</div>
          </div>
        </div>
        <div className="flex flex-col items-center px-5 py-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-xl mb-2">BS</div>
          <div className="font-semibold text-sm text-slate-800">Bu Sari</div>
          <div className="text-xs text-slate-400">Guru Model</div>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {[
            { label: "Beranda",    icon: "🏠", active: false, action: () => router.push("/dashboard") },
            { label: "Buat Kelas", icon: "➕", active: true,  action: () => {} },
            { label: "Observer",   icon: "👁️", active: false, action: () => alert("Halaman Observer") },
            { label: "Bantuan",    icon: "❓", active: false, action: () => alert("Halaman Bantuan") },
          ].map(item => (
            <button key={item.label} onClick={item.action}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all ${
                item.active ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-[#EFF3FB] hover:text-blue-600"
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

      {/* ── MAIN ── */}
      <main className="flex-1 px-8 py-7">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.push("/dashboard")}
            className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-lg hover:border-blue-500 hover:text-blue-600 transition">
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Buat Kelas Baru</h1>
            <p className="text-sm text-slate-400 mt-0.5">Isi detail kelas Lesson Study</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-7 shadow-sm max-w-2xl">

          {/* Kode Kelas */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kode Kelas (otomatis)</label>
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between">
              <span className="text-2xl font-extrabold tracking-widest text-blue-600 font-mono">{kode}</span>
              <button onClick={copyKode}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${copied ? "bg-green-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                {copied ? "✓ Tersalin!" : "📋 Salin"}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Bagikan kode ini ke observer agar mereka bisa bergabung.</p>
          </div>

          {/* Nama Kelas */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Kelas *</label>
            <input value={namaKelas} onChange={e => setNamaKelas(e.target.value)}
              placeholder="contoh: X Rekayasa Perangkat Lunak B"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
          </div>

          {/* Mata Pelajaran */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mata Pelajaran *</label>
            <input value={mapel} onChange={e => setMapel(e.target.value)}
              placeholder="contoh: Dasar Pemrograman"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
          </div>

          {/* Sekolah */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Sekolah</label>
            <input value={sekolah} onChange={e => setSekolah(e.target.value)}
              placeholder="contoh: SMK Negeri 1 Malang"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
          </div>

          {/* Tanggal */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal Pelaksanaan *</label>
            <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
          </div>

          {/* Observer Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tambah Observer</label>
            <p className="text-xs text-green-600 font-medium mb-2">
              ✅ Perbaikan: daftar muncul otomatis, pilih dengan sekali klik
            </p>

            <div className="border-2 border-slate-200 rounded-xl p-3">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="🔍 Cari observer..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 transition mb-2" />

              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                {filtered.map(obs => (
                  <label key={obs.id}
                    onClick={() => toggleObserver(obs.id)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition select-none ${
                      selectedIds.has(obs.id) ? "bg-blue-50" : "hover:bg-slate-50"
                    }`}>
                    <input type="checkbox" checked={selectedIds.has(obs.id)} onChange={() => toggleObserver(obs.id)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer" onClick={e => e.stopPropagation()} />
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{background: obs.color}}>{obs.initial}</div>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{obs.name}</div>
                      <div className="text-xs text-slate-400">{obs.email}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Chips observer terpilih */}
            {selectedObservers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedObservers.map(obs => (
                  <div key={obs.id} className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                      style={{background: obs.color, fontSize: "8px"}}>{obs.initial}</div>
                    {obs.name}
                    <button onClick={() => toggleObserver(obs.id)} className="text-blue-500 hover:text-blue-800 font-bold ml-0.5">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={simpan}
              disabled={isSubmitting}
              className={`${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white px-7 py-2.5 rounded-xl text-sm font-semibold transition`}>
              {isSubmitting ? "⏳ Menyimpan..." : "✓ Simpan Kelas"}
            </button>
            <button onClick={() => router.push("/dashboard")}
              className="bg-slate-100 text-slate-600 px-7 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition">
              Batal
            </button>
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 z-50">
          ✅ Kelas berhasil dibuat!
        </div>
      )}
    </div>
  );
}