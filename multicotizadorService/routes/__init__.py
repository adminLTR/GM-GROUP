from .san_cristobal import sc_bp
from .sura import sura_bp
from .sbi import sbi_bp

def register_blueprints(app):
    app.register_blueprint(sc_bp)
    app.register_blueprint(sura_bp)
    app.register_blueprint(sbi_bp)
