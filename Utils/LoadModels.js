import { connectClientDb } from '../config/clientdb.js';
import BranchModel from "../Models/Branch.js";
import UserModel from "../Models/User.js";
import LedgerModel from "../Models/Ledger.js";

export default (dbName) => {
    const db = connectClientDb(dbName);
    const Branch = db.model('Branch', BranchModel.schema);
    const User = db.model('User', UserModel.schema);
    const Ledger = db.model('Ledger', LedgerModel.schema);


    return { Branch, User, Ledger };
}