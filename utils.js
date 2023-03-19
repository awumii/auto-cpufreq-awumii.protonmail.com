const { St, Gio } = imports.gi;

// TODO: Use gresource instead.
function createIcon(extension, icon) {
    let gicon = Gio.icon_new_for_string(`${extension.path}/icons/${icon}.svg`);
    return new St.Icon({
        gicon,
        icon_size: 16
    });
}

// Read the latest stats from the file
function getStatsFromFile() {
    const file = Gio.File.new_for_path("/var/run/auto-cpufreq.stats");

    if (file.query_exists(null)) {
        const contents = file.load_contents(null)[1];
    
        const decoder = new TextDecoder();
        const stats = decoder.decode(contents);
    
        const latestStats = stats.split('\n').slice(-42, -2).join('\n');
        return latestStats;
    }

    return "Could not read auto-cpufreq stats, is the daemon disabled?";
}
