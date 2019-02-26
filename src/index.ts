import { doGet } from "./server/webapp";
import "./es6";
//import global from "./global";
//import {global} from "gas-entry-generator"
//global defined by gas-entry-generator
/// <reference path = "globals.d.ts" />

global.doGet = doGet;

global.sendmail = (email = "amit@labnol.org") => {
    GmailApp.sendEmail(email, "It works!", "Hello Google Apps Script");
};
