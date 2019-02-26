declare interface Global {
  [idx:string]: (anyArg?:any)=>any
}
declare var global: Global
