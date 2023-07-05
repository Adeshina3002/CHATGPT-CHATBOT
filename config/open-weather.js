import axios from 'axios'
import dotenv from 'dotenv';
dotenv.config();

async function getWeatherData(city) {
    const apiKey= process.env.OPENWEATHER_API_KEY
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await axios.get(url)
        const weatherData = response.data
        return weatherData
    } catch (error) {
        console.error('Error retrieving weather data:', error);
    }
}

export default getWeatherData