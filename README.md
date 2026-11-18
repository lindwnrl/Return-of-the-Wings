# The Return of the Wings

Halaman kampanye edukasi lingkungan yang memperkenalkan biodiversitas melalui kupu-kupu,
mulai dari siklus hidupnya, tanaman inang dan nektarnya, ancaman terhadap habitatnya, hingga tindakan
sederhana yang bisa dilakukan siapa saja. Ditulis dalam Bahasa Indonesia.

Aplikasi web statis sesuai PRD v0.4. Berjalan langsung di sisi frontend tanpa backend, tanpa akun, dan tanpa dependensi eksternal.

## Menjalankan

Buka `index.html` langsung di peramban, atau jalankan server statis:

```sh
python -m http.server 8000
# http://127.0.0.1:8000
```

Tidak memerlukan langkah build. Seluruh berkas bersifat statis dan siap diunggah langsung ke Netlify, Vercel, atau GitHub Pages.

## Struktur

```
index.html                 # satu halaman utama dengan tujuh bagian (Vitrin 01–07)
assets/css/styles.css      # token desain, tata letak, komponen, animasi, gaya cetak
assets/js/main.js          # navigasi, scroll-spy, tab siklus, simulasi habitat, kuis, komitmen, hadiah
assets/img/*.webp          # foto spesimen teroptimasi
assets/fonts/*.woff2       # DM Serif Display + DM Sans (self-hosted)
PRODUCT.md                 # spesifikasi produk (pengguna, batasan, komitmen merek)
DESIGN.md                  # sistem visual (token warna, tipografi, komponen)
```

## Interaksi

| Fitur | Perilaku |
|---|---|
| Indeks vitrin (rail kiri) | Menandai bagian aktif saat menggulir dan otomatis disembunyikan pada layar di bawah 1200px |
| Menu seluler | Membuka dan menutup menu navigasi, tombol `Esc` menutup menu dan mengembalikan fokus ke tombol |
| Strip empat tahap (hero) | Pada layar ponsel hanya menampilkan nama tahap, sedangkan penjelasan lengkapnya tersedia di tab siklus hidup |
| Siklus hidup | Empat tab interaktif dengan dukungan tombol panah kiri/kanan, `Home`/`End`, dan atribut `aria-selected` |
| Simulasi habitat (FR-08) | Empat sakelar `role="switch"` yang semuanya dimulai dalam posisi nonaktif. Mengaktifkan keempatnya akan membuka dialog keberhasilan dan menerbangkan kupu-kupu |
| Kuis (FR-09) | Tombol kirim baru aktif setelah kelima pertanyaan dijawab dan berubah label menjadi "Kirim Jawaban", lalu menampilkan skor serta pembahasan tiap nomor |
| Hadiah | Tiga hadiah interaktif berupa Rumah lengkap, Kursor kupu-kupu, dan Spider lily |
| Aksi Nyata (FR-10) | Memilih minimal satu langkah komitmen untuk menampilkan konfirmasi lokal serta animasi Butterfly Bloom |
| Checklist aksi | Enam pilihan langkah nyata yang disimpan di `localStorage` (`rotw.checklist.v1`) |

### Fitur gamifikasi (PRD v0.4)

| Fitur | Perilaku |
|---|---|
| Sakelar habitat | Dimulai dalam kondisi nonaktif, dilengkapi label status ("Aktif"/"Nonaktif") dan penjelasan dampak yang berubah secara dinamis |
| Popup keberhasilan | Muncul setiap kali keempat elemen habitat diaktifkan |
| Animasi kupu-kupu | Tiga kupu-kupu melintas saat habitat lengkap, dan 18 kupu-kupu terbang naik saat komitmen dikirim |
| Kupu-kupu terbang | Hadiah "Rumah lengkap" memiliki sakelar Nyala/Mati. Saat aktif, kupu-kupu terbang berkeliaran mengikuti koordinat halaman, menghindari kursor, dan otomatis nonaktif jika `prefers-reduced-motion` menyala (`swarmOn`) |
| Kupu-kupu biru rahasia | Satu kupu-kupu bersayap biru gelap terbang di antara kupu-kupu lain setelah habitat dan kuis diselesaikan. Jika diklik, muncul dialog hasil riset keragaman kupu-kupu di Lumajang (Leksono dkk. 2025) sekaligus membuka opsi kursor ketiga yaitu Mati / Klasik / Biru (`rewards.blue`, `rewards.cursorStyle`) |
| Kursor kupu-kupu | Tersedia pada perangkat dengan penunjuk presisi (mouse). Sayap mengepak perlahan saat diam, lebih cepat saat bergerak, dan paling cepat di atas tautan atau tombol (`localStorage`) |
| Alternatif sentuh | Tombol "Terbangkan kupu-kupu" hadir pada perangkat layar sentuh sebagai pengganti kursor kustom |
| Spider lily | Terbuka khusus bila skor kuis mencapai 5/5. Sakelar Nyala/Mati menumbuhkan bunga spider lily merah di bawah daftar Hadiah, dan menekan bunganya akan melepas dua kupu-kupu merah selama sesi berlangsung (`lilyOn`) |
| Butterfly Bloom | Animasi 18 kupu-kupu yang terbang dari bawah layar lalu memudar dan menghapus elemen DOM-nya secara otomatis |
| Pengurangan gerak | Seluruh animasi hadiah dilewati ketika pengaturan pengurangan gerak aktif, namun dialog dan teks konfirmasi tetap ditampilkan |

