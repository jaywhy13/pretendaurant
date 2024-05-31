import { CustomerInLine, Line } from "../types";
import { customerClient, CustomerClient } from "./Customer";
import { RemoteCustomerInLine, RemoteLine } from "./types";

export type LineParameters = Omit<Partial<Line>, "id">;
export type RemoteLineParameters = Omit<Partial<RemoteLine>, "id">;

export enum LineOrderBy {
  CUSTOMERS_IN_LINE = "CUSTOMERS_IN_LINE",
}

export enum Order {
  ASCENDING = "ASC",
  DESCENDING = "DESC",
}

export interface ListArguments {
  orderBy?: LineOrderBy;
  order?: Order;
  filters?: ListFilters;
}

export interface ListFilters {
  cashierId?: string;
}

/**
 * The LineClient provides access to the state of lines and the cashier
 * assigned to them, along with the customers in line.
 *
 * Some interesting things to consider here:
 * - Should the line know about the customer?
 * - Should be flexible enough to support other types of objects in the line? e.g. staff members
 */
export class LineClient {
  private REMOTE_LINES: RemoteLine[] = [];
  private REMOTE_CUSTOMERS_IN_LINE: RemoteCustomerInLine[] = [];
  private customerClient: CustomerClient;

  public constructor(customerClient?: CustomerClient) {
    this.customerClient = customerClient || new CustomerClient();
  }

  public list(listArguments?: ListArguments): Line[] {
    let lines = this.REMOTE_LINES.map((line) => {
      const remoteCustomersInLine = this.getRemoteCustomersInLine(line.id);
      return this.toLocalLine(line, remoteCustomersInLine);
    });

    const filters = listArguments?.filters;
    if (filters && "cashierId" in filters) {
      const { cashierId } = filters;
      lines = lines.filter((line) => line.cashierId === cashierId);
    }

    if (listArguments?.orderBy === LineOrderBy.CUSTOMERS_IN_LINE) {
      lines = lines.sort((line1: Line, line2: Line) => {
        const numberOfCustomersInLine1 = line1.customersInLine.filter(
          (remoteCustomerInLine) => remoteCustomerInLine.lineId === line1.id,
        ).length;
        const numberOfCustomersInLine2 = line2.customersInLine.filter(
          (remoteCustomerInLine) => remoteCustomerInLine.lineId === line2.id,
        ).length;

        if (listArguments.order === Order.DESCENDING) {
          return numberOfCustomersInLine2 - numberOfCustomersInLine1;
        }
        return numberOfCustomersInLine1 - numberOfCustomersInLine2;
      });
    }
    return lines;
  }

