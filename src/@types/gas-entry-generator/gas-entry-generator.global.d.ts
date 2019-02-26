
declare module 'gas-entry-generator' {
    export interface global {
      [idx:string]: (anyArg?:any)=>any
    }
    export var global: global
}
