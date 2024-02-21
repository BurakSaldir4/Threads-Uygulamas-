import { Text, View } from 'react-native'
import React from 'react'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from './screens/HomeScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import ActivityScreen from "./screens/ActivityScreen"
import ProfilesScreen from "./screens/ProfileScreen"
import ThreadsScreen from "./screens/ThreadsScreen"

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "black" },
          headerShown: false,
          tabBarIcon: ({ focused }) => focused ? (
            <Entypo name="home" size={24} color="black" />
          ) : (
            <AntDesign name="home" size={24} color="black" />
          )
        }} />
        <Tab.Screen name="Threads" component={ThreadsScreen} options={{
          tabBarLabel: "Create",
          tabBarLabelStyle: { color: "black" },
          headerShown: false,
          tabBarIcon: ({ focused }) => focused ? (
            <Ionicons name="create" size={24} color="black" />
          ) : (
            <Ionicons name="create-outline" size={24} color="black" />)
        }} />
        <Tab.Screen name="Activity"
          component={ActivityScreen}
          options={{
            tabBarLabel: "Activity",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) => focused ? (
              <Entypo name="heart" size={24} color="black" />
            ) : (
              <AntDesign name="hearto" size={24} color="black" />
            )
          }} />
        <Tab.Screen name="Profile"
          component={ProfilesScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) => focused ? (
              <Ionicons name="person" size={24} color="black" />
            ) : (
              <Ionicons name="person-outline" size={24} color="black" />
            )
          }} />
      </Tab.Navigator>
    )
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitleAlign: "center" }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerTitleAlign: "center" }} />
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerTitleAlign: "center" }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator
