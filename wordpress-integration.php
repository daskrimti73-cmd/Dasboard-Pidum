<?php
/**
 * WordPress Integration Code untuk Dashboard Pidum
 * 
 * CARA PAKAI:
 * 1. Copy kode ini ke functions.php theme WordPress Anda
 * 2. Atau buat plugin baru dengan kode ini
 * 3. Gunakan shortcode [dashboard_pidum] di halaman WordPress
 */

// ============================================
// SHORTCODE UNTUK IFRAME DASHBOARD
// ============================================

function dashboard_pidum_shortcode($atts) {
    // Default attributes
    $atts = shortcode_atts(array(
        'height' => '900px',
        'url' => 'https://dashboard.kejati-kepri.com/iframe-embed.html',
        'loading' => 'eager'
    ), $atts);
    
    // Generate unique ID untuk iframe
    $iframe_id = 'dashboard-pidum-' . uniqid();
    
    ob_start();
    ?>
    <div class="dashboard-pidum-wrapper" style="width: 100%; position: relative;">
        <!-- Loading Overlay -->
        <div id="<?php echo $iframe_id; ?>-loading" class="dashboard-loading" style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: <?php echo esc_attr($atts['height']); ?>;
            background: rgba(255,255,255,0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
            transition: opacity 0.3s ease;
        ">
            <div style="text-align: center;">
                <div class="spinner" style="
                    width: 50px;
                    height: 50px;
                    border: 4px solid #e0e0e0;
                    border-top: 4px solid #0f3460;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 15px;
                "></div>
                <p style="color: #0f3460; font-weight: 600;">Memuat Dashboard...</p>
            </div>
        </div>
        
        <!-- Iframe Dashboard -->
        <iframe 
            id="<?php echo $iframe_id; ?>"
            src="<?php echo esc_url($atts['url']); ?>" 
            width="100%" 
            height="<?php echo esc_attr($atts['height']); ?>" 
            frameborder="0" 
            loading="<?php echo esc_attr($atts['loading']); ?>"
            style="border: none; display: block; min-height: <?php echo esc_attr($atts['height']); ?>;"
            allowfullscreen
            title="Dashboard Pidum Kejati Kepulauan Riau">
        </iframe>
    </div>
    
    <style>
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .dashboard-pidum-wrapper {
            margin: 20px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
    </style>
    
    <script>
        (function() {
            var iframe = document.getElementById('<?php echo $iframe_id; ?>');
            var loading = document.getElementById('<?php echo $iframe_id; ?>-loading');
            
            // Hide loading when iframe loaded
            iframe.addEventListener('load', function() {
                setTimeout(function() {
                    loading.style.opacity = '0';
                    setTimeout(function() {
                        loading.style.display = 'none';
                    }, 300);
                }, 500);
            });
            
            // Auto-resize iframe (optional)
            window.addEventListener('message', function(e) {
                if (e.data && e.data.height) {
                    iframe.style.height = e.data.height + 'px';
                }
            });
        })();
    </script>
    <?php
    
    return ob_get_clean();
}
add_shortcode('dashboard_pidum', 'dashboard_pidum_shortcode');


// ============================================
// CUSTOM PAGE TEMPLATE (OPTIONAL)
// ============================================

/**
 * Register custom page template
 * Simpan file template-dashboard-pidum.php di theme folder
 */
function dashboard_pidum_page_template($templates) {
    $templates['template-dashboard-pidum.php'] = 'Dashboard Pidum (Full Width)';
    return $templates;
}
add_filter('theme_page_templates', 'dashboard_pidum_page_template');


// ============================================
// ADMIN MENU (OPTIONAL)
// ============================================

/**
 * Tambah menu di WordPress Admin untuk akses cepat
 */
function dashboard_pidum_admin_menu() {
    add_menu_page(
        'Dashboard Pidum',           // Page title
        'Dashboard Pidum',           // Menu title
        'manage_options',            // Capability
        'dashboard-pidum',           // Menu slug
        'dashboard_pidum_admin_page', // Callback function
        'dashicons-chart-bar',       // Icon
        30                           // Position
    );
}
add_action('admin_menu', 'dashboard_pidum_admin_menu');

function dashboard_pidum_admin_page() {
    ?>
    <div class="wrap">
        <h1>Dashboard Pidum - Kejati Kepulauan Riau</h1>
        <p>Gunakan shortcode berikut untuk menampilkan dashboard di halaman WordPress:</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #0f3460; margin: 20px 0;">
            <h3>Shortcode Dasar:</h3>
            <code style="font-size: 14px;">[dashboard_pidum]</code>
        </div>
        
        <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #0f3460; margin: 20px 0;">
            <h3>Shortcode dengan Custom Height:</h3>
            <code style="font-size: 14px;">[dashboard_pidum height="1000px"]</code>
        </div>
        
        <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #0f3460; margin: 20px 0;">
            <h3>Shortcode dengan Custom URL:</h3>
            <code style="font-size: 14px;">[dashboard_pidum url="https://your-domain.com/iframe-embed.html" height="900px"]</code>
        </div>
        
        <hr style="margin: 30px 0;">
        
        <h2>Cara Penggunaan:</h2>
        <ol style="line-height: 2;">
            <li>Buat halaman baru di WordPress</li>
            <li>Tambahkan shortcode <code>[dashboard_pidum]</code> di konten halaman</li>
            <li>Publish halaman</li>
            <li>Dashboard akan muncul di halaman tersebut</li>
        </ol>
        
        <hr style="margin: 30px 0;">
        
        <h2>Preview Dashboard:</h2>
        <div style="margin-top: 20px;">
            <?php echo do_shortcode('[dashboard_pidum height="700px"]'); ?>
        </div>
    </div>
    <?php
}


// ============================================
// WIDGET DASHBOARD (OPTIONAL)
// ============================================

class Dashboard_Pidum_Widget extends WP_Widget {
    
    function __construct() {
        parent::__construct(
            'dashboard_pidum_widget',
            'Dashboard Pidum Widget',
            array('description' => 'Tampilkan Dashboard Pidum di sidebar atau widget area')
        );
    }
    
    public function widget($args, $instance) {
        echo $args['before_widget'];
        
        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']) . $args['after_title'];
        }
        
        $height = !empty($instance['height']) ? $instance['height'] : '600px';
        $url = !empty($instance['url']) ? $instance['url'] : 'https://dashboard.kejati-kepri.com/iframe-embed.html';
        
        echo do_shortcode('[dashboard_pidum height="' . esc_attr($height) . '" url="' . esc_url($url) . '"]');
        
        echo $args['after_widget'];
    }
    
    public function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : 'Dashboard Pidum';
        $height = !empty($instance['height']) ? $instance['height'] : '600px';
        $url = !empty($instance['url']) ? $instance['url'] : 'https://dashboard.kejati-kepri.com/iframe-embed.html';
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>">Title:</label>
            <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" 
                   name="<?php echo $this->get_field_name('title'); ?>" type="text" 
                   value="<?php echo esc_attr($title); ?>">
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('height'); ?>">Height:</label>
            <input class="widefat" id="<?php echo $this->get_field_id('height'); ?>" 
                   name="<?php echo $this->get_field_name('height'); ?>" type="text" 
                   value="<?php echo esc_attr($height); ?>" placeholder="600px">
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('url'); ?>">Dashboard URL:</label>
            <input class="widefat" id="<?php echo $this->get_field_id('url'); ?>" 
                   name="<?php echo $this->get_field_name('url'); ?>" type="text" 
                   value="<?php echo esc_url($url); ?>">
        </p>
        <?php
    }
    
    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = (!empty($new_instance['title'])) ? strip_tags($new_instance['title']) : '';
        $instance['height'] = (!empty($new_instance['height'])) ? strip_tags($new_instance['height']) : '600px';
        $instance['url'] = (!empty($new_instance['url'])) ? esc_url_raw($new_instance['url']) : '';
        return $instance;
    }
}

function register_dashboard_pidum_widget() {
    register_widget('Dashboard_Pidum_Widget');
}
add_action('widgets_init', 'register_dashboard_pidum_widget');


// ============================================
// ENQUEUE SCRIPTS (OPTIONAL)
// ============================================

function dashboard_pidum_enqueue_scripts() {
    // Add custom CSS for dashboard pages
    wp_enqueue_style('dashboard-pidum-style', get_template_directory_uri() . '/dashboard-pidum.css', array(), '1.0.0');
}
add_action('wp_enqueue_scripts', 'dashboard_pidum_enqueue_scripts');

?>
