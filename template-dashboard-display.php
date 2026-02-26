<?php
/**
 * Template Name: Dashboard Display Template
 * Description: Full width template untuk menampilkan Dashboard Pidana Umum
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title('|', true, 'right'); ?> <?php bloginfo('name'); ?></title>
    <?php wp_head(); ?>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        #dashboard-container {
            width: 100vw;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
        }
        #dashboard-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        .loading-screen {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            font-family: Arial, sans-serif;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #1a4d2e;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div id="dashboard-container">
        <div class="loading-screen" id="loading">
            <div class="spinner"></div>
            <p>Memuat Dashboard...</p>
        </div>
        <iframe 
            id="dashboard-iframe"
            src="https://daskrimti73-cmd.github.io/Dasboard-Pidum/display.html"
            title="Dashboard Pidana Umum Kejaksaan Tinggi Kepulauan Riau"
            onload="document.getElementById('loading').style.display='none'">
        </iframe>
    </div>
    <?php wp_footer(); ?>
</body>
</html>
