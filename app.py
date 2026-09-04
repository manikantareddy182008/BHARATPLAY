from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3
import os

app = Flask(__name__)
app.secret_key = "bharatplay-demo-secret-key"

DATABASE = "database/bharatplay.db"


# ---------------- DATABASE ----------------

def get_db():
    os.makedirs("database", exist_ok=True)
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    db = get_db()

    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    db.execute("""
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            game TEXT NOT NULL,
            points INTEGER NOT NULL
        )
    """)

    db.commit()
    db.close()


# ---------------- HOME / LOGIN ----------------

@app.route("/", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

        db = get_db()

        user = db.execute(
            "SELECT * FROM users WHERE username=? AND password=?",
            (username, password)
        ).fetchone()

        db.close()

        if user:
            session["username"] = username
            return redirect(url_for("library"))

        return render_template(
            "login.html",
            error="Invalid username or password"
        )

    return render_template("login.html")


# ---------------- REGISTER ----------------

@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

        if not username or not password:
            return render_template(
                "register.html",
                error="Please enter username and password."
            )

        db = get_db()

        try:

            db.execute(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                (username, password)
            )

            db.commit()
            db.close()

            return redirect(url_for("login"))

        except sqlite3.IntegrityError:

            db.close()

            return render_template(
                "register.html",
                error="Username already exists."
            )

    return render_template("register.html")


# ---------------- LOGOUT ----------------

@app.route("/logout")
def logout():

    session.clear()

    return redirect(url_for("login"))


# ---------------- GAME LIBRARY ----------------

@app.route("/library")
def library():

    if "username" not in session:
        return redirect(url_for("login"))

    return render_template(
        "library.html",
        username=session["username"]
    )


# ---------------- GAMES ----------------

@app.route("/game/<game_id>")
def game(game_id):

    if "username" not in session:
        return redirect(url_for("login"))

    games = {
        "lost-seal": {
            "title": "The Lost Seal",
            "subtitle": "Indus Valley Civilization",
            "description": "Explore an ancient settlement and uncover a mysterious seal."
        },

        "kings-messenger": {
            "title": "The King's Messenger",
            "subtitle": "Ancient India",
            "description": "Carry an important royal message across a dangerous ancient route."
        },

        "panchatantra": {
            "title": "Panchatantra: The Clever Choice",
            "subtitle": "Indian Storytelling Tradition",
            "description": "Make clever decisions and discover how your choices change the story."
        }
    }

    if game_id not in games:
        return redirect(url_for("library"))

    return render_template(
        "game.html",
        game_id=game_id,
        game=games[game_id],
        username=session["username"]
    )


# ---------------- SAVE SCORE ----------------

@app.route("/score", methods=["POST"])
def save_score():

    if "username" not in session:
        return redirect(url_for("login"))

    game = request.form.get("game", "Unknown")
    points = int(request.form.get("points", 0))

    db = get_db()

    db.execute(
        "INSERT INTO scores (username, game, points) VALUES (?, ?, ?)",
        (session["username"], game, points)
    )

    db.commit()
    db.close()

    return redirect(url_for("leaderboard"))


# ---------------- LEADERBOARD ----------------

@app.route("/leaderboard")
def leaderboard():

    if "username" not in session:
        return redirect(url_for("login"))

    db = get_db()

    players = db.execute("""
        SELECT username, SUM(points) AS points
        FROM scores
        GROUP BY username
        ORDER BY points DESC
        LIMIT 10
    """).fetchall()

    db.close()

    return render_template(
        "leaderboard.html",
        players=players,
        username=session["username"]
    )


# ---------------- START ----------------

init_db()

if __name__ == "__main__":
    app.run(debug=True)
