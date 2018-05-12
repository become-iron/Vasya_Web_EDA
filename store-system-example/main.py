import sqlite3

from flask import Flask, jsonify, request

cursor = None
app = Flask(__name__)


class HTTPCodes:
    SUCCESS = 200
    NOT_FOUND = 404


@app.route('/libraries', methods=['GET'])
def get_libraries():
    cursor.execute('SELECT * FROM libraries')
    libraries = cursor.fetchall()
    return jsonify(libraries), HTTPCodes.SUCCESS


@app.route('/libraries/<library_id>', methods=['GET'])
def get_library(library_id):
    cursor.execute('SELECT * FROM libraries WHERE id=?', (library_id,))
    library = cursor.fetchone()

    if library is None:
        return jsonify(dict('No library with this ID')), HTTPCodes.NOT_FOUND
    else:
        return jsonify(library), HTTPCodes.SUCCESS


@app.route('/libraries', methods=['POST'])
def add_library():
    library = request.get_json()
    library = [library['id'], library['name'], library['description'], str(library['components'])]
    sql_query = 'INSERT INTO libraries (id, name, description, components) VALUES (?, ?, ?, ?)'
    cursor.execute(sql_query, library)
    return jsonify({}), HTTPCodes.SUCCESS


@app.route('/libraries/<library_id>', methods=['PUT'])
def update_library(library_id):
    library = request.get_json()
    library = [library['name'], library['description'], str(library['components']), library_id]
    sql_query = 'UPDATE libraries SET id=?, name=?, description=?, components=? WHERE id=?'
    cursor.execute(sql_query, library)
    return jsonify({}), HTTPCodes.SUCCESS


@app.route('/libraries/<library_id>', methods=['DELETE'])
def delete_library(library_id):
    sql_query = 'DELETE FROM libraries WHERE id=?'
    cursor.execute(sql_query, (library_id,))
    return jsonify({}), HTTPCodes.SUCCESS


if __name__ == '__main__':
    connection = sqlite3.connect('db.sqlite')
    cursor = connection.cursor()
    app.run(debug=True)
    connection.close()
