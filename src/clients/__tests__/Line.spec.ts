import { v4 as uuidv4 } from 'uuid';
import { LineClient, LineOrderBy, Order } from '../Line';


describe('Line Client', () => {
    let lineClient: LineClient;

    beforeEach(() => {
        lineClient = new LineClient();
    })

    describe('create', () => {
        it('creates lines with an ID', () => {
            const cashierId = uuidv4();
            const line = lineClient.create({ cashierId }
            );
            expect(line.id).toBeTruthy();
        })

        it('creates lines with cashier', () => {
            const cashierId = uuidv4();
            const line = lineClient.create({ cashierId }
            );
            expect(line).toMatchObject({ cashierId });
        })
    })

    describe('list', () => {

        it('orders lines by length ascending', () => {
            const lineWithTwoCustomers = lineClient.create({});
            [uuidv4(), uuidv4()].forEach(customerId => {
                lineClient.addCustomerToLine(lineWithTwoCustomers.id, customerId)
            })

            const lineWithOneCustomer = lineClient.create({});
            lineClient.addCustomerToLine(lineWithOneCustomer.id, uuidv4());

            const lineWithNoCustomers = lineClient.create({});

            const lines = lineClient.list({ order: Order.ASCENDING, orderBy: LineOrderBy.CUSTOMERS_IN_LINE })
            const lineIds = lines.map(line => line.id);

            expect(lineIds).toEqual([lineWithNoCustomers.id, lineWithOneCustomer.id, lineWithTwoCustomers.id])

        })

        it('orders lines by length descending', () => {
            const lineWithTwoCustomers = lineClient.create({});
            [uuidv4(), uuidv4()].forEach(customerId => {
                lineClient.addCustomerToLine(lineWithTwoCustomers.id, customerId)
            })

            const lineWithOneCustomer = lineClient.create({});
            lineClient.addCustomerToLine(lineWithOneCustomer.id, uuidv4());

            const lineWithNoCustomers = lineClient.create({});

            const lines = lineClient.list({ order: Order.DESCENDING, orderBy: LineOrderBy.CUSTOMERS_IN_LINE })
            const lineIds = lines.map(line => line.id);

            expect(lineIds).toEqual([lineWithTwoCustomers.id, lineWithOneCustomer.id, lineWithNoCustomers.id])

        })

        describe('filters', () => {
            it('returns cashier if correct ID is provided', () => {
                const cashierId = uuidv4();
                const line = lineClient.create({ cashierId })

                const lines = lineClient.list({ filters: { cashierId } })
                expect(lines).toHaveLength(1);

                expect(lines[0]).toMatchObject({ cashierId })
            })

            it('returns nothing if incorrect ID is provided', () => {
                const cashierId = uuidv4();
                const line = lineClient.create({ cashierId })

                // Pass a different ID
                const lines = lineClient.list({ filters: { cashierId: uuidv4() } })
                expect(lines).toHaveLength(0);
            })

            it('allows filtering by no cashiers', () => {
                const line = lineClient.create({}); // create line without cashier
                const lines = lineClient.list({ filters: { cashierId: undefined } })
                expect(lines).toHaveLength(1);
                expect(lines[0]).toMatchObject({ cashierId: undefined })
            })
        })
    })

    describe('customers in line', () => {
        it('add customers to the line', () => {
            const cashierId = uuidv4();
            const line = lineClient.create({ cashierId }
            );

            const customerId = uuidv4();
            const customerInLine = lineClient.addCustomerToLine(line.id, customerId);

            expect(customerInLine).toEqual({ lineId: line.id, customerId });
        })

        it('removes customers from the line', () => {
            const cashierId = uuidv4();
            const line = lineClient.create({ cashierId }
            );

            const customerId = uuidv4();
            const customerInLine = lineClient.addCustomerToLine(line.id, customerId);

            const anotherCustomerId = uuidv4();
            const anotherCustomerInLine = lineClient.addCustomerToLine(line.id, anotherCustomerId);

            lineClient.removeCustomerFromLine(line.id, customerId);

            const customersInLine = lineClient.getCustomersInLine(line.id);
            expect(customersInLine).not.toContainEqual(customerInLine);

            expect(customersInLine).toContainEqual(anotherCustomerInLine);

        })
    })

    describe('cashier', () => {
        it('adds cashier to the line', () => {
            const cashierId = uuidv4();
            const line = lineClient.create({});

            const updatedLine = lineClient.addCashierToLine(line.id, cashierId);

            expect(updatedLine).not.toBeUndefined();
            expect(updatedLine!.cashierId).toBe(cashierId);
        })

        it('removes cashier from the line', () => {
            const cashierId = uuidv4();
            const line = lineClient.create({ cashierId });

            const lineWithCashierRemoved = lineClient.removeCashierFromLine(line.id, cashierId);
            expect(lineWithCashierRemoved).not.toBeUndefined();
            expect(lineWithCashierRemoved!.cashierId).toBeUndefined();
        })
    })




})