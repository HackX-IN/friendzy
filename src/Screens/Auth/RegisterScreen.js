import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Alert,
  Platform,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API } from "../../../APi";
import * as ImagePicker from "expo-image-picker";
import CountryPicker from "react-native-country-picker-modal";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [number, setNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const navigation = useNavigation();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      let newfile = {
        uri: result.assets[0].uri,
        type: `test/${result.assets[0].uri.split(".")[1]}`,
        name: `test.${result.assets[0].uri.split(".")[1]}`,
      };
      handleUpload(newfile);
    } else {
      Alert.alert("you need to give up permission to work");
    }
  };
  const handleNumberChange = (text) => {
    // Remove any existing calling code from the input text
    const strippedText = text.replace(`+${selectedCountry.callingCode}`, "");

    // If a country is selected, prepend the calling code to the stripped text
    if (selectedCountry) {
      setNumber(`+${selectedCountry.callingCode}${strippedText}`);
    } else {
      setNumber(text); // No country selected, update the number as is
    }
  };

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      image: image,
      number: number,
    };

    axios
      .post(API + "/register", user)
      .then((response) => {
        console.log(response.data);
        // Store the user data in AsyncStorage

        Alert.alert(
          "Registration successful",
          "You have been registered Successfully"
        );
        setName("");
        setEmail("");
        setPassword("");
        setImage("");
        setNumber("");
        navigation.navigate("Login");
      })
      .catch((error) => {
        Alert.alert(
          "Registration Error",
          "An error occurred while registering"
        );
        console.log("registration failed", error);
      });
  };

  const handleUpload = (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Friendzy");
    data.append("cloud_name", "inamneda");

    fetch("https://api.cloudinary.com/v1_1/inamneda/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        // setImage(data.url);

        setImage(data?.url);
      })
      .catch((err) => {
        Alert.alert("error while uploading");
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#4A55A2", fontSize: 17, fontWeight: "600" }}>
            Register
          </Text>

          <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 15 }}>
            Register To your Account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <Pressable
            className="flex justify-center items-center py-1 px-2"
            onPress={pickImage}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <Image
                source={{
                  uri: "https://cdn.dribbble.com/userupload/8313273/file/still-6d0532b705cc54c25accac362f7dfbaa.png?resize=320x240&vertical=center",
                }}
                className="w-20 h-20 rounded-full"
              />
            )}
          </Pressable>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Name
            </Text>

            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"black"}
              placeholder="Enter your name"
            />
          </View>

          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Email
            </Text>

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"black"}
              placeholder="Enter Your Email"
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Password
            </Text>

            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"black"}
              placeholder="Password"
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Phone Number
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Country Picker Modal */}
              <CountryPicker
                onSelect={(country) => setSelectedCountry(country)}
                withFilter
                countryCode={selectedCountry ? selectedCountry.cca2 : "US"}
              />

              {/* Phone Number Input */}
              <TextInput
                value={number}
                onChangeText={handleNumberChange}
                keyboardType="phone-pad"
                style={{
                  fontSize: 18,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                  marginVertical: 10,
                  flex: 1,
                }}
                placeholderTextColor={"black"}
                placeholder="Enter Your Phone Number"
              />
            </View>
          </View>

          <Pressable
            onPress={handleRegister}
            style={{
              width: 200,
              backgroundColor: "#4A55A2",
              padding: 15,
              marginTop: 50,
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Register
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.goBack()}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Already Have an account? Sign in
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
