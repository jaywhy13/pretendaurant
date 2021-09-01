import { lineClient, LineClient } from "../clients/Line";
import { RemoteLine } from "../clients/types";
import { Customer, Line } from "../types";

type LineParameters = Omit<Partial<Line>, "id">;

class LineService {

    client: LineClient;

    public constructor(client: LineClient) {
        this.client = client;
    }

    private toLocalLine(remoteLine: RemoteLine): Line {
        return {
            id: remoteLine.id,
            customerIds: remoteLine.customersInLine.map(customerInLine => customerInLine.customerId),
            cashierId: remoteLine.cashierId,
        }
    }

    public list(): Line[] {
        const remoteLines = this.client.list();
        return remoteLines.map((remoteLine) => this.toLocalLine(remoteLine));
    }

    public get(id: string): Line | undefined {
        const remoteLine = this.client.get(id);
        return remoteLine ? this.toLocalLine(remoteLine) : undefined;
    }

    public create(params: LineParameters): Line {
        return this.toLocalLine(this.client.create(params));
    }

    public update(id: string, params: LineParameters): Line {
        return this.toLocalLine(this.client.update(id, params));
    }

    public addCustomerToLine(lineId: string, customerId: string) {
        this.client.addCustomerToLine(lineId, customerId);
    }

    public removeCustomerFromLine(lineId: string, customerId: string) {
        this.client.removeCustomerFromLine(lineId, customerId);
    }

    public addCashierToLine(lineId: string, cashierId: string): Line {
        return this.toLocalLine(this.client.addCashierToLine(lineId, cashierId));
    }

    public getEmptiestLine() {
        return this.client.getEmptiestLine();
    }

    public getLinesWithoutCashiers() {
        return this.client.getLinesWithoutCashiers();
    }
}

export const lineService = new LineService(lineClient);