"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/application/use-cases/payment-session/verify-payment-session.ts
var verify_payment_session_exports = {};
__export(verify_payment_session_exports, {
  VerifyPaymentSessionUseCase: () => VerifyPaymentSessionUseCase
});
module.exports = __toCommonJS(verify_payment_session_exports);
var VerifyPaymentSessionUseCase = class {
  constructor(findPaymentSessionBySessionIdUseCase) {
    this.findPaymentSessionBySessionIdUseCase = findPaymentSessionBySessionIdUseCase;
  }
  async execute(sessionId) {
    const paymentSession = await this.findPaymentSessionBySessionIdUseCase.execute(sessionId);
    if (!paymentSession || !paymentSession.isPaid) return false;
    return true;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VerifyPaymentSessionUseCase
});
