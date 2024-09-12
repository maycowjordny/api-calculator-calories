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

// src/infra/database/prisma/mappers/diet/create-diet-mapper.ts
var create_diet_mapper_exports = {};
__export(create_diet_mapper_exports, {
  CreateDietMapper: () => CreateDietMapper
});
module.exports = __toCommonJS(create_diet_mapper_exports);

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

// src/infra/database/prisma/mappers/diet/create-diet-mapper.ts
var CreateDietMapper = class extends DietMapper {
  static toPrisma(diet) {
    return {
      id: diet.id,
      calories: diet.calories ?? null,
      description: diet.description ?? [],
      createdAt: diet.createdAt,
      updatedAt: diet.updatedAt
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateDietMapper
});
