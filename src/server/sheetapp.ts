//sheetapp
/// <reference path = "webappevent.d.ts" />
import 'reflect-metadata';
import { jsonProperty, Serializable } from "ts-serializable";
export const settingsMenu = () => {
    var email = Session.getActiveUser().getEmail();
}
export function onOpen(): void {
    SpreadsheetApp.getUi() // Or DocumentApheadersp or SlidesApp or FormApp.
        .createMenu('Sensorbot')
        .addItem('insert data', 'insertData')
        .addToUi();
}


function showDialog(): void {
    var publicId = CacheService.getUserCache().get("publicId");
    var html = HtmlService.createHtmlOutputFromFile('Page')
        .setWidth(400)
        .setHeight(300);
    SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
        .showModalDialog(html, 'Insert sensorbot data');
}

interface WithPubUrl  {
    pubUrl?: string;
}

type templateWithProps = WithPubUrl & GoogleAppsScript.HTML.HtmlTemplate

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
    public ts: number = 0;
    @jsonProperty(String)
    public value: string = "";
    public constructor(jsonObj: any) {
        super();
        if ('ts' in jsonObj && 'value' in jsonObj) {
            this.ts = jsonObj.ts;
            this.value = jsonObj.value;
        } else {
            this.ts = 0;
            this.value = "";
        }

    }
}

class SensorbotData extends Serializable {
    @jsonProperty(TimeSeries)
    public plantowerPM25concRaw: TimeSeries[] = [new TimeSeries(this.plantowerPM25concRaw)];
    @jsonProperty(Number)
    public status: number = 0;
    @jsonProperty(String)
    public message: string = ""
}

export function insertData(): void {
    var pubId: string = CacheService.getUserCache().get("pubId")
    console.log("Read value of pubid=" + pubId + " from user cache for user " + Session.getActiveUser().getUserLoginId());
    var template: templateWithProps = HtmlService.createTemplateFromFile("Page.html");
    template.pubUrl = ScriptApp.getService().getUrl();
    var html = template.evaluate();

    var currentAccessToken: string = CacheService.getUserCache().get("accessToken");

    if (!!currentAccessToken === false && !!pubId === true) { // have pubid but not token
        console.info("Pubid read but no access token found for user session, attempting fetch...")
        var postBody = {publicId: pubId}
        var jsonText = JSON.stringify(postBody)
        /* eslint-disable-next-line @typescript-eslint/camelcase */
        var params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {method: "post", contentType: "application/json", payload: jsonText};
        var resp = UrlFetchApp.fetch("http://sensorbot.org:8080/api/auth/login/public", params);
        console.info("response code from authz server: " + resp.getResponseCode().toString());
        
        const sensorbotToken: SensorbotToken = JSON.parse(resp.getContentText());
        
        if (!!sensorbotToken.token === true) {
            currentAccessToken =  sensorbotToken.token;
            CacheService.getUserCache().put("accessToken", currentAccessToken)
        } else {
            console.warn("no access token returned by authz server")
        }
        if (!!sensorbotToken.message) {
            if (!!sensorbotToken.status) {
                console.warn("status returned by authz server: " + sensorbotToken.status)
            }
            console.warn("message from authz server: " + sensorbotToken.message);
        }
    }

    // check whether we are still tokenless...
    if (!!currentAccessToken == false || !!pubId == false) {
        SpreadsheetApp.getUi().showModelessDialog(html,"Enter sensorbot id")        
        return;
    }
    
    // attempt to retrieve some data
    console.log("attempting to fetch timeseries from sensorbot")
    var urlString = `http://www.sensorbot.org:8080/api/plugins/telemetry/DEVICE/${pubId}/values/timeseries?keys=plantowerPM25concRaw`
    var deviceUrlString = "http://www.sensorbot.org:8080/api/plugins/telemetry/DEVICE/858db870-6457-11e8-a60d-9d9c1f00510b/values/timeseries?keys=plantowerPM25concRaw"
    /* eslint-disable-next-line @typescript-eslint/camelcase */
    var sensorbotRequest: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        method: "get",
        headers: {"X-Authorization": "Bearer " + currentAccessToken}
    }
    var sensorbotResponse = UrlFetchApp.fetch(deviceUrlString, sensorbotRequest)
    var sensorbotDatum: SensorbotData = JSON.parse(sensorbotResponse.getContentText())
    if (!!sensorbotResponse.getResponseCode() === true) {
        console.log("sensorbot response status: " + sensorbotResponse.getResponseCode())
    }
    var sensorbotDataPoint = JSON.parse(sensorbotResponse.getContentText())
    console.log("sensorbot response payload: " + sensorbotResponse.getContentText())
    if ("plantowerPM25concRaw" in sensorbotDataPoint && Array.isArray(sensorbotDataPoint.plantowerPM25concRaw) && sensorbotDataPoint.plantowerPM25concRaw.length > 0 &&  "ts" in sensorbotDataPoint.plantowerPM25concRaw[0]  && (!!sensorbotDataPoint.plantowerPM25concRaw[0].ts) === true && "value" in sensorbotDataPoint.plantowerPM25concRaw[0] && (!!sensorbotDataPoint.plantowerPM25concRaw[0].value) == true) {
        // update spreadsheet

        var rowContents = [sensorbotDataPoint.plantowerPM25concRaw[0].ts, sensorbotDataPoint.plantowerPM25concRaw[0].value]
        var activeSheet = SpreadsheetApp.getActiveSpreadsheet()
        var currentSheet: GoogleAppsScript.Spreadsheet.Sheet|null = null
        if (activeSheet !== null) {
            currentSheet = activeSheet.appendRow(rowContents)
        }
        if (currentSheet !== null) {
            return;
        }
    } else {
        console.error("Failed to read valid data from sensorbot")
    }
    if (!!sensorbotDatum.message === true) {
        if (!!sensorbotDatum.status == true) {
            console.warn("status returned by sensorbot: " + sensorbotDatum.status);
        }
        console.warn("message from sensorbot: " + sensorbotDatum.message);
    }
    SpreadsheetApp.getUi().showModelessDialog(html,"Enter sensorbot id")        
    return;
    
}

export function doPost(e: WebappEvent): void {
    if (e.parameters !== undefined) {
        var pubid = e.parameters["publicId"][0]
        CacheService.getUserCache().put("pubId", e.parameters["publicId"][0])
        console.log("got publicid = " + pubid + " from user " + Session.getActiveUser().getUserLoginId())
        insertData();
    } else {
        console.log("empty parameters list sent from POST request")
    }
}

export function setPubIdPlusInsertData(pubId: string): void {
    console.log("value of pubid set by user " + Session.getActiveUser().getUserLoginId() + " was " + pubId);
    CacheService.getUserCache().put("pubId",pubId);
    insertData();
}
