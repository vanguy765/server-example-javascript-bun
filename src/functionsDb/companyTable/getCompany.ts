// src/functionsDb/companyTable/getCompany.ts

export const getCompany = (companyId: string) => {
  return mockGetCompany;
};

const mockGetCompany = {
  ID: "345",
  name: "Acme Supplies Inc.",
  phone: {
    number: "+12367055080",
  },
};
