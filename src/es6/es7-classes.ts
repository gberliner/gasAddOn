export function something() {} // export found, so this module is considered 'external'

class Person {
    public name = "Amit Agarwal";

    public greet = () => `Hello ${this.name}!!`;

    public getFirstName = () => {
        const [firstName] = this.name.split(" ");
        return firstName;
    };

    public static country = "India";

    public static sayHello = () => {
        Logger.log("Hello World!!");
    };
}

const person = new Person();
Logger.log(person.getFirstName());
Logger.log(Person.country);

Person.sayHello();
