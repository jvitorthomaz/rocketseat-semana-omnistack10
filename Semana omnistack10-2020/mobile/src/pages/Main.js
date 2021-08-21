import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import {  connect, disconnect, subscribeToNewDevs } from '../services/socket';

//Nome icones: https://material.io/resources/icons/?style=baseline

function Main({ navigation }) {
    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [techs, setTechs] = useState('');

    useEffect(() => {
        async function loadInitialPosition() {
            //pedindo permissao do usuario para acessar posicão
            //metodo retorna um obj com varias informaçoes sobre a permissao do usuario
            const { granted } = await requestPermissionsAsync();

            if(granted){
                //se o usuario concedeu a permissao, entao busca a posicao do usuario
                const {coords} = await getCurrentPositionAsync({
                    //usando via gps(lembrando que para isso o gps deve estar ativado)
                    //buscar a locolizacao via gps do dispositivo é mais preciso do que via outros modos como wi-fi
                    enableHighAccuracy: true,
                });
                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    //calculos navais para obter o zoom dentro do mapa 
                    //valores colocados apenas para visualizar o mapa no escopo do projeto
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                })
            }
        }
        loadInitialPosition();
    }, [])

    //useEffect para monitorar a variavel devs
    //toda vez que ela alterar, executa a funcao subscribeToNewDevs
    useEffect(() => {
        //copia todas a info que ja tem la dentro e add o novo dev
        subscribeToNewDevs(dev => setDevs([...devs, dev]));
    }, [devs]);

    function setupWebsocket() {
        //antes de o usuario fazer a conexao, disconecta do socket caso ele esteja
        //conectado
        disconnect();

        const { latitude, longitude } = currentRegion;

        connect(
            latitude,
            longitude,
            techs,
        );

    }

    //metodo para carregar os usuarios
    async function loadDevs() {
        const { latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        });
        setDevs(response.data.devs);
        //funçao setSevs demora um pouco para executar, entao foi criado o useEffect() para
        //para monitorar a variavel devs
        //para nao fazer tudo dentro de uma mesma funçao, cria uma nova
        setupWebsocket();

    }

    // por padrao um dos parametros que onRegionChangeComplete envia é (region)
    function handleRegionChanged(region) {
        setCurrentRegion(region);
    }

    //enquanto a localizaçao nao existir retorna nula para nao renderizar nada na tela 
    if(!currentRegion){
        return null;
    }

    //em style={{}} a primeira { é para declarar que quero incluir um código js } e a segunda 
    //{ é para declarar que é um obj js}
    return(
        //criando fragment para isolar, encapsular os dois
        //quando se quer colocar em elemento em cima do mapa tem que criar o elemento depois 
        //do MapView
        <>
            <MapView 
                onRegionChangeComplete={handleRegionChanged} 
                initialRegion={currentRegion} 
                style={styles.map}
            >
                {devs.map(dev => (
                    <Marker 
                    key={dev._id}
                    coordinate={{ 
                        longitude: dev.location.coordinates[0],
                        latitude: dev.location.coordinates[1]
                        }}
                >
                    <Image 
                        style={styles.avatar} 
                        source={{ uri: dev.avatar_url }} 
                    />

                    
                    <Callout onPress={() => {
                        //funçao que executa a navegaçao
                        //passa o nome da tela que vai enviar o usuario
                        navigation.navigate('Profile', { github_username: dev.github_username});
                    }}>
                        <View style={styles.callout}>
                            <Text style={styles.devName}>{dev.name}</Text>
                            <Text style={styles.devBio}>{dev.bio}</Text>
                            <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                        </View>
                    </Callout>
                </Marker>
                ))}
            </MapView>
            
            <View style={styles.searchForm}>
                <TextInput
                    style={styles.searchInput} 
                    placeholder="Buscar devs por techs..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={techs}
                    //retorna direto o texto escrito
                    onChangeText={setTechs}
                />
    
                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name="my-location" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </>
    ); 
}

const styles = StyleSheet.create({
    map:{
        flex: 1
    },
    avatar:{
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth:4,
        borderColor: '#FFF'
    },

    callout:{
        width: 260,
    },

    devName:{
        fontWeight: 'bold',
        fontSize:16,
    },

    devBio:{
       color:'#666',
       marginTop: 5, 
    },

    devTechs:{
        marginTop: 5,
    },

    searchForm:{
        position: 'absolute',
        top: 20,
        left: 20,
        right:20,
        zIndex: 5,
        flexDirection: 'row',
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset:{
            width: 4,
            height: 4,
        },
        elevation: 2,
    },

    loadButton:{
        width: 50,
        height: 50,
        backgroundColor: '#8E4Dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
})

export default Main;