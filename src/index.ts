import { doGet } from "./server/webapp";
import "./es6";
//var global=Object.create({})
//export {global}

global.doGet = doGet;

global.sendmail = (email = "amit@labnol.org") => {
    GmailApp.sendEmail(email, "It works!", "Hello Google Apps Script");
};
