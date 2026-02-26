<?php
/**
 * Template Name: Dashboard Pidum (Full Width)
 * Description: Template khusus untuk menampilkan Dashboard Pidum full width tanpa sidebar
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title><?php wp_title('|', true, 'right'); ?> <?php bloginfo('name'); ?></title>
    
    <?php wp_head(); ?>
    
    <style>
        /* Reset WordPress default styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden;
        }
        
        #wpadminbar {
            display: none !important;
        }
        
        .dashboard-fullwidth-container {
            width: 100%;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
        }
        
        .dashboard-fullwidth-container iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
        }
        
        .dashboard-loading {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.3s ease;
        }
        
        .dashboard-loading.hidden {
            opacity: 0;
            pointer-events: none;
        }
        
        .spinner {
            width: 60px;
            height: 60px;
            border: 5px solid #e0e0e0;
            border-top: 5px solid #0f3460;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-text {
            margin-top: 20px;
            color: #0f3460;
            font-size: 18px;
            font-weight: 600;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .loading-subtext {
            margin-top: 10px;
            color: #666;
            font-size: 14px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
    </style>
</head>
<body <?php body_class('dashboard-pidum-page'); ?>>

<div class="dashboard-fullwidth-container">
    <!-- Loading Overlay -->
    <div class="dashboard-loading" id="dashboardLoading">
        <div class="spinner"></div>
        <div class="loading-text">Memuat Dashboard Pidum</div>
        <div class="loading-subtext">Kejaksaan Tinggi Kepulauan Riau</div>
    </div>
    
    <!-- Dashboard Iframe -->
    <iframe 
        id="dashboardIframe"
        src="https://dashboard.kejati-kepri.com/iframe-embed.html"
        title="Dashboard Pidum - Kejati Kepulauan Riau"
        allowfullscreen
        loading="eager">
    </iframe>
</div>

<script>
(function() {
    'use strict';
    
    var iframe = document.getElementById('dashboardIframe');
    var loading = document.getElementById('dashboardLoading');
    
    // Hide loading overlay when iframe is loaded
    iframe.addEventListener('load', function() {
        setTimeout(function() {
            loading.classList.add('hidden');
            setTimeout(function() {
                loading.style.display = 'none';
            }, 300);
        }, 500);
    });
    
    // Handle iframe messages (optional)
    window.addEventListener('message', function(event) {
        // Handle messages from iframe if needed
        if (event.data && event.data.type === 'dashboard-ready') {
            console.log('Dashboard loaded successfully');
        }
    });
    
    // Prevent scrolling on body
    document.body.style.overflow = 'hidden';
    
    // Handle browser back button
    window.addEventListener('popstate', function(event) {
        if (confirm('Apakah Anda yakin ingin meninggalkan halaman dashboard?')) {
            window.history.back();
        } else {
            window.history.pushState(null, null, window.location.href);
        }
    });
    
    // Push initial state
    window.history.pushState(null, null, window.location.href);
})();
</script>

<?php wp_footer(); ?>

</body>
</html>
