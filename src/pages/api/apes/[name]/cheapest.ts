import { getXcpBtcRate, satoshisToBitcoin } from 'bitcoin-conversion';
import Decimal from 'decimal.js-light';
import type { NextApiHandler } from 'next';
import { Counterparty } from '../../../../modules/shared/lib/Counterparty';

const cp = new Counterparty();
const handler: NextApiHandler = async (req, res) => {
  const { name } = req.query;
  if (typeof name !== 'string') {
    return res.status(400).end();
  }

  const [dispensers, orders, xcpRate] = await Promise.all([
    cp.getDispensersByAssetName(name),
    cp.getOrdersByAssetName(name),
    getXcpBtcRate(),
  ]);

  const cheapestDispenser = dispensers.length
    ? dispensers.reduce((prev, dispenser) => {
        return Math.min(prev, satoshisToBitcoin(dispenser.satoshirate));
      }, Number.MAX_SAFE_INTEGER)
    : undefined;

  const cheapestOrder = orders.length
    ? orders
        .filter((o) => o.get_asset === 'XCP')
        .reduce((prev, order) => {
          const priceInBtc = satoshisToBitcoin(
            new Decimal(xcpRate).mul(order.get_quantity).div(order.give_quantity).toNumber()
          );
          return Math.min(prev, priceInBtc);
        }, Number.MAX_SAFE_INTEGER)
    : undefined;

  res.json({ cheapestPrice: getCheapestPrice({ cheapestDispenser, cheapestOrder }) });
};

const getCheapestPrice = ({ cheapestDispenser, cheapestOrder }: CheapestPriceParams) => {
  if (cheapestDispenser && !cheapestOrder) return cheapestDispenser;
  if (!cheapestDispenser && cheapestOrder) return cheapestOrder;
  if (cheapestDispenser && cheapestOrder) return Math.min(cheapestDispenser, cheapestOrder);
  return null;
};

type CheapestPriceParams = {
  cheapestDispenser: number | undefined;
  cheapestOrder: number | undefined;
};

export default handler;
