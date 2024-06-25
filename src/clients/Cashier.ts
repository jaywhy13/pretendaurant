import { v4 as uuidv4 } from "uuid";
import { Cashier } from "../types";
import { RemoteCashier } from "./types";

export type CashierProperties = Omit<Partial<Cashier>, "id">;
export type RemoteCashierProperties = Omit<Partial<RemoteCashier>, "id">;

export class CashierClient {
  REMOTE_CASHIER_DATA: RemoteCashier[] = [];

  public async list(): Promise<Cashier[]> {
    return this.REMOTE_CASHIER_DATA.map((remoteCashier) => this.toLocalCashier(remoteCashier));
  }

  public async create(speed: number): Promise<Cashier> {
    const cashier: RemoteCashier = {
      id: uuidv4(),
      speed,
    };
    this.REMOTE_CASHIER_DATA.push(cashier);
    return this.toLocalCashier(cashier);
  }

  public async get(id: string): Promise<Cashier | undefined> {
    console.log("remote cashier data for get", this.REMOTE_CASHIER_DATA);
    const remoteCashier = this.REMOTE_CASHIER_DATA.find(
      (candidateCashier) => candidateCashier.id === id
    );
    if (remoteCashier) {
      console.log("remote cashier data after get", remoteCashier);
      return this.toLocalCashier(remoteCashier);
    }
  }

  private getRemote(id: string): RemoteCashier | undefined {
    const index = this.REMOTE_CASHIER_DATA.findIndex(
      (candidateCashier) => candidateCashier.id === id
    );
    if (index >= 0) {
      return this.REMOTE_CASHIER_DATA[index];
    }
  }

  public async update(id: string, properties: CashierProperties): Promise<Cashier | undefined> {
    const remoteCashier = this.updateRemote(id, { ...properties });
    return remoteCashier ? this.toLocalCashier(remoteCashier) : undefined;
  }

  private updateRemote(id: string, properties: RemoteCashierProperties): RemoteCashier | undefined {
    console.log("remote cashier data", this.REMOTE_CASHIER_DATA);
    const index = this.REMOTE_CASHIER_DATA.findIndex(
      (candidateCashier) => candidateCashier.id === id
    );
    if (index >= 0) {
      const remoteCashier = this.REMOTE_CASHIER_DATA[index];
      const updatedCashier = {
        ...remoteCashier,
        ...properties,
      }
      this.REMOTE_CASHIER_DATA[index] = updatedCashier
      console.log("remote cashier data after update", this.REMOTE_CASHIER_DATA);
      return this.toLocalCashier(updatedCashier);
    }
  }

  private toLocalCashier(cashier: RemoteCashier): Cashier {
    return {
      ...cashier,
    };
  }
}

export const cashierClient = new CashierClient();
