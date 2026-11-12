import argparse
import sys
from datetime import date

from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError

from .. import models


def setup_models(dbsession):
    """Menambahkan data awal (seeding) mahasiswa dan matakuliah ke database.

    Bersifat idempoten: data yang sudah ada (dicocokkan lewat nim / kode_mk)
    tidak akan dimasukkan ulang, sehingga skrip ini aman dijalankan berkali-kali.
    """
    seed_mahasiswa = [
        dict(
            nim='124140098',
            nama='Chesya Margaretha Deto',
            jurusan='Teknik Informatika',
            tanggal_lahir=date(2005, 3, 17),
            alamat='Bandar Lampung geser dikit'
        ),
        dict(
            nim='124140144',
            nama='Muhammad Faiz Ashfaq',
            jurusan='Teknik Informatika',
            tanggal_lahir=date(2005, 8, 22),
            alamat='Bandar Lampung Ujung'
        ),
    ]
    for data in seed_mahasiswa:
        exists = dbsession.query(models.Mahasiswa).filter_by(nim=data['nim']).first()
        if exists is None:
            dbsession.add(models.Mahasiswa(**data))

    seed_matakuliah = [
        dict(kode_mk='IF2110', nama_mk='Pemrograman Web', sks=3, semester=3),
        dict(kode_mk='IF2241', nama_mk='Struktur Data', sks=3, semester=3),
        dict(kode_mk='IF3140', nama_mk='Basis Data', sks=4, semester=5),
        dict(kode_mk='IF4130', nama_mk='Kecerdasan Buatan', sks=3, semester=7),
    ]
    for data in seed_matakuliah:
        exists = dbsession.query(models.Matakuliah).filter_by(kode_mk=data['kode_mk']).first()
        if exists is None:
            dbsession.add(models.Matakuliah(**data))


def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'config_uri',
        help='Configuration file, e.g., development.ini',
    )
    return parser.parse_args(argv[1:])


def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    env = bootstrap(args.config_uri)

    try:
        with env['request'].tm:
            dbsession = env['request'].dbsession
            setup_models(dbsession)
            print("Berhasil memasukkan data seeding awal mahasiswa & matakuliah!")
    except OperationalError:
        print("Pyramid gagal terhubung ke database SQL.")
        print("Pastikan service PostgreSQL berjalan dan connection string di development.ini benar.")


if __name__ == '__main__':
    main()
