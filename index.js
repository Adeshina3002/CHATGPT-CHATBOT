import openai from "./config/open-ai.js";
import readlineSync from "readline-sync";
import colors from "colors";
import getWeatherData from "./config/open-weather.js";

async function main() {
  console.log(colors.bold.green("Welcome to the Chatbot Program!"));
  console.log(colors.bold.green("You can start chatting with the bot."));

  const chatHistory = []; // store converstaion history

  while (true) {
    const userInput = readlineSync.question(colors.yellow("You: "));

    if (userInput.toLowerCase().includes("weather")) {
      // extract city name from the user input

      const city = extractCityFromInput(userInput);
      if (city) {
        try {
          const weatherData = await getWeatherData(city);

          if (weatherData) {
            // Extract relevant information from weatherData and incorporate it into your chatbot's responses
            const temperature = weatherData.main.temp;
            const description = weatherData.weather[0].description;

            console.log(
              `The current temperature in ${city} is ${temperature}°C. The weather is ${description}.`
            );
          } else {
            console.log(`Failed to retrieve weather data for ${city}.`);
          }
        } catch (error) {
          console.error("Error retrieving weather data:", error);
        }
      } else {
        console.log(
          "Please provide a valid city name for weather information."
        );
      }
    } else {
      try {
        // construct messages by iterating over the history
        const messages = chatHistory.map(([role, content]) => ({
          role,
          content,
        }));

        // Add latest user input
        messages.push({ role: "user", content: userInput });

        // call the API with user input
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: messages,
        });

        // Get completion text/content
        const completionText = completion.data.choices[0].message.content;

        if (userInput.toLowerCase() === "exit") {
          console.log(colors.green("Bot: ") + completionText);
          return;
        }

        console.log(colors.green("Bot: ") + completionText);

        // Update history with user input and assistant response
        chatHistory.push(["user", userInput]);
        chatHistory.push(["assistant", completionText]);
      } catch (error) {
        console.error(colors.red(error));
      }
    }
  }
}

function extractCityFromInput(input) {
    // Implement your logic to extract the city name from the user input
    // You can use regular expressions, string manipulation, or external libraries to achieve this
  
    // Example: Extract the first word after "weather"
    const weatherIndex = input.toLowerCase().indexOf('weather');
    if (weatherIndex !== -1) {
      const cityName = input.slice(weatherIndex + 8).trim();
      return cityName;
    }
  
    return null;
  }

main();

