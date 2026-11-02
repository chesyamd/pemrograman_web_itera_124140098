def hitung_bmi(bb: float, tb: float) -> float:
    """Hitung nilai BMI dari berat (kg) dan tinggi (m)."""
    return bb / (tb * tb)

def kategori_bmi(bmi: float) -> str:
    """Tentukan kategori status berat badan berdasarkan nilai BMI."""
    if bmi < 18.5:
        return "Berat badan kurang"
    elif bmi < 25:
        return "Berat badan normal"
    elif bmi < 30:
        return "Berat badan berlebih"
    else:
        return "Obesitas"

def main() -> None:
    """Jalankan program penghitung BMI secara interaktif."""
    print("=" * 44)
    print("PROGRAM PENGHITUNG BMI".center(44))
    print("=" * 44)

    bb = float(input("Berat badan (kg) : "))
    tb = float(input("Tinggi badan (m) : "))

    bmi = hitung_bmi(bb, tb)
    kategori = kategori_bmi(bmi)

    print("-" * 44)
    print(f"BMI      : {bmi:.2f}")
    print(f"Kategori : {kategori}")
    print("-" * 44)

if __name__ == "__main__":
    main()
