import { ActionFunctionArgs, json } from "@remix-run/node";
import axios from "axios";
import { getAnimalData } from "~/utils/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.json();
  const date = data.date;
  const animalData = getAnimalData(date);

  switch (request.method) {
    case "POST": {
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

      // PRODUCTION
      return json({
        success: true,
        imageUrl,
        description: animalData.description,
      });

      // DEVELOPMENT
      // return json({
      //   success: true,
      //   imageUrl: "/img/bg-1.jpg",
      //   description: animalData.description,
      // });
    }
  }
};
