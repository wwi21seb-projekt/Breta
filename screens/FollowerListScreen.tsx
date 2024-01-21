import UserList from "../components/UserListItem";
import { useState, useEffect, useRef } from "react";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { baseUrl } from "../env";
import {
  ListRecords,
  FollowerResponseData,
} from "../components/types/UserListTypes";

interface RouteParams {
  type: string;
}

const FollowerListScreen = () => {
  const route = useRoute();
  const params = route.params as RouteParams;
  const type = params.type ? params.type : "";

  const [records, setRecords] = useState<ListRecords[]>([]);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchUsers = async (loadMore: boolean) => {
    if (!hasMoreData) {
      return;
    }
    let data!: FollowerResponseData;
    let response;
    let newOffset = loadMore ? offset + 10 : 0;
    const urlWithParams = `${baseUrl}subscriptions?type=${type}&offset=${offset}&limit=10`;

    try {
      response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        data = await response.json();
        setRecords(loadMore ? [...records, ...data.records] : data.records);
        setOffset(newOffset);
        setHasMoreData(data.records.length === 10);
      } else {
        switch (response.status) {
          case 401:
            setError("Auf das Login Popup navigieren!");
            break;
          case 404:
            setError(
              "Die Nutzer konnten nicht geladen werden. Versuche es später erneut.",
            );
            break;
          default:
            setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
        }
      }
    } catch (error) {
      setError("Etwas ist schiefgelaufen. Versuche es später erneut.");
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMoreUsers = () => {
    if (!loadingMore && hasMoreData) {
      setLoadingMore(true);
      fetchUsers(true);
    }
  };

  useEffect(() => {
    fetchUsers(false);
  }, []);

  if (error !== "") {
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">{error}</Text>
      </View>
    );
  } else if (records.length > 0) {
    return (
      <View className="bg-white h-full">
        <FlatList
          className="my-6"
          data={records}
          keyExtractor={(item) => item.user.username}
          renderItem={({ item }) => (
            <UserList user={item.user} subscriptionId={item.subscriptionId} />
          )}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreUsers}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size={"small"} /> : null
          }
        />
      </View>
    );
  } else {
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">
          Etwas ist schiefgelaufen. Versuche es später erneut.
        </Text>
      </View>
    );
  }
};

export default FollowerListScreen;
