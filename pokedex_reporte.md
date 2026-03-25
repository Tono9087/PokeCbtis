Reporte del Proyecto
pokedex
Snack URL:
https://snack.expo.dev/@carlos_hernandez/pokedex
1. Estructura del Proyecto
components/
PokeCard.js
data/
pokedex.js
screens/
DetailScreen.js
FavoritesScreen.js
ListScreen.js
store/
usePokemonStore.js
App.js
2. Código Fuente
PokeCard.js
components/PokeCard.js
// src/components/PokeCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePokemonStore } from '../store/usePokemonStore';
export default function PokeCard({ pokemon, onPress }) {
const toggleFavorito = usePokemonStore((state) => state.toggleFavorito);
const esFavorito = usePokemonStore((state) => state.esFavorito(pokemon.id));
return (
<TouchableOpacity style={styles.card} onPress={onPress}>
<TouchableOpacity
style={styles.star}
onPress={() => toggleFavorito(pokemon)}>
<Ionicons
name={esFavorito ? 'star' : 'star-outline'}
size={20}
color={esFavorito ? 'gold' : 'gray'}
/>
</TouchableOpacity>
<Image source={pokemon.image} style={styles.image} />
<Text style={styles.id}>#{pokemon.id}</Text>
<Text style={styles.name}>{pokemon.name}</Text>
<Text style={styles.type}>{pokemon.type}</Text>
</TouchableOpacity>
);
}
const styles = StyleSheet.create({
card: {
flex: 1,
margin: 8,
padding: 12,
backgroundColor: '#fff',
borderRadius: 16,
alignItems: 'center',
elevation: 3,
shadowColor: '#000',
shadowOpacity: 0.1,
shadowRadius: 4,
},
star: { position: 'absolute', top: 8, right: 8 },
image: { width: 80, height: 80 },
id: { color: '#999', fontSize: 12, marginTop: 6 },
name: { fontWeight: 'bold', fontSize: 16, textTransform: 'capitalize' },
type: { fontSize: 12, color: '#666', marginTop: 2 },
});
usePokemonStore.js
store/usePokemonStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
// El Almacenamiento de Bill: Persistencia de Favoritos
export const usePokemonStore = create(
persist(
(set, get) => ({
favoritos: [],
// Función para alternar el estado de favorito (Toggle)
toggleFavorito: (pokemon) => set((state) => {
const existe = state.favoritos.find(p => p.id === pokemon.id);
if (existe) {
// Si ya es favorito, lo quitamos del equipo
return { favoritos: state.favoritos.filter(p => p.id !== pokemon.id) };
} else {
// Si no existe, lo agregamos (¡Atrapado!)
return { favoritos: [...state.favoritos, pokemon] };
}
}),
// Consulta rápida para saber si un ID ya es favorito
esFavorito: (id) => get().favoritos.some(p => p.id === id)
}),
{
name: 'TonoDex', // Nombre de la partida guardada
storage: createJSONStorage(() => AsyncStorage),
}
)
);
App.js
App.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import ListScreen from './screens/ListScreen';
import DetailScreen from './screens/DetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function HomeStack() {
return (
<Stack.Navigator
screenOptions={{
headerStyle: { backgroundColor: '#0ca6ab' },
headerTintColor: '#fc2403',
headerTitleAlign: 'center',
headerTitleStyle: styles.headerTitle,
}}>
<Stack.Screen
name="List"
component={ListScreen}
options={{ title: 'Pokédex' }}
/>
<Stack.Screen
name="Detail"
component={DetailScreen}
options={{ title: 'Detalle' }}
/>
</Stack.Navigator>
);
}
export default function App() {
return (
<NavigationContainer>
<Tab.Navigator
screenOptions={{
headerStyle: { backgroundColor: '#0ca6ab' },
headerTintColor: '#fc2403',
headerTitleAlign: 'center',
headerTitleStyle: styles.headerTitle,
}}>
<Tab.Screen
name="Home"
component={HomeStack}
options={{
tabBarIcon: ({ color, focused }) => (
<Ionicons
name={focused ? 'list' : 'list-outline'}
color={color}
size={28}
/>
),
headerShown: false,
}}
/>
<Tab.Screen
name="Favorites"
component={FavoritesScreen}
options={{
tabBarIcon: ({ color, focused }) => (
<Ionicons
name={focused ? 'heart' : 'heart-outline'}
color={color}
size={28}
/>
),
headerShown: true,
}}
/>
</Tab.Navigator>
</NavigationContainer>
);
}
const styles = StyleSheet.create({
headerTitle: {
fontSize: 22,
fontWeight: 'bold',
color: '#fc2403',
textShadowColor: '#000',
textShadowOffset: { width: 1, height: 1 },
textShadowRadius: 1,
},
});
ListScreen.js
screens/ListScreen.js
import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import PokeCard from '../components/PokeCard';
import pokedexData from '../data/pokedex';
export default function ListScreen({ navigation }) {
return (
<View style={styles.container}>
<FlatList
data={pokedexData}
keyExtractor={(item) => item.id.toString()}
renderItem={({ item }) => (
<PokeCard
pokemon={item}
onPress={() => navigation.navigate('Detail', { pokemon: item })}
/>
)}
numColumns={2}
/>
</View>
);
}
const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#f0f0f0', padding: 10 },
});
DetailScreen.js
screens/DetailScreen.js
import React from 'react';
import {
View,
Text,
Image,
Button,
StyleSheet,
TouchableOpacity,
} from 'react-native';
import { usePokemonStore } from '../store/usePokemonStore';
import { Ionicons } from '@expo/vector-icons';
export default function DetailScreen({ route }) {
// Extraemos el objeto "pokemon" enviado desde la lista
const { pokemon } = route.params;
// Conectamos con el Store para acciones y consultas
const toggleFavorito = usePokemonStore((state) => state.toggleFavorito);
const esFavorito = usePokemonStore((state) => state.esFavorito(pokemon.id));
return (
<View style={styles.container}>
<TouchableOpacity
style={styles.star}
onPress={() => toggleFavorito(pokemon)}>
<Ionicons
name={esFavorito ? 'star' : 'star-outline'}
size={30}
color={esFavorito ? 'gold' : 'gray'}
/>
</TouchableOpacity>
<Image source={pokemon.image} style={styles.image} />
<Text style={styles.title}>{pokemon.name}</Text>
<Text style={styles.type}>Tipo: {pokemon.type}</Text>
</View>
);
}
const styles = StyleSheet.create({
container: {
flex: 1,
alignItems: 'center',
justifyContent: 'center',
padding: 20,
},
image: { width: 250, height: 250 },
title: { fontSize: 32, fontWeight: 'bold', textTransform: 'uppercase' },
type: { fontSize: 18, color: '#666', marginBottom: 20 },
star: { position: 'absolute', top: 12, right: 12 },
});
FavoritesScreen.js
screens/FavoritesScreen.js
// src/screens/FavoritesScreen.js
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import PokeCard from '../components/PokeCard';
import { usePokemonStore } from '../store/usePokemonStore';
export default function FavoritesScreen({ navigation }) {
const favoritos = usePokemonStore((state) => state.favoritos);
if (favoritos.length === 0) {
return (
<View style={styles.empty}>
<Text style={styles.emptyText}>No tienes favoritos aún</Text>
</View>
);
}
return (
<View style={styles.container}>
<FlatList
data={favoritos}
keyExtractor={(item) => item.id.toString()}
renderItem={({ item }) => (
<PokeCard
pokemon={item}
onPress={() => navigation.navigate('Detail', { pokemon: item })}
/>
)}
numColumns={2}
/>
</View>
);
}
const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#f0f0f0', padding: 10 },
empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
emptyText: { fontSize: 16, color: '#999' },
});
pokedex.js
data/pokedex.js
const pokedexData = [
{
id: 1,
name: 'Bulbasaur',
type: 'Planta',
image: require('../assets/bulbasour.png'),
},
{
id: 4,
name: 'Charmander',
type: 'Fuego',
image: require('../assets/charmander.png'),
},
{
id: 7,
name: 'Squirtle',
type: 'Agua',
image: require('../assets/squirtle.png'),
},
{
id: 25,
name: 'Pikachu',
type: 'Eléctrico',
image: require('../assets/pikachu.png'),
},
/ / M E M E S Ø=ÜG
{
id: 52,
name: 'Daniel V.',
type: 'Dragón',
image: require('../assets/DanielPokemon.jpg'),
},
{
id: 9,
name: 'Natalia',
type: 'Hada',
image: require('../assets/nataliapokemonv2.jpeg'),
},
{
id: 10,
name: 'Pablo Escolar',
type: 'Roca',
image: require('../assets/pablopokemon.png'),
},
{
id: 238,
name: 'Daniel G.',
type: 'Fantasma',
image: require('../assets/DanielGPokemon.jpg'),
},
{
id: 2,
name: 'Kevin',
type: 'Lucha',
image: require('../assets/kevinpokemon.jpg'),
},
{
id: 0,
name: 'Toño',
type: 'Legendario',
image: require('../assets/tonopokemon.png'),
},
];
export default pokedexData;
3. Capturas de Pantalla
Captura 1
Captura 2
Captura 3