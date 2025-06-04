<?php
// Cargar variables de entorno desde el archivo .env_qr
if (file_exists(__DIR__ . '/.env_qr')) {
    $env = parse_ini_file(__DIR__ . '/.env_qr');
    $host = $env['DB_HOST'];
    $dbname = $env['DB_NAME'];
    $username = $env['DB_USER'];
    $password = $env['DB_PASS'];
} else {
    die("Error: El archivo env no se encuentra.");
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Función para sanitizar y validar el código QR
function sanitize_code($code) {
    if (preg_match('/^[a-zA-Z0-9]+$/', $code)) {
        return htmlspecialchars($code, ENT_QUOTES, 'UTF-8');
    }
    return false;
}

// Iniciar sesión para persistencia del client_id
session_start();

// Función para validar y generar client_id
function get_or_create_client_id() {
    // Patrón que deben seguir los client_id (client_ + alfanumérico)
    $client_id_pattern = '/^client_[a-zA-Z0-9]{14,}$/';
    
    // Verificar y validar client_id de la sesión
    if (isset($_SESSION['ga_client_id']) && preg_match($client_id_pattern, $_SESSION['ga_client_id'])) {
        return $_SESSION['ga_client_id'];
    }
    
    // Verificar y validar client_id de la cookie
    if (isset($_COOKIE['ga_client_id']) && preg_match($client_id_pattern, $_COOKIE['ga_client_id'])) {
        $_SESSION['ga_client_id'] = $_COOKIE['ga_client_id'];
        return $_COOKIE['ga_client_id'];
    }
    
    // Generar nuevo client_id si no existe o no es válido
    $new_client_id = 'client_' . bin2hex(random_bytes(7)); // Más seguro que uniqid()
    
    // Almacenar en sesión y cookie
    $_SESSION['ga_client_id'] = $new_client_id;
    setcookie('ga_client_id', $new_client_id, [
        'expires' => time() + 31536000, // 1 año
        'path' => '/',
        'secure' => true, // Solo en HTTPS
        'httponly' => true, // No accesible desde JS
        'samesite' => 'Lax' // Protección CSRF
    ]);
    
    return $new_client_id;
}

// Obtener el código QR desde la URL
if (isset($_GET['code'])) {
    $code = sanitize_code($_GET['code']);

    if (!$code) {
        header("Location: /");
        exit();
    }

    // Consultar la base de datos
    $stmt = $pdo->prepare("SELECT * FROM qr_codes WHERE code = :code AND status = :status LIMIT 1");
    $stmt->execute([
        'code' => $code,
        'status' => 1
    ]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        $qr_code_id = $row['id'];
        $ga_tracking_id = $row['ga_tracking_id'];
        $api_secret = $row['api_secret'];
        
        // Obtener client_id validado
        $client_id = get_or_create_client_id();
        $ga_params = json_decode($row['ga_params'], true);

        $payload = [
            'client_id' => $client_id,
            'events' => [
                [
                    'name' => $row['event_name'],
                    'params' => array_merge($ga_params, [
                        'shorturl_pagina_destino' => $row['url'],
                        'shorturl_qr_code' => $code,
                        'engagement_time_msec' => '1000' // Añadir tiempo de engagement
                    ])
                ]
            ]
        ];

        // Debug mode: permite marcar eventos para pruebas cuando se añade ?debug=true a la URL
        // Estos eventos pueden filtrarse en GA4 usando el parámetro 'debug' == true
        $debugMode = isset($_GET['debug']) && in_array(strtolower($_GET['debug']), ['1', 'true', 'yes', 'si', 'on'], true);
        if ($debugMode) {
            $payload['events'][0]['params']['debug_mode'] = true;
        }

        

        $endpoint = "https://www.google-analytics.com/mp/collect?measurement_id=$ga_tracking_id&api_secret=$api_secret";
        $user_agent = $_SERVER['HTTP_USER_AGENT'];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $endpoint);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'User-Agent: ' . $user_agent
        ]);

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($http_code != 204) {
            $stmt = $pdo->prepare("INSERT INTO ga_errors (qr_code_id, error_message) VALUES (:qr_code_id, :error_message)");
            $stmt->execute([
                'qr_code_id' => $qr_code_id,
                'error_message' => "Error HTTP: $http_code, Respuesta: $response"
            ]);
        }

        header("Location: " . $row['url']);
        exit();
    } else {
        header("Location: /");
        exit();
    }
} else {
    header("Location: /");
    exit();
}
?>