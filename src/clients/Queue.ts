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
    console.log("Removing customer from the queue", customerId);
    this.QUEUE = this.QUEUE.filter(
      (candidateCustomerId: string) => candidateCustomerId !== customerId
    );
    console.log("See queue after removing customer", this.QUEUE)
  }

  public list(): string[] {
    console.log("Listing queue", this.QUEUE)
    return [...this.QUEUE];
  }
}

