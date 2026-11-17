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
assets/js/main.js          # navigasi, scroll-spy, stepper siklus, rencana taman, kuis, checklist
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
| Rencana taman | Empat lapisan bisa dimatikan; catatan menjelaskan akibatnya |
| Kuis | Lima pertanyaan, umpan balik teks + ikon, skor, ulangi |
| Checklist aksi | Enam langkah, tersimpan di `localStorage` (`rotw.checklist.v1`) |

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
