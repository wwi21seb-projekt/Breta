import UserListItem from "../components/UserListItem";
import { useState, useEffect } from "react";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { baseUrl } from "../env";
import { AboRecords, SearchRecords } from "../components/types/UserListTypes";

interface RouteParams {
  type: string;
  username: string;
}

const FollowerListScreen = () => {
  const route = useRoute();
  const params = route.params as RouteParams;
  const type = params.type ? params.type : "";
  const username = params.username ? params.username : "";

  const [records, setRecords] = useState<AboRecords[]>([]);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchUsers = async (loadMore: boolean) => {
    if (!hasMoreData) {
      return;
    }
    let data!: SearchRecords;
    let response;
    let newOffset = loadMore ? offset + 10 : 0;
    const urlWithParams = `${baseUrl}subscriptions/:${username}?type=${type}&offset=${newOffset}&limit=10`;

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
    fetchUsers(false).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (error !== "") {
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
          keyExtractor={(item) => item.username}
          renderItem={({ item }) => (
            <UserListItem
              username={item.username}
              profilePictureUrl={item.profilePictureUrl}
              followingId={item.followingId}
            />
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
