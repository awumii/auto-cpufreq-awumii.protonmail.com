'use strict';

const { Adw, Gio, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {
}

function fillPreferencesWindow(window) {
    // Use the same GSettings schema as in `extension.js`
    const settings = ExtensionUtils.getSettings("org.gnome.shell.extensions.auto-cpufreq-extension");
    
    // Create a preferences page and group
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    // Create a new preferences row
    const row = new Adw.ActionRow({
        title: "Refresh time (in seconds)",
        subtitle: "This option controls how often the extension refreshes the statistics displayed in the user interface."
    });
    group.add(row);

    // Create the spin button and bind its value to the `num-stats` key
    const spinButton = new Gtk.SpinButton({
        adjustment: new Gtk.Adjustment({
            value: settings.get_int('refresh'),
            lower: 1,
            upper: 100,
            step_increment: 1,
            page_increment: 10
        }),
        valign: Gtk.Align.CENTER
    });

    settings.bind(
        'refresh',
        spinButton.get_adjustment(),
        'value',
        Gio.SettingsBindFlags.DEFAULT
    );

    // Add the spin button to the row
    row.add_suffix(spinButton);
    row.activatable_widget = spinButton;

    // Add our page to the window
    window.add(page);
}