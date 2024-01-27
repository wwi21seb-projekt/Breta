import { useState, useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { baseUrl } from "../env";
import { ScrollView } from "native-base";

const Impressum = () => {
  const [impressumText, setImpressumText] = useState("");
  const [error, setError] = useState("");
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
        if (response.ok) {
          data = await response.json();
          setImpressumText(data.text);
        } else {
          setError(
            "Das Impressum konnte nicht gelanden. Versuchen sie es später erneut.",
          );
        }
      } catch (error) {
        setError(
          "Das Impressum konnte nicht gelanden. Versuchen sie es später erneut.",
        );
      }
    })()
    .finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  else if (error !== "") {
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">{error}</Text>
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
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">
          Das Impressum konnte nicht gelanden. Versuchen sie es später erneut.
        </Text>
      </View>
    );
  }
};

export default Impressum;
