interface KeyValueArray {
   [idx:string]: string[]
}

interface PostData {
   [idx:string]: string|number
   length: number;
   type: string;
   contents: string;
   name: string;
}

interface WebappEvent {
   [idx:string]: any;
   queryString: string;
   parameter: string;
   parameters: KeyValueArray;
   contextPath: string;
   contentLength: number; 
   postData: PostData;
}
