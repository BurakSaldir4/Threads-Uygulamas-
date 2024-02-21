import { Image, ScrollView, Text, View } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from "jwt-decode"
import { UserType } from '../UserContext';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const { userId, setUserId } = useContext(UserType);

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/${postId}/${userId}/like`
      );
      const updatedPost = response.data;

      const updatedPosts = posts?.map((post) => post?._id === updatedPost._id ? updatedPost : post)
      setPosts(updatedPosts)
    } catch (error) {
      console.log("Error liking the posts", error)
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/get-posts`)
        console.log("response.data", response.data);
        setPosts(response.data.posts)
      } catch (error) {
        console.log("error fetching posts", error, new Date().toLocaleTimeString())
      }
    }

    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        setUserId(userId);
      } catch (error) {
        console.log("error fetching users", error, new Date().toLocaleTimeString())
      }
    }

    fetchUsers();
    fetchPosts();
  }, [])

  return (
    <ScrollView style={{ marginTop: 50, flex: 1, backgroundColor: "white" }}>
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <Image
        style={{ width: 60, height: 40, resizeMode: "contain" }}
        source={{
          uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png"
        }}
      />
    </View>
    <View>
      {posts?.map((post) => (
        <View key={post.id} style={{ padding: 15, flexDirection: "row", gap: 10, marginVertical: 10 }}>
          <View>
            <Image
              style={{
                marginBottom: 20,
                width: 40,
                height: 40,
                borderRadius: 20,
                resizeMode: "contain",
              }}
              source={{ uri: "https://e7.pngegg.com/pngimages/416/62/png-clipart-anonymous-person-login-google-account-computer-icons-user-activity-miscellaneous-computer.png" }}
            />
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold", marginBottom: 4 }}>{post?.user?.name}</Text>
            <Text>{post?.content}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 15 }}>
              {post.likes.includes(userId) ? (
                <AntDesign onPress={()=>handleLike(post?._id)} name="heart" size={18} color="red" />
              ): (
                <AntDesign onPress={()=>handleLike(post?._id)} name="hearto" size={18} color="black" />  
              )}

              {/* <AntDesign onPress={()=>handleLike(post?._id)} name="hearto" size={18} color="black" /> */}

              <FontAwesome5 name="comment" size={18} color="black" />

              <Ionicons name="share-social-outline" size={18} color="black" />
            </View>
            <Text style={{marginTop:4,color:"gray"}}>
              {post.likes.length} beğeni {post.replies.length} cevap
            </Text>
          </View>
        </View>
      ))}
    </View>

    {/* {
      posts.map((p, i) => (
        <Text key={i}>{JSON.stringify(p.content)}</Text>
      ))
    } */}
  </ScrollView>
  )
}

export default HomeScreen
