import { satoshisToBitcoin } from 'bitcoin-conversion';
import type { Order as OrderType } from 'counterparty-node-client';
import React from 'react';

export const Order: React.FC<Props> = ({ order }) => {
  return (
    <a href={`https://xchain.io/tx/${order.tx_hash}`} target="_blank" rel="noreferrer">
      <div className="rounded-md shadow-lg bg-gray-50 p-4">
        <p>
          You Give: {satoshisToBitcoin(order.get_quantity)} {order.get_asset}
        </p>
        <p>
          You Get: {order.give_quantity} {order.give_asset}
        </p>
      </div>
    </a>
  );
};

type Props = { order: OrderType };
