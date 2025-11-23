import sqlite3

db_path = 'modas_pathy.db'
conn = sqlite3.connect(db_path)
c = conn.cursor()

for col in ['is_new','is_trending','is_featured']:
    try:
        c.execute(f'''
            ALTER TABLE product
            ADD COLUMN {col} BOOLEAN NOT NULL DEFAULT 0;
        ''')
        print(f"Columna `{col}` añadida.")
    except Exception as e:
        print(f"skip `{col}`:", e)

conn.commit()
conn.close()
print("¡Migración de flags completada!")
