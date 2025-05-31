import { findKeywords } from "./fetchKeyword";
import { getCharacterInspiration } from "./getCharacterInspiration";
import { getRandomName } from "./getRandomName";
import { getWeather } from "./weather";
import { confirmOrder } from "./confirmOrder";
import { sendSmsOrderUpdate } from "./sendSmsOrderUpdate";
import { sendSmsOrderSpecialsFavorites } from "./sendSmsOrderSpecialsFavorites";
import { bookAppointment } from "./bookAppointment";

export default {
  getWeather: getWeather,
  findKeywords: findKeywords,
  getRandomName: getRandomName,
  getCharacterInspiration: getCharacterInspiration,
  bookAppointment: bookAppointment,
  confirmOrder: confirmOrder,
  sendSmsOrderUpdate: sendSmsOrderUpdate,
  sendSmsOrderSpecialsFavorites: sendSmsOrderSpecialsFavorites,
};
