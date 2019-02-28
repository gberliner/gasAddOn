import { doGet } from "./server/webapp";
import {onOpen, doPost, insertData} from "./server/sheetapp";
import "./es6";

/// <reference path = "globals.d.ts" />
global.doGet = doGet;
global.onOpen = onOpen;
global.doPost = doPost;
global.insertData = insertData;
global.sendmail = (email = "amit@labnol.org") => {
    GmailApp.sendEmail(email, "It works!", "Hello Google Apps Script");
};
