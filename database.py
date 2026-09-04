import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

DATABASE = "bharatplay.db"


def get_db():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():

    connection = get_db()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            points INTEGER DEFAULT 0
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            game TEXT NOT NULL,
            points INTEGER NOT NULL
        )
    """)

    connection.commit()
    connection.close()


def create_user(username, password):

    connection = get_db()

    try:
        hashed_password = generate_password_hash(password)

        connection.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, hashed_password)
        )

        connection.commit()

        return True

    except sqlite3.IntegrityError:

        return False

    finally:

        connection.close()


def verify_user(username, password):

    connection = get_db()

    user = connection.execute(
        "SELECT * FROM users WHERE username = ?",
        (username,)
    ).fetchone()

    connection.close()

    if user and check_password_hash(user["password"], password):
        return user

    return None


def add_score(username, game, points):

    connection = get_db()

    connection.execute(
        "INSERT INTO scores (username, game, points) VALUES (?, ?, ?)",
        (username, game, points)
    )

    connection.execute(
        "UPDATE users SET points = points + ? WHERE username = ?",
        (points, username)
    )

    connection.commit()
    connection.close()


def get_leaderboard():

    connection = get_db()

    players = connection.execute("""
        SELECT username, points
        FROM users
        ORDER BY points DESC
        LIMIT 20
    """).fetchall()

    connection.close()

    return players
