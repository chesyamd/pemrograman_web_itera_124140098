import math_operations as modul
from math_operations import PI, celsius_ke_fahrenheit, celsius_ke_kelvin

def tampilkan_bangun_datar() -> None:
    """Tampilkan luas dan keliling tiga bangun datar."""
    print("A. BANGUN DATAR")
    print("-" * 46)

    bangun = [
        ("Persegi", "sisi = 8",
         modul.luas_persegi(8), modul.keliling_persegi(8)),
        ("Persegi panjang", "panjang = 20, lebar = 15",
         modul.luas_persegi_panjang(20, 15), modul.keliling_persegi_panjang(20, 15)),
        ("Lingkaran", "jari-jari = 14",
         modul.luas_lingkaran(14), modul.keliling_lingkaran(14)),
    ]

    for nama, parameter, luas, keliling in bangun:
        print(f"{nama} ({parameter})")
        print(f"  Luas     : {luas:.2f}")
        print(f"  Keliling : {keliling:.2f}")
        print()

def tampilkan_konversi_suhu() -> None:
    """Tampilkan konversi Celsius ke Fahrenheit dan Kelvin."""
    print("B. KONVERSI SUHU")
    print("-" * 46)
    print(f"{'Celsius':>8}  {'Fahrenheit':>12}  {'Kelvin':>8}")
    print("-" * 46)

    for celsius in [0, 25, 37, 100]:
        fahrenheit = celsius_ke_fahrenheit(celsius)
        kelvin = celsius_ke_kelvin(celsius)
        print(f"{celsius:>8}  {fahrenheit:>12.2f}  {kelvin:>8.2f}")

    print()


def tampilkan_konstanta() -> None:
    """Tampilkan konstanta PI dari modul."""
    print("C. KONSTANTA")
    print("-" * 46)
    print(f"PI = {PI}")
    print()


def main() -> None:
    """Jalankan program utama modul matematika."""
    print("=" * 46)
    print("MODUL MATEMATIKA".center(46))
    print("=" * 46)
    print()

    tampilkan_bangun_datar()
    tampilkan_konversi_suhu()
    tampilkan_konstanta()


if __name__ == "__main__":
    main()
