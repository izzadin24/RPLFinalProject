"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PenilaianObservasi() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State untuk nyimpen nilai dari form
  const [penilaian, setPenilaian] = useState({
    penguasaanMateri: "",
    interaksiSiswa: "",
    metodeMengajar: "",
    catatan: "",
  });

  const handlePilihNilai = (kriteria, skor) => {
    setPenilaian({ ...penilaian, [kriteria]: skor });
  };

  const kirimPenilaian = (e) => {
    e.preventDefault();
    
    // Validasi sederhana
    if (!penilaian.penguasaanMateri || !penilaian.interaksiSiswa || !penilaian.metodeMengajar) {
      alert("⚠️ Harap isi semua kriteria penilaian (skala 1-5) terlebih dahulu.");
      return;
    }

    setLoading(true);

    // Simulasi loading ngirim data ke Supabase selama 1.5 detik
    setTimeout(() => {
      setLoading(false);
      alert("✅ Hasil observasi berhasil disimpan dan dikirim ke Guru Model!");
      router.push("/observer"); // Otomatis balik ke dashboard observer
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#EFF3FB] pb-12 font-sans" style={{fontFamily:"'Segoe UI',sans-serif"}}>
      
      {/* ── HEADER FORM (Nempel di atas) ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push("/observer")}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 font-bold transition">
              ←
            </button>
            <h1 className="text-lg md:text-xl font-bold text-slate-800">Lembar Observasi</h1>
          </div>
          <button 
            onClick={kirimPenilaian}
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-sm font-bold text-white transition ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-md"}`}>
            {loading ? "Menyimpan..." : "Kirim Data"}
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT (Di tengah layar) ── */}
      <main className="max-w-3xl mx-auto px-5 mt-6 md:mt-8">
        
        {/* Info Kelas Card */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-md mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="text-xs font-semibold bg-blue-500/50 w-fit px-2 py-1 rounded mb-3">
              SEDANG BERLANGSUNG
            </div>
            <h2 className="text-2xl font-bold mb-1">Matematika Dasar (EDV4D43)</h2>
            <p className="text-blue-100 text-sm">Guru Model: Bu Karin • 4 Juli 2026</p>
          </div>
        </div>

        {/* Form Penilaian */}
        <form onSubmit={kirimPenilaian} className="space-y-6">
          
          {/* Kriteria 1 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-1">1. Penguasaan Materi</h3>
            <p className="text-sm text-slate-500 mb-4">Sejauh mana guru menguasai konsep dan menyampaikannya tanpa kebingungan?</p>
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
              {[1, 2, 3, 4, 5].map((skor) => (
                <button 
                  key={skor} type="button"
                  onClick={() => handlePilihNilai("penguasaanMateri", skor)}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                    penilaian.penguasaanMateri === skor 
                    ? "bg-green-500 text-white shadow-md scale-110" 
                    : "bg-white text-slate-500 border border-slate-200 hover:border-green-400"
                  }`}>
                  {skor}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
              <span>Kurang</span>
              <span>Sangat Baik</span>
            </div>
          </div>

          {/* Kriteria 2 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-1">2. Interaksi dengan Siswa</h3>
            <p className="text-sm text-slate-500 mb-4">Apakah guru mampu memancing diskusi dan melibatkan siswa secara aktif?</p>
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
              {[1, 2, 3, 4, 5].map((skor) => (
                <button 
                  key={skor} type="button"
                  onClick={() => handlePilihNilai("interaksiSiswa", skor)}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                    penilaian.interaksiSiswa === skor 
                    ? "bg-green-500 text-white shadow-md scale-110" 
                    : "bg-white text-slate-500 border border-slate-200 hover:border-green-400"
                  }`}>
                  {skor}
                </button>
              ))}
            </div>
          </div>

          {/* Kriteria 3 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-1">3. Penggunaan Metode Mengajar</h3>
            <p className="text-sm text-slate-500 mb-4">Efektivitas media dan metode pembelajaran yang diterapkan.</p>
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
              {[1, 2, 3, 4, 5].map((skor) => (
                <button 
                  key={skor} type="button"
                  onClick={() => handlePilihNilai("metodeMengajar", skor)}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                    penilaian.metodeMengajar === skor 
                    ? "bg-green-500 text-white shadow-md scale-110" 
                    : "bg-white text-slate-500 border border-slate-200 hover:border-green-400"
                  }`}>
                  {skor}
                </button>
              ))}
            </div>
          </div>

          {/* Catatan / Feedback */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">Catatan & Masukan Tambahan</h3>
            <textarea 
              rows="4"
              value={penilaian.catatan}
              onChange={(e) => setPenilaian({...penilaian, catatan: e.target.value})}
              placeholder="Ketik temuan menarik atau saran perbaikan di sini..."
              className="w-full border-2 border-slate-200 rounded-xl p-4 text-sm text-slate-700 outline-none focus:border-green-500 transition resize-none"
            ></textarea>
          </div>
          
        </form>

      </main>
    </div>
  );
}