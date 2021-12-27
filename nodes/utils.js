const mysql = require('mysql')
const chalk = require('chalk')

const connect = async (node, server) => {
    return new Promise(function(resolve, reject){
        try{
        var conn = mysql.createConnection({
            host: server.host,
            port: server.port,
            user: server.username,
            password: server.password,
            database: server.db
          });

          conn.connect()
          successStatus(node,"Connected")
          resolve(conn)
        }
        catch(err){
            reject(err)
        }
    })     
}

const clearStatus = (node) => {
    node.status({})
}

const successStatus = (node,message) => {
    node.status({fill:"green",shape:"dot",text:message});
}

const infoStatus = (node,message) => {
    node.status({fill:"blue",shape:"ring",text:message});
}

const warningStatus = (node,message) => {
    node.status({fill:"yellow",shape:"dot",text:message});
}

const errorStatus = (node,message) => {
    node.status({fill:"red",shape:"dot",text:message});
}

handleException = (errMsg,node,msg,stopFlow=true) => {
    if(stopFlow){
        console.log(chalk.red('Error - flow stopped: ', errMsg))
        node.status({fill:"red",shape:"ring", text: errMsg})
        node.error(errMsg, msg)
    }
    else{
        node.status({fill:"red",shape:"dot",text: errMsg})
    }
}

module.exports = {
    connect,    
    clearStatus,
    successStatus,
    errorStatus,
    infoStatus,
    warningStatus,
    handleException
}


