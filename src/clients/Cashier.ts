import { v4 as uuidv4 } from 'uuid';
import { RemoteCashier } from './types';

const CASHIER_DATA: RemoteCashier[] = [];

export class CashierClient {
    public list(): RemoteCashier[] {
        return CASHIER_DATA;
    }

    public create(speed: number): RemoteCashier {
        const cashier: RemoteCashier = {
            id: uuidv4(),
            speed,
        }
        CASHIER_DATA.push(cashier);
        return cashier;
    }

    public get(id: string): RemoteCashier | undefined {
        return CASHIER_DATA.find(candidateCashier => candidateCashier.id === id);
    }

    public update(cashier: RemoteCashier) {
        const matchingCashier = CASHIER_DATA.find((candidate) => candidate.id === cashier.id);
        if (matchingCashier) {
            matchingCashier.speed = cashier.speed;
        }
    }
}

export const cashierClient = new CashierClient();