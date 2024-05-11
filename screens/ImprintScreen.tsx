import { useState, useEffect } from "react";
import { Text, View, ActivityIndicator, ScrollView } from "react-native";
import { baseUrl } from "../env";
import ErrorComp from "../components/ErrorComp";

const ImprintScreen = () => {
  const [imprintText, setImprintText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(true);

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
          setErrorText("Something went wrong. Please try again.");
        }
      } catch (error) {
        setErrorText("Connection error. Please try again.");
      }
    })().finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (imprintText !== "") {
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
  } else {
    return <ErrorComp errorText={errorText} />;
  }
};

export default ImprintScreen;
