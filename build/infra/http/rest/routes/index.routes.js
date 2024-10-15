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

// src/infra/http/rest/routes/index.routes.ts
var index_routes_exports = {};
__export(index_routes_exports, {
  appRoutes: () => appRoutes
});
module.exports = __toCommonJS(index_routes_exports);

// src/app.ts
var import_cors = __toESM(require("@fastify/cors"));
var import_axios = __toESM(require("axios"));
var import_fastify = __toESM(require("fastify"));
var import_fastify_raw_body = __toESM(require("fastify-raw-body"));
var import_node_cron = __toESM(require("node-cron"));
var app = (0, import_fastify.default)();
app.get("/cron", async (request, reply) => {
  reply.status(200).send("ok");
});
import_node_cron.default.schedule("*/5 * * * *", async () => {
  try {
    await import_axios.default.get("https://api-calculator-calories-1.onrender.com/cron");
  } catch (error) {
    console.error("Error pinging server:", error);
  }
});
app.register(import_fastify_raw_body.default, {
  field: "rawBody",
  global: false,
  encoding: "utf8",
  runFirst: true
});
app.register(appRoutes);
app.register(import_cors.default, {
  origin: "*"
});

// src/utils/round-to-decimals.ts
function roundToDecimals(num, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

// src/utils/round-to-nearest-hundred.ts
function roundToNearestHundred(num) {
  return Math.round(num / 100) * 100;
}

// src/application/errors/use-case-errors.ts
var UseCaseError = class extends Error {
  messageException() {
    return {
      name: this.name,
      message: this.message
    };
  }
};

// src/application/use-cases/diet/errors/create-calories-exception.ts
var CreateCaloriesException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao criar as calorias : ${err}.`);
    this.name = "CreateCalorieasException";
  }
};

// src/application/use-cases/diet/create-calories-use-case.ts
var CreateCaloriesUseCase = class {
  constructor(dietRepository) {
    this.dietRepository = dietRepository;
    this.basalMetabolicRate = 0;
  }
  async execute(inputCalories) {
    try {
      const { activity, age, gender, height, weight, weightGoal } = inputCalories;
      if (gender === "female") {
        this.basalMetabolicRate = 10 * weight + 6.25 * height - 5 * age - 161;
      } else {
        this.basalMetabolicRate = 10 * weight + 6.25 * height - 5 * age + 5;
      }
      const totalCalories = this.basalMetabolicRate * activity;
      const totalCaloriesWithWeightGoal = weightGoal > weight ? totalCalories + 300 : totalCalories - totalCalories * 0.2;
      const protein = weight * 2;
      const fat = weight * 0.8;
      const carbs = (totalCaloriesWithWeightGoal - (protein * 4 + fat * 9)) / 4;
      const resultCaloriesRounded = roundToNearestHundred(
        totalCaloriesWithWeightGoal
      );
      const proteinRounded = roundToDecimals(protein);
      const fatRounded = roundToDecimals(fat);
      const carbsRounded = roundToDecimals(carbs);
      let existingCalories = await this.dietRepository.findByCalories(
        resultCaloriesRounded
      );
      if (!existingCalories) {
        existingCalories = await this.dietRepository.createCalories(
          resultCaloriesRounded
        );
      }
      return {
        quantity: existingCalories.calories,
        protein: proteinRounded,
        fat: fatRounded,
        carbs: carbsRounded
      };
    } catch (err) {
      throw new CreateCaloriesException(err);
    }
  }
};

// src/lib/prisma/prisma.ts
var import_client = require("@prisma/client");
var import_process = require("process");
var prisma = new import_client.PrismaClient({
  log: import_process.env.NODE_ENV === "dev" ? [] : []
});

// src/core/domain/Entity.ts
var Entity = class {
  constructor(props) {
    this.props = props;
  }
  equals(object) {
    if (object === null || object === void 0) {
      return false;
    }
    if (this === object) {
      return true;
    }
    return false;
  }
};

// src/domain/entities/diet-entity.ts
var Diet = class _Diet extends Entity {
  get id() {
    return this.props.id;
  }
  get calories() {
    return this.props.calories;
  }
  get description() {
    return this.props.description;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  static create(props) {
    const diet = new _Diet({
      ...props
    });
    return diet;
  }
};

// src/infra/database/prisma/mappers/diet/diet-mapper.ts
var DietMapper = class {
  static toDomain(rawDiet) {
    return new Diet({
      id: rawDiet.id,
      calories: rawDiet.calories ?? void 0,
      description: rawDiet.description ?? void 0,
      createdAt: rawDiet.createdAt,
      updatedAt: rawDiet.updatedAt
    });
  }
};

// src/infra/database/prisma/repositories/prisma-diet-repository.ts
var PrismaDietRepository = class {
  async update(description, calories) {
    const result = await prisma.diet.update({
      data: {
        description
      },
      where: {
        calories
      }
    });
    return DietMapper.toDomain(result);
  }
  async findByCalories(calories) {
    const result = await prisma.diet.findFirst({
      where: {
        calories
      }
    });
    return result && DietMapper.toDomain(result);
  }
  async createCalories(calories) {
    const result = await prisma.diet.create({
      data: {
        calories
      }
    });
    return DietMapper.toDomain(result);
  }
};

// src/application/factory/diet/make-create-calories-factory.ts
function makeCreateCalories() {
  const dietRepository = new PrismaDietRepository();
  const createCaloriesUseCase = new CreateCaloriesUseCase(dietRepository);
  return createCaloriesUseCase;
}

// src/infra/http/rest/controller/create-calories-controller.ts
var CreateCaloriesController = class {
  constructor() {
    this.create = async (request, reply) => {
      try {
        const makeCreateCaloriesUseCase = makeCreateCalories();
        const calories = await makeCreateCaloriesUseCase.execute(
          request.body
        );
        return reply.status(201).send({ calories });
      } catch (err) {
        return reply.status(err instanceof CreateCaloriesException ? 500 : 409).send({
          name: err.name,
          message: err.message
        });
      }
    };
  }
};

// src/infra/http/rest/routes/calories.routes.ts
var createCaloriesController = new CreateCaloriesController();
async function createCaloriesRoutes(app2) {
  app2.post("/", createCaloriesController.create);
}

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

// src/infra/http/rest/routes/checkout.routes.ts
var createCheckoutController = new CreateCheckoutController();
async function createCheckoutRoutes(app2) {
  app2.post("/", createCheckoutController.create);
}

// src/utils/format-diets.ts
function formatDiets(text) {
  let menus = text.split(/\*\*Card[aá]pio \d+:\*\*/).map((menu) => menu.trim()).filter((menu) => menu.length > 0);
  return menus.slice(1);
}

// src/application/use-cases/diet/create-diet-use-case.ts
var import_generative_ai = require("@google/generative-ai");

// src/application/use-cases/payment-session/errors/session-not-paid-exception.ts
var SessionNotPaidException = class extends UseCaseError {
  constructor() {
    super(
      `A sess\xE3o n\xE3o foi paga, e n\xE3o \xE9 poss\xEDvel gerar uma dieta personalizada sem excluir alimentos.`
    );
    this.name = "SessionNotPaidException";
  }
};

// src/application/use-cases/diet/errors/create-diet-exception.ts
var CreateDietException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao criar dieta: ${err}.`);
    this.name = "CreateDietException";
  }
};