  public get(id: string): Line | undefined {
    const remoteLine = this.REMOTE_LINES.find((candidateLine) => candidateLine.id === id);
    const remoteCustomersInLine = this.getRemoteCustomersInLine(id);

    if (remoteLine) {
      return this.toLocalLine(remoteLine, remoteCustomersInLine);
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
    return this.toLocalLine(remoteLine, this.getRemoteCustomersInLine(id));
  }

  private updateRemote(id: string, params: RemoteLineParameters): RemoteLine {
    const index = this.REMOTE_LINES.findIndex((candidateLine) => candidateLine.id === id);
    let remoteLine = this.REMOTE_LINES[index];

    if (remoteLine) {
      remoteLine = {
        ...remoteLine,
        ...params,
      };
      this.REMOTE_LINES[index] = remoteLine;
    }
    return remoteLine;
  }

  private getRemote(id: string): RemoteLine | undefined {
    const index = this.REMOTE_LINES.findIndex((candidateLine) => candidateLine.id === id);
    if (index >= 0) {
      return this.REMOTE_LINES[index];
    }
  }

  private getRemoteCustomersInLine(lineId: string): RemoteCustomerInLine[] {
    return this.REMOTE_CUSTOMERS_IN_LINE.filter((remoteCustomerInLine) => remoteCustomerInLine.lineId === lineId);
  }

  public addCustomerToLine(lineId: string, customerId: string): CustomerInLine {
    const remoteCustomer = this.customerClient.getRemote(customerId);
    const remoteCustomerInLine = {
      lineId,
      customer: remoteCustomer!,
      joinedAt: new Date().getTime(),
    };
    this.REMOTE_CUSTOMERS_IN_LINE.push(remoteCustomerInLine);
    return this.toLocalCustomerInLine(remoteCustomerInLine);
  }

  public removeCustomerFromLine(lineId: string, customerId: string) {
    const index = this.REMOTE_CUSTOMERS_IN_LINE.findIndex(
      (remoteCustomerInLine) =>
        remoteCustomerInLine.customer?.id === customerId && remoteCustomerInLine.lineId === lineId,
    );
    if (index >= 0) {
      this.REMOTE_CUSTOMERS_IN_LINE.splice(index, 1);
    }
  }

  public getCustomersInLine(lineId: string): CustomerInLine[] {
    return this.REMOTE_CUSTOMERS_IN_LINE.filter(
      (remoteCustomerInLine) => remoteCustomerInLine.lineId === lineId,
    ).map((remoteCustomerInLine) => this.toLocalCustomerInLine(remoteCustomerInLine));
  }

  public addCashierToLine(lineId: string, cashierId: string): Line | undefined {
    const remoteLine = this.getRemote(lineId);
    if (remoteLine) {
      const updatedRemoteLine = this.updateRemote(lineId, { cashierId });
      const remoteCustomersInLine = this.getRemoteCustomersInLine(lineId);
      return this.toLocalLine(updatedRemoteLine, remoteCustomersInLine);
    }
  }

  public removeCashierFromLine(lineId: string, cashierId: string): Line | undefined {
    const remoteLine = this.getRemote(lineId);
    if (remoteLine && remoteLine.cashierId === cashierId) {
      const updatedRemoteLine = this.updateRemote(lineId, { cashierId: undefined });
      const remoteCustomersInLine = this.getRemoteCustomersInLine(lineId);
      return this.toLocalLine(updatedRemoteLine, remoteCustomersInLine);
    }
  }

  public getLinesWithoutCashiers(): Line[] {
    return this.REMOTE_LINES.filter((line) => line.cashierId === undefined).map((remoteLine) => {
      const remoteCustomersInLine = this.getRemoteCustomersInLine(remoteLine.id);
      return this.toLocalLine(remoteLine, remoteCustomersInLine);
    });
  }

  public getEmptiestLine(): Line | undefined {
    let emptiestLine: Line | undefined;
    let smallestLineLength = Number.MAX_SAFE_INTEGER;
    this.REMOTE_LINES.forEach((remoteLine) => {
      const customersInLine = this.REMOTE_CUSTOMERS_IN_LINE.filter(
        (remoteCustomerInLine) => remoteCustomerInLine.lineId === remoteLine.id,
      );
      if (customersInLine.length < smallestLineLength) {
        smallestLineLength = customersInLine.length;
        emptiestLine = this.toLocalLine(remoteLine, this.getRemoteCustomersInLine(remoteLine.id));
      }
    });
    return emptiestLine;
  }

  private toLocalLine(remoteLine: RemoteLine, remoteCustomersInLine: RemoteCustomerInLine[]): Line {
    const localCustomersInLine = remoteCustomersInLine.map((remoteCustomerInLine) =>
      this.toLocalCustomerInLine(remoteCustomerInLine),
    );

    return {
      id: remoteLine.id,
      cashierId: remoteLine.cashierId,
      customersInLine: localCustomersInLine,
    };
  }

  private toLocalCustomerInLine(remoteCustomerInLine: RemoteCustomerInLine): CustomerInLine {
    const localCustomer = {
      id: remoteCustomerInLine.customer.id,
      patience: remoteCustomerInLine.customer.patience,
    };
    return { lineId: remoteCustomerInLine.lineId, customer: localCustomer };
  }
}

export const lineClient = new LineClient(customerClient);
