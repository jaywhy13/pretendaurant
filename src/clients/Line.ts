import { Line } from "../types";
import { RemoteLine } from "./types";

const REMOTE_LINES: RemoteLine[] = [];

export type LineParameters = Omit<Partial<Line>, "id">;
export type RemoteLineParameters = Omit<Partial<RemoteLine>, "id">;

export class LineClient {
    public list(): Line[] {
        return REMOTE_LINES.map(line => this.toLocalLine(line))
    }

    public get(id: string): Line | undefined {
        const remoteLine = REMOTE_LINES.find(candidateLine => candidateLine.id === id);
        if (remoteLine) {
            return this.toLocalLine(remoteLine);
        }
    }

    public create(params: LineParameters): Line {
        const id = REMOTE_LINES.length.toString();
        const remoteLine: RemoteLine = {
            id,
            customersInLine: [],
            cashierId: undefined,
            ...params,
        };
        REMOTE_LINES.push(remoteLine);
        return this.toLocalLine(remoteLine);
    }

    public update(id: string, params: LineParameters): Line {
        const index = REMOTE_LINES.findIndex(candidateLine => candidateLine.id === id);
        const remoteLine = REMOTE_LINES[index];
        const updatedRemoteLine = {
            ...remoteLine,
            ...params
        };
        // console.log("Updated line", updatedRemoteLine, "with params", params);
        REMOTE_LINES[index] = updatedRemoteLine;
        return this.toLocalLine(updatedRemoteLine);
    }

    private updateRemote(id: string, params: RemoteLineParameters): RemoteLine {
        const index = REMOTE_LINES.findIndex(candidateLine => candidateLine.id === id);
        const remoteLine = REMOTE_LINES[index];
        if (remoteLine) {
            REMOTE_LINES[index] = {
                ...remoteLine,
                ...params
            }
        }
        return remoteLine;
    }

    private getRemote(id: string): RemoteLine | undefined {
        const index = REMOTE_LINES.findIndex(candidateLine => candidateLine.id === id);
        if (index >= 0) {
            return REMOTE_LINES[index];
        }
    }

    public addCustomerToLine(lineId: string, customerId: string): Line | undefined {
        const remoteLine = this.getRemote(lineId);
        if (remoteLine) {
            const customerInLine = {
                lineId,
                customerId,
                joinedAt: new Date().getTime()
            }
            return this.toLocalLine(this.updateRemote(lineId, {
                customersInLine: [...remoteLine.customersInLine || [], customerInLine]
            }))
        }
    }

    public removeCustomerFromLine(lineId: string, customerId: string) {
        const remoteLine = this.getRemote(lineId);
        if (remoteLine) {
            const customersWithoutGivenCustomer = remoteLine?.customersInLine.filter(candidateCustomerInLine => candidateCustomerInLine.customerId !== customerId) || [];
            return this.toLocalLine(this.updateRemote(lineId, {
                customersInLine: [...customersWithoutGivenCustomer]
            }))
        }
    }

    public addCashierToLine(lineId: string, cashierId: string): Line | undefined {
        const remoteLine = this.getRemote(lineId);
        if (remoteLine) {
            return this.toLocalLine(this.updateRemote(lineId, {
                cashierId
            }))
        }
    }

    public getEmptiestLine(): Line | undefined {
        if (REMOTE_LINES.length > 0) {
            let emptiestLine = REMOTE_LINES[0];
            REMOTE_LINES.forEach((line) => {
                if (line.customersInLine.length < emptiestLine.customersInLine.length) {
                    emptiestLine = line;
                }
            })
            return this.toLocalLine(emptiestLine);
        }
    }

    public getLinesWithoutCashiers(): Line[] {
        return REMOTE_LINES.filter(line => line.cashierId === undefined).map(remoteLine => this.toLocalLine(remoteLine))
    }

    private toLocalLine(remoteLine: RemoteLine): Line {
        return { id: remoteLine.id, cashierId: remoteLine.cashierId, customerIds: remoteLine.customersInLine.map(customerInLine => customerInLine.customerId) }
    }

}

export const lineClient = new LineClient();