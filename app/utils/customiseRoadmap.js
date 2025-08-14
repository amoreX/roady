"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
const cache = {};
export async function getCustom(custom, roadmap) {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDTO_PHWACl8Vxx2EPp2u2EWLJW6W0XNkA"
  );
  //new one -> AIzaSyBYm_TyKpW2rrhyOZSekvc1BlUP9_SKJYA
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  let prompt = `modify the given roadmap: ${roadmap} according to the prompt: ${custom} ,only respond in JSON nothing else,do not give any other text , so that i can use JSON function to convert your response to JSON ,json structure should be identical to given roadmap`;

  let result = await model.generateContent(prompt);
  result = result.response.text();
  result = result.replace("```json", "");
  result = result.replace("```", "");
  console.log(result);
  //   console.log(result);
  const parse_result = JSON.parse(result);
  console.log(parse_result);
  return parse_result;
}
