import sqlite3

from flask import Flask, render_template, request, redirect, jsonify, abort
from datetime import datetime
import os

app = Flask(__name__)


@app.before_request
def auth():
    if request.headers.get('Authorization') == os.getenv('seckey'):
        return None
    else:
        abort(403)


@app.route('/api/add', methods=['POST'])
def add():
    data = request.get_json()
    # print(data)
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    c.execute("INSERT INTO reading_list (title, url) VALUES (?, ?)",
              (data['title'], data['url']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Data added successfully'})


@app.route('/dashboard')
def dashboard():
    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, title, url, strftime('%Y-%m-%d %H:%M:%S', create_time, '+8 hour'), status FROM reading_list ORDER BY create_time DESC")
    rows = cursor.fetchall()
    conn.close()

    data = {}
    for row in rows:
        record = {
            'id': row[0],
            'status': row[4],
            'title': row[1],
            'url': row[2],
            'create_time': datetime.strptime(row[3], "%Y-%m-%d %H:%M:%S")
        }
        create_time = record['create_time'].strftime("%m%d")
        if create_time not in data:
            data[create_time] = []
        data[create_time].append(record)
        # print(data)

    return render_template('dashboard.html', data=data, seckey=request.headers.get('Authorization'))


@app.route('/sync/<int:id>/<int:status>')
def sync_status(id, status):
    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE reading_list SET status=? WHERE id=?", (status, id))
    conn.commit()
    conn.close()

    return redirect('/dashboard')


@app.route('/delete/<int:id>')
def delete_record(id):
    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM reading_list WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return redirect('/dashboard')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=10393)
