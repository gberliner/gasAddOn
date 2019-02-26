import { expBackoff } from './utils';

export function getPropertyStore(this: any) {
    if (!this.store) {
        this.store = expBackoff(() => PropertiesService.getUserProperties());
    }
    return this.store;
}

export function getProperty(propertyName: string) {
    return getPropertyStore().getProperty(propertyName) || '';
}

export function setProperty(name: string, value: string) {
    getPropertyStore().setProperty(name, value);
}

export function deleteProperty(propertyName: string) {
    getPropertyStore().deleteProperty(propertyName);
}
