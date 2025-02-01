// demo/src/functionsDb/companyTable/getCompanyByPhoneNumber.ts

import { number } from "zod";

export const getCompanyByPhoneNumber = (companyId: string) => {
  return mockGetCompany;
};

const mockGetCompany = {
  ID: "345",
  name: "Acme Supplies Inc.",
  phone: {
    landline: "+12367055080",
    mobile: "+12367055080",
  },
  agents: [
    {
      name: "default",
      phoneId: "+12367055080",
    },
  ],
};
