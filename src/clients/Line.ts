import { CustomerInLine, Line } from "../types";
import { RemoteCustomerInLine, RemoteLine } from "./types";


export type LineParameters = Omit<Partial<Line>, "id">;
export type RemoteLineParameters = Omit<Partial<RemoteLine>, "id">;

export enum LineOrderBy {
    CUSTOMERS_IN_LINE = 'CUSTOMERS_IN_LINE'
}

export enum Order {
    ASCENDING = 'ASC',
    DESCENDING = 'DESC'
}

export interface ListArguments {
    orderBy?: LineOrderBy,
    order?: Order,
    filters?: ListFilters
}

export interface ListFilters {
    cashierId?: string;
}


/**
 * Some interesting things to consider here:
 * - Should the line know about the customer?
 * - Should be flexible enough to support other types of objects in the line? e.g. staff members
 */
export class LineClient {
    private REMOTE_LINES: RemoteLine[] = [];
    private REMOTE_CUSTOMERS_IN_LINE: RemoteCustomerInLine[] = [];


    public list(listArguments?: ListArguments): Line[] {
        let lines = this.REMOTE_LINES.map(line => this.toLocalLine(line))

        const filters = listArguments?.filters;
        if (filters && "cashierId" in filters) {
            const { cashierId } = filters;
            lines = lines.filter(line => line.cashierId === cashierId);
        }


        if (listArguments?.orderBy) {
            lines = lines.sort((line1: Line, line2: Line) => {
                const customersInLine1 = this.REMOTE_CUSTOMERS_IN_LINE.filter(remoteCustomerInLine => remoteCustomerInLine.lineId === line1.id).length;
                const customersInLine2 = this.REMOTE_CUSTOMERS_IN_LINE.filter(remoteCustomerInLine => remoteCustomerInLine.lineId === line2.id).length;

                if (listArguments.order === Order.DESCENDING) {
                    return customersInLine2 - customersInLine1;
                }
                return customersInLine1 - customersInLine2;
            })
        }
        return lines;
    }

    public get(id: string): Line | undefined {
        const remoteLine = this.REMOTE_LINES.find(candidateLine => candidateLine.id === id);
        if (remoteLine) {
            return this.toLocalLine(remoteLine);
        }
    }

    public create(params: LineParameters): Line {
        const id = this.REMOTE_LINES.length.toString();
        const { cashierId } = params;
        const remoteLine: RemoteLine = {
            id,
            cashierId,
        };
        this.REMOTE_LINES.push(remoteLine);
        return this.toLocalLine(remoteLine);
    }

    private updateRemote(id: string, params: RemoteLineParameters): RemoteLine {
        const index = this.REMOTE_LINES.findIndex(candidateLine => candidateLine.id === id);
        let remoteLine = this.REMOTE_LINES[index];

        if (remoteLine) {
            remoteLine = {
                ...remoteLine,
                ...params
            }
            this.REMOTE_LINES[index] = remoteLine;
        }
        return remoteLine;
    }

    private getRemote(id: string): RemoteLine | undefined {
        const index = this.REMOTE_LINES.findIndex(candidateLine => candidateLine.id === id);
        if (index >= 0) {
            return this.REMOTE_LINES[index];
        }
    }

    public addCustomerToLine(lineId: string, customerId: string): CustomerInLine {
        const remoteCustomerInLine = {
            lineId,
            customerId,
            joinedAt: new Date().getTime()
        }
        this.REMOTE_CUSTOMERS_IN_LINE.push(remoteCustomerInLine);

        return this.toLocalCustomerInLine(remoteCustomerInLine);
    }

    public removeCustomerFromLine(lineId: string, customerId: string) {
        const index = this.REMOTE_CUSTOMERS_IN_LINE.findIndex(remoteCustomerInLine => remoteCustomerInLine.customerId === customerId && remoteCustomerInLine.lineId === lineId);
        if (index >= 0) {
            this.REMOTE_CUSTOMERS_IN_LINE.splice(index, 1);
        }
    }

    public getCustomersInLine(lineId: string): CustomerInLine[] {
        return this.REMOTE_CUSTOMERS_IN_LINE.filter(remoteCustomerInLine => remoteCustomerInLine.lineId === lineId).map(remoteCustomerInLine => this.toLocalCustomerInLine(remoteCustomerInLine))
    }

    public addCashierToLine(lineId: string, cashierId: string): Line | undefined {
        const remoteLine = this.getRemote(lineId);
        if (remoteLine) {
            return this.toLocalLine(this.updateRemote(lineId, {
                cashierId
            }))
        }
    }

    public removeCashierFromLine(lineId: string, cashierId: string): Line | undefined {
        const remoteLine = this.getRemote(lineId);
        if (remoteLine) {
            return this.toLocalLine(this.updateRemote(lineId, {
                cashierId: undefined
            }))
        }
    }


    public getLinesWithoutCashiers(): Line[] {
        return this.REMOTE_LINES.filter(line => line.cashierId === undefined).map(remoteLine => this.toLocalLine(remoteLine))
    }

    private toLocalLine(remoteLine: RemoteLine): Line {
        return { id: remoteLine.id, cashierId: remoteLine.cashierId }
    }

    private toLocalCustomerInLine(remoteCustomerInLine: RemoteCustomerInLine): CustomerInLine {
        return { lineId: remoteCustomerInLine.lineId, customerId: remoteCustomerInLine.customerId }
    }

}

export const lineClient = new LineClient();