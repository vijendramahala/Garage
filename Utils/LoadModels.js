import { connectClientDb } from '../config/clientdb';

export default (dbName) => {
    const db = connectClientDb(dbName);

    return { };
}