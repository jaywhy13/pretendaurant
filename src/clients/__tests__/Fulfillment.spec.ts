import { FulfillmentClient } from '../Fulfillment'
import { v4 as uuidv4 } from 'uuid';

describe('Fulfillment Client', () => {
    let fulfillmentClient: FulfillmentClient;

    beforeEach(() => {
        fulfillmentClient = new FulfillmentClient();
    })

    it('records served customers', () => {
        const customerId = uuidv4();
        const lineId = uuidv4();
        const cashierId = uuidv4();
        const duration = 10;

        fulfillmentClient.serveCustomer({ lineId, customerId, cashierId, duration })

        const fulfillments = fulfillmentClient.list(lineId, customerId);

        expect(fulfillments.length).toEqual(1);

        expect(fulfillments[0]).toMatchObject({ lineId, cashierId, customerId, duration })
    })
})