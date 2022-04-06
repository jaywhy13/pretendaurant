import { CashierClient } from "../Cashier"
import { getRandomInt } from "./factories";

describe('Cashier', () => {
    let cashierClient: CashierClient;

    beforeEach(() => {
        cashierClient = new CashierClient();
    })

    describe('create', () => {
        it('should create cashiers with supplied attributes', () => {
            const speed = getRandomInt(10);
            const cashier = cashierClient.create(speed);
            expect(cashier.speed).toBe(speed);
        })
    })

    describe('list', () => {
        it('should list existing cashiers', () => {
            const speed = getRandomInt(10);
            const cashier = cashierClient.create(speed);
            expect(cashierClient.list()).toEqual([cashier]);
        })
    })

    describe('get', () => {
        it('should get existing cashier', () => {
            const speed = getRandomInt(10);
            const cashier = cashierClient.create(speed);
            expect(cashierClient.get(cashier.id)).toEqual(cashier);
        })

        it('should return undefined for non-existent cashier', () => {
            expect(cashierClient.get('abcdef')).toBeUndefined();
        })
    })

    describe('update', () => {
        it('should update existing cashier', () => {
            const speed = 2;
            const cashier = cashierClient.create(speed);

            cashierClient.update(cashier.id, { speed: 10 });
            expect(cashierClient.get(cashier.id)?.speed).toEqual(10);

        })
    })
})