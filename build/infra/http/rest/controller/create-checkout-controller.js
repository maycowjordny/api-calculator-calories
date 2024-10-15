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

// src/infra/http/rest/controller/create-checkout-controller.ts
var create_checkout_controller_exports = {};
__export(create_checkout_controller_exports, {
  CreateCheckoutController: () => CreateCheckoutController
});
module.exports = __toCommonJS(create_checkout_controller_exports);

// src/application/errors/use-case-errors.ts
var UseCaseError = class extends Error {
  messageException() {
    return {
      name: this.name,
      message: this.message
    };
  }
};

// src/application/use-cases/checkout/errors/create-checkout-exception.ts
var CreateCheckoutException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao processar pagamento: ${err}.`);
    this.name = "CreateCheckoutException";
  }
};

// src/application/use-cases/checkout/create-checkout-use-case.ts
var CreateCheckoutUseCase = class {
  constructor(stripeRepository) {
    this.stripeRepository = stripeRepository;
  }
  async execute() {
    try {
      return this.stripeRepository.createCheckoutSession();
    } catch (err) {
      throw new CreateCheckoutException(err);
    }
  }
};

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

// src/infra/stripe/stripe-payment-service.ts
var StripePaymentService = class {
  async createCheckoutSession() {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/`,
      cancel_url: `${process.env.BASE_URL}/`
    });
    return session;
  }
};

// src/application/factory/checkout/make-create-checkout.ts
function makeCreateCheckout() {
  const checkoutRepository = new StripePaymentService();
  const createCheckoutUseCase = new CreateCheckoutUseCase(checkoutRepository);
  return createCheckoutUseCase;
}

// src/infra/http/rest/controller/create-checkout-controller.ts
var CreateCheckoutController = class {
  constructor() {
    this.create = async (request, reply) => {
      try {
        const createCheckoutUseCase = makeCreateCheckout();
        const session = await createCheckoutUseCase.execute();
        reply.status(200).send({ id: session.id, url: session.url });
      } catch (err) {
        return reply.status(err instanceof CreateCheckoutException ? 500 : 409).send({
          name: err.name,
          message: err.message
        });
      }
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateCheckoutController
});
