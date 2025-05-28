import defaultFunctions from "../../functions";
import { FunctionCallPayload } from "../../types/vapi.types";

export const functionCallHandler = async (
  payload: FunctionCallPayload,
  functions: Record<string, Function> = defaultFunctions
) => {
  /**
   * Handle Business logic here.
   * You can handle function calls here. The payload will have function name and parameters.
   * You can trigger the appropriate function based your requirements and configurations.
   * You can also have a set of validators along with each functions which can be used to first validate the parameters and then call the functions.
   * Here Assumption is that the function are handling the fallback cases as well. They should return the appropriate response in case of any error.
   */

  console.log("Function Call Payload:", payload);

  //===================================================================================
  process.exit(1); // For debugging purposes, remove this in production
  //===================================================================================

  const { functionCall } = payload;

  if (!functionCall) {
    throw new Error("Invalid Request.");
  }

  const { name, parameters } = functionCall;

  async function handleFunctionCall(functionCall) {
    const { name, parameters } = functionCall;

    try {
      switch (name) {
        // Calendar & Scheduling
        case "schedule_appointment":
          return await scheduleAppointment(
            parameters.date,
            parameters.time,
            parameters.duration,
            parameters.description
          );

        case "get_availability":
          return await getAvailability(parameters.date, parameters.timeRange);

        case "cancel_appointment":
          return await cancelAppointment(parameters.appointmentId);

        case "reschedule_appointment":
          return await rescheduleAppointment(
            parameters.appointmentId,
            parameters.newDate,
            parameters.newTime
          );

        // Customer Management
        case "get_customer_info":
          return await getCustomerInfo(
            parameters.customerId || parameters.phone || parameters.email
          );

        case "update_customer_info":
          return await updateCustomerInfo(
            parameters.customerId,
            parameters.updates
          );

        case "create_customer":
          return await createCustomer(
            parameters.name,
            parameters.phone,
            parameters.email,
            parameters.address
          );

        // Order Management
        case "place_order":
          return await placeOrder(
            parameters.customerId,
            parameters.items,
            parameters.deliveryAddress
          );

        case "get_order_status":
          return await getOrderStatus(parameters.orderId);

        case "cancel_order":
          return await cancelOrder(parameters.orderId);

        case "modify_order":
          return await modifyOrder(parameters.orderId, parameters.changes);

        // Inventory & Product
        case "check_inventory":
          return await checkInventory(
            parameters.productId || parameters.productName
          );

        case "get_product_info":
          return await getProductInfo(
            parameters.productId,
            parameters.includePrice,
            parameters.includeStock
          );

        case "search_products":
          return await searchProducts(
            parameters.query,
            parameters.category,
            parameters.filters
          );

        // Payment & Billing
        case "process_payment":
          return await processPayment(
            parameters.amount,
            parameters.paymentMethod,
            parameters.customerId
          );

        case "get_payment_status":
          return await getPaymentStatus(
            parameters.paymentId || parameters.orderId
          );

        case "refund_payment":
          return await refundPayment(
            parameters.paymentId,
            parameters.amount,
            parameters.reason
          );

        case "get_invoice":
          return await getInvoice(parameters.invoiceId || parameters.orderId);

        // Support & Tickets
        case "create_support_ticket":
          return await createSupportTicket(
            parameters.customerId,
            parameters.issue,
            parameters.priority
          );

        case "get_ticket_status":
          return await getTicketStatus(parameters.ticketId);

        case "escalate_ticket":
          return await escalateTicket(parameters.ticketId, parameters.reason);

        // Notifications & Communication
        case "send_sms":
          return await sendSMS(parameters.phoneNumber, parameters.message);

        case "send_email":
          return await sendEmail(
            parameters.email,
            parameters.subject,
            parameters.body,
            parameters.template
          );

        case "schedule_reminder":
          return await scheduleReminder(
            parameters.customerId,
            parameters.message,
            parameters.scheduleTime
          );

        // Location & Delivery
        case "get_store_hours":
          return await getStoreHours(parameters.storeId, parameters.date);

        case "find_nearest_store":
          return await findNearestStore(
            parameters.address || parameters.zipCode
          );

        case "track_delivery":
          return await trackDelivery(
            parameters.orderId || parameters.trackingNumber
          );

        case "schedule_delivery":
          return await scheduleDelivery(
            parameters.orderId,
            parameters.address,
            parameters.timeSlot
          );

        // Analytics & Reporting
        case "get_call_summary":
          return await getCallSummary(parameters.callId);

        case "log_interaction":
          return await logInteraction(
            parameters.customerId,
            parameters.type,
            parameters.details
          );

        // Weather & External APIs
        case "get_weather":
          return await getWeather(parameters.location, parameters.date);

        case "get_business_hours":
          return await getBusinessHours(parameters.date);

        // Authentication & Verification
        case "verify_customer":
          return await verifyCustomer(
            parameters.phone,
            parameters.verificationCode || parameters.lastFourSSN
          );

        case "send_verification_code":
          return await sendVerificationCode(
            parameters.phone || parameters.email
          );

        // Utility Functions
        case "format_address":
          return await formatAddress(
            parameters.street,
            parameters.city,
            parameters.state,
            parameters.zipCode
          );

        case "validate_phone":
          return await validatePhone(parameters.phoneNumber);

        case "get_timezone":
          return await getTimezone(parameters.location);

        // Transfer & Escalation
        case "transfer_to_human":
          return await transferToHuman(
            parameters.department,
            parameters.reason,
            parameters.priority
          );

        case "transfer_to_department":
          return await transferToDepartment(
            parameters.department,
            parameters.context
          );

        // Database Operations
        case "search_database":
          return await searchDatabase(
            parameters.table,
            parameters.query,
            parameters.filters
          );

        case "update_record":
          return await updateRecord(
            parameters.table,
            parameters.recordId,
            parameters.updates
          );

        // Custom Business Logic
        case "calculate_shipping":
          return await calculateShipping(
            parameters.origin,
            parameters.destination,
            parameters.weight,
            parameters.dimensions
          );

        case "apply_discount":
          return await applyDiscount(
            parameters.customerId,
            parameters.discountCode,
            parameters.orderAmount
          );

        case "check_eligibility":
          return await checkEligibility(
            parameters.customerId,
            parameters.service || parameters.promotion
          );

        default:
          console.warn(`Unknown function call: ${name}`);
          return {
            success: false,
            error: `Function '${name}' is not recognized`,
            message:
              "I'm sorry, I don't know how to handle that request. Let me transfer you to a human agent.",
          };
      }
    } catch (error) {
      console.error(`Error executing function ${name}:`, error);
      return {
        success: false,
        error: error.message,
        message:
          "I encountered an error while processing your request. Please try again or speak with a human agent.",
      };
    }
  }

  // This may not work !!!!!!!!!!!!!!!!!!!!!!!!!!!
  return handleFunctionCall(functionCall);

  console.log(name, parameters);
  if (Object.prototype.hasOwnProperty.call(functions, name)) {
    return await functions[name](parameters);
  } else {
    return;
  }
};
