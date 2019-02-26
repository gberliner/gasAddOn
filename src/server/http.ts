export const makeQueryString = (url: string, params: {[key:string]:string;} = {}) => {
    const paramString = Object.keys(params)
        .map((key: string) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + paramString;
};

export const makeHttpGetRequest = (apiUrl: string, params: {[key:string]:string;}, accessToken: string) => {
    const url = makeQueryString(apiUrl, params);
    const response = UrlFetchApp.fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        muteHttpExceptions: true
    });
    return JSON.parse(response.getContentText());
};
