export interface Template {
    id: string;
    name: string;
    mappings: Mapping[];
}

export interface Mapping {
    jsonKey: string;
    selector: string;
}
