import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { baseUrl } from "../env";

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
    <View className="p-6 bg-white h-full">
      <Text className="text-base">{impressumText}</Text>
    </View>
  );
}

export default Impressum;

