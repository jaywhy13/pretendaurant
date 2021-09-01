import { Cashier } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { cashierClient, CashierClient } from '../clients/Cashier';
import { RemoteCashier } from '../clients/types';

class CashierService {
    client: CashierClient;

    public constructor(client: CashierClient) {
        this.client = client;
    }

    public list(): Cashier[] {
        const remoteCashiers = this.client.list();
        return remoteCashiers.map((remoteCashier) => this.toLocalCashier(remoteCashier))
    }

    public create(speed: number): Cashier {
        return this.toLocalCashier(this.client.create(speed));
    }

    public get(id: string): Cashier | undefined {
        const remoteCashier = this.client.get(id);
        return remoteCashier ? this.toLocalCashier(remoteCashier) : undefined;
    }

    public update(cashier: Cashier) {
        this.client.update(cashier);
    }

    private toLocalCashier(remoteCashier: RemoteCashier): Cashier {
        return {
            id: remoteCashier.id,
            speed: remoteCashier.speed,
        }
    }
}

export const cashierService = new CashierService(cashierClient);