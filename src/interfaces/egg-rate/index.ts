import { SupplierInterface } from 'interfaces/supplier';
import { GetQueryInterface } from 'interfaces';

export interface EggRateInterface {
  id?: string;
  rate: number;
  supplier_id: string;
  city: string;
  created_at?: any;
  updated_at?: any;

  supplier?: SupplierInterface;
  _count?: {};
}

export interface EggRateGetQueryInterface extends GetQueryInterface {
  id?: string;
  supplier_id?: string;
  city?: string;
}
