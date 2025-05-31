import { findKeywords } from "./fetchKeyword";
import { getCharacterInspiration } from "./getCharacterInspiration";
import { getRandomName } from "./getRandomName";
import { getWeather } from "./weather";
import { confirmOrder } from "./confirmOrder";
import { sendOrderPackageBySms } from "./sendOrderPackageBySms";
import { sendSmsOrderUpdate } from "./sendSmsOrderUpdate";

export default {
  getWeather: getWeather,
  findKeywords: findKeywords,
  getRandomName: getRandomName,
  getCharacterInspiration: getCharacterInspiration,
  bookAppointment: bookAppointment,
  confirmOrder: confirmOrder,
  sendOrderPackageBySms: sendOrderPackageBySms,
  sendSmsOrderUpdate: sendSmsOrderUpdate,
};
