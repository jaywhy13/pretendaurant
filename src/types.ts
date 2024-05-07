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
  id: string;
  cashierId?: string;
  customersInLine: CustomerInLine[];
}

export interface CustomerInLine {
    lineId: string;
    customerId: string;
}

export interface Fulfillment {
    id: string;
    customerId: string;
    lineId: string;
    cashierId: string;
    duration: number;
}
