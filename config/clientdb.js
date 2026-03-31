import mongoose from "mongoose";

const connections = {};

const connectMasterDb = () => {
    return mongoose.createConnection(process.env.MONGO_URL, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000
    });
};

const connectClientDb = (dbName) => {

    if(connections[dbName]){
        return connections[dbName];
    }

    const uri = `${process.env.CLIENT_URL}${dbName}`;

    const connection = mongoose.createConnection(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000
    });

    connections[dbName] = connection;

    connection.on("connected", () => {
        console.log(`Client DB Connected: ${dbName}`);
    });
    connection.on("error", (err) => {
        console.log(`Client DB Error: (${dbName}):`, err);
    });

    return connection;
};

export default { connectMasterDb, connectClientDb }