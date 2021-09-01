import { RemoteCustomer } from "./types";
import { v4 as uuidv4 } from 'uuid';

type RemoteCustomerParameters = Omit<Partial<RemoteCustomer>, "id">;

export class CustomerClient {
    CUSTOMER_DATA: RemoteCustomer[] = [];

    public list(): RemoteCustomer[] {
        return this.CUSTOMER_DATA;
    }

    public get(id: string): RemoteCustomer | undefined {
        return this.CUSTOMER_DATA.find(customer => customer.id === id);
    }

    public create(patience: number): RemoteCustomer {
        const customer: RemoteCustomer = {
            id: uuidv4(),
            patience,
        }
        this.CUSTOMER_DATA.push(customer);
        return customer;
    }

    public update(id: string, parameters: RemoteCustomerParameters) {
        const matchingCustomer = this.get(id);
        if (matchingCustomer) {
            this.CUSTOMER_DATA = this.CUSTOMER_DATA.map((remoteCustomer) => {
                if (remoteCustomer.id === id) {
                    return {
                        ...matchingCustomer,
                        ...parameters
                    }
                }
                return remoteCustomer;
            })
        }
    }




}