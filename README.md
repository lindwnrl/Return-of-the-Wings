# The Return of the Wings

Halaman kampanye edukasi lingkungan: biodiversitas diperkenalkan lewat kupu-kupu —
siklus hidupnya, tanaman inang dan nektarnya, ancaman terhadap habitatnya, dan tindakan
yang bisa dilakukan siapa saja. Bahasa Indonesia.

Purwarupa frontend sesuai PRD v0.3. Tanpa backend, tanpa akun, tanpa dependensi.

## Menjalankan

Buka `index.html` langsung di peramban, atau jalankan server statis:

```sh
python -m http.server 8000
# http://127.0.0.1:8000
```

Tidak ada langkah build. Seluruh berkas statis; unggah apa adanya ke Netlify/Vercel.

## Struktur

```
index.html                 # satu halaman, tujuh bagian (vitrin 01–07)
assets/css/styles.css      # token, tata letak, komponen, gerak, cetak
assets/js/main.js          # navigasi, scroll-spy, stepper siklus, simulasi habitat, kuis, komitmen, hadiah
assets/img/*.webp          # foto spesimen (JPEG asli disimpan untuk rujukan)
assets/fonts/*.woff2       # DM Serif Display + DM Sans, dihosting sendiri
PRODUCT.md                 # kebenaran produk (pengguna, batasan, komitmen merek)
DESIGN.md                  # sistem visual (token, tipografi, komponen)
```

## Interaksi

| Fitur | Perilaku |
|---|---|
| Indeks vitrin (rail kiri) | Menandai bagian aktif saat menggulir; tersembunyi di bawah 1200px |
| Menu seluler | Buka/tutup, `Esc` menutup, fokus kembali ke tombol |
| Strip empat tahap (hero) | Di ponsel hanya nama tahapnya; kalimat penjelas ada di tab siklus hidup |
| Siklus hidup | Empat tab, panah kiri/kanan, `Home`/`End`, `aria-selected` |
| Simulasi habitat (FR-08) | Empat sakelar `role="switch"`, semuanya mulai nonaktif. Mengaktifkan keempatnya membuka dialog keberhasilan dan menerbangkan kupu-kupu |
| Kuis (FR-09) | Tombol terkunci sampai kelima pertanyaan terjawab, berubah menjadi "Kirim Jawaban"; jawaban terkunci setelah dikirim; skor + penjelasan |
| Hadiah | Tiga hadiah: Rumah lengkap, Kursor kupu-kupu, Sayap sempurna |
| Aksi Nyata (FR-10) | Minimal satu langkah untuk mengirim; konfirmasi lokal + animasi Butterfly Bloom |
| Checklist aksi | Enam langkah, tersimpan di `localStorage` (`rotw.checklist.v1`) |

### Fitur gamifikasi (PRD v0.4)

| Fitur | Perilaku |
|---|---|
| Sakelar habitat | Mulai nonaktif; setiap sakelar punya kata status ("Aktif"/"Nonaktif") dan catatan yang berubah |
| Popup keberhasilan | Muncul setiap kali keempat elemen aktif, dengan pesan dari PRD |
| Animasi kupu-kupu | Tiga kupu-kupu melintas saat habitat lengkap; 18 kupu-kupu naik dan memudar saat komitmen dikirim |
| Kursor kupu-kupu | Hanya untuk penunjuk presisi; bisa dinyalakan/dimatikan; disimpan di `localStorage` |
| Alternatif sentuh | Tombol "Terbangkan kupu-kupu" di perangkat sentuh, menggantikan kursor |
| Sayap sempurna | Terbuka hanya bila skor kuis 5/5 |
| Butterfly Bloom | 18 kupu-kupu dari bawah layar, menyebar, memudar, lalu membersihkan dirinya |
| Pengurangan gerak | Semua animasi hadiah dilewati; dialog dan teks konfirmasi tetap muncul |

Semua hadiah dan progres disimpan di peramban ini saja (`rotw.habitat.v1`, `rotw.rewards.v1`,
`rotw.checklist.v1`, `rotw.commit.v1`) dan tidak tersinkron antarperangkat.

Kuis dan checklist bekerja tanpa penyimpanan (mode privat tetap berfungsi; pilihan hanya
tidak bertahan setelah muat ulang).

## Aksesibilitas

- Target WCAG 2.2 AA. Semua teks memakai `--leaf-ink` (#3C6A44) atau lebih gelap di atas krem:
  kontras ≥ 5.5:1. Hijau palet asli (#477A50) dipakai untuk garis, ikon, dan diagram.
- `prefers-reduced-motion` menonaktifkan semua transisi dan entrance.
- Tanpa JavaScript, seluruh isi tetap terlihat (kelas `.js` yang mengaktifkan animasi
  dipasang oleh skrip inline).
- Skip link memindahkan fokus ke `<main>`, landmark semantik, fokus terlihat, target sentuh ≥ 44px.
- Umpan balik kuis tidak bergantung pada warna: ikon + label "Benar" / "Belum tepat".
- Setiap sakelar habitat punya kata status, bukan hanya posisi dan warna.
- Hadiah kursor tidak pernah wajib: kursor standar dan navigasi papan tunas tetap berfungsi.
- Animasi hadiah berada di lapisan `pointer-events: none` dan tidak menghalangi interaksi.

## Gambar

Semua foto dari Wikimedia Commons, diperkecil ke WebP, dengan atribusi dan lisensi
di footer halaman dan di setiap pelat. Tidak ada gambar tanpa kredit.

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

Rentang waktu tiap tahap siklus bersifat umum dan berbeda menurut spesies, ketinggian,
dan musim. Klaim tentang penurunan populasi diperlakukan sebagai hipotesis kampanye,
bukan temuan ilmiah — lihat catatan di Vitrin 05.
