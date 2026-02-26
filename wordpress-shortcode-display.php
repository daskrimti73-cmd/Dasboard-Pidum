<?php
/**
 * WordPress Shortcode untuk Dashboard Display
 * 
 * CARA INSTALL:
 * 1. Copy kode ini
 * 2. Login WordPress Admin
 * 3. Buka Appearance > Theme File Editor
 * 4. Pilih functions.php
 * 5. Paste di paling bawah
 * 6. Klik Update File
 * 
 * CARA PAKAI:
 * Di halaman/post WordPress, ketik: [dashboard_pidum]
 * Atau dengan custom height: [dashboard_pidum height="1000px"]
 */

// Shortcode untuk Dashboard Pidum Display
function kejati_dashboard_display_shortcode($atts) {
    // Default attributes
    $atts = shortcode_atts(array(
        'height' => '800px',
        'width' => '100%'
    ), $atts);
    
    // Build iframe HTML
    $output = '<div style="width: ' . esc_attr($atts['width']) . '; height: ' . esc_attr($atts['height']) . '; min-height: 600px; position: relative; margin: 20px 0;">';
    
    // Loading indicator
    $output .= '<div id="dashboard-loading" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">';
    $output .= '<div style="border: 4px solid #f3f3f3; border-top: 4px solid #1a4d2e; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>';
    $output .= '<p>Memuat Dashboard...</p>';
    $output .= '</div>';
    
    // Iframe
    $output .= '<iframe ';
    $output .= 'src="https://daskrimti73-cmd.github.io/Dasboard-Pidum/display.html" ';
    $output .= 'style="width: 100%; height: 100%; border: none;" ';
    $output .= 'title="Dashboard Pidana Umum Kejaksaan Tinggi Kepulauan Riau" ';
    $output .= 'loading="lazy" ';
    $output .= 'onload="document.getElementById(\'dashboard-loading\').style.display=\'none\'">';
    $output .= '</iframe>';
    
    $output .= '</div>';
    
    // Add CSS animation
    $output .= '<style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>';
    
    return $output;
}
add_shortcode('dashboard_pidum', 'kejati_dashboard_display_shortcode');

// Shortcode dengan URL custom (opsional)
function kejati_dashboard_custom_url_shortcode($atts) {
    $atts = shortcode_atts(array(
        'url' => 'https://daskrimti73-cmd.github.io/Dasboard-Pidum/display.html',
        'height' => '800px',
        'width' => '100%',
        'title' => 'Dashboard Kejaksaan'
    ), $atts);
    
    $output = '<div style="width: ' . esc_attr($atts['width']) . '; height: ' . esc_attr($atts['height']) . '; min-height: 600px;">';
    $output .= '<iframe ';
    $output .= 'src="' . esc_url($atts['url']) . '" ';
    $output .= 'style="width: 100%; height: 100%; border: none;" ';
    $output .= 'title="' . esc_attr($atts['title']) . '" ';
    $output .= 'loading="lazy">';
    $output .= '</iframe>';
    $output .= '</div>';
    
    return $output;
}
add_shortcode('dashboard_custom', 'kejati_dashboard_custom_url_shortcode');
?>
