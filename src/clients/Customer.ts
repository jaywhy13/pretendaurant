import { RemoteCustomer } from "./types";
import { v4 as uuidv4 } from "uuid";
import { Customer } from "../types";
import { faker } from '@faker-js/faker';
faker.seed(123);

type RemoteCustomerParameters = Omit<Partial<RemoteCustomer>, "id">;
type CustomerParameters = Omit<Partial<Customer>, "id">;


export class CustomerClient {
  REMOTE_CUSTOMER_DATA: RemoteCustomer[] = [];

  public async list(): Promise<Customer[]> {
    return this.REMOTE_CUSTOMER_DATA.map((remoteCustomer) => this.toLocalCustomer(remoteCustomer));
  }

  public async get(id: string): Promise<Customer | undefined> {
    const remoteCustomer = this.REMOTE_CUSTOMER_DATA.find((customer) => customer.id === id);
    if (remoteCustomer) {
      return this.toLocalCustomer(remoteCustomer);
    }
  }

  public async getRemote(id: string): Promise<RemoteCustomer | undefined> {
    console.log("Getting remote customer with id", id, this.REMOTE_CUSTOMER_DATA, this, toString())
    const result = this.REMOTE_CUSTOMER_DATA.find((customer) => customer.id === id);
    console.log("Customer.getRemote Got remote customer", result)
    return result;
  }

  public async create(params: CustomerParameters): Promise<Customer> {
    const customer: RemoteCustomer = {
      id: uuidv4(),
      patience: params.patience!,
      name: faker.person.firstName(),
    };
    this.REMOTE_CUSTOMER_DATA.push(customer);
    console.log("Customer created", this.REMOTE_CUSTOMER_DATA, this, toString())
    return this.toLocalCustomer(customer);
  }

  private updateRemote(id: string, params: RemoteCustomerParameters): RemoteCustomer | undefined {
    const index = this.REMOTE_CUSTOMER_DATA.findIndex((remoteCustomer) => remoteCustomer.id === id);
    if (index >= 0) {
      const remoteCustomer = this.REMOTE_CUSTOMER_DATA[index];
      this.REMOTE_CUSTOMER_DATA[index] = {
        ...remoteCustomer,
        ...params,
      };
      return this.REMOTE_CUSTOMER_DATA[index];
    }
  }

  public async update(id: string, parameters: RemoteCustomerParameters): Promise<Customer | undefined> {
    const remoteCustomer = this.updateRemote(id, parameters);
    return remoteCustomer ? this.toLocalCustomer(remoteCustomer) : undefined;
  }

  private toLocalCustomer(remoteCustomer: RemoteCustomer): Customer {
    return {
      ...remoteCustomer,
    };
  }
}

