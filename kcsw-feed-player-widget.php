<?php
/**
 * Plugin Name: KSCW Feed Player
 * Plugin URI: https://wordpress.org/plugins/kscw-feed-player/
 * Description: Plays traxx from different feeds
 * Version: 1.0.1
 * Author: crash springfield
 * Author URI: https://github.com/crashspringfield/kcsw-radio-wp-plugin
 */

defined('ABSPATH') or die('Hack the planet, lolz');

include_once(ABSPATH . WPINC . '/feed.php');

class KCSW_Podcast_Feed_Player extends WP_Widget {

  // Set up the widget name and description.
  public function __construct() {
    $widget_options = array(
      'classname' => 'kcsw_podcast_widget',
      'description' => 'Combine multiple feeds into a single radio player'
    );
    parent::__construct('kcsw_podcast_widget', 'KCSW Feed Player Widget', $widget_options);
  }

  // Create the widget output.
  public function widget($args, $instance) {
    $quantity = apply_filters('kcsw_podcast_feed', $instance['quantity']);
    $message = apply_filters('kcsw_podcast_feed', $instance['message']);

    // workaround for getting ONLY selected feeds
    $selected_feeds = apply_filters('kcsw_podcast_feed', $instance['selected_feeds']);
    $res = wprss_get_all_feed_sources();
    $feeds = filter_feeds($res->posts, $selected_feeds);

    $feedz = array();

    // Get and format the latest `$quantity` items from each feed
    foreach ($feeds as $key => $f) {
      // Get the feed
      $url = get_post_meta($f->ID, 'wprss_url', true);
      $feed = fetch_feed($url);

      if (!is_wp_error($feed)) {
        $feed_items = $feed->get_items(0, $quantity);
      }

      // Get and format the data
      foreach ($feed_items as $k => $item) {

        // Some feeds may have more than one enclosure (e.g if the feed has images)
        if ($enclosures = $item->get_enclosures()) {
          foreach ($enclosures as $enclosure) {
            $handler = $enclosure->get_handler();

            // Get whichever enclosure is audio
            if ($handler == 'mp3' || $handler == 'wav' || $handler == 'quicktime') {
              $audio = preg_replace('/\?.*/', '', $enclosure->get_link());
              break;
            }
          }
        }

        $returned = array(
          'podcast' => $f->post_title,
          'title' => $item->get_title(),
          'audio' => $audio,
          'link' => $item->get_link(),
          'date' => $item->get_date(),
          'source' => $item->get_base()
        );
        array_push($feedz, $returned);
      }
    }

    // Build the player, passing a JSON object of the shit we need
    ?>
    <script type="text/javascript">
      const feedz = <?php echo json_encode($feedz); ?>;
    </script>

    <div id="player-container" class="player-container">
      <div id="player" class="player">
        <div class="top">
          <span class="now-playing">Now Playing: </span>
          <span id="podcast-name" class="podcast-name"></span>
          <span class="dash">-</span>
          <span id="podcast-title" class="podcast-title"></span>
          <span class="comma">,</span>
          <span id="podcast-date" class="podcast-date"></span>
        </div>
        <div class="middle">
            <div class="previous-container">
              <span class="previous-track">Previous podcast: </span>
              <span id="previous-podcast"></span>
            </div>
            <div id="player-buttons" class="player-buttons">
              <a id="previous-button" class="player-button previous"></a>
              <a id="replay10-button" class="player-button replay"></a>
              <a id="playpause-button" class="player-button play"></a>
              <a id="forward10-button" class="player-button forward"></a>
              <a id="next-button" class="player-button next"></a>
            </div>
            <div class="next-container">
              <span class="next-track">Next podcast: </span>
              <span id="next-podcast"></span>
            </div>
          </div>
          <div id="player-controls" class="bottom">
            <div id="player-slider-wrapper" class="player-slider-wrapper">
              <div id="current-time" class="time">
                0:00
              </div>
              <div id="progress-bar-wrapper" class="progress-bar-wrapper">
                <input id="progress-bar" class="progress-bar" type="range" min="0" max="1" step="any" />
              </div>
              <div id="total-time" class="time">
                0:00
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <?php echo $args['after_widget'];
  } // end widget

  // Create the admin area widget settings form.
  public function form($instance) {
    $quantity = !empty($instance['quantity']) ? $instance['quantity'] : '';
    $message = !empty($instance['message']) ? $instance['message'] : '';

    $res = wprss_get_all_feed_sources();
    $feeds = !empty($instance['feeds']) ? $instance['feeds'] : [];
    $feeds = $res->posts;

    $selected_feeds = !empty($instance['selected_feeds']) ? $instance['selected_feeds'] : array();
    ?>

    <div>
      <ul>
        <?php foreach ($feeds as $f) { ?>
          <li>
            <label for="<?php echo $f->post_title; ?>"><?php echo $f->post_title ?>:</label>
            <input
              id="<?php echo $f->post_title; ?>"
              type="checkbox"
              name="<?php echo esc_attr($this->get_field_name('selected_feeds')); ?>[]"
              value="<?php echo $f->post_title ?>"
              <?php checked((in_array($f->post_title, $selected_feeds)) ? $f->post_title : ' ', $f->post_title); ?> />
          </li>
        <?php } ?>
      </ul>
    </div>
    <p>
      <label for="<?php echo $this->get_field_id('quantity'); ?>">Number of episodes from each show:</label>
      <input type="number" id="<?php echo $this->get_field_id('quantity'); ?>" name="<?php echo $this->get_field_name('quantity'); ?>" value="<?php if(is_numeric($quantity)) { echo esc_attr($quantity); } else { echo "5"; } ?>" />
    </p>

    <?php if(strlen($message) > 0) {
    ?> <div style="color: red; font-weight: bold;"><?php echo $message; ?></div>
    <?php }
  }

  // Apply settings to the widget instance.
  public function update($new_instance, $old_instance) {
    $instance = $old_instance;
    $instance['quantity'] = strip_tags($new_instance['quantity']);

    $feedurls = explode(',', $feedurl);
    $instance['message'] = $message;

    $selected_feeds = (!empty($new_instance['selected_feeds'])) ? (array) $new_instance['selected_feeds'] : array();
    $instance['selected_feeds'] = array_map( 'sanitize_text_field', $selected_feeds);

    return $instance;
  }

}

// filter $all_feeds based on $selected_names
function filter_feeds(array $all_feeds, array $selected_names): array {
  $selected_feeds = [];
  foreach ($selected_names as $key => $name) {
    foreach ($all_feeds as $k => $v) {
      if ($name == $v->post_title) {
        array_push($selected_feeds, $v);
      }
    }
  }
  return $selected_feeds;
}

// Register the widget.
add_action('widgets_init', function() {
   register_widget( 'KCSW_Podcast_Feed_Player' );
});

// Add JS && CSS
add_action('wp_enqueue_scripts', function() {
  wp_enqueue_script('bundle-min.js', plugins_url( '/dist/bundle-min.js', __FILE__ ));
  wp_enqueue_style('stylesheet.css', plugins_url('/dist/stylesheet.css', __FILE__));
});

?>
