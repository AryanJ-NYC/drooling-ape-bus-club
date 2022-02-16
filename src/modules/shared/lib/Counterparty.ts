import { CounterpartyClient, Dispenser } from 'counterparty-node-client';

export class Counterparty extends CounterpartyClient {
  constructor() {
    super('http://api.counterparty.io:4000/api/', 'rpc', 'rpc');
  }

  async getDispensersByAssetName(assetName: string) {
    try {
      return this.getDispensers({
        filters: [
          { field: 'asset', op: '==', value: assetName },
          { field: 'give_remaining', op: '>=', value: 1 },
          { field: 'give_quantity', op: '>=', value: 1 },
        ],
        order_by: 'satoshirate',
        order_dir: 'asc',
        status: 0,
      });
    } catch {
      return [];
    }
  }

  async getDispensersByAssetNames(assetNames: string[]): Promise<Dispenser[]> {
    try {
      return this.getDispensers({
        filters: [
          { field: 'asset', op: 'IN', value: assetNames },
          { field: 'give_remaining', op: '>=', value: 1 },
          { field: 'give_quantity', op: '>=', value: 1 },
        ],
        order_by: 'satoshirate',
        order_dir: 'asc',
        status: 0,
      });
    } catch {
      return [];
    }
  }

  async getOrdersByAssetName(assetName: string) {
    try {
      return this.getOrders({
        filters: [
          { field: 'give_asset', op: '==', value: assetName },
          { field: 'give_remaining', op: '>=', value: 1 },
        ],
        order_by: 'block_index',
        order_dir: 'desc',
        status: 'open',
      });
    } catch {
      return [];
    }
  }

  async getordersByAssetNames(assetNames: string[]) {
    try {
      return this.getOrders({
        filters: [
          { field: 'give_asset', op: 'IN', value: assetNames },
          { field: 'give_remaining', op: '>=', value: 1 },
        ],
        order_by: 'block_index',
        order_dir: 'desc',
        status: 'open',
      });
    } catch {
      return [];
    }
  }
}
