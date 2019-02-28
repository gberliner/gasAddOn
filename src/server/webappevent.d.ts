declare interface KeyValueArray {
   [idx:string]: string[]
}

declare interface PostData {
   [idx:string]: string|number
   length: number;
   type: string;
   contents: string;
   name: string;
}

declare interface WebappEvent {
   [idx:string]: any;
   queryString?: string|undefined;
   parameter?: string|undefined;
   parameters?: KeyValueArray|undefined;
   contextPath?: string|undefined;
   contentLength?: number|undefined; 
   postData?: PostData|undefined;
}
