import { useState } from "react";
import axios from "axios";

export const useApiResponse = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const translate = async (text) => {
    setLoading(true);
    const encodedParams = new URLSearchParams();
    encodedParams.set("source_language", "en");
    encodedParams.set("target_language", "hi");
    encodedParams.set("text", text);
    const options = {
      method: "POST",
      url: "https://text-translator2.p.rapidapi.com/translate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": process.env.REACT_APP_TRANSLATE_API_KEY,
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      setData(response.data.data.translatedText);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const gptResponse = async (content) => {
    setLoading(true);
    const url = "https://api.openai.com/v1/chat/completions";
    const apiKey = process.env.REACT_APP_CHATGPT_API_KEY;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content,
        },
      ],
    };

    try {
      const response = await axios.post(url, data, { headers });
      setData(response.data.choices[0].message.content);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return { translate, data, error, loading, gptResponse };
};
