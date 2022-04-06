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

export interface Fulfillment {
    id: string;
    customerId: string;
    lineId: string;
    cashierId: string;
    duration: number;
}
