For the fololowing workflow, return in javascript

const phone = "+17787754146";
const tenantId = "f0555d1a-5da7-4d15-b864-a1c6b16458a8";

Give code to auth a user

if the user does not exist,
give code as a function to create them,

then give code to get the customer linked to the user,

if no customer,
give code as a function to create the customer linked to the user (c-u),

then give code to get the last order linked to the user (lo-u),

if no last order,
get the default last order using orderId = xxx, customerId = xxx (d-lo),
give code as a function to create a last order linked to the customer (lo-c)
usimg data from (d-lo),

    get the default order items using orderId = xxx, customerId = xxx (d-oi),
    give code as a function to create order items linked to the last order linked to the customer (oi-clo)


then get the porposed order for the customer

if no proposed order,
give the code as a function to get the last order of the customer (lo_c) with the order items as an array list of json objects
give code as a function to create a proposed order linked to the customer (po-c)
