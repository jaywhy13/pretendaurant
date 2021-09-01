import { Customer } from '../types';
import { CustomerClient } from '../clients/Customer';
import { RemoteCustomer } from '../clients/types';

type CustomerParameters = Omit<Partial<Customer>, "id">;


class CustomerService {
    client: CustomerClient

    public constructor(client: CustomerClient) {
        this.client = client;
    }

    public list(): Customer[] {
        const remoteCustomers = this.client.list();
        return remoteCustomers.map(remoteCustomer => this.toLocalCustomer(remoteCustomer));
    }


    public create(patience: number): Customer {
        return this.toLocalCustomer(this.client.create(patience))
    }

    public get(customerId: string): Customer | undefined {
        const remoteCustomer = this.client.get(customerId);
        return remoteCustomer ? this.toLocalCustomer(remoteCustomer) : undefined;
    }

    public update(id: string, parameters: CustomerParameters) {
        this.client.update(id, parameters)
    }

    private toLocalCustomer(remoteCustomer: RemoteCustomer): Customer {
        return {
            id: remoteCustomer.id,
            patience: remoteCustomer.patience,
        }
    }

}

export const customerService = new CustomerService(new CustomerClient());