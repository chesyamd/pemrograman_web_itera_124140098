from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPNotFound,
    HTTPBadRequest,
)
from sqlalchemy.exc import IntegrityError

from ..models import Matakuliah

REQUIRED_FIELDS = ['kode_mk', 'nama_mk', 'sks', 'semester']


def _is_positive_integer(value):
    """Cek apakah value berupa integer (bukan bool) dan lebih dari nol."""
    return isinstance(value, int) and not isinstance(value, bool) and value > 0


def _validate_payload(json_data, require_all):
    """Validasi payload JSON matakuliah.

    Mengembalikan (data, error_response). Jika error_response bukan None,
    pemanggil harus langsung mengembalikan error_response tersebut.
    """
    errors = []

    fields = REQUIRED_FIELDS if require_all else [f for f in REQUIRED_FIELDS if f in json_data]

    for field in fields:
        if field not in json_data or json_data[field] is None or json_data[field] == '':
            errors.append(f'Field {field} wajib diisi!')

    if errors:
        return None, HTTPBadRequest(json_body={'error': ' '.join(errors)})

    data = {}
    for field in ('kode_mk', 'nama_mk'):
        if field in json_data:
            data[field] = str(json_data[field]).strip()
            if not data[field]:
                return None, HTTPBadRequest(json_body={'error': f'Field {field} wajib diisi!'})

    for field in ('sks', 'semester'):
        if field in json_data:
            value = json_data[field]
            if not _is_positive_integer(value):
                return None, HTTPBadRequest(
                    json_body={'error': f'Field {field} harus berupa bilangan bulat positif (minimal 1)!'}
                )
            data[field] = value

    return data, None


# 1. READ ALL: Menampilkan daftar seluruh matakuliah
@view_config(route_name='matakuliah_list', renderer='json')
def matakuliah_list(request):
    """View untuk mengambil semua data matakuliah"""
    dbsession = request.dbsession
    matakuliahs = dbsession.query(Matakuliah).order_by(Matakuliah.id.asc()).all()
    return {'matakuliahs': [m.to_dict() for m in matakuliahs]}


# 2. READ ONE: Menampilkan detail satu matakuliah berdasarkan ID
@view_config(route_name='matakuliah_detail', renderer='json')
def matakuliah_detail(request):
    """View untuk melihat detail satu matakuliah berdasarkan ID di URL"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']
    matakuliah = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()

    if matakuliah is None:
        return HTTPNotFound(json_body={'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'})

    return {'matakuliah': matakuliah.to_dict()}


# 3. CREATE: Menambahkan data matakuliah baru
@view_config(route_name='matakuliah_add', request_method='POST', renderer='json')
def matakuliah_add(request):
    """View untuk menambahkan matakuliah baru dari payload JSON"""
    try:
        json_data = request.json_body
    except Exception:
        return HTTPBadRequest(json_body={'error': 'Body request harus berupa JSON yang valid'})

    data, error = _validate_payload(json_data, require_all=True)
    if error is not None:
        return error

    matakuliah = Matakuliah(**data)

    dbsession = request.dbsession
    dbsession.add(matakuliah)
    try:
        # Flush untuk mengeksekusi INSERT dan mendapatkan id autoincrement
        dbsession.flush()
    except IntegrityError:
        return HTTPBadRequest(json_body={'error': f"Kode matakuliah '{data.get('kode_mk')}' sudah digunakan!"})

    return {'success': True, 'matakuliah': matakuliah.to_dict()}


# 4. UPDATE: Mengubah data matakuliah yang sudah ada
@view_config(route_name='matakuliah_update', request_method='PUT', renderer='json')
def matakuliah_update(request):
    """View untuk mengupdate data matakuliah berdasarkan ID"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']

    matakuliah = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    if matakuliah is None:
        return HTTPNotFound(json_body={'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'})

    try:
        json_data = request.json_body
    except Exception:
        return HTTPBadRequest(json_body={'error': 'Body request harus berupa JSON yang valid'})

    data, error = _validate_payload(json_data, require_all=False)
    if error is not None:
        return error

    for field, value in data.items():
        setattr(matakuliah, field, value)

    try:
        dbsession.flush()
    except IntegrityError:
        return HTTPBadRequest(json_body={'error': f"Kode matakuliah '{data.get('kode_mk')}' sudah digunakan!"})

    return {'success': True, 'matakuliah': matakuliah.to_dict()}


# 5. DELETE: Menghapus data matakuliah
@view_config(route_name='matakuliah_delete', request_method='DELETE', renderer='json')
def matakuliah_delete(request):
    """View untuk menghapus matakuliah berdasarkan ID"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']

    matakuliah = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    if matakuliah is None:
        return HTTPNotFound(json_body={'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'})

    dbsession.delete(matakuliah)

    return {'success': True, 'message': f'Matakuliah dengan ID {matakuliah_id} berhasil dihapus'}
