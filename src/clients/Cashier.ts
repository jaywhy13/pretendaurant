import { v4 as uuidv4 } from 'uuid';
import { Cashier } from '../types';
import { RemoteCashier } from './types';

const REMOTE_CASHIER_DATA: RemoteCashier[] = [];

export type CashierProperties = Omit<Partial<Cashier>, "id">;
export type RemoteCashierProperties = Omit<Partial<RemoteCashier>, "id">;

export class CashierClient {
    public list(): Cashier[] {
        return REMOTE_CASHIER_DATA.map(remoteCashier => this.toLocalCashier(remoteCashier));
    }

    public create(speed: number): Cashier {
        const cashier: RemoteCashier = {
            id: uuidv4(),
            speed,
        }
        REMOTE_CASHIER_DATA.push(cashier);
        return this.toLocalCashier(cashier);
    }

    public get(id: string): Cashier | undefined {
        const remoteCashier = REMOTE_CASHIER_DATA.find(candidateCashier => candidateCashier.id === id);
        if (remoteCashier) {
            return this.toLocalCashier(remoteCashier);
        }
    }

    private getRemote(id: string): RemoteCashier | undefined {
        const index = REMOTE_CASHIER_DATA.findIndex(candidateCashier => candidateCashier.id === id);
        if (index >= 0) {
            return REMOTE_CASHIER_DATA[index];
        }
    }

    public update(id: string, properties: CashierProperties): Cashier | undefined {
        const remoteCashier = this.updateRemote(id, { ...properties })
        return remoteCashier ? this.toLocalCashier(remoteCashier) : undefined;
    }

    private updateRemote(id: string, properties: RemoteCashierProperties): RemoteCashier | undefined {
        const index = REMOTE_CASHIER_DATA.findIndex(candidateCashier => candidateCashier.id === id);
        if (index >= 0) {
            const remoteCashier = REMOTE_CASHIER_DATA[index];
            REMOTE_CASHIER_DATA[index] = {
                ...remoteCashier,
                ...properties
            }
            return this.toLocalCashier(remoteCashier);
        }
    }

    private toLocalCashier(cashier: RemoteCashier): Cashier {
        return {
            ...cashier
        }
    }
}

export const cashierClient = new CashierClient();