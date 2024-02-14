import { useEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SHADOWS, COLORS } from "../theme";
import { baseUrl } from "../env";
import { checkAuthentification } from "../authentification/CheckAuthentification";
import LoginPopup from "../components/LoginPopup";

type RootStackParamList = {
  Feed: undefined;
};

type PostScreenprops = {
  navigation: StackNavigationProp<RootStackParamList, "Feed">;
};

const PostScreen: React.FC<PostScreenprops> = ({ navigation }) => {
  const isAuthenticated = checkAuthentification();

  const [postText, setPostText] = useState("");
  const [postError, setPostError] = useState("");
  const [token, setToken] = useState("");
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const createPost = async () => {
    let response;
    try {
      response = await fetch(`${baseUrl}posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: postText,
        }),
      });
      switch (response.status) {
        case 201:
          setPostError("");
          navigation.navigate("Feed");
          break;
        case 400:
          setPostError(
            "The request body is invalid. Please check the request body and try again.",
          );
          break;
        case 401:
          setPostError("Unauthorized. Please login again");
          break;
        default:
          console.error(response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  if (!isAuthenticated) {
    return <LoginPopup />;
  } else {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="bg-white flex-1">
          <View className="bg-white justify-center flex-row">
            <TextInput
              className="flex-1 border-2 mt-10 ml-2.5 mr-2.5 border-lightgray rounded-[8px] p-2"
              value={postText}
              onChangeText={(post) => {
                setPostText(post);
              }}
              multiline={true}
              numberOfLines={8} // Anzahl der sichtbaren Zeilen
              placeholder="Verfasse hier deinen Text ..."
              maxLength={256}
            />
          </View>
          <View className="mt-1.5 ml-2.5 justify-start flex-row">
            <Text className="text-black text-xs">{postText.length} / 256</Text>
          </View>
          <View>
            {postError.length !== 0 && (
              <Text className="text-red pt-5 text-center">{postError}</Text>
            )}
          </View>
          <View className="bg-white justify-center flex-row">
            <TouchableOpacity
              style={{
                backgroundColor:
                  postText === "" ? COLORS.lightgray : COLORS.primary,
                ...SHADOWS.small,
              }}
              className="flex-1 mt-[50px] mx-[120px] p-3 items-center rounded-[18px]"
              disabled={postText === ""}
              onPress={() => {
                createPost();
              }}
            >
              <Text className="text-black text-xs">Beitrag erstellen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

export default PostScreen;
