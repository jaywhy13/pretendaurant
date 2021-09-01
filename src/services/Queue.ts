class QueueService {

    QUEUE: string[] = [];

    public addCustomer(customerId: string) {
        this.QUEUE.push(customerId);
    }

    public removeCustomer(customerId: string) {
        this.QUEUE = this.QUEUE.filter((candidateCustomerId: string) => candidateCustomerId !== customerId);
    }

    public list(): string[] {
        return [...this.QUEUE];
    }
}

export const queueService = new QueueService();