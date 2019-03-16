=== KCSW Feed Player Widget ===
Authors: crash springfield
Tags: feeds, podcasts
Requires at least:
Tested up to: 5.0.3
Requires PHP: 7.2
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

KCSW Feed Player Widget provides a radio that can run off multiple RSS feeds

== Description ==

A simple widget that allows you to create a custom radio based on your site's subscribed RSS feeds.

= About KCSW Feed Player Widget =

This pulls from the feeds you've added via RSS Aggregator. The widget then allows you to choose which feeds you would like to pull tracks from.

== Installation ==

1. Upload the `kcsw-feed-player-widget` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Select which feeds you would like to pull traxx from
4. Identify how many traxx you'd like to pull from each feed.
5. Click Save

== Customization ==
CSS and JS are minified for you in /dist. If you'd like to make changes, the unminified versions are under /css && /js respectively. Update `add_action` in `kcsw-feed-player-widget` with paths of editing files.

== Frequently Asked Questions ==

== Screenshots ==

== Changelog ==
= 1.0.0 =
Release.

= 0.2.2 =
Bug fix: Account for non-audio media in feeds

= 0.2.1 =
Bug fix: Fix parsing error with non-ASCII characters

= 0.2.0 =
Create gulpfile to minify CSS and JS. Use minified versions in plugin.

= 0.1.0 =
Beta AF
