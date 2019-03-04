import {onOpen,  insertData, setPubIdPlusInsertData, configureSettingsPlusInsertData} from "./server/sheetapp";

/// <reference path = "globals.d.ts" />
global.onOpen = onOpen;
global.insertData = insertData;
global.setPubIdPlusInsertData = setPubIdPlusInsertData;
global.configureSettingsPlusInsertData = configureSettingsPlusInsertData;
