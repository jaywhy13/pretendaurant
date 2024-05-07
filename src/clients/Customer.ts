import { RemoteCustomer } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { Customer } from "../types";

type RemoteCustomerParameters = Omit<Partial<RemoteCustomer>, "id">;
type CustomerParameters = Omit<Partial<Customer>, "id">;

export class CustomerClient {
    REMOTE_CUSTOMER_DATA: RemoteCustomer[] = [];

    public list(): Customer[] {
        return this.REMOTE_CUSTOMER_DATA.map(remoteCustomer => this.toLocalCustomer(remoteCustomer));
    }

    public get(id: string): Customer | undefined {
        const remoteCustomer = this.REMOTE_CUSTOMER_DATA.find(customer => customer.id === id);
        if (remoteCustomer) {
            return this.toLocalCustomer(remoteCustomer);
        }
    }

    public getRemote(id: string): RemoteCustomer | undefined {
        return this.REMOTE_CUSTOMER_DATA.find((customer) => customer.id === id);
    }

    public create(params: CustomerParameters): Customer {
        const customer: RemoteCustomer = {
            id: uuidv4(),
            patience: params.patience!
        }
        this.REMOTE_CUSTOMER_DATA.push(customer);
        return this.toLocalCustomer(customer);
    }

    private updateRemote(id: string, params: RemoteCustomerParameters): RemoteCustomer | undefined {
        const index = this.REMOTE_CUSTOMER_DATA.findIndex(remoteCustomer => remoteCustomer.id === id);
        if (index >= 0) {
            const remoteCustomer = this.REMOTE_CUSTOMER_DATA[index];
            this.REMOTE_CUSTOMER_DATA[index] = {
                ...remoteCustomer,
                ...params
            }
            return this.REMOTE_CUSTOMER_DATA[index];
        }
    }

    public update(id: string, parameters: RemoteCustomerParameters): Customer | undefined {
        const remoteCustomer = this.updateRemote(id, parameters);
        return remoteCustomer ? this.toLocalCustomer(remoteCustomer) : undefined;
    }

    private toLocalCustomer(remoteCustomer: RemoteCustomer): Customer {
        return {
            ...remoteCustomer
        }
    }
}

export const customerClient = new CustomerClient();