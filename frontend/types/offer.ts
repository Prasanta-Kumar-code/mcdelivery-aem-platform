export interface Offer {
  _path?: string;
  offerId: string;
  title: string;
  description?: string;
  offerType?: string;
  value?: number;
  currency?: string;
  promoCode?: string;
  terms?: string;
  isActive?: boolean;
}
