<?php
// Cargar variables de entorno desde el archivo .env_qr
if (file_exists(__DIR__ . '/.env_qr')) {
    $env = parse_ini_file(__DIR__ . '/.env_qr');
    $host = $env['DB_HOST'];
    $db = $env['DB_NAME'];
    $user = $env['DB_USER'];
    $pass = $env['DB_PASS'];
	$charset = 'utf8mb4';
} else {
    die("Error: El archivo env no se encuentra.");
}

// Conexión PDO
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Obtener todos los registros con el campo ga_params
    $stmt = $pdo->query("SELECT id, ga_params FROM qr_codes");

    while ($row = $stmt->fetch()) {
        $id = $row['id'];
        $gaParams = json_decode($row['ga_params'], true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            echo "Error al decodificar JSON para ID $id\n";
            continue;
        }

        $newParams = [];

        foreach ($gaParams as $key => $value) {
            // Si empieza con utm_, reemplazar por shorturl_
            if (strpos($key, 'utm_') === 0) {
                $newKey = str_replace('utm_', 'shorturl_', $key);
            }
            // Si es page_type, cambiar a shorturl_page_type
            elseif ($key === 'page_type') {
                $newKey = 'shorturl_page_type';
            }
            // Dejar todo lo demás igual
            else {
                $newKey = $key;
            }

            $newParams[$newKey] = $value;
        }

        // Guardar de nuevo en la base de datos
        $jsonUpdated = json_encode($newParams, JSON_UNESCAPED_UNICODE);

        $update = $pdo->prepare("UPDATE qr_codes SET ga_params = :json WHERE id = :id");
        $update->execute([':json' => $jsonUpdated, ':id' => $id]);

        echo "Actualizado registro ID $id\n";
    }

    echo "✅ Proceso terminado.\n";

} catch (PDOException $e) {
    echo "Error en la conexión o ejecución: " . $e->getMessage();
}
?>
