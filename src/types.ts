export interface Cashier {
    id: string;
    speed: number;
}

export interface Customer {
    id: string;
    patience: number;
}

export interface Line {
    id: string;
    cashierId?: string;
    customerIds: string[];
}

