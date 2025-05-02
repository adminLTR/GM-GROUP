from flask import Flask
from routes import register_blueprints
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()
register_blueprints(app)

if __name__ == '__main__':
    app.run(debug=True)
