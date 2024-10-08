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

// src/application/use-cases/diet/create-calories-use-case.ts
var create_calories_use_case_exports = {};
__export(create_calories_use_case_exports, {
  CreateCaloriesUseCase: () => CreateCaloriesUseCase
});
module.exports = __toCommonJS(create_calories_use_case_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateCaloriesUseCase
});
