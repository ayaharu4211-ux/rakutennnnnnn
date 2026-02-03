
export interface RakutenProduct {
  rank: number;
  itemName: string;
  itemUrl: string;
  itemPrice: number;
  mediumImageUrls: string[];
  shopName: string;
  affiliateUrl: string;
}

export enum Genre {
  ALL = '0',
  FASHION = '100371',
  COSMETICS = '100939',
  FOOD = '100227',
  SWEETS = '100236',
  INTERIOR = '100804',
  ELECTRONICS = '562630',
  BABY = '100533',
  DAILY_GOODS = '215783',
  SPORTS = '101070',
  KITCHEN = '558944',
  GIFT = '101438',
  BOOKS = '100033',
  TOYS = '101164'
}
