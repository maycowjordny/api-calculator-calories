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

// src/application/use-cases/webhook/webhook-use-case.ts
var webhook_use_case_exports = {};
__export(webhook_use_case_exports, {
  WebHookUseCase: () => WebHookUseCase
});
module.exports = __toCommonJS(webhook_use_case_exports);

// src/lib/stripe/stripe.ts
var import_stripe = __toESM(require("stripe"));
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is missing. Please set the environment variable."
  );
}
var stripe = new import_stripe.default(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30.acacia",
  typescript: true
});

// src/application/errors/use-case-errors.ts
var UseCaseError = class extends Error {
  messageException() {
    return {
      name: this.name,
      message: this.message
    };
  }
};

// src/application/use-cases/webhook/errors/secret-exception.ts
var SecretException = class extends UseCaseError {
  constructor(err) {
    super(`Erro na chave secreta: ${err}.`);
    this.name = "SecretException";
  }
};

// src/application/use-cases/webhook/errors/webhook-exception.ts
var WebhookException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao se comunicar com o webhook: ${err}.`);
    this.name = "WebhookException";
  }
};

// src/application/use-cases/webhook/webhook-use-case.ts
var WebHookUseCase = class {
  constructor(createPaymentSessionUseCase) {
    this.createPaymentSessionUseCase = createPaymentSessionUseCase;
  }
  async execute(event, body, signature) {
    try {
      const secret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
      if (secret) {
        try {
          event = stripe.webhooks.constructEvent(body, signature, secret);
        } catch (err) {
          throw new SecretException(err);
        }
      }
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          if (session.payment_status === "paid") {
            const session2 = event.data.object;
            const sessionInput = {
              email: session2.customer_details?.email,
              isPaid: true,
              sessionId: session2.id
            };
            return await this.createPaymentSessionUseCase.execute(sessionInput);
          }
          break;
        }
        case "checkout.session.expired": {
          const session = event.data.object;
          if (session.payment_status === "unpaid") {
            const testeId = session.metadata?.testeId;
            console.log("Checkout expirado", testeId);
          }
          break;
        }
        default:
          console.log(`Evento desconhecido recebido: ${event.type}`);
      }
    } catch (err) {
      throw new WebhookException(err);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WebHookUseCase
});
