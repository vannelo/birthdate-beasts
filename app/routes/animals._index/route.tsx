import { ActionFunctionArgs, json } from "@remix-run/node";
import axios from "axios";
import { getAnimalData } from "~/utils/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const action = async ({ request }: ActionFunctionArgs) => {
  // Organizing data
  const data = await request.json();
  const { email, date, ip } = data;
  const dateString = new Date(date).toDateString();
  const name = email.split("@")[0];
  const animalData = getAnimalData(date);

  // Searching user with email
  const userExists: any = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  // Searching user with ip
  const userExistsIp = await prisma.user.findFirst({
    where: {
      ip,
    },
  });

  // Getting data from database
  if (userExists || userExistsIp) {
    return json({
      success: true,
      message: "User already exists",
      user: userExists,
      description: userExists.description,
    });
  }

  // Creating new user and image
  const response = await axios.post(
    "https://api.openai.com/v1/images/generations",
    {
      model: "dall-e-3",
      prompt: animalData.prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  const imageUrl = response.data.data[0].url;
  const user = await prisma.user.create({
    data: {
      email,
      name,
      date: dateString,
      ip,
      imageUrl: imageUrl,
      description: animalData.description,
    },
  });

  // PRODUCTION
  return json({
    success: true,
    user,
    message: "Work done!",
    description: animalData.description,
  });

  // DEVELOPMENT
  // return json({
  //   success: true,
  //   user: {
  //     email,
  //     name,
  //     date: dateString,
  //     ip,
  //     imageUrl: "https://picsum.photos/1024",
  //     description: animalData.description,
  //   },
  //   description: "description",
  //   message: "Work done!",
  // });
};
