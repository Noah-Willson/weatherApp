import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, ScrollView, RefreshControl, Alert, TextInput, Image, TouchableOpacity, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const Weather = ({ navigation }) => {

    const weatherKey = "e1ae328dfde693fd240d7d6838f178da";
    const [forecast, setForecast] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [city, setCity] = useState('')

    const handleSearch = () => {
        navigation.navigate('Result', { city })
    }

    const loadForecast = async () => {
        setRefreshing(true);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access denied!');
            setRefreshing(false);
            return;
        }

        try {
            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { latitude, longitude } = location.coords;

            const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setForecast(data);
            } else {
                Alert.alert('Error', 'Could not fetch weather data');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch location');
        }

        setRefreshing(false);
    };

    useEffect(() => {
        loadForecast();
    }, []);

    if (!forecast) {
        return (
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator size='large' />
            </SafeAreaView>
        );
    }

    // Ensure forecast is in the expected format
    if (!forecast.weather || !forecast.weather.length || !forecast.main || !forecast.wind || !forecast.sys) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Weather data not available</Text>
            </SafeAreaView>
        );
    }

    return (


        <SafeAreaView style={styles.container}>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={loadForecast}
                        style={{ marginTop: 50 }}
                    />
                }
                contentContainerStyle={styles.scrollViewContent}
            >

                <Image
                    style={styles.logo}
                    source={{ url: 'https://www.creativefabrica.com/wp-content/uploads/2021/03/31/weather-icon-illustration03-Graphics-10205167-1.jpg' }} />



                <Text style={styles.top}>
                    Hey, lets check the weather!
                </Text>

                <TextInput
                    style={styles.search}
                    placeholder='Tell me the city'
                    onChangeText={setCity}
                    value={city} />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        title='Search'
                        onPress={handleSearch}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.buttonText}>Search</Text>

                    </TouchableOpacity>
                </View>


                <Text style={styles.title}>Current weather</Text>

                <Text style={styles.weatherText}>
                    Weather: {forecast.weather[0].description}
                </Text>
                <Text style={styles.locationText}>
                    Location: {forecast.name}, {forecast.sys.country}
                </Text>
                <Text style={styles.weatherDetailsText}>
                    Temperature: {forecast.main.temp} °C
                </Text>
                <Text style={styles.weatherDetailsText}>
                    Humidity: {forecast.main.humidity} %
                </Text>
                <Text style={styles.weatherDetailsText}>
                    Wind Speed: {forecast.wind.speed} m/s
                </Text>
            </ScrollView>
        </SafeAreaView>

    );
};

export default Weather;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightblue',
        paddingHorizontal: 20,
    },
    iconSearch: {
        opacity: 0.3,
        padding: 5
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 20,
        position: 'relative',
        marginBottom: 50,


    },
    buttonContainer: {
        padding: 15,
        borderRadius: 20,
        backgroundColor: 'blue',
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,

    },
    buttonText: {
        fontSize: 15,
        color: 'white',
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        color: 'white'
    },
    search: {
        flex: 1,
        maxHeight: 50,
        backgroundColor: 'white',
        paddingHorizontal: 50,
        borderRadius: 25,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },

    top: {
        color: 'blue',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        paddingBottom: 50
    },
    weatherText: {
        fontSize: 18,
        marginVertical: 10,
        fontWeight: 'bold'

    },
    locationText: {
        fontSize: 16,
        marginVertical: 5,
        fontWeight: 'bold'

    },
    weatherDetailsText: {
        fontSize: 16,
        marginVertical: 5,
        color: '#333',
        fontWeight: 'bold'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: 'red',
    },
});
