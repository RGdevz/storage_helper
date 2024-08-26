declare const objInitiator: {
    array: () => any[];
    string: () => string;
    number: () => number;
};
export declare class storage_helper<databaseEntries extends Record<string, any>> {
    private readonly scheme;
    private readonly databaseFilePath;
    constructor(scheme: Record<keyof databaseEntries, keyof typeof objInitiator>, dataPath: string);
    getDBPath(): string;
    getDatabase(): Promise<databaseEntries>;
    private saveDatabase;
    private initEmptyValue;
    getValue<the_key extends keyof databaseEntries>(key: the_key): Promise<databaseEntries[the_key]>;
    setValue<the_key extends keyof databaseEntries>(key: the_key, value: databaseEntries[the_key]): Promise<void>;
}
export {};
