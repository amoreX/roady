"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
const cache = {};
export async function getRoad(topic) {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDTO_PHWACl8Vxx2EPp2u2EWLJW6W0XNkA"
  );
  //new one -> AIzaSyBYm_TyKpW2rrhyOZSekvc1BlUP9_SKJYA
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  let prompt = `give me a roadmap to learn ${topic} , do NOT skip any topic ,  include every topic in proper sections and only respond in JSON nothing else,do not give any other text , so that i can use JSON function to convert your response to JSON ,json structure should be identical to this  id: "root",
    name: "Data Structures and Algorithms",
    timeEstimate: 40,
    completed:false,
    children: [
      {
        id: "1",
        name: "Arrays & Hashing",
        completed: false,
        timeEstimate: 10,
        children: [
          { id: "1-1", name: "Two Sum", completed: false, timeEstimate: 2 },
          { id: "1-2", name: "Valid Anagram", completed: false, timeEstimate: 3 },
          { id: "1-3", name: "Group Anagrams", completed: false, timeEstimate: 5 },
        ],
      },
      {
        id: "2",
        name: "Two Pointers",
        completed: false,
        timeEstimate: 8,
        children: [
          { id: "2-1", name: "Valid Palindrome", completed: false, timeEstimate: 3 },
          { id: "2-2", name: "3Sum", completed: false, timeEstimate: 5 },
        ],
}]`;

  let result = await model.generateContent(prompt);
  result = result.response.text();
  result = result.replace("```json", "");
  result = result.replace("```", "");
  //   console.log(result);
  const parse_result = JSON.parse(result);
  console.log(parse_result);
  return parse_result;
}
