import { useState, React } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import styles from "../stylesheets/stylePost";
import { COLORS, SIZES } from "../theme";
import { baseUrl } from "../env";
import axios from "axios";

const Post = ({ navigation }) => {
  const [postText, changePostText] = useState("");
  const [postError, setPostError] = useState("");

  const createPost = () => {
    axios
      .post(`${baseUrl}posts`, {
        // Daten
      })
      .then(function (response) {
        if (response.status === 201) {
          setPostError("");
          navigation.navigate("TopBar");
        }
      })
      .catch(function (error) {
        switch (error.response.status) {
          case 400: {
            setPostError(
              "The request body is invalid. Please check the request body and try again.",
            );
            break;
          }
          case 401: {
            setPostError("Unauthorized");
            break;
          }
        }
      });
  };

  return (
    <View className="bg-white flex-1">
      <View className="bg-white justify-center flex-row">
        <TextInput
          style={styles.textInput}
          className="flex-1 border-2 mt-10 ml-2.5 mr-2.5"
          value={postText}
          onChangeText={(post) => {
            changePostText(post);
          }}
          multiline={true}
          numberOfLines={8} // Anzahl der sichtbaren Zeilen
          placeholder="Verfasse hier deinen Text ..."
          maxLength={256}
        />
      </View>
      <View className="mt-1.5 ml-2.5 justify-start flex-row">
        <Text style={{ color: COLORS.black, fontSize: SIZES.small }}>
          {postText.length} / 256
        </Text>
      </View>
      <View>
        {!(postError.length === 0) && (
          <Text
            style={{ color: COLORS.red, paddingTop: 20, textAlign: "center" }}
          >
            {postError}
          </Text>
        )}
      </View>
      <View className="bg-white justify-center flex-row">
        <TouchableOpacity
          style={[
            styles.postButton,
            {
              backgroundColor:
                postText === "" ? COLORS.lightgray : COLORS.primary,
            },
          ]}
          disabled={postText === ""}
          onPress={() => {
            createPost();
          }}
        >
          <Text style={{ color: COLORS.black, fontSize: SIZES.small }}>
            Beitrag erstellen
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Post;
