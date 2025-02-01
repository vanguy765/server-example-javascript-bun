
## Available Tools
sendSms({
  from: string,
  to: string,
  message: string
})

createOrder({
  userID: string,
  status: string,
  lineItems: Array<{
    id: string,
    name: string,
    size: string,
    quantity: string
  }>
})


## Message Templates
### LAST Message Template:
{
  "message": `LAST ORDER
Order ID: ${LastOrder.orderID}
Date: ${LastOrder.orderDate}
- ${LastOrder.itemsOrdered[0].quantity} units ${LastOrder.itemsOrdered[0].name}: ${LastOrder.itemsOrdered[0].size}
- ${LastOrder.itemsOrdered[1].quantity} units ${LastOrder.itemsOrdered[1].name}: ${LastOrder.itemsOrdered[1].size}
Reply to review or make changes.`,
  "from": Company.companyPhone,
  "to": LastOrder.userCell
}

### PENDING Message Template:
{
  "message": `PENDING ORDER
- ${pendingItems[0].quantity} units ${pendingItems[0].name}: ${pendingItems[0].size}
- ${pendingItems[1].quantity} units ${pendingItems[1].name}: ${pendingItems[1].size}
Reply 'YES' to confirm or indicate changes.
Reference: Previous Order #${LastOrder.orderID}
(Order #${NewOrder.orderID} PENDING till confirmed)`,
  "from": Company.companyPhone,
  "to": LastOrder.userCell
}

### CONFIRM Message Template:
{
  "message": `CONFIRMED ORDER #${NewOrder.orderID}
For ${LastOrder.userName}
Date: ${currentDate}
- ${confirmedItems[0].quantity} units ${confirmedItems[0].name}: ${confirmedItems[0].size}
- ${confirmedItems[1].quantity} units ${confirmedItems[1].name}: ${confirmedItems[1].size}
This order is CONFIRMED.`,
  "from": Company.companyPhone,
  "to": LastOrder.userCell
}