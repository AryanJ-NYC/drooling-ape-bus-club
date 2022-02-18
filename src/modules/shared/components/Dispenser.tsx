import { satoshisToBitcoin } from 'bitcoin-conversion';
import type { Dispenser as DispenserType } from 'counterparty-node-client';
import React from 'react';
import { toast } from 'react-hot-toast';
import { FaCopy } from 'react-icons/fa';
import QRCode from 'react-qr-code';
import useSWR from 'swr';
import { useClipboard } from 'use-clipboard-copy';
import { Counterparty } from '../lib/Counterparty';

const counterparty = new Counterparty();
export const Dispenser: React.FC<{ dispenser: DispenserType }> = ({
  dispenser: initialDispenser,
}) => {
  const clipboard = useClipboard();
  console.log({ initialDispenser });
  const { data: dispensesPending } = useSWR(
    [initialDispenser.source, 'mempool'],
    async (source) => {
      const _ = await counterparty.getMempool();
      return _.filter((m) => m.category === 'dispenses')
        .map((m) => JSON.parse(m.bindings))
        .filter((m) => m.source === source)
        .reduce((sum, dispense) => sum + dispense.dispense_quantity, 0);
    },
    { refreshInterval: 1000 * 60 * 5 }
  );
  const { data: dataDispenser } = useSWR(
    [initialDispenser.tx_index, 'get_by_tx_hash'],
    async (_txHash) => counterparty.getDispenserByTxIndex(_txHash),
    { fallbackData: initialDispenser, refreshInterval: 1000 * 60 * 5 }
  );
  const dispenser = dataDispenser ?? initialDispenser;

  if (dispenser.give_remaining - dispensesPending <= 0) return null;

  const priceInBtc = satoshisToBitcoin(dispenser.satoshirate);
  const bitcoinUrl = `bitcoin:${dispenser.source}?amount=${priceInBtc}`;
  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-lg space-y-1">
      <div className="flex items-baseline space-x-2">
        <p>{priceInBtc.toFixed(8)} BTC</p>
        <FaCopy
          className="cursor-pointer text-gray-500"
          onClick={() => {
            clipboard.copy(priceInBtc);
            toast.success(`${priceInBtc} copied`);
          }}
        />
      </div>
      <div className="flex items-baseline space-x-2">
        <p>{dispenser.source}</p>
        <FaCopy
          className="cursor-pointer text-gray-500"
          onClick={() => {
            clipboard.copy(dispenser.source);
            toast.success(`${dispenser.source} copied`);
          }}
        />
      </div>
      <a
        className="text-cyan-500 hover:text-cyan-800"
        href={`https://xchain.io/tx/${dispenser.tx_hash}`}
        target="_blank"
        rel="noreferrer"
      >
        Xchain Dispenser
      </a>
      <a className="flex justify-center" href={bitcoinUrl}>
        <QRCode value={bitcoinUrl} />
      </a>
      <p>{dispenser.give_remaining} Remaining</p>
      {dispensesPending > 0 && <p>{dispensesPending} Purchases Pending</p>}
    </div>
  );
};
