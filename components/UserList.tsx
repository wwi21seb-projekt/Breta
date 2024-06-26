import UserListItem from "../components/UserListItem";
import React, { useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { baseUrl } from "../env";
import { AboRecords, UserRecords } from "../components/types/UserListTypes";
import { useAuth } from "../authentification/AuthContext";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import ErrorComp from "../components/ErrorComp";

type Props = {
  type: string;
};

interface RouteParams {
  username: string;
}

const UserList: React.FC<Props> = ({ type }) => {
  const { token } = useAuth();
  const route = useRoute();
  const params = route.params as RouteParams;
  const username = params.username ? params.username : "";
  const [records, setRecords] = useState<AboRecords[]>([]);
  const [errorText, setErrorText] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchUsers = async (loadMore: boolean) => {
    setLoading(true);
    let data!: UserRecords;
    let response;
    let newOffset = loadMore ? offset + 10 : 0;
    const urlWithParams = `${baseUrl}subscriptions/${username}?type=${type}&offset=${newOffset}&limit=10`;

    try {
      response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      data = await response.json();
      switch (response.status) {
        case 200:
          setRecords(loadMore ? [...records, ...data.records] : data.records);
          setOffset(newOffset);
          setHasMoreData(data.pagination.records - data.pagination.offset > 10);
          break;
        case 401:
        case 404:
          setErrorText(data.error.message);
          break;
        default:
          setErrorText("Something went wrong, please try again later.");
      }
    } catch (error) {
      setErrorText(
        "There are issues communicating with the server, please try again later.",
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreUsers = () => {
    if (!loadingMore && hasMoreData) {
      setLoadingMore(true);
      fetchUsers(true);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUsers(false);
    }, []),
  );

  if (loading && !loadingMore) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (errorText) {
    return <ErrorComp errorText={errorText} />;
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
              profilePictureUrl={item.picture?.url}
              followingId={item.followingId}
              setErrorText={setErrorText}
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
      <ErrorComp errorText="Something went wrong, please try again later." />
    );
  }
};

export default UserList;
