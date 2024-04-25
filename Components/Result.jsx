import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';


const Result = ({ route }) => {
    const { city } = route.params
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true)

    const fetchWeatherData = async () => {
        try {
            const weatherKey = "e1ae328dfde693fd240d7d6838f178da";
            const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherKey}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok) {
                setWeatherData(data);
            } else {
                Alert.alert('Error', 'Could not fetch weather data');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch weather data');
        }

        setLoading(false);
    };

    const getBackgroundColor = (temp) => {
        return temp > 10 ? "#FFDAB9" : '#ADD8E6'
    }

    const getTitleColor = (temp) => {
        return temp > 10 ? '#f55538' : 'blue'
    }

    const getImageUrl = (weatherDescription) => {
        switch (weatherDescription) {
            case 'Rain':
                return require('../assets/Rain.png');
            case 'Clear':
                return require('../assets/Sunny.png');
            case 'Clouds':
                return require('../assets/Clouds.png');
            default:
                return require('../assets/Clouds.png');
        }
    };


useEffect(() => {
    fetchWeatherData()
}, [city])

if (loading) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weather Details for {city}</Text>
        </View>
    );

}
if (!weatherData) {
    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>Weather data not available</Text>
        </View>
    );
}

const backgroundColor = getBackgroundColor(weatherData.main.temp);
const titleColor = getTitleColor(weatherData.main.temp);
const weatherImage = getImageUrl(weatherData.weather[0].main)

return (
    <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.title, { color: titleColor }]}>Weather Details for {city}</Text>


        <Image style={styles.image} source={weatherImage} />


        <Text style={styles.weatherText}>
            Weather: {weatherData.weather[0].description}
        </Text>
        <Text style={styles.weatherDetailsText}>
            Temperature: {weatherData.main.temp} °C
        </Text>
        <Text style={styles.weatherDetailsText}>
            Humidity: {weatherData.main.humidity} %
        </Text>
        <Text style={styles.weatherDetailsText}>
            Wind Speed: {weatherData.wind.speed} m/s
        </Text>
    </View>
);





};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
    },
    image:{
        height:150,
        width:150
    },
    title: {
        fontSize: 24,
        marginTop: 25,
        fontWeight: 'bold',
        marginBottom: 100,

    },
    weatherText: {
        fontWeight: '900',
        paddingBottom: 10,
        paddingTop:50
    },
    weatherDetailsText: {
        fontWeight: '500',
        paddingTop:20

    }
});


export default Result
