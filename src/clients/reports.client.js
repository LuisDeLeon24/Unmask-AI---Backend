import { Client } from "@gradio/client";

let clientInstance = null;

async function getClient() {
  if (!clientInstance) {
    console.log("Connecting to Gradio app...");
    clientInstance = await Client.connect(
      "https://app-fftfmen20677d8v2.aistudio-app.com/"
    );
    console.log("Gradio client connected");
  }
  return clientInstance;
}

export async function searchMediaCoverage(query) {
  if (!query || query.length < 5) {
    throw new Error("Query too short for media search");
  }

  try {
    const client = await getClient();

    console.log("Gradio search query:", query);

    const result = await client.predict("/partial", {
      message: query,
      chat_history: [],
      content_box: query,
      tool_result_box: "",
      plan_box: ""
    });

    console.log("Gradio raw result:", result);

    return result.data;

  } catch (error) {
    console.error("Gradio client failed");

    if (error.message) {
      console.error(error.message);
    }

    throw error;
  }
}
