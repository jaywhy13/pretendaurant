import { Customer } from '../types';
import { v4 as uuidv4 } from 'uuid';

const CUSTOMER_DATA: Customer[] = [];


class CustomerService {
    public list(): Customer[] {
        return CUSTOMER_DATA;
    }

    public create(patience: number): Customer {
        const customer: Customer = {
            id: uuidv4(),
            patience,
        }
        CUSTOMER_DATA.push(customer);
        return customer;
    }

    public update(customer: Customer) {
        const matchingCustomer = CUSTOMER_DATA.find((candidate) => candidate.id === customer.id);
        if (matchingCustomer) {
            matchingCustomer.patience = customer.patience;
        }
    }
}

export const customerService = new CustomerService();