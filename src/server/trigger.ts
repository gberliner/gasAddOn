export const deleteTrigger = (fnName: string) => {
    ScriptApp.getProjectTriggers().forEach(trigger => {
        if (trigger.getHandlerFunction() === fnName) {
            ScriptApp.deleteTrigger(trigger);
        }
    });
};

export const addTrigger = (fnName: string) => {
    let triggerFound = false;
    ScriptApp.getProjectTriggers().forEach(trigger => {
        if (trigger.getHandlerFunction() === fnName) {
            triggerFound = true;
        }
    });

    if (!triggerFound) {
        ScriptApp.newTrigger(fnName)
            .timeBased()
            .everyHours(1)
            .create();
    }
};