// src/application/use-cases/diet/errors/diet-not-found-exception.ts
var DietNotFoundException = class extends UseCaseError {
  constructor() {
    super(`N\xE3o foi poss\xEDvel encontrar uma dieta.`);
    this.name = "DietNotFoundException";
  }
};

// src/application/use-cases/diet/create-diet-use-case.ts
var CreateDietUseCase = class {
  constructor(dietRepository, verifyPaymentSessionUseCase) {
    this.dietRepository = dietRepository;
    this.verifyPaymentSessionUseCase = verifyPaymentSessionUseCase;
  }
  async execute(calories, excludedFoods, sessionId) {
    try {
      await this.ensureSessionIsPaid(excludedFoods, sessionId);
      const existingDiet = await this.dietRepository.findByCalories(calories);
      if (!existingDiet) throw new DietNotFoundException();
      if (existingDiet.description.length > 0) {
        return existingDiet.description;
      }
      const updatedDescription = await this.generateDietDescription(
        calories,
        excludedFoods
      );
      await this.dietRepository.update(updatedDescription, calories);
      return updatedDescription;
    } catch (err) {
      throw new CreateDietException(err);
    }
  }
  async ensureSessionIsPaid(excludedFoods, sessionId) {
    const isPaidSession = await this.verifyPaymentSessionUseCase.execute(
      sessionId
    );
    if (!isPaidSession && excludedFoods.length > 0)
      throw new SessionNotPaidException();
  }
  async generateDietDescription(calories, excludedFoods) {
    const genAI = new import_generative_ai.GoogleGenerativeAI(process.env.API_KEY_GEMINI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      excludedFoods ? `5 card\xE1pios de ${calories} calorias sem esses alimentos: ${excludedFoods}. N\xE3o me envie mais nenhuma informa\xE7\xE3o, apenas o card\xE1pio.` : `5 card\xE1pios de ${calories} calorias. N\xE3o me envie mais nenhuma informa\xE7\xE3o, apenas o card\xE1pio.`
    );
    const response = result.response;
    const text = response.text();
    return formatDiets(text);
  }
};

