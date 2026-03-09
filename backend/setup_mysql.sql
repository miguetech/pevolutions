-- Script de configuración de MySQL para PEvolutions
-- Ejecutar como root: mysql -u root -p < setup_mysql.sql

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS pevolutions_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario
CREATE USER IF NOT EXISTS 'pevolutions_user'@'localhost' IDENTIFIED BY 'pevolutions_password';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON pevolutions_db.* TO 'pevolutions_user'@'localhost';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Mostrar confirmación
SELECT 'Base de datos y usuario creados exitosamente!' AS Status;
