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

// src/infra/database/prisma/repositories/prisma-diet-repository.ts
var prisma_diet_repository_exports = {};
__export(prisma_diet_repository_exports, {
  PrismaDietRepository: () => PrismaDietRepository
});
module.exports = __toCommonJS(prisma_diet_repository_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaDietRepository
});
