PI = 3.14159

def luas_persegi(sisi: float) -> float:
    return sisi * sisi

def keliling_persegi(sisi: float) -> float:
    return 4 * sisi

def luas_persegi_panjang(panjang: float, lebar: float) -> float:
    return panjang * lebar

def keliling_persegi_panjang(panjang: float, lebar: float) -> float:
    return 2 * (panjang + lebar)

def luas_lingkaran(jari_jari: float) -> float:
    return PI * jari_jari * jari_jari

def keliling_lingkaran(jari_jari: float) -> float:
    return 2 * PI * jari_jari

def celsius_ke_fahrenheit(celsius: float) -> float:
    return celsius * 9 / 5 + 32

def celsius_ke_kelvin(celsius: float) -> float:
    return celsius + 273.15
