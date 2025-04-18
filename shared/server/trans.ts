import { AzureOpenAI } from "openai";

const endpoint = "https://hj-azure-openai1.openai.azure.com/";
const modelName = "gpt-4o";
const deployment = "gpt-4o";
const apiKey = process.env.AZURE_OPENAI_KEY || "";
const apiVersion = "2024-04-01-preview";

export const getAIClient = () => {
  const options = { endpoint, apiKey, deployment, apiVersion };
  return new AzureOpenAI(options);
};

const client = getAIClient();

const languageCodeMap: Record<string, string[]> = {
  en: ["english", "en", "eng"],
  zh: [
    "chinese",
    "zh",
    "zh-cn",
    "zh-tw",
    "chinese (simplified)",
    "chinese (traditional)",
    "mandarin",
    "cantonese",
  ],
  ja: ["japanese", "ja", "jpn"],
  ko: ["korean", "ko", "kor"],
  es: ["spanish", "es", "spa"],
  fr: ["french", "fr", "fra"],
  de: ["german", "de", "deu", "ger"],
  ru: ["russian", "ru", "rus"],
};

/**
 * detect language of the text
 * @param text
 * @returns language code
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a language detection expert. Respond with only the ISO language code (e.g., 'en' for English, 'zh' for Chinese).",
        },
        {
          role: "user",
          content: `What language is the following text written in? Please answer with just the ISO language code.\n\n"${text.substring(
            0,
            500
          )}"`,
        },
      ],
      max_tokens: 10,
      temperature: 0.1,
      top_p: 0.95,
      model: modelName,
    });

    const detectedLanguage =
      response.choices[0]?.message?.content?.trim().toLowerCase() || "unknown";
    return detectedLanguage;
  } catch (error) {
    console.error("Language detection error:", error);
    return "unknown";
  }
}

function isSameLanguage(lang1: string, lang2: string): boolean {
  lang1 = lang1.toLowerCase();
  lang2 = lang2.toLowerCase();

  if (lang1 === lang2) return true;

  for (const [code, names] of Object.entries(languageCodeMap)) {
    if (
      (names.includes(lang1) && names.includes(lang2)) ||
      (names.includes(lang1) && lang2 === code) ||
      (lang1 === code && names.includes(lang2))
    ) {
      return true;
    }
  }

  return false;
}

async function translateTextWithOpenAI(
  text: string,
  targetLanguage = "en",
  sourceLanguage?: string
): Promise<string> {
  try {
    if (!text || text.trim() === "") {
      return text;
    }

    if (!sourceLanguage) {
      sourceLanguage = await detectLanguage(text);
    }

    if (isSameLanguage(targetLanguage, sourceLanguage)) {
      console.log(`Text already in ${targetLanguage}, skipping translation`);
      return text;
    }

    // systemPrompt
    const systemPrompt = `You are the official translation expert for Broccoli NGO, specializing in professional translation in the fields of environmental protection, animal rescue, and charitable initiatives.

Please follow these translation principles:
1. Accurately convey the meaning, tone, and nuances of the original text
2. Maintain a tone that aligns with Broccoli NGO's eco-friendly and charitable mission
3. Professionally translate terminology related to blockchain, pet rescue, environmental protection, and charitable activities
4. Ensure the translated text maintains the original format and structure
5. Be consistent with professional terminology, especially terms related to BNB Chain, blockchain transparency, and animal welfare

IMPORTANT: Always respond in valid JSON format. The JSON should maintain the input key-value structure.`;

    // userPrompt
    let userPrompt = `Translate the following key-value pairs to ${targetLanguage} and respond with a valid JSON object.

RULES:
1. Maintain the exact same keys as provided in the input
2. Only translate the values, not the keys
3. Ensure special characters like line breaks are preserved
4. Your entire response must be a valid JSON object

Input text:`;
    if (sourceLanguage) {
      userPrompt += ` (source language: ${sourceLanguage})`;
    }
    userPrompt += `:\n\n${text}\n\n`;

    userPrompt += `
Format your response as a valid JSON object like this:
{
  "key1": "translated value1",
  "key2": "translated value2",
  ...
}`;

    console.log("targetLanguage", targetLanguage);

    // run the translation
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 4096,
      temperature: 0.3,
      top_p: 0.95,
      model: modelName,
      response_format: { type: "json_object" },
    });

    // get the translated text from the response
    const translatedText = response.choices[0]?.message?.content?.trim();

    if (!translatedText) {
      throw new Error("No translation result received");
    }

    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error(
      `Failed to translate text: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function translateJsonData(
  jsonData: any,
  targetLanguage = "zh",
  sourceLanguage?: string
) {
  const sampleText = String(jsonData.description || "");
  const detectedLanguage = sourceLanguage || (await detectLanguage(sampleText));

  console.log("language from ", detectedLanguage, " to ", targetLanguage);

  if (isSameLanguage(targetLanguage, detectedLanguage)) {
    console.log(`Content already in ${targetLanguage}, skipping translation`);
    return jsonData;
  }

  const textToTranslate = generateTemplateForTranslation(jsonData);
  console.log("-- textToTranslate", textToTranslate);

  try {
    // translate text in one request
    const translatedText = await translateTextWithOpenAI(
      // JSON.stringify(jsonData),
      textToTranslate,
      targetLanguage,
      detectedLanguage
    );

    // restore translated text to json
    return restoreTranslatedTextFromJson(jsonData, JSON.parse(translatedText));
  } catch (error) {
    console.error("Error during translation:", error);
    return jsonData;
  }
}

// generate template for translation: `key: value key: value`
function generateTemplateForTranslation(jsonData: any) {
  let translationTemplate = "";

  translationTemplate += `description: ${String(
    jsonData.description
  ).replaceAll("\n", "___$___")}\n`;

  jsonData.attributes.forEach((attr: any) => {
    translationTemplate += `${attr.trait_type}: ${String(attr.value).replaceAll(
      "\n",
      "___$___"
    )}\n`;
  });

  return translationTemplate;
}

// restore translated text to json
function restoreTranslatedTextFromJson(
  originalData: any,
  translatedObj: Record<string, string>
): any {
  const translatedData = { ...originalData };
  debugger;
  
  if ('description' in translatedObj) {
    translatedData.description = translatedObj.description.replaceAll('___$___', '\n');
  }
  
  if (translatedData.attributes && Array.isArray(translatedData.attributes)) {
    translatedData.attributes = translatedData.attributes.map((attr: any) => {
      if (attr.trait_type in translatedObj) {
        return {
          ...attr,
          value: translatedObj[attr.trait_type].replaceAll('___$___', '\n'),
        };
      }
      return attr;
    });
  }

  return translatedData;
}

export const getTextLanguage = async (text: string) => {
  const response = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Please identify the language of the following text: "${text}"`,
      },
    ],
    max_tokens: 420,
    temperature: 0.3,
    top_p: 0.95,
    model: modelName,
  });

  return response.choices[0]?.message?.content?.trim();
};
