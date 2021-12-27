module.exports = function(RED){
    function MysqlConfig(config) {
        RED.nodes.createNode(this,config)
        this.host = config.host
        this.port = parseInt(config.port)
        this.username = config.username
        this.password = config.password
        this.db = config.db
    }

    RED.nodes.registerType("mysql2-server",MysqlConfig)
}