Semua hadiah dan progres disimpan secara lokal di peramban perangkat (`rotw.habitat.v1`, `rotw.rewards.v1`,
`rotw.checklist.v1`, `rotw.commit.v1`) tanpa sinkronisasi antarperangkat.

Kuis dan checklist tetap berfungsi penuh pada mode penjelajahan privat meskipun datanya tidak disimpan setelah halaman dimuat ulang.

## Aksesibilitas

- Memenuhi target WCAG 2.2 AA. Seluruh teks menggunakan `--leaf-ink` (#3C6A44) atau warna lebih gelap di atas latar krem dengan rasio kontras ≥ 5.5:1.
- Menghormati pengaturan `prefers-reduced-motion` dengan menonaktifkan transisi serta animasi dekoratif.
- Seluruh konten tetap terbaca penuh meskipun JavaScript dinonaktifkan.
- Dilengkapi tautan lewati ke isi utama (`#main`), landmark semantik, indikator fokus yang jelas, dan ukuran area sentuh minimal 44px.
- Umpan balik kuis selalu memadukan warna dengan ikon serta teks label "Benar" atau "Belum tepat".
- Setiap sakelar habitat menampilkan teks status secara eksplisit sehingga tidak bergantung pada warna saja.
- Bunga spider lily dibuat menggunakan elemen `<button>` asli yang dapat diakses dengan tombol `Tab` serta ditekan menggunakan `Enter` atau `Space`, dilengkapi pengumuman `aria-live`.
- Warna merah spider lily (`#C8102E`, `#8E0B21`) merupakan satu-satunya pengecualian di luar palet utama yang dikhususkan bagi bunga hadiah beserta dua kupu-kupunya sesuai catatan di `DESIGN.md`.
- Hadiah kursor bersifat opsional sehingga kursor standar dan navigasi keyboard (papan ketik) tetap berfungsi normal.
- Seluruh lapisan animasi hadiah menggunakan `pointer-events: none` agar tidak pernah menghalangi klik pengguna.

## Gambar

Semua foto berasal dari Wikimedia Commons yang telah dioptimasi ke format WebP, lengkap dengan atribusi pemilik dan lisensi pada setiap foto maupun bagian footer.

| Berkas | Spesies / subjek | Pemilik | Lisensi |
|---|---|---|---|
| `hero-tree-nymph` | *Idea leuconoe* | Richard Bartz | CC BY-SA 2.5 |
| `anatomy` | *Papilio polytes* jantan | Atanu Bose Photography | CC BY-SA 4.0 |
| `blumei` | *Papilio blumei* | Yi-Kai Tea | CC BY-SA 4.0 |
| `helena` | *Troides helena* | ZiemowitJ | CC BY 4.0 |
| `agamemnon` | *Graphium agamemnon* | ManaskaMukhopadhyay | CC BY-SA 4.0 |
| `egg` | telur *Papilio demoleus* | Hemant Ogale | CC BY-SA 4.0 |
| `larva` | larva *Papilio demoleus* | Vinayaraj | CC BY-SA 4.0 |
| `pupa` | pupa *Papilio demoleus* | Sandipoutsider | CC BY-SA 4.0 |
| `polytes` | *Papilio polytes* di *Lantana* | Charles J. Sharp | CC BY-SA 4.0 |
| `nectar` | *Lantana camara* | Vengolis | CC BY-SA 4.0 |

## Rujukan

1. Academy of Natural Sciences. *An Educator's Guide to Butterflies*.
2. Leksono, A. S. dkk. (2025). Butterfly diversity along an altitudinal gradient and land
   uses in East Java, Indonesia. *Biodiversitas*, 26(2), 551–563.
   <https://doi.org/10.13057/biodiv/d260204>

Rentang waktu pada setiap tahap metamorfosis merupakan gambaran umum yang dapat berbeda menurut spesies, ketinggian wilayah, serta musim.
