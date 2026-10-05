// Array untuk menyimpan data barang di keranjang.
let keranjang = [];
let totalAkhir = 0;

// Ambil form dan input barang dari halaman.
let formBarang = document.getElementById("form-barang");
let namaBarang = document.getElementById("nama-barang");
let hargaBarang = document.getElementById("harga-barang");
let qtyBarang = document.getElementById("qty-barang");
let errorNama = document.getElementById("error-nama");
let errorHarga = document.getElementById("error-harga");
let errorQty = document.getElementById("error-qty");
let pesanKeranjangKosong = document.getElementById("keranjang-kosong");
let uangBayarInput = document.getElementById("uang-bayar");
let hasilKembalian = document.getElementById("hasil-kembalian");
let tombolProsesPembayaran = document.querySelector(".aksi-transaksi .tombol-utama");
let tombolResetTransaksi = document.getElementById("reset-transaksi");

// Ubah angka menjadi format Rupiah sederhana.
function formatRupiah(angka) {
	return "Rp " + angka.toLocaleString("id-ID");
}

// Format nilai input dan ubah kembali nominal berformat menjadi angka.
function formatInputRupiah(nilai) {
	let angka = nilai.replace(/\D/g, "");
	if (angka === "") {
		return "";
	}
	return formatRupiah(Number(angka));
}

function ambilAngkaRupiah(nilai) {
	let nilaiBersih = nilai.replace("Rp ", "").replace(/\./g, "");
	return Number(nilaiBersih);
}

// Gunakan input teks agar simbol Rupiah dapat ditampilkan.
hargaBarang.type = "text";
hargaBarang.inputMode = "numeric";
uangBayarInput.type = "text";
uangBayarInput.inputMode = "numeric";

hargaBarang.addEventListener("input", function() {
	hargaBarang.value = formatInputRupiah(hargaBarang.value);
});

uangBayarInput.addEventListener("input", function() {
	uangBayarInput.value = formatInputRupiah(uangBayarInput.value);
});

// Hitung seluruh subtotal dan perbarui ringkasan transaksi.
function hitungTotal() {
	let totalBelanja = 0;

	for (let i = 0; i < keranjang.length; i++) {
		totalBelanja += keranjang[i].harga * keranjang[i].qty;
	}

	let jumlahDiskon;
	if (totalBelanja >= 50000) {
		jumlahDiskon = totalBelanja * 10 / 100;
	} else {
		jumlahDiskon = 0;
	}

	totalAkhir = totalBelanja - jumlahDiskon;
	document.getElementById("total-belanja").textContent = formatRupiah(totalBelanja);
	document.getElementById("jumlah-diskon").textContent = formatRupiah(jumlahDiskon);
	document.getElementById("total-akhir").textContent = formatRupiah(totalAkhir);
}

// Hapus barang, lalu perbarui tabel dan ringkasan transaksi.
function hapusBarang(index) {
	keranjang.splice(index, 1);
	localStorage.setItem("keranjang", JSON.stringify(keranjang));
	tampilkanKeranjang();
	hitungTotal();
}

// Tampilkan setiap barang dari array ke dalam tabel keranjang.
function tampilkanKeranjang() {
	let tabelKeranjang = document.getElementById("tabel-keranjang");
	tabelKeranjang.innerHTML = "";

	for (let i = 0; i < keranjang.length; i++) {
		let barang = keranjang[i];
		let subtotal = barang.harga * barang.qty;
		let baris = document.createElement("tr");
		let nilaiKolom = [
			i + 1,
			barang.nama,
			formatRupiah(barang.harga),
			barang.qty,
			formatRupiah(subtotal)
		];

		for (let j = 0; j < nilaiKolom.length; j++) {
			let kolom = document.createElement("td");
			kolom.textContent = nilaiKolom[j];
			baris.appendChild(kolom);
		}

		let kolomAksi = document.createElement("td");
		let tombolHapus = document.createElement("button");
		tombolHapus.type = "button";
		tombolHapus.className = "tombol tombol-sekunder";
		tombolHapus.textContent = "Hapus";
		tombolHapus.addEventListener("click", function() {
			hapusBarang(i);
		});
		kolomAksi.appendChild(tombolHapus);
		baris.appendChild(kolomAksi);
		tabelKeranjang.appendChild(baris);
	}

	pesanKeranjangKosong.style.display = keranjang.length === 0 ? "block" : "none";
}

// Muat keranjang tersimpan, lalu tampilkan nilai awal dengan format Rupiah.
let dataTersimpan = localStorage.getItem("keranjang");
if (dataTersimpan) {
	keranjang = JSON.parse(dataTersimpan);
}
tampilkanKeranjang();
hitungTotal();
hasilKembalian.textContent = formatRupiah(0);

// Tampilkan data barang saat form dikirim.
formBarang.addEventListener("submit", function(event) {
	event.preventDefault();

	let valid = true;
	let harga = ambilAngkaRupiah(hargaBarang.value);
	let qty = Number(qtyBarang.value);

	if (namaBarang.value.trim().length < 3) {
		errorNama.textContent = "Nama barang minimal 3 karakter.";
		valid = false;
	} else {
		errorNama.textContent = "";
	}

	if (harga <= 500) {
		errorHarga.textContent = "Harga harus lebih dari Rp 500.";
		valid = false;
	} else {
		errorHarga.textContent = "";
	}

	if (qty < 1) {
		errorQty.textContent = "Jumlah minimal 1.";
		valid = false;
	} else {
		errorQty.textContent = "";
	}

	if (valid) {
		let barang = {
			nama: namaBarang.value,
			harga: harga,
			qty: qty
		};

		// Simpan barang valid, perbarui tabel, dan kosongkan form.
		keranjang.push(barang);
		localStorage.setItem("keranjang", JSON.stringify(keranjang));
		tampilkanKeranjang();
		hitungTotal();
		formBarang.reset();
		console.log(barang);
	}
});

// Hitung dan tampilkan kembalian saat pembayaran diproses.
tombolProsesPembayaran.addEventListener("click", function() {
	let nilaiUangBayar = uangBayarInput.value.trim();

	if (nilaiUangBayar === "") {
		hasilKembalian.textContent = "Masukkan uang pembayaran.";
		return;
	}

	let uangBayar = ambilAngkaRupiah(nilaiUangBayar);
	if (!Number.isFinite(uangBayar) || uangBayar < 0) {
		hasilKembalian.textContent = "Masukkan jumlah uang pembayaran.";
		return;
	}

	if (uangBayar < totalAkhir) {
		let kekurangan = totalAkhir - uangBayar;
		hasilKembalian.textContent = "Uang pembayaran kurang " + formatRupiah(kekurangan) + ".";
	} else if (uangBayar === totalAkhir) {
		hasilKembalian.textContent = "Pembayaran pas.";
	} else {
		let kembalian = uangBayar - totalAkhir;
		hasilKembalian.textContent = formatRupiah(kembalian);
	}
});

// Kembalikan aplikasi ke kondisi transaksi baru.
tombolResetTransaksi.addEventListener("click", function() {
	keranjang = [];
	localStorage.removeItem("keranjang");
	tampilkanKeranjang();
	hitungTotal();

	namaBarang.value = "";
	hargaBarang.value = "";
	qtyBarang.value = "";
	uangBayarInput.value = "";
	errorNama.textContent = "";
	errorHarga.textContent = "";
	errorQty.textContent = "";
	hasilKembalian.textContent = "";
});
