export interface Store {
  _path?: string;
  storeId: string;
  name: string;
  address?: string;
  phone?: string;
  openingHours?: string;
  serviceModes?: string;
  timezone?: string;
  isActive?: boolean;
  temporaryClosure?: boolean;
}
