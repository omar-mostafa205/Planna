/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import OpenAI from "openai";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

const MAX_IMAGE_UPLOAD_SIZE = 5 * 1024 * 1024; 

async function compressImage(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const compressedBuffer = await sharp(buffer)
    .webp({ quality: 80 })
    .resize({ height: 800, withoutEnlargement: true })
    .toBuffer();
    
  return compressedBuffer;
}

function getImageBase64(buffer: Buffer): string {
  const base64 = buffer.toString('base64');
  return `data:image/webp;base64,${base64}`;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized - Please sign in" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const data = {
      fullName: formData.get("fullName") as string,
      age: formData.get("age") as string,
      height: formData.get("height") as string,
      gender: formData.get("gender") as string,
      activityLevel: formData.get("activityLevel") as string,
      goals: formData.get("goals") as string,
      medicalConditions: formData.get("medicalConditions") as string || "",
      images: formData.getAll("images") as File[],
    };

    // Validate required fields
    if (!data.fullName || !data.age || !data.height || !data.gender || !data.activityLevel || !data.goals) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Process image if exists
    let inBodyText = "";
    if (data.images.length > 0) {
      const image = data.images[0];
      
      if (image.size > MAX_IMAGE_UPLOAD_SIZE) {
        return NextResponse.json(
          { error: "Image size exceeds 5MB limit" },
          { status: 400 }
        );
      }

      try {
        const compressedBuffer = await compressImage(image);
        const base64Image = getImageBase64(compressedBuffer);

        const openai = new OpenAI({ 
          apiKey: process.env.OPENROUTER_API_KEY,
          baseURL: "https://openrouter.ai/api/v1"
        });
        
        const visionResult = await openai.chat.completions.create({
          model: 'mistralai/mistral-small-3.1-24b-instruct:free',
          messages: [
            {
              role: "system",
              content: "Extract body composition metrics from this InBody scan."
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Extract these metrics: body fat %, muscle mass, water %, visceral fat, BMI" },
                { type: "image_url", image_url: { url: base64Image } }
              ]
            }
          ],
          max_tokens: 300
        });

        inBodyText = visionResult.choices[0].message.content || "";
      } catch (visionError) {
        console.error("Vision API error:", visionError);
        inBodyText = "";
      }
    }

    // Generate meal plan
    const openai = new OpenAI({ 
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1"
    });
    
    const planPrompt = `Create a daily meal plan in JSON format for:
Name: ${data.fullName}
Age: ${data.age}
Height: ${data.height} cm
Gender: ${data.gender}
Activity: ${data.activityLevel}
Goals: ${data.goals}
Health Notes: ${data.medicalConditions}
InBody Data: ${inBodyText}

Return EXACTLY this JSON structure:
{
  "calories": number (total daily calories),
  "protein": number (total daily protein in grams),
  "carbs": number (total daily carbs in grams),
  "fat": number (total daily fat in grams),
  "currentWeight": number (estimated current weight in kg based on data),
  "bodyFat": number (estimated body fat percentage),
  "muscleMass": number (estimated muscle mass in kg),
  "goal": "string describing the main goal",
  "meals": {
    "breakfast": {
      "title": "Meal name",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"]
    },
    "lunch": {
      "title": "Meal name",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"]
    },
    "dinner": {
      "title": "Meal name",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"]
    },
    "snack": {
      "title": "Meal name",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"]
    }
  }
}`;

    const mealPlan = await openai.chat.completions.create({
      model: "mistralai/mistral-small-3.1-24b-instruct:free",
      messages: [{ role: "user", content: planPrompt }],
      response_format: { type: "json_object" }
    });

    let mealPlanJson;
    try {
      mealPlanJson = JSON.parse(mealPlan.choices[0].message.content || "{}");
      
      if (!mealPlanJson.meals || !mealPlanJson.calories) {
        throw new Error("Invalid meal plan structure");
      }
    } catch (parseError) {
      console.error("Failed to parse meal plan JSON:", parseError);
      return NextResponse.json(
        { error: "Failed to generate valid meal plan" },
        { status: 500 }
      );
    }

    await prisma.profile.upsert({
      where: { userId },
      update: { mealPlan: mealPlanJson },
      create: { 
        userId, 
        mealPlan: mealPlanJson,
      },
    });

    return NextResponse.json(mealPlanJson);

  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate plan" },
      { status: 500 }
    );
  }
}