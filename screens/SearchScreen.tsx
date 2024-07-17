import React, { useEffect, useState } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDebounce } from "use-debounce";
import { baseUrl } from "../env";
import { COLORS } from "../theme";
import { ListUser, UserRecords } from "../components/types/UserListTypes";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import UserListItem from "../components/UserListItem";
import { Post, PostRecords } from "../components/types/Post";
import TextPostCard from "../components/TextPostCard";
import { useAuth } from "../authentification/AuthContext";
import ErrorComp from "../components/ErrorComp";

const SearchScreen = () => {
  const { token } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebounce(searchInput, 500);
  const [users, setUsers] = useState<ListUser[]>([]);
  const layout = useWindowDimensions();
  const [userSearchError, setUserSearchError] = useState("");
  const [postSearchError, setPostSearchError] = useState("");

  // Custom TabBar component for styling the TabView
  const customTabBar: React.FC<any> = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: COLORS.black }}
      tabStyle={{ backgroundColor: COLORS.white }}
      activeColor={COLORS.primary}
      inactiveColor={COLORS.darkgray}
    />
  );

  // Render user list
  const userList = () => {
    if (userSearchError !== "") {
      return <ErrorComp errorText={userSearchError}></ErrorComp>;
    } else {
      return (
        <View>
          <FlatList
            data={users}
            keyExtractor={(item) => item.username}
            renderItem={({ item }) => (
              <UserListItem
                username={item.username}
                profilePictureUrl={item.picture?.url}
                followingId={"searchResult"}
                setErrorText={setUserSearchError}
              />
            )}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMoreUsers}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              loadingMoreUsers ? <ActivityIndicator size={"small"} /> : null
            }
          ></FlatList>
        </View>
      );
    }
  };

  // Render post list
  const postList = () => {
    if (postSearchError !== "") {
      return <ErrorComp errorText={postSearchError}></ErrorComp>;
    } else {
      return (
        <View>
          <FlatList
          className="py-5"
            data={posts}
            keyExtractor={(item) => item.postId}
            renderItem={({ item }) => (
              <TextPostCard
                key={item.postId}
                username={item.author.username}
                profilePic={item.author?.picture?.url || ""}
                date={item.creationDate}
                postContent={item.content}
                repostAuthor={item.repost?.author?.username || ""}
                repostPicture={item.repost?.author?.picture?.url  || ""}
                isRepost={item.repost !== null}
                postId={item.postId}
                initialLiked={item.liked}
                initialLikes={item.likes}
                isOwnPost={false}
                repostPostPicture={item.repost?.picture?.url || ""}
                picture={item.picture?.url  || ""}
                repostPostContent={item.repost?.content}
              />
            )}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMorePosts}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              loadingMorePosts ? <ActivityIndicator size={"small"} /> : null
            }
          ></FlatList>
        </View>
      );
    }
  };

  // Index and routes for TabView
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Users" },
    { key: "second", title: "Posts" },
  ]);

  // Initialize SceneMap for TabView
  const renderScene = SceneMap({
    first: userList,
    second: postList,
  });

  // State variables for user search
  const [userOffset, setUserOffset] = useState(0);
  const [loadingMoreUsers, setLoadingMoreUsers] = useState(false);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  let userLimit = 10;

  // Fetch users from the server
  const fetchUsers = async (loadingMore: boolean) => {
    if (!hasMoreUsers || !searchInput.trim()) {
      return;
    }

    let data!: UserRecords;
    const encodedSearchValue = encodeURIComponent(debouncedSearchInput);
    let newOffset = loadingMore ? userOffset + userLimit : 0;
    const urlWithParams = `${baseUrl}users?username=${encodedSearchValue}&offset=${newOffset}&limit=${userLimit}`;
    let response;

    try {
      response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.ok) {
        data = await response.json();
        setUsers([...users, ...data.records]);
        setUserOffset(newOffset);
        setHasMoreUsers(data.records.length === userLimit);
      } else {
        switch (response.status) {
          case 401:
            setUserSearchError(data.error.message);
            break;
          default:
            setUserSearchError("Something went wrong, please try again later.");
        }
      }
    } catch (error) {
      setUserSearchError(
        "There are issues communicating with the server, please try again later.",
      );
    } finally {
      setLoadingMoreUsers(false);
    }
  };

  // Load more users when scrolling
  const loadMoreUsers = () => {
    if (!loadingMoreUsers && hasMoreUsers) {
      setLoadingMoreUsers(true);
      fetchUsers(true);
    }
  };

  // State variables for post search
  const [lastPostId, setLastPostId] = useState("");
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  let postLimit = 10;
  const [posts, setPosts] = useState<Post[]>([]);

  // Fetch posts from the server
  const fetchPosts = async () => {
    if (!hasMorePosts || !searchInput.trim()) {
      return;
    }

    let data!: PostRecords;
    const encodedSearchValue = encodeURIComponent(debouncedSearchInput);
    const urlWithParams = `${baseUrl}posts?q=${encodedSearchValue}&postId=${lastPostId}&limit=${postLimit}`;
    let response;

    try {
      response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        data = await response.json();
        setPosts([...posts, ...data.records]);
        setLastPostId(data.pagination.lastPostId);
        setHasMorePosts(data.records.length === postLimit);
      } else {
        switch (response.status) {
          case 401:
            setPostSearchError(data.error.message);
            break;
          default:
            setPostSearchError(
              "Something went wrong, please try again later." + response.status,
            );
        }
      }
    } catch (error) {
      setPostSearchError(
        "There are issues communicating with the server, please try again later.",
      );
    } finally {
      setLoadingMorePosts(false);
    }
  };

  // Load more posts when scrolling
  const loadMorePosts = () => {
    if (!loadingMorePosts && hasMorePosts) {
      setLoadingMorePosts(true);
      fetchPosts();
    }
  };

  // Effect to handle debounced search input changes
  useEffect(() => {
    if (debouncedSearchInput === "") {
      // Reset user search
      setUserOffset(0);
      setLoadingMoreUsers(false);
      setHasMoreUsers(true);
      setUsers([]);

      // Reset post search
      setLastPostId("");
      setLoadingMorePosts(false);
      setHasMorePosts(true);
      setPosts([]);
    }
    fetchUsers(false);
    fetchPosts();
  }, [debouncedSearchInput]);

  // Handle search input change
  const handleSearchInputChange = (searchInput: string) => {
    setLastPostId("");
    setSearchInput(searchInput);
  };

  // Render the main view
  return (
    <View className="flex flex-col h-full bg-white pb-4">
      <View className="flex flex-row  bg-lightgray rounded-full m-4">
        <TextInput
          value={searchInput}
          placeholder="search for users"
          className="flex-1 p-4"
          onChangeText={handleSearchInputChange}
        />
        <TouchableOpacity className="flex items-center justify-center m-4">
          <Ionicons name="search-outline" size={26} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={customTabBar}
      />
    </View>
  );
};

export default SearchScreen;
