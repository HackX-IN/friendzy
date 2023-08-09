import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../../../UserContext";
import { useNavigation } from "@react-navigation/native";
import UserChat from "../../Components/userChat";
import { API } from "../../../APi";

const ChatsScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
    acceptedFriendsList();
  }, []);
  const acceptedFriendsList = async () => {
    try {
      const response = await fetch(API + `/accepted-friends/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setAcceptedFriends(data);
      }
    } catch (error) {
      console.log("error showing the accepted friends", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await acceptedFriendsList();
    setRefreshing(false);
  };
  console.log("friends", acceptedFriends);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="bg-white"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Pressable>
        {acceptedFriends.map((item, index) => (
          <UserChat key={index} item={item} />
        ))}
      </Pressable>
    </ScrollView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
