export enum ROLE {
    Admin = 1,
    User = 2,
    Salesman = 3
}

export const COMPANY = {
  name: 'Dynamo Stitches',
  tagline: 'EMBROIDERY. DIGITIZING. EXCELLENCE.',
  email: 'accounts@dynamostitches.com',
  orderEmail: 'order@dynamostitches.com',
  phone: '+1 469-819-2874',
  website: 'www.dynamostitches.com',
  address: '[ Your Company Address Here ]',
}

// Billing entity details shown in the invoice PDF's "Bill From" section
export const BILL_FROM = {
  name: "Dynamo Stitches LLC",
  email: "accounts@dynamostitches.com",
  phone: "+1 469-819-2874",
  address: "5900 Balcones Drive #18641 Austin, TX, 78731, USA",
  taxId: "35-2971957",
};