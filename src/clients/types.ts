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
}

export interface RemoteCustomerInLine {
  customer: RemoteCustomer;
  lineId: string;
  joinedAt: number;
}

export interface RemoteFulfillment {
    id: string;
    customerId: string;
    lineId: string;
    cashierId: string;
    duration: number;
}
