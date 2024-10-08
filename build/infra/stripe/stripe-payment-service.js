"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/infra/stripe/stripe-payment-service.ts
var stripe_payment_service_exports = {};
__export(stripe_payment_service_exports, {
  StripePaymentService: () => StripePaymentService
});
module.exports = __toCommonJS(stripe_payment_service_exports);
var import_stripe = __toESM(require("stripe"));
var StripePaymentService = class {
  constructor() {
    this.stripe = new import_stripe.default(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-09-30.acacia",
      appInfo: {
        name: "Fit-Caloria"
      }
    });
  }
  async createCheckoutSession() {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1Q7H4wJMMqaVQXpHifnZRv1N",
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel"
    });
    return session.url;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StripePaymentService
});
