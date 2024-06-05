import { Fulfillment } from "../types";
import { v4 as uuidv4 } from "uuid";
import { RemoteFulfillment } from "./types";

export type FulfillmentParams = Omit<Fulfillment, "id">;

export class FulfillmentClient {
  private CUSTOMERS_SERVED: RemoteFulfillment[] = [];

  public serveCustomer(params: FulfillmentParams): Fulfillment {
    const fulfillment = {
      id: uuidv4(),
      ...params,
    };
    this.CUSTOMERS_SERVED = [...this.CUSTOMERS_SERVED, fulfillment];
    return this.toLocalFulfillment(fulfillment);
  }

  public list(lineId: string, customerId: string): Fulfillment[] {
    return this.CUSTOMERS_SERVED.filter(
      (fulfillment) => fulfillment.customerId === customerId && fulfillment.lineId === lineId
    ).map((remoteFulfillment) => this.toLocalFulfillment(remoteFulfillment));
  }

  private toLocalFulfillment(remoteFulfillment: RemoteFulfillment): Fulfillment {
    return {
      ...remoteFulfillment,
    };
  }
}

export const fulfilmentClient = new FulfillmentClient();
