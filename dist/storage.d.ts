declare const obj_initiator: {
    array: () => any[];
    string: () => string;
    number: () => number;
};
export declare class storage_helper<database_entries extends Record<string, any>> {
    private readonly scheme;
    private readonly db_path;
    constructor(scheme: Record<keyof database_entries, keyof typeof obj_initiator>, db_path?: string);
    getDBPath(): string;
    get_db(): Promise<database_entries>;
    private save_db;
    private init_empty_value;
    get_value<the_key extends keyof database_entries>(key: the_key): Promise<database_entries[the_key]>;
    set_value<the_key extends keyof database_entries>(key: the_key, value: database_entries[the_key]): Promise<void>;
}
export {};
