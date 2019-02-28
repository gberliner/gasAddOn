//sheetapp
/// <reference path = "webappevent.d.ts" />
import { jsonProperty, Serializable } from "ts-serializable";
export const settingsMenu = () => {
    var email = Session.getActiveUser().getEmail();
}
export function onOpen():void {
    SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
        .createMenu('Sensorbot')
        .addItem('insert data', 'insertData')
        .addToUi();
}


function showDialog():void {
    var publicId = CacheService.getUserCache().get("publicId");
    var html = HtmlService.createHtmlOutputFromFile('Page')
        .setWidth(400)
        .setHeight(300);
    SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
        .showModalDialog(html, 'Insert sensorbot data');
}

interface withPubUrl  {
    pubUrl?: string
}

type templateWithProps = withPubUrl & GoogleAppsScript.HTML.HtmlTemplate

class SensorbotToken extends Serializable {
    @jsonProperty(String)
    public token: string = "";
    @jsonProperty(String)
    public refreshToken: string = "";
    @jsonProperty(Number)
    public status: number = 0;
    @jsonProperty(String)
    public message: string = "";
}

class TimeSeries extends Serializable {
    @jsonProperty(Number)
    public ts: Number = 0;
    @jsonProperty(String)
    public value: string = "";
    constructor() {
        super();
    }
}

class SensorbotData extends Serializable {
    @jsonProperty(TimeSeries)
    public plantowerPM25concRaw: TimeSeries|null = null;
    @jsonProperty(Number)
    public status: number = 0;
    @jsonProperty(String)
    public message: string = ""
}

export function insertData():void {
    var pubId: string = CacheService.getUserCache().get("pubId")
    var template: templateWithProps = HtmlService.createTemplateFromFile("Page.html");
    template.pubUrl = ScriptApp.getService().getUrl();
    var html = template.evaluate();
    var currentAccessToken: string = CacheService.getUserCache().get("accessToken");

    if (currentAccessToken === "" && pubId !== "") {
        var postBody = {publicId: pubId}
        var jsonText = JSON.stringify(postBody)
        var params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {method: "post", contentType: "application/json", payload: jsonText};
        var resp = UrlFetchApp.fetch("http://sensorbot.org:8080/api/auth/login/public", params);
        const sensorbotToken: SensorbotToken = JSON.parse(resp.getContentText());
        
        if (sensorbotToken.token !== "") {
            currentAccessToken =  sensorbotToken.token;
            CacheService.getUserCache().put("accessToken", currentAccessToken)
        }
    }

    // check whether we are still tokenless...
    if (currentAccessToken === "" || pubId === "") {
        SpreadsheetApp.getUi().showModelessDialog(html,"Enter sensorbot id")        
        return;
    }
    
    // attempt to retrieve some data
    var urlString = `http://www.sensorbot.org:8080/api/plugins/telemetry/DEVICE/${pubId}/values/timeseries?keys=plantowerPM25concRaw`
    var sensorbotRequest: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        method: "get",
        headers: ["X-Authorization: Bearer " + currentAccessToken]
    }
    var sensorbotResponse = UrlFetchApp.fetch(urlString, sensorbotRequest)
    var sensorbotDatum: SensorbotData = JSON.parse(sensorbotResponse.getContentText())
    
    if (sensorbotDatum.message === "" && sensorbotDatum.plantowerPM25concRaw !== null) {
        // update spreadsheet

        var rowContents = [sensorbotDatum.plantowerPM25concRaw.ts, sensorbotDatum.plantowerPM25concRaw.value]
        var activeSheet = SpreadsheetApp.getActiveSpreadsheet()
        var currentSheet: GoogleAppsScript.Spreadsheet.Sheet|null = null
        if (activeSheet !== null) {
           currentSheet = activeSheet.appendRow(rowContents)
        }
        if (currentSheet !== null) {
            return;
        }
    }

    SpreadsheetApp.getUi().showModelessDialog(html,"Enter sensorbot id")        
    return;
    
}

export function doPost(e: WebappEvent) {
    if (e.parameters !== undefined) {
        CacheService.getUserCache().put("publicId", e.parameters["publicId"][0])
        insertData();
    }
}