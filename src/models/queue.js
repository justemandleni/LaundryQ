class LaundryQueue {
    constructor() {
      this.washerQueue = []; // { phone: string, joinedAt: timestamp }
      this.dryerQueue = [];
      this.activeWasher = null; // { phone: string, startedAt: timestamp }
      this.activeDryer = null;
    }
  
    addToQueue(type, phone) {
      const queue = type === 'washer' ? this.washerQueue : this.dryerQueue;
      if (!queue.find((entry) => entry.phone === phone)) {
        queue.push({ phone, joinedAt: Date.now() });
      }
    }
  
    removeFromQueue(type, phone) {
      const queue = type === 'washer' ? this.washerQueue : this.dryerQueue;
      const index = queue.findIndex((entry) => entry.phone === phone);
      if (index !== -1) queue.splice(index, 1);
    }
  
    startCycle(type, phone) {
      if (type === 'washer') {
        this.activeWasher = { phone, startedAt: Date.now() };
      } else {
        this.activeDryer = { phone, startedAt: Date.now() };
      }
      this.removeFromQueue(type, phone);
    }
  
    endCycle(type) {
      if (type === 'washer') this.activeWasher = null;
      else this.activeDryer = null;
    }
  
    getNext(type) {
      const queue = type === 'washer' ? this.washerQueue : this.dryerQueue;
      return queue.length > 0 ? queue[0] : null;
    }
  
    getQueueStatus(type) {
      const queue = type === 'washer' ? this.washerQueue : this.dryerQueue;
      const active = type === 'washer' ? this.activeWasher : this.activeDryer;
      return { queue, active };
    }
  }
  
  module.exports = new LaundryQueue();