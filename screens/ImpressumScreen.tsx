import { useState, useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { baseUrl } from "../env";
import { ScrollView } from "native-base";
import Error from "../components/Error";

const Impressum = () => {
  const [impressumText, setImpressumText] = useState("");
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
        switch (response.status) {
          case 200:
            data = await response.json();
            setImpressumText(data.text);
            break;
          default:
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
  } else if (impressumText !== "") {
    return (
      <View className="pb-10 px-5 bg-white h-full">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-base">{impressumText}</Text>
        </ScrollView>
      </View>
    );
  } else {
    return <Error errorText={errorText} />;
  }
};

export default Impressum;
