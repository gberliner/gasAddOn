class Person {
    public name: string;
    public gender: string;
    public constructor(name = "Anonymous", gender = "Unknown") {
        this.name = name;
        this.gender = gender;
    }

    public printDetails(): string {
        return `${this.name} is ${this.gender}`;
    }
}

const person = new Person("Amit Agarwal", "male");
Logger.log(person.printDetails());

class Employee extends Person {
    public role: string;
    public constructor(name: string, gender: string, role: string) {
        super(name, gender);
        this.role = role;
    }

    public printRole(): string {
        return `${this.name} is ${this.role}`;
    }
}

const employee = new Employee("Amit", "male", "Google Developer");
Logger.log(employee.printDetails());
Logger.log(employee.printRole());
export { Person, Employee };
