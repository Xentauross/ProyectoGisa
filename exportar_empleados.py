import pandas as pd
import pymysql

# Conexión a la base de datos
conexion = pymysql.connect(
    host     = '127.0.0.1',
    port     = 3306,
    user     = 'root',
    password = 'root',
    database = 'gisa',
    charset  = 'utf8mb4',
)

# Consulta de empleados
query = """
    SELECT
        CONCAT(p.nombre, ' ', p.apellido1, ' ', COALESCE(p.apellido2, '')) AS 'Nombre completo',
        p.dni                  AS 'DNI',
        p.telefono             AS 'Teléfono',
        p.num_seguridad_social AS 'Nº Seg. Social',
        p.localidad            AS 'Localidad',
        p.fecha_nacimiento     AS 'Fecha nacimiento',
        u.email                AS 'Email'
    FROM perfiles p
    LEFT JOIN users u ON u.id = p.user_id
    ORDER BY p.nombre
"""

df = pd.read_sql(query, conexion)
conexion.close()

# Exportar a Excel
df.to_excel('empleados.xlsx', index=False)
print("Archivo 'empleados.xlsx' generado correctamente.")
