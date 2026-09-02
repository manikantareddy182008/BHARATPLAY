from flask import Flask, render_template, request

app = Flask(__name__)


# HOME
@app.route("/")
def home():
    return render_template("index.html")


# GAME LIBRARY
@app.route("/library")
def library():
    return render_template("library.html")


# THE LOST SEAL - 3D GAME
@app.route("/game/lost-seal")
def lost_seal():
    return render_template("game.html")


# LEADERBOARD
@app.route("/leaderboard")
def leaderboard():

    score = int(request.args.get("score", 0))

    players = [
        ("Arjun", 120),
        ("Meera", 105),
        ("Rahul", 95),
        ("Ananya", 80),
        ("Kiran", 75)
    ]

    rank = 1

    for name, points in players:
        if score < points:
            rank += 1

    return render_template(
        "leaderboard.html",
        score=score,
        rank=rank,
        players=players
    )


if __name__ == "__main__":
    app.run(debug=True)
