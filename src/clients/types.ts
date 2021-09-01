export interface RemoteCustomer {
    id: string;
    patience: number;
}

export interface RemoteCashier {
    id: string;
    speed: number;
}

export interface RemoteLine {
    id: string;
    cashierId?: string;
    customersInLine: RemoteCustomerInLine[];
}

export interface RemoteCustomerInLine {
    customerId: string;
    lineId: string;
    joinedAt: number;
}
