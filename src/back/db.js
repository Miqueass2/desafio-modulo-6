"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.dataBase = void 0;
const admin = require("firebase-admin");
const serviceAccount = require("../../key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://apx-dwf-m6-d2160-default-rtdb.firebaseio.com"
});
const dataBase = admin.firestore();
exports.dataBase = dataBase;
const rtdb = admin.database();
exports.rtdb = rtdb;
dataBase.settings({ ignoreUndefinedProperties: true });
