DATA_MAHASISWA = [
    {
        "nama": "chesya margaretha",
        "nim": "124140098",
        "nilai_uts": 98,
        "nilai_uas": 99,
        "nilai_tugas": 100,
    },
    {
        "nama": "faiz ashfaq",
        "nim": "124140144",
        "nilai_uts": 98,
        "nilai_uas": 98,
        "nilai_tugas": 100,
    },
    {
        "nama": "ramanda zoldyk",
        "nim": "124140170",
        "nilai_uts": 98,
        "nilai_uas": 97,
        "nilai_tugas": 100,
    },
    {
        "nama": "jelita siregar",
        "nim": "124140056",
        "nilai_uts": 98,
        "nilai_uas": 96,
        "nilai_tugas": 100,
    },
    {
        "nama": "alya nazwa",
        "nim": "124140225",
        "nilai_uts": 98,
        "nilai_uas": 95,
        "nilai_tugas": 100,
    },
]


def hitung_nilai_akhir(mahasiswa: dict) -> float:
    """Hitung nilai akhir berbobot 30% UTS, 40% UAS, dan 30% tugas."""
    return (
        0.30 * mahasiswa["nilai_uts"]
        + 0.40 * mahasiswa["nilai_uas"]
        + 0.30 * mahasiswa["nilai_tugas"]
    )

def tentukan_grade(nilai_akhir: float) -> str:
    """Petakan nilai akhir ke grade A-E."""
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    else:
        return "E"

def tampilkan_tabel(data: list) -> None:
    """Tampilkan data mahasiswa dalam format tabel yang rapi."""
    lebar_nama = max(len("Nama"), max(len(m["nama"]) for m in data))
    lebar_nim = max(len("NIM"), max(len(m["nim"]) for m in data))
    lebar_nilai = len("Nilai Akhir")

    header = (
        f"{'Nama':<{lebar_nama}}  "
        f"{'NIM':<{lebar_nim}}  "
        f"{'Nilai Akhir':>{lebar_nilai}}  "
        f"{'Grade':<5}"
    )
    print(header)
    print("-" * len(header))

    for mahasiswa in data:
        akhir = hitung_nilai_akhir(mahasiswa)
        grade = tentukan_grade(akhir)
        print(
            f"{mahasiswa['nama']:<{lebar_nama}}  "
            f"{mahasiswa['nim']:<{lebar_nim}}  "
            f"{akhir:>{lebar_nilai}.2f}  "
            f"{grade:<5}"
        )

def tampilkan_tertinggi_terendah(data: list) -> None:
    """Tampilkan mahasiswa dengan nilai akhir tertinggi dan terendah."""
    tertinggi = max(data, key=hitung_nilai_akhir)
    terendah = min(data, key=hitung_nilai_akhir)

    akhir_tertinggi = hitung_nilai_akhir(tertinggi)
    akhir_terendah = hitung_nilai_akhir(terendah)

    print("Nilai akhir tertinggi : "
          f"{tertinggi['nama']} ({tertinggi['nim']}) = "
          f"{akhir_tertinggi:.2f} (Grade {tentukan_grade(akhir_tertinggi)})")
    print("Nilai akhir terendah  : "
          f"{terendah['nama']} ({terendah['nim']}) = "
          f"{akhir_terendah:.2f} (Grade {tentukan_grade(akhir_terendah)})")

def main() -> None:
    """Jalankan program pengelolaan data nilai mahasiswa."""
    print("=" * 62)
    print("PROGRAM PENGELOLAAN DATA NILAI MAHASISWA".center(62))
    print("=" * 62)
    print()

    tampilkan_tabel(DATA_MAHASISWA)

    print()
    tampilkan_tertinggi_terendah(DATA_MAHASISWA)
    print("=" * 62)

if __name__ == "__main__":
    main()
