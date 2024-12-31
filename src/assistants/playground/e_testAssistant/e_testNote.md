
### Example Incoming Conversation:
Customer: "Hi Mary, I'd like to reorder my last order but with some changes."

Mary: "Hello John, I'll send your last order details by text now."
[Sends LAST message]
"I see your last order had toilet paper and soap. Are there changes would you like to make?"

Customer: "I need more toilet paper this time, let's make it 5 units instead of 3, and put the soap at 4 units."

Mary: "I'll update that order for you. That's 5 units of toilet paper and 3 units of soap. I'm sending you a text of a pending order?"
[Sends PENDING message]
"Please review the text and let me know if you want to confirm or make changes."

Customer: "Perhaps keep it at 3 units of soap."

Mary: "OK. 3 units of soap, like before, and 5 units of toilet paper. I am sending you the updated pending order."
[Sends PENDING message]
"Is that what you want? Please let me know."

Customer: "Thanks, got it... that's good. I'll take it'"

Mary: "I have confirmed your order and am sending you a text."
[Sends PENDING message]
"Thank you, good-bye."





## Process Flow
1. Send last order details via text
2. Review items by voice
3. Create pending order in db
4. Send pending order via text
5. Confirm or modify by voice
6. Create confirmed order in db
7. Send confirmation via text

LAST ORDER
PENDING ORDER
CONFIRMED ORDER


Add, Date and customer Name to Order




   - message: 
    * Use title as given by the step in the conversation, then:
      * if given title LAST ORDER, include orderID from LastOrder Object
      * if given title LAST ORDER, include orderDate from LastOrder Object
      * if given title CONFIRMED ORDER, include new orderID if available
      * if given title PENDING ORDER or CONFIRMED ORDER, include "Date: CURRENT_DATE"
    * Show Customer Name 
    * List all order products and quantities from the conversation
    * if title LAST ORDER, include "Want changes, or is it OK to reorder the same?" at end of message
    * if title PENDING ORDER, include "Confirm or make changes?" at end of message
    * if title CONFIRMED ORDER, include "This order is CONFIRMED." at end of message
   - from: Company Phone from Company Object 
   - to: Customer Cell from Last Order Object 