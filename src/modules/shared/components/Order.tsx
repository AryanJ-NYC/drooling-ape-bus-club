import { satoshisToBitcoin, xcpToBitcoin } from 'bitcoin-conversion';
import type { Order as OrderType } from 'counterparty-node-client';
import React, { useEffect, useState } from 'react';

export const Order: React.FC<Props> = ({ order }) => {
  const [priceInBtc, setPriceInBtc] = useState<number | null>(null);
  useEffect(() => {
    const getAndSetPriceInBtc = async () => {
      if (order.get_asset === 'XCP') {
        setPriceInBtc(
          await xcpToBitcoin(satoshisToBitcoin(order.get_quantity / order.give_quantity))
        );
      }
    };
    void getAndSetPriceInBtc();
  }, [order]);

  return (
    <a href={`https://xchain.io/tx/${order.tx_hash}`} target="_blank" rel="noreferrer">
      <div className="rounded-md shadow-lg bg-gray-50 p-4">
        <p>
          You Give:{' '}
          {order.get_asset === 'XCP' ? satoshisToBitcoin(order.get_quantity) : order.get_quantity}{' '}
          {order.get_asset}
          {priceInBtc ? ` (~${priceInBtc} BTC each)` : null}
        </p>
        <p>
          You Get: {order.give_quantity} {order.give_asset}
        </p>
      </div>
    </a>
  );
};

type Props = { order: OrderType };
