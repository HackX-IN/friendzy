import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import jwt_decode from "jwt-decode";

import axios from "axios";
const ProfileScreen = () => {
  const [user, setuser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const Getuser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;

      const response = await axios.get(
        `http://192.168.1.7:8000/userById/${userId}`
      );
      console.log(response.data.user);
      setuser(response.data.user);
    };
    Getuser();
  }, []);

  const Logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      console.log("Token removed from AsyncStorage.");
      navigation.navigate("Login");
    } catch (error) {
      console.log("Error removing token from AsyncStorage", error);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: Platform.OS === "android" ? 40 : 0 }}
    >
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://walkingtree.tech/wp-content/uploads/revslider/splash-creative-light-01-animated/Slider-CL01-Background.png",
          }}
          style={styles.backgroundImage}
        />
        <View style={styles.header}>
          <Pressable>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Feather name="edit" size={24} color="black" />
        </View>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: user?.image }} style={styles.profileImage} />
        </View>
        <View className="flex-col justify-center items-center p-3 space-x-3 py-12 ">
          <Text className="font-bold text-xl text-black">{user?.name}</Text>
          <Text className="text-gray-500">{user?.email}</Text>
        </View>
        <View className=" w-[80%] h-[50%] bg-yellow-500 p-3 space-x-2 py-3 left-11 rounded-2xl ">
          <View className=" m-3">
            <TouchableOpacity className="p-5 bg-slate-600 space-x-2 py-3 rounded-2xl mb-3 flex-row items-center ">
              <MaterialIcons name="security" size={24} color="white" />
              <Text className="text-white font-bold">Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-5 bg-slate-600 space-x-2 py-3 rounded-2xl mb-3 flex-row items-center ">
              <Ionicons name="notifications" size={24} color="white" />
              <Text className="text-white font-bold">Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-5 bg-slate-600 space-x-2 py-3 rounded-2xl mb-3  flex-row items-center">
              <Feather name="database" size={24} color="white" />
              <Text className="text-white font-bold">Storage</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-5 bg-slate-600 space-x-2 py-3 rounded-2xl mb-3 flex-row items-center">
              <Ionicons name="help-outline" size={24} color="white" />
              <Text className="text-white font-bold">Help</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-5 bg-red-600 space-x-2 py-3 rounded-2xl mb-3 flex-row items-center"
              onPress={Logout}
            >
              <AntDesign name="logout" size={24} color="white" />
              <Text className="text-white font-bold">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    height: "30%",
    resizeMode: "cover",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  profileImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: Platform.OS === "android" ? 180:150,
    left: 0,
    right: 0,
  },
  profileImage: {
    width: 100, // Adjust the size as per your requirement
    height: 100, // Adjust the size as per your requirement
    borderRadius: 50,
    resizeMode: "cover",
  },
});

export default ProfileScreen;
