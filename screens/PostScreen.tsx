import { useEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  Button,
  Image,
  StyleSheet
} from "react-native";
import { SHADOWS, COLORS } from "../theme";
import { baseUrl } from "../env";
import { useAuth } from "../authentification/AuthContext";
import * as Location from "expo-location";
import { navigate } from "../navigation/NavigationService";
import ErrorComp from "../components/ErrorComp";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


const PostScreen: React.FC = () => {
  const { token } = useAuth();
  const [postText, setPostText] = useState("");
  const [postError, setPostError] = useState("");
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(0);

  useEffect(() => {
    getLocation();
  });

  const createPost = async () => {
    let response;
    let base64;

    if(image !== ''){
      base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    let body = JSON.stringify({
      content: postText,
      picture: image === '' ? "" : base64,
      location: {
        longitude: longitude,
        latitude: latitude,
        accuracy: accuracy === null ? "" : Math.floor(accuracy),
      },
    })

    console.log(body)

    try {
      response = await fetch(`${baseUrl}posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body
      });
      console.log("response: ", response)

      switch (response.status) {
        case 201:
          setPostError("");
          navigate("Profile");
          break;
        case 400:
          setPostError(
            "The request body is invalid. Please check the request body and try again.",
          );

          break;
        case 401:
          setPostError(
            "The Request is unauthorized. Please login to your account",
          );
          break;
        default:
          setPostError(response.status.toString());
      }
    } catch (error) {
      setPostError(`Network Error: ${error}`);
    }
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setAccuracy(location.coords.accuracy);
    } catch (error) {
      setPostError(`Error requesting location permission: ${error}`);
    }
  };

  const [image, setImage] = useState('');
  const [base64Image, setBase64Image] = useState('')
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
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage('');
    console.log("Image has been Removed")
  }

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
            numberOfLines={8}
            placeholder="Please put your text here..."
            maxLength={256}
          />
        </View>
        <View className="mt-1.5 ml-2.5 justify-start flex-row">
          <Text className="text-black text-xs">{postText.length} / 256</Text>
        </View>
        <View className="mt-10 items-center">
          <TouchableOpacity onPress={pickImage}>
            {image !== '' ? (
              <Image className="w-96 h-96 mb-5"source={{ uri: image }}/>
            ) : (
              <Image className="w-96 h-96 mb-5" source={require("../assets/images/image_placeholder.jpeg")}/>
            )}
          </TouchableOpacity>
        </View>
        <View>
          {postError.length !== 0 && <ErrorComp errorText={postError} />}
        </View>
        <View className="bg-white justify-center items-center flex-row">
          <TouchableOpacity
            style={{
              backgroundColor:
                postText === "" ? COLORS.lightgray : COLORS.primary,
              ...SHADOWS.small,
            }}
            className="flex-1 mx-7  p-3 items-center rounded-[18px]"
            disabled={postText === ""}
            onPress={() => {
              createPost();
            }}
          >
            <Text className="text-black text-xs">Create Post</Text>
          </TouchableOpacity>
          {image !== '' && (
            <TouchableOpacity
            style={{
              backgroundColor:
                COLORS.lightgray,
              ...SHADOWS.small,
            }}
            className="flex-1 mx-7 p-3 items-center rounded-[18px]"
            disabled={postText === ""}
            onPress={() => {
              removeImage();
            }}
          >
            <Text className="text-black text-xs">Remove Image</Text>
          </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PostScreen;
