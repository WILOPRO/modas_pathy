from app import app, db, User

if __name__ == '__main__':
    with app.app_context():
        # Asegúrate de que la BD y las tablas existen
        db.create_all()
        # Comprueba si ya existe el usuario 'admin'
        if not User.query.filter_by(username='admin').first():
            # Cambia '1234' por la contraseña que prefieras
            admin = User(username='admin', password='1234')
            db.session.add(admin)
            db.session.commit()
            print("✅ Usuario creado: admin / 1234")
        else:
            print("⚠️ El usuario 'admin' ya existe.")
