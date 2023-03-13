const fs = require('fs');
//获取元素在数组的下标
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++)
        if (this[i] == val)
            return i;
    return -1;
};
//根据数组的下标，删除该下标的元素
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1)
        this.splice(index, 1);
};

class PermissionManager {
    constructor(config_path) {
        this.FILE_PATH = config_path;
        this.config = {};
    }
    load() {
        if (fs.existsSync(this.FILE_PATH))
            this.config = JSON.parse(fs.readFileSync(this.FILE_PATH, 'utf-8'));
        else
            this.save();
    }
    save() {
        fs.writeFileSync(this.FILE_PATH, JSON.stringify(this.config), 'utf-8');
    }
    hasPermission(plugin_id, channel_id) {
        if (this.config[plugin_id] == null) return false;
        return this.config[plugin_id].find(v => v == channel_id) != null;
    }
    addPermission(plugin_id, channel_id) {
        if (this.config[plugin_id] == null) this.create(plugin_id);
        if (this.config[plugin_id].find(x => x == channel_id) == null)
            this.config[plugin_id].push(channel_id);
        this.save();
    }
    removePermission(plugin_id, channel_id) {
        if (this.config[plugin_id] == null) return;
        this.config[plugin_id].remove(channel_id);
        this.save();
    }
    create(plugin_id) {
        this.config[plugin_id] = [];
    }
}

module.exports = { PermissionManager };