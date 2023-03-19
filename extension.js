/* exported init */

const { St, Gio, GLib } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;


const Me = ExtensionUtils.getCurrentExtension();
const settings = ExtensionUtils.getSettings("org.gnome.shell.extensions.auto-cpufreq-extension");

// Code for the panel indicator
class Extension {
    constructor(uuid) {
        this._uuid = uuid;
    }

    enable() {
        this._indicator = new PanelMenu.Button(0.0, "auto-cpufreq indicator", false);

        // Create icon for the button
        let gicon = Gio.icon_new_for_string(`${Me.path}/speedometer-symbolic.svg`);
        let icon = new St.Icon({
            gicon,
            icon_size: 16
        });
    
        this._indicator.add_child(icon);

        Main.panel.addToStatusArea(this._uuid, this._indicator);

        this.updateStatsOnUI();
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
        if (!this.popupBox) {
            // Create a new popup and add a label to show the statistics
            this.popupBox = new St.BoxLayout({ style_class: 'panel' });
            this.popupLabel = new St.Label({ text: this.getStatsFromFile() });
            this.popupBox.add(this.popupLabel);

            // Add the popup to the menu
            this._indicator.menu.box.add(this.popupBox);
        } else {
            // Update the label text
            this.popupLabel.set_text(this.getStatsFromFile());
        }
    }
        
    // Read the latest stats from the file
    getStatsFromFile() {
        console.time('getStatsFromFile');
        const file = Gio.File.new_for_path("/var/run/auto-cpufreq.stats");
    
        if (file.query_exists(null)) {
            const contents = file.load_contents(null)[1];
        
            const decoder = new TextDecoder();
            const stats = decoder.decode(contents);
        
            const latestStats = stats.split('\n').slice(-41, -2).join('\n');
            console.timeEnd('getStatsFromFile');
            return latestStats;
        }
    
        return "Could not read auto-cpufreq stats, is the daemon disabled?";
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
