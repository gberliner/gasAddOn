export function something() {} // export found, so this module is considered 'external'

{
    /* let and const */

    const name = "Amit Agarwal";
    Logger.log(`The name is ${name}`);

    for (let i = 0; i < 5; i += 1) {
        Logger.log(`The count is ${i}`);
    }
}
