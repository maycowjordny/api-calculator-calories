import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { prisma } from "./lib/prisma/prisma";
const app = express();

const port = 3001;
dotenv.config();
app.use(express.json());

const corsOptions = {
  credentials: true,
  origin: "*",
};

app.use(cors(corsOptions));

app.post("/api/gemini", async (req, res) => {
  try {
    const { calories } = req.body;

    if (!calories) {
      return res.status(400).json({ error: "calories is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI as string);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const existingDiet = await prisma.diet.findFirst({
      where: { calories: { quantity: calories } },
    });

    if (existingDiet) {
      return res.status(200).json({ diet: existingDiet.description });
    }

    const result = await model.generateContent(
      `cardapio de ${calories} calorias e n me mande mais nenhuma informação,apenas o cardapio`
    );

    const response = result.response;
    const text = response.text();

    const { description } = await prisma.diet.create({
      data: {
        description: text,
        calories: {
          connect: { quantity: calories },
        },
      },
    });

    return res.status(201).json({ diet: description });
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao processar sua solicitação" });
  }
});

app.post("/calculate-calories", async (req, res) => {
  try {
    const { activity, age, gender, height, weight, weightGoal } = req.body;

    let basalMetabolicRate: number = 0;

    if (gender === "female") {
      basalMetabolicRate = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      basalMetabolicRate = 10 * weight + 6.25 * height - 5 * age + 5;
    }

    const totalCalories = basalMetabolicRate * activity;

    const totalCaloriesWithWeigthGoal =
      weightGoal > weight
        ? totalCalories + 300
        : totalCalories - totalCalories * 0.8;

    const result = Math.round(totalCaloriesWithWeigthGoal);

    const existingCalories = await prisma.calories.findUnique({
      where: { quantity: result },
    });

    if (existingCalories) {
      return res.status(200).json({ calories: existingCalories.quantity });
    }

    const { quantity } = await prisma.calories.create({
      data: {
        quantity: result,
      },
    });

    return res.status(201).json({ calories: quantity });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
