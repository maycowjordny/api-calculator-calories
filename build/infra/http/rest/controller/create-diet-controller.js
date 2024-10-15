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

// src/infra/http/rest/controller/create-diet-controller.ts
var create_diet_controller_exports = {};
__export(create_diet_controller_exports, {
  CreateDietController: () => CreateDietController
});
module.exports = __toCommonJS(create_diet_controller_exports);

// src/utils/format-diets.ts
function formatDiets(text) {
  let menus = text.split(/\*\*Card[aá]pio \d+:\*\*/).map((menu) => menu.trim()).filter((menu) => menu.length > 0);
  return menus.slice(1);
}

// src/application/use-cases/diet/create-diet-use-case.ts
var import_generative_ai = require("@google/generative-ai");

// src/application/errors/use-case-errors.ts
var UseCaseError = class extends Error {
  messageException() {
    return {
      name: this.name,
      message: this.message
    };
  }
};

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateDietController
});
