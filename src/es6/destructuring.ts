const person = {
    name: "Amit Agarwal",
    website: "https://digitalinspiration.com/",
    email: "amit@labnol.org"
};

type CountryOrUndefined = string | undefined;
var { name, email, ...rest } = person;
function tryˀ<T>(exp: () => T, d: T) {
    try {
        let val = exp();
        if (val != null) {
            return val;
        }
    } catch {}
    return d;
}
var country: string = tryˀ(
    () => Object.create(null).getOwnPropertyDescriptor(rest, "country").value,
    "not known"
);
//if (person.hasOwnProperty("country")) {
//   country = person.getProperty(country
//} else {
//   country = "not known"
//}

Logger.log(`${name}'s email address is ${email}. Their country is ${country}`);

interface MyObj {
    items: { data: string }[];
}
// eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
const myObj: MyObj = {} as MyObj;

// Default
const result2 = tryˀ(() => myObj.items[0].data, "Default");

export default person;
