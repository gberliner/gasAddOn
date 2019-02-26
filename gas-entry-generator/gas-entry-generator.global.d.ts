declare namespace GasEntryGenerator {
    export interface global {
      [idx:string]: (anyArg?:any)=>any
    }
}

declare var global: GasEntryGenerator.global;
