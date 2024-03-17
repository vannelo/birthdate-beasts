import { ActionFunctionArgs, json } from "@remix-run/node";
import axios from "axios";
import { getAnimalData } from "~/utils/utils";
import { PrismaClient } from "@prisma/client";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = "us-east-1";
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as any,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as any,
  },
}) as any;

const prisma = new PrismaClient();

export const action = async ({ request }: ActionFunctionArgs) => {
  // Organizing data
  const data = await request.json();
  const { email, date, ip, successValue } = data;
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

  // User exists
  if (userExists || successValue) {
    return json({
      success: true,
      message: "User already exists",
      user: userExists,
      description: userExists.description,
    });
  }

  // IP exists
  if (userExistsIp) {
    return json({
      success: true,
      message: "User already exists",
      user: userExistsIp,
      description: "",
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
        "content-type": "application/json",
      },
    }
  );
  const imageUrl = response.data.data[0].url;
  const fileName = `${name}-image.png`;
  const user = await prisma.user.create({
    data: {
      email,
      name,
      date: dateString,
      ip,
      imageUrl: `https://birthdate-beasts-s3.s3.amazonaws.com/${fileName}`,
      description: animalData.description,
    },
  });

  // Saving imageUrl archive image to S3
  const file = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(file.data, "binary");
  const params: any = {
    Bucket: "birthdate-beasts-s3",
    Key: fileName,
    Body: buffer,
    ContentType: "image/png", // Assuming the image is a PNG
    ACL: "public-read", // if you want the image to be publicly readable
  };
  try {
    await s3Client.send(new PutObjectCommand(params));
    return json({
      success: true,
      user,
      message: "Work done!",
      description: animalData.description,
    });
  } catch (err) {
    console.log("Error", err);
    throw new Error("File upload failed");
  }
};
