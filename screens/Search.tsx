import { useEffect, useState } from "react";
import { TextInput, View, TouchableOpacity, Text, useWindowDimensions, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Icon } from "native-base";
import { useDebounce } from "use-debounce";
import { baseUrl } from "../env";
import { COLORS } from "../theme";
import { ListUser, SearchRecords } from "../components/types/UserListTypes";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import UserListItem from "../components/UserListItem";



const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebounce(searchInput, 500);

  const [users, setUsers] = useState<ListUser[]>([]);

  const layout = useWindowDimensions();

  //style own TabBar since materials isn't fitting
  //any type since the types come directly from react-native-tab-view libary
  const customTabBar: React.FC<any> = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: COLORS.black}}
      tabStyle={{backgroundColor: COLORS.white}}
      activeColor={COLORS.primary}
      inactiveColor={COLORS.darkgray}
    />
  )
  
  //components for tabs in TabView -> in future gonna be UserList and own SearchPostFeed comps
  const userList = () => {
    return(
      <View>
            <FlatList
              data={users}
              keyExtractor={(item) => item.username}
              renderItem={({ item }) => (
                <UserListItem
                  username={item.username}
                  profilePictureUrl={item.profilePictureUrl}
                  enableFollowHandling={false}
            />
              )}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMoreUsers}
              onEndReachedThreshold={0.2}
              ListFooterComponent={
                loadingMore ? <ActivityIndicator size={"small"} /> : null
              }
              ></FlatList>
          </View>
    )
  }
  
  const postList = () => {
    return(
      <View>
        <Text>Hier kommen die posts hin!</Text>
      </View>
    )
   
  }
  
  //index and routes with title for TabView
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Users' },
    { key: 'second', title: 'Posts' },
  ]);

    //initialize SceneMap for Tabview
  const renderScene = SceneMap({
    first: userList,
    second: postList,
  })

  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  //limit noch auf 10 ändern!‚
  let limit = 2

  const fetchUsers = async (loadingMore: boolean) => {
    if(!hasMoreData){
      return;
    }

    let data!: SearchRecords;
    const encodedSearchValue = encodeURIComponent(debouncedSearchInput);
    let newOffset = loadingMore ? offset + limit : 0;
    const urlWithParams = `${baseUrl}users?username=${encodedSearchValue}&offset=${newOffset}&limit=${limit}`;
    let response;

    try {
      response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.ok) {
        data = await response.json();
        setUsers(data.records);
        setOffset(newOffset)
        setHasMoreData(data.records.length === limit)
      }else{
        switch(response.status){
          case 401:
            setError("Sie sind nicht authentifiziert!")
            break;
          default:
            setError("Etwas ist schiefgelaufen. Versuche es später erneut.")
          }
        }
    } catch (error) {
      setError("There has been an error while communicating with the server.")
    } finally {
      setLoadingMore(false)
    }
  }

  const loadMoreUsers = () => {
    if(!loadingMore && hasMoreData){
      setLoadingMore(true)
      fetchUsers(true)
    }
  }

  useEffect(() => {
    if (!searchInput.trim()) {
      return;
    }
    fetchUsers(false)
    console.log(debouncedSearchInput);
  }, [debouncedSearchInput]);

  const handleSearchInputChange = (searchInput: string) => {
    if (searchInput === ""){
      setSearchInput("")
    }else{
      setSearchInput(searchInput);
    }
  };

  if(error !== "") {
    return (
      <View className="p-6 bg-white h-full">
        <Text className="text-base">{error}</Text>
      </View>
    );
  } else {
    return (
      <View>
        <View className="bg-white">
          <View className="flex flex-row  bg-lightgray rounded-full m-4">
            <TextInput
              value={searchInput}
              placeholder="search for users"
              className="flex-1 p-4"
              onChangeText={handleSearchInputChange}
              />
            <TouchableOpacity className="flex items-center justify-center m-4">
              <Icon
                as={Ionicons}
                name="search-outline"
                size="xl"
                color={COLORS.black}
                />
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-full">
        <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width, height: layout.height }}
        renderTabBar={customTabBar}
        />
        </View>
      </View>
  );
  }
};
export default Search;
