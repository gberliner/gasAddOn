import { doGet } from "./server/webapp";
import "./es6";

/// <reference path = "globals.d.ts" />
global.doGet = doGet;

global.sendmail = (email = "amit@labnol.org") => {
    GmailApp.sendEmail(email, "It works!", "Hello Google Apps Script");
};
