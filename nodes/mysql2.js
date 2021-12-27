const Utils = require('./utils')

var bind = async (node) => {
    if(node.bind === true || node.bind === 'true')
      return Array.isArray(msg.payload) ? msg.payload : []
     else
        return []
 }


const executeQuery = async (node, msg, connection) => {
    try{
        if (typeof msg.topic === 'string') {
            var topic = msg.topic || node.topic
            var binddata = await bind(node)
            
            await connection.query(`${topic}`, binddata , async (err, rows) => {
                if (err) {
                    await Utils.handleException(err.message,node,msg)
                }
                else {
                    msg.payload = rows
                    await node.send(msg);
                    await Utils.successStatus(node, 'Executed')                    
                }
            });
            await connection.end()
        }
        else {
            if (typeof msg.topic !== 'string') {                  
                Utils.handleException('msg.topic : the query is not defined as a string', node, msg); 
            }
        }
    }catch(e){
        Utils.handleException(e.message, node, msg)
    }
}

module.exports = function(RED){
    function MySql2(config) {
        RED.nodes.createNode(this,config)           
        this.server = (config.server)?RED.nodes.getNode(config.server):''
        this.bind = config.bind
        this.topic = config.topic      
        var node = this         
        
        this.on('input', async (msg) => {
            try{            
                Utils.clearStatus(node)                
                let server = (msg.server)? msg.server : node.server
                if(server){
                    var connection = await Utils.connect(node, server)
                    await Utils.infoStatus(node, 'Executing...')
                    await executeQuery(node, msg, connection)                                                        
                }
                else{
                    Utils.handleException('Server is not setup', node, msg)
                }
            }catch(e){
                Utils.handleException(e.message, node, msg)
            }                         
        })

        this.on('close', async () => {
            try{
                Utils.clearStatus(node)                            
                if(node.server){                    
                    connection = await Utils.connect(node, node.server)
                    await connection.release()
                    await connection.destroy()
                }
                else{
                    Utils.warningStatus(node,"Server not setup")
                }
            }
            catch(e){
                Utils.handleException("Unable to Connect", node, "Unable to Connect", false)
            } 
        })        
        
    }

    RED.nodes.registerType("mysql2",MySql2)
}
