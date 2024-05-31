/**
  * This class is responsible for managing customers who
  * haven't yet entered a line.
  * CUstomers are transitioned from the queue to a line
  */
export class QueueClient {

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

export const queueClient = new QueueClient();
