import Cookies from "js-cookie";
import dayjs from "dayjs";
import { authKey } from "./constants";



export class helpers {
  // ===== Cookies =====
  static setAuthCookie(key: string, value: string): void {
    Cookies.set(key, value);
  }

  static getAuthCookie(key: string): string | undefined {
    return Cookies.get(key);
  }

  static removeAuthCookie(key: string): void {
    Cookies.remove(key);
  }

  static hasAuthToken(): string | undefined {
    return Cookies.get(authKey);
  }

  // ===== Dates =====
  static formatDate(date: string | Date, type = "DD MMM YYYY"): string {
    return dayjs(date).format(type);
  }

  static formatTime(date: string | Date): string {
    return dayjs(date).format("h:s A"); 
  }

  static formatDateTime(date: string | Date): string {
    return dayjs(date).format("h:s A - DD MMM YYYY");
  }

  // ===== Strings =====
  static capitalize(text: string): string {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  static lowerCase(text: string): string {
    return text ? text.toLowerCase() : "";
  }

  static upperCase(text: string): string {
    return text ? text.toUpperCase() : "";
  }
}


