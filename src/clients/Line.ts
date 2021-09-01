import { Customer } from "../types";
import { RemoteLine } from "./types";

const LINES: RemoteLine[] = [];

type RemoteLineParameters = Omit<Partial<RemoteLine>, "id">;

export class LineClient {
    public list(): RemoteLine[] {
        return LINES.map(line => ({ id: line.id, cashierId: line.cashierId, customersInLine: line.customersInLine }))
    }

    public get(id: string): RemoteLine | undefined {
        return LINES.find(candidateLine => candidateLine.id === id);
    }

    public create(params: RemoteLineParameters): RemoteLine {
        const id = LINES.length.toString();
        const line: RemoteLine = {
            id,
            customersInLine: [],
            cashierId: undefined,
            ...params,
        };
        LINES.push(line);
        return { ...line };
    }

    public update(id: string, params: RemoteLineParameters): RemoteLine {
        const index = LINES.findIndex(candidateLine => candidateLine.id === id);
        const line = LINES[index];
        const updatedLine = {
            ...line,
            ...params
        };
        // console.log("Updated line", updatedLine, "with params", params);
        LINES[index] = updatedLine;
        return updatedLine;
    }

    public addCustomerToLine(lineId: string, customerId: string) {
        const line = this.get(lineId);
        if (line) {
            const customerInLine = {
                lineId,
                customerId,
                joinedAt: new Date().getTime()
            }
            this.update(line.id, { customersInLine: [...line.customersInLine || [], customerInLine] })
        }
    }

    public removeCustomerFromLine(lineId: string, customerId: string) {
        const line = this.get(lineId);
        const customersWithoutGivenCustomer = line?.customersInLine.filter(candidateCustomerInLine => candidateCustomerInLine.customerId !== customerId) || [];
        if (line) {
            this.update(line.id, { customersInLine: [...customersWithoutGivenCustomer] })
        }
    }

    public addCashierToLine(lineId: string, cashierId: string): RemoteLine {
        return this.update(lineId, { cashierId });
    }

    public getEmptiestLine() {
        let emptiestLine = LINES[0];
        LINES.forEach((line) => {
            if (line.customersInLine.length < emptiestLine.customersInLine.length) {
                emptiestLine = line;
            }
        })
        return emptiestLine;
    }

    public getLinesWithoutCashiers() {
        return LINES.filter(line => line.cashierId === undefined)
    }
}

export const lineClient = new LineClient();