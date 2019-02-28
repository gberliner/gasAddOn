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
   queryString: string;
   parameter: string;
   parameters: KeyValueArray;
   contextPath: string;
   contentLength: number; 
   postData: PostData;
}
