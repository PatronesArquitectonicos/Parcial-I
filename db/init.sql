-- Inicialización de la base de datos de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    producto VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_total DOUBLE PRECISION NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Datos de ejemplo
INSERT INTO pedidos (cliente, producto, cantidad, precio_total, estado)
VALUES
    ('Juan Pérez', 'Laptop Dell XPS', 1, 2500000.00, 'PENDIENTE'),
    ('María García', 'Monitor LG 27"', 2, 1800000.00, 'EN_PROCESO'),
    ('Carlos López', 'Teclado Mecánico', 3, 450000.00, 'COMPLETADO');
