#!/usr/bin/env python3
"""
Prompt Workshop — native Linux application using GTK 3 + WebKitGTK.

Opens in its own window with no browser needed. Falls back gracefully
if GTK/WebKit libraries are not installed.

Requirements (pre-installed on most GNOME/Ubuntu/Fedora desktops):
  - python3
  - python3-gi (GObject Introspection)
  - gir1.2-webkit2-4.0 or gir1.2-webkit2-4.1

If not installed:
  Ubuntu/Debian:  sudo apt install python3-gi gir1.2-webkit2-4.0
  Fedora:         sudo dnf install python3-gobject webkit2gtk3
  Arch:           sudo pacman -S python-gobject webkit2gtk
"""

import os
import sys
import signal

def main():
    # Allow Ctrl+C to close the app
    signal.signal(signal.SIGINT, signal.SIG_DFL)

    # Resolve the HTML file path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(script_dir, 'viewer.html')

    if not os.path.exists(html_path):
        print(f"Error: viewer.html not found at {html_path}")
        sys.exit(1)

    try:
        import gi
        gi.require_version('Gtk', '3.0')

        # Try WebKit2 4.1 first (newer distros), then 4.0
        webkit_version = None
        for ver in ('4.1', '4.0'):
            try:
                gi.require_version('WebKit2', ver)
                webkit_version = ver
                break
            except ValueError:
                continue

        if webkit_version is None:
            raise ImportError("WebKit2 not found")

        from gi.repository import Gtk, WebKit2, GLib

    except (ImportError, ValueError) as e:
        print(f"Native window libraries not available: {e}")
        print("Install them with:")
        print("  Ubuntu/Debian:  sudo apt install python3-gi gir1.2-webkit2-4.0")
        print("  Fedora:         sudo dnf install python3-gobject webkit2gtk3")
        print("  Arch:           sudo pacman -S python-gobject webkit2gtk")
        print("")
        print("Falling back to browser...")
        os.execvp("xdg-open", ["xdg-open", html_path])
        sys.exit(1)

    # ── Build the native GTK window ──

    class PromptWorkshopWindow(Gtk.Window):
        def __init__(self):
            super().__init__(title="Prompt Workshop")
            self.set_default_size(1280, 860)
            self.set_position(Gtk.WindowPosition.CENTER)

            # Try to set the WM_CLASS for better desktop integration
            self.set_wmclass("prompt-workshop", "Prompt Workshop")

            # WebView with persistent data
            context = WebKit2.WebContext.get_default()
            webview = WebKit2.WebView.new_with_context(context)

            settings = webview.get_settings()
            settings.set_enable_developer_extras(True)
            settings.set_enable_javascript(True)
            settings.set_javascript_can_access_clipboard(True)

            # Enable localStorage persistence
            data_manager = context.get_website_data_manager()

            # Load the HTML
            webview.load_uri('file://' + html_path)

            # Handle keyboard shortcuts
            self.connect('key-press-event', self._on_key_press, webview)

            self.add(webview)
            self.connect('destroy', Gtk.main_quit)
            self.show_all()

        def _on_key_press(self, widget, event, webview):
            from gi.repository import Gdk
            ctrl = event.state & Gdk.ModifierType.CONTROL_MASK

            if ctrl:
                if event.keyval == Gdk.KEY_plus or event.keyval == Gdk.KEY_equal:
                    zoom = webview.get_zoom_level()
                    webview.set_zoom_level(zoom * 1.1)
                    return True
                elif event.keyval == Gdk.KEY_minus:
                    zoom = webview.get_zoom_level()
                    webview.set_zoom_level(zoom / 1.1)
                    return True
                elif event.keyval == Gdk.KEY_0:
                    webview.set_zoom_level(1.0)
                    return True
                elif event.keyval == Gdk.KEY_r:
                    webview.reload()
                    return True

            if event.keyval == Gdk.KEY_F11:
                if self._is_fullscreen:
                    self.unfullscreen()
                else:
                    self.fullscreen()
                self._is_fullscreen = not getattr(self, '_is_fullscreen', False)
                return True

            return False

    app = PromptWorkshopWindow()
    app._is_fullscreen = False
    Gtk.main()


if __name__ == '__main__':
    main()
