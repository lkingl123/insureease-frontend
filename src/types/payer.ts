import { Payer, Product, PayerContact } from '@prisma/client'

export type FullPayer = Payer & {
  products: Product[]
  contacts: PayerContact[]
}
