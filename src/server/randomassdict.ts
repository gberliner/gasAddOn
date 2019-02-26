export function something() {} // export found, so this module is considered 'external'

interface RandomAss {
   [parm:string]:string;
   beta: string;
   gamma: string;
   delta: string;
};
const randomAss: RandomAss = {
   beta: "beta",
   gamma: "gamma",
   delta: "delta"
};

function myFunc(str: string): string {
    return str;
}

function hasKey<O>(obj: O, key: string|number|symbol): key is keyof O {
    return key in obj
}

function returnKey(desiredLetter: string): string {
if (hasKey(randomAss, desiredLetter)) {
    return randomAss[desiredLetter];
} else {
    return "Unknown letter";
}
	}


const letter = returnKey("delta");

console.log("leter = " + letter)
