from app import app, db, User
from werkzeug.security import generate_password_hash

with app.app_context():
    if not User.query.filter_by(username='superadmin').first():
        user = User(
            username='superadmin',
            name='Super Administrador',
            password=generate_password_hash('1234'),  # ← HASH AQUÍ
            is_superadmin=True
        )
        db.session.add(user)
        db.session.commit()
        print("✅ Superadmin creado correctamente (con hash).")
    else:
        print("Ya existe un superadmin.")
