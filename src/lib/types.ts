export type UUID = string;

export type AccountDTO = {
  id: UUID;
  created_at?: string;
  updated_at?: string;
  name: string;
  type: string;
  currency: string;
  balance: string;         // numeric приходит строкой
  is_shared: boolean;
  owner_user_id: UUID;
};

export type OperationType = "income" | "expense" | "transfer";

export type OperationDTO = {
  id: UUID;
  created_at: string;
  op_date: string;
  op_time: string | null;
  user_id: UUID;
  account_id: UUID;
  type: OperationType;
  category_id: UUID | null;
  amount: string;          // numeric -> строка
  currency: string;
  description: string | null;
  transfer_account_id: UUID | null;
  counterparty_user_id: UUID | null;
  external_id: string | null;
};
