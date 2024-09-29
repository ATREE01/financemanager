import { Bank } from "./bank";

export interface CreateBank
  extends Omit<
    Bank,
    | "id"
    | "currency"
    | "userId"
    | "order"
    | "stockBuyRecords"
    | "stockBundleSellRecords"
  > {
  currencyId: number;
}