// src/application/use-cases/payment-session/errors/create-payment-session-exception.ts
var CreatePaymentSessionException = class extends UseCaseError {
  constructor(err) {
    super(`Erro ao criar sess\xE3o de pagamento: ${err}.`);
    this.name = "CreatePaymentSessionException";
  }
};

// src/application/use-cases/payment-session/find-payment-session-by-session-id.ts
var FindPaymentSessionBySessionIdUseCase = class {
  constructor(paymentSessionRepository) {
    this.paymentSessionRepository = paymentSessionRepository;
  }
  async execute(sessionId) {
    try {
      if (!sessionId) return null;
      return await this.paymentSessionRepository.findBySessionId(sessionId);
    } catch (err) {
      throw new CreatePaymentSessionException(err);
    }
  }
};

// src/application/use-cases/payment-session/verify-payment-session.ts
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

// src/domain/entities/payment-session-entity.ts
var PaymentSession = class _PaymentSession extends Entity {
  get id() {
    return this.props.id;
  }
  get sessionId() {
    return this.props.sessionId;
  }
  get isPaid() {
    return this.props.isPaid;
  }
  get email() {
    return this.props.email;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  static create(props) {
    const paymentsession = new _PaymentSession({
      ...props
    });
    return paymentsession;
  }
};

// src/infra/database/prisma/mappers/payment-session/payment-session-mapper.ts
var PaymentSessionMapper = class {
  static toDomain(rawPaymentSession) {
    return new PaymentSession({
      id: rawPaymentSession.id,
      sessionId: rawPaymentSession.sessionId,
      email: rawPaymentSession.email,
      isPaid: rawPaymentSession.isPaid,
      createdAt: rawPaymentSession.createdAt,
      updatedAt: rawPaymentSession.updatedAt
    });
  }
};

// src/infra/database/prisma/mappers/payment-session/create-payment-session-mapper.ts
var CreatePaymentSessionMapper = class extends PaymentSessionMapper {
  static toPrisma(paymentsession) {
    return {
      sessionId: paymentsession.sessionId,
      email: paymentsession.email,
      isPaid: paymentsession.isPaid
    };
  }
};

// src/infra/database/prisma/repositories/prisma-payment-session-repository.ts
var PrismaPaymentSessionRepository = class {
  async create(data) {
    const result = await prisma.paymentSession.create({
      data: CreatePaymentSessionMapper.toPrisma(data)
    });
    return PaymentSessionMapper.toDomain(result);
  }
  async findBySessionId(sessionId) {
    const result = await prisma.paymentSession.findUnique({
      where: {
        sessionId
      }
    });
    return result && PaymentSessionMapper.toDomain(result);
  }
};

// src/application/factory/diet/make-create-diet-factory.ts
function makeCreateDiet() {
  const paymentSessionRepository = new PrismaPaymentSessionRepository();
  const dietRepository = new PrismaDietRepository();
  const findPaymentSessionBySessionIdUseCase = new FindPaymentSessionBySessionIdUseCase(paymentSessionRepository);
  const verifyPaymentSessionUseCase = new VerifyPaymentSessionUseCase(
    findPaymentSessionBySessionIdUseCase
  );
  const createDietUseCase = new CreateDietUseCase(
    dietRepository,
    verifyPaymentSessionUseCase
  );
  return createDietUseCase;
}

// src/infra/http/rest/controller/create-diet-controller.ts
var CreateDietController = class {
  constructor() {
    this.create = async (request, reply) => {
      try {
        const makeCreateDietUseCase = makeCreateDiet();
        const { calories, sessionId, excludedFoods } = request.body;
        const diet = await makeCreateDietUseCase.execute(
          calories,
          excludedFoods,
          sessionId
        );
        return reply.status(201).send({ diet });
      } catch (err) {
        return reply.status(err instanceof CreateDietException ? 500 : 409).send({
          name: err.name,
          message: err.message
        });
      }
    };
  }
};

// src/infra/http/rest/routes/diet.routes.ts
var createDietController = new CreateDietController();
async function createDietRoutes(app2) {
  app2.post("/", createDietController.create);
}

// src/application/use-cases/payment-session/create-payment-session.ts
var CreatePaymentSessionUseCase = class {
  constructor(paymentSessionRepository) {
    this.paymentSessionRepository = paymentSessionRepository;
  }
  async execute(inputPaymentSession) {
    try {
      return await this.paymentSessionRepository.create(inputPaymentSession);
    } catch (err) {
      throw new CreatePaymentSessionException(err);
    }
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
      const secret2 = process.env.STRIPE_WEBHOOK_SECRET_KEY;
      if (secret2) {
        try {
          event = stripe.webhooks.constructEvent(body, signature, secret2);
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

// src/application/factory/webhook/make-webhook-factory.ts
function makeWebhook() {
  const paymentSessionRepository = new PrismaPaymentSessionRepository();
  const createPaymentSession = new CreatePaymentSessionUseCase(
    paymentSessionRepository
  );
  const webhookUseCase = new WebHookUseCase(createPaymentSession);
  return webhookUseCase;
}

// src/infra/http/rest/controller/webhook-controller.ts
var secret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
var WebhookController = class {
  constructor() {
    this.create = async (request, reply) => {
      try {
        let event = request.body;
        const body = request.rawBody;
        const signature = request.headers["stripe-signature"];
        const webhookUseCase = makeWebhook();
        await webhookUseCase.execute(event, body, signature);
        return reply.status(200).send({ result: event, ok: true });
      } catch (err) {
        console.error("Erro no webhook:", err);
        return reply.status(500).send({
          message: `Erro no webhook: ${err.message}`,
          ok: false
        });
      }
    };
  }
};

// src/infra/http/rest/routes/weebhook.routes.ts
var webhookController = new WebhookController();
async function webhookRoutes(app2) {
  app2.post("/", { config: { rawBody: true } }, webhookController.create);
}

// src/infra/http/rest/routes/index.routes.ts
async function appRoutes() {
  app.register(createCaloriesRoutes, { prefix: "/calculate-calories" });
  app.register(createDietRoutes, { prefix: "/api/gemini" });
  app.register(createCheckoutRoutes, { prefix: "/checkout" });
  app.register(webhookRoutes, { prefix: "/webhooks/stripe" });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  appRoutes
});
