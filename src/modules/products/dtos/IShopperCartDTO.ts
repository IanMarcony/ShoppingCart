import ISaleItemDTO from "./ISaleItemDTO";

export default interface IShopperCartDTO {
  items: ISaleItemDTO[];
  total: number;
}