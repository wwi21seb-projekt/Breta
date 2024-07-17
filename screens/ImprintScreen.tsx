import { useState, useEffect } from "react";
import { Text, View, ActivityIndicator, ScrollView } from "react-native";
import { baseUrl } from "../env";
import ErrorComp from "../components/ErrorComp";

const ImprintScreen = () => {
  const [imprintText, setImprintText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch imprint text from the server
  useEffect(() => {
    (async () => {
      let data;
      let response;
      try {
        response = await fetch(`${baseUrl}imprint`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          data = await response.json();
          setImprintText(data.text);
        } else {
          setErrorText("Something went wrong, please try again later.");
        }
      } catch (error) {
        setErrorText(
          "There are issues communicating with the server, please try again later.",
        );
      }
    })().finally(() => {
      setLoading(false);
    });
  }, []);

  // Render loading indicator
  if (loading) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } 
  // Render imprint text if available
  else if (imprintText !== "") {
    return (
      <View className="pb-10 px-5 bg-white h-full">
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
        >
          <Text className="text-base">{imprintText}</Text>
        </ScrollView>
      </View>
    );
  } 
  // Render error component if there's an error
  else {
    return <ErrorComp errorText={errorText} />;
  }
};

export default ImprintScreen;
