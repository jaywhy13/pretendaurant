import { Fulfillment } from '../types'

class FulfillmentService {

    CUSTOMERS_SERVED: Fulfillment[] = [];

    public serveCustomer(lineId: string, customerId: string, cashierId: string): Fulfillment {
        const fulfillment = {
            lineId,
            customerId,
            cashierId,
            duration: 0
        }
        console.log(cashierId, "is serving ", customerId);
        this.CUSTOMERS_SERVED = [...this.CUSTOMERS_SERVED,
            fulfillment];
        return fulfillment;
    }

    public list(lineId: string, customerId: string): Fulfillment[] {
        return this.CUSTOMERS_SERVED.filter(fulfillment => fulfillment.customerId === customerId && fulfillment.lineId === lineId);
    }
}

export const fulfilmentService = new FulfillmentService();