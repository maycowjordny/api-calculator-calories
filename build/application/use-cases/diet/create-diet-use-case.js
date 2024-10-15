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

// src/application/use-cases/diet/create-diet-use-case.ts
var create_diet_use_case_exports = {};
__export(create_diet_use_case_exports, {
  CreateDietUseCase: () => CreateDietUseCase
});
module.exports = __toCommonJS(create_diet_use_case_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateDietUseCase
});
