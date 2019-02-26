import { doGet } from "./server/webapp";
import "./es6";

//global defined by gas-entry-generator
global.doGet = doGet;

global.sendmail = (email = "amit@labnol.org") => {
    GmailApp.sendEmail(email, "It works!", "Hello Google Apps Script");
};
