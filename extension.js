/* exported init */

const { St, Gio, GLib } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Me = ExtensionUtils.getCurrentExtension();
const settings = ExtensionUtils.getSettings("org.gnome.shell.extensions.auto-cpufreq-extension");
const Parser = Me.imports.parser.Parser;

const Utils = Me.imports.utils;

// Code for the panel indicator
class Extension {
    constructor(uuid) {
        this._uuid = uuid;
    }

    enable() {
        this._indicator = new PanelMenu.Button(0.0, "auto-cpufreq indicator", false);
        this._indicator.add_child(Utils.createIcon(Me, "speedometer-symbolic"));

        Main.panel.addToStatusArea(this._uuid, this._indicator);

        // Create a new popup and add a label to show the statistics
        this.popupBox = new St.BoxLayout({ style_class: "panel" });
        this.popupLabel = new St.Label({ text: "Initializing..." });
        this.popupBox.add(this.popupLabel);

        // Add the popup to the menu
        this._indicator.menu.box.add(this.popupBox);

        // Settings button
        const settingsItem = new PopupMenu.PopupMenuItem("Settings", {});
        settingsItem.connect('activate', () => ExtensionUtils.openPrefs());
        settingsItem.insert_child_at_index(Utils.createIcon(Me, "settings-symbolic"), 0);
        this._indicator.menu.box.add(settingsItem);

        // Setup the statistic update timer
        this.updateTimer();
        settings.connect('changed::refresh', () => this.updateTimer());
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }

    updateTimer() {
        // Remove timer if it exists
        if (this._timer) {
            GLib.source_remove(this._timer);
        }

        // Set up a timer to refresh the stats periodically
        this._timer = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT,
            settings.get_int('refresh'),
            () => {
                this.updateStatsOnUI();
                return true;
            }
        );
    }

    // Update the UI with the latest stats
    updateStatsOnUI() {
        const stats = Utils.getStatsFromFile();
        //const parser = new Parser(stats);

        this.popupLabel.set_text(stats);
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
