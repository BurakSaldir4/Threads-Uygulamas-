import { Image, KeyboardAvoidingView, Pressable, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken")
        if (token) {
          setTimeout(() => {
            navigation.replace("Main")
          }, 400)
        }

      } catch (error) {
        console.log("error", error)
      }
    }
    checkLoginStatus();
  }, [])

  const handleLogin = () => {
    const user = {
      email,
      password
    }

    axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/login`, user).then((response) => {
      if (response.data.success) {
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        navigation.navigate("Home")
      }
      else {
        alert("Login error")
        console.dir("error", error)
      }
    })
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center"
      }}
    >
      <View style={{
        justifyContent: 'center',
        alignItems: "center"
      }}  >
        <Image
          style={{
            width: 170,
            height: 200,
            resizeMode: "contain"
          }}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>
      <KeyboardAvoidingView>
        <View style={{ alignItems: "center", justifyContent: "center" }} >
          <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 25 }} >Login to Your Account</Text>
        </View>

        <View style={{ marginTop: 50 }} >
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            borderColor: "D0D0D0",
            borderWidth: 1,
            paddingVertical: 5,
            borderRadius: 5,
          }} >
            <MaterialIcons style={{ marginLeft: 8 }} name="email" size={24} color="gray" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{ color: "gray", marginVertical: 10, width: 300, fontSize: email ? 16 : 16 }}
              placeholder='Enter your Email'
            />
          </View>

        </View>
        <View style={{ marginTop: 30 }} >
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            borderColor: "D0D0D0",
            borderWidth: 1,
            paddingVertical: 5,
            borderRadius: 5,
          }} >
            <AntDesign style={{ marginLeft: 8 }} name="lock" size={24} color="gray" />
            <TextInput
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{ color: "gray", marginVertical: 10, width: 300, fontSize: password ? 16 : 16 }}
              placeholder='Enter your Password'
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 }} >
            <Text>Keep me logged in</Text>
            <Text style={{ fontWeight: 500, color: "#007FFF" }} >Forgot Password</Text>
          </View>
        </View>
        <View style={{ marginTop: 45 }} />
        <Pressable
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "black",
            padding: 15,
            marginTop: 40,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: "white" }} >LOGİN</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Register")} style={{ marginTop: 10 }}>
          <Text style={{ textAlign: "center", fontSize: 16 }} >Don't have an account ? Sign Up</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginScreen
