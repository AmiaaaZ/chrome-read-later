import os
import sqlite3
from datetime import datetime

from flask import Flask, render_template, request, redirect, jsonify, abort, session

app = Flask(__name__)
app.secret_key = os.getenv('seckey')


@app.before_request
def auth():
    if session.get('login') == 'true' or request.headers.get('Authorization') == os.getenv('seckey'):
        return None
    elif request.args.get('seckey') == os.getenv('seckey'):
        session['login'] = 'true'
        return None
    else:
        abort(403)


@app.route('/add', methods=['POST'])
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

    data = {}
    for row in rows:
        record = {
            'id': row[0],
            'status': row[4],
            'title': row[1],
            'url': row[2],
            'create_time': datetime.strptime(row[3], "%Y-%m-%d %H:%M:%S")
        }
        create_time = record['create_time'].strftime("%m%d%y")
        if create_time not in data:
            data[create_time] = []
        data[create_time].append(record)
        # print(data)

    cursor.execute(
        "SELECT SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS count_status_1, COUNT(*) AS count_total FROM reading_list")
    count = cursor.fetchone()
    count = f'{count[0]}/{count[1]}'
    conn.close()
    return render_template('dashboard.html', data=data, count=count)


@app.route("/")
def index():
    return redirect("/dashboard")


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


@app.route('/add-note', methods=['POST'])
def add_note():
    data = request.get_json()
    content = data['content']

    if content:
        conn = sqlite3.connect('data.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('INSERT INTO quick_notes (content) VALUES (?)', (content,))
        conn.commit()
        conn.close()
        return jsonify({'status': 'success', 'message': 'Note added successfully.'}), 200
    return jsonify({'status': 'error', 'message': 'No content provided.'}), 400


@app.route('/get-notes', methods=['GET'])
def get_notes():
    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, content, strftime('%Y-%m-%d %H:%M:%S', create_time, '+8 hour'), status FROM quick_notes ORDER BY create_time DESC")
    rows = cursor.fetchall()
    conn.close()

    data = []
    for row in rows:
        record = {
            'id': row[0],
            'status': row[3],
            'content': row[1],
            'create_time': datetime.strptime(row[2], "%Y-%m-%d %H:%M:%S").strftime("%d%m%y")
        }
        data.append(record)

    return jsonify(data)


if __name__ == '__main__':
    if not os.path.isfile("data.db"):
        conn = sqlite3.connect('data.db')
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS reading_list (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            title TEXT,
                            url TEXT UNIQUE,
                            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            status BOOLEAN DEFAULT 0
                        )''')
        conn.commit()
        conn.close()
    app.run(host="0.0.0.0", port=10393)
