import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { baseUrl } from "../env";
import { ScrollView } from "native-base";

const Impressum = () => {
  const [impressumText, setImpressumText] = useState("");
  const [error, setError] = useState("");

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
        data = await response.json();
      } catch (error) {
        setError("Das Impressum konnte nicht gelanden. Versuchen sie es später erneut.")
      }
      if (response?.ok) {
        setImpressumText(data.text);
      }
    })();
  });

  if (error !== "") {
    return (
      <View className="p-6 bg-white h-full">
      <Text className="text-base">{error}</Text>
    </View>
    );
  }
  else return (
    <View className="pb-10 px-5 bg-white h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
      <Text className="text-base">{impressumText}</Text>
      <Text className="text-base">{impressumText}</Text>
    </ScrollView>
    </View>
  );
}

export default Impressum;

