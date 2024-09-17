jest.useFakeTimers();
describe("test", () => {
  it("this is the test", async () => {
    async function simpleTimer(callback) {
      await callback();

      setTimeout(() => {
        simpleTimer(callback);
      }, 1000);
    }

    const callback = jest.fn();
    await simpleTimer(callback);

    jest.advanceTimersByTime(8000);

    expect(callback).toHaveBeenCalledTimes(8);
  });


  it('execution order', async () => {
    const order = [];
    order.push('1');
    setTimeout(() => { order.push('6'); }, 0);
    const promise = new Promise(resolve => {
      order.push('2');
      resolve();
    }).then(() => {
      order.push('4');
    });
    order.push('3');
    await promise;
    order.push('5');
    jest.advanceTimersByTime(0);
    expect(order).toEqual(['1', '2', '3', '4', '5', '6']);
  });


  it.only('understanding execution order', async () => {
    const order = [];

    order.push('1');
    const promise = new Promise(resolve => {
      // This is executed synchronously
      order.push('2');
      // This marks the promise as resolved
      // and queues the then in the microtask queue
      resolve();
    }).then(() => {
      order.push('5');
    })
    // Then it continues processing from the stack
    order.push('3')
    order.push('4')
    // This runs the "then" and queues the rest
    // in the microtask queue
    await promise;
    setTimeout(() => { order.push('8') });
    order.push('6');
    order.push('7');
    jest.advanceTimersByTime(0);
    expect(order).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);

  });
});
