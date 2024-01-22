import { useEffect, useState } from "react";
import { TextInput, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Icon } from "native-base";
import { useDebounce } from "use-debounce";
import { baseUrl } from "../env";
import { COLORS } from "../theme";
import { User, ResponseData } from "../components/types/UserListTypes";
import { TabView, SceneMap } from 'react-native-tab-view';


const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebounce(searchInput, 500);

  const [showResultList, setshowResultList] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  //components for tabs -> in future gonna be UserList and own SearchPostFeed comps
  const userList = () => {
    return(
      <View>
            <FlatList
              data={users}
              keyExtractor={(item) => item.username}
              renderItem={({ item }) => (
                <View>
                  <Text>{item.username}</Text>
                  <Text>{item.nickname}</Text>
                </View>
              )}
            ></FlatList>
          </View>
    )
  }
  
  //initialize SceneMap for Tabview
  const renderScene = SceneMap({
    userList: userList
  })

  useEffect(() => {
    if (!searchInput.trim()) {
      return;
    }
    (async () => {
    let data!: ResponseData;
    const encodedSearchValue = encodeURIComponent(debouncedSearchInput);

    const urlWithParams = `${baseUrl}users?username=${encodedSearchValue}&offset=0&limit=3000`;

    console.log(urlWithParams);
    let response;

    try {
      response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      data = await response.json();
    } catch (error) {
      console.log(error);
    }

    if (response?.ok) {
      setUsers(data.records);
      console.log(users);
      setshowResultList(true);
    }
  })();
  console.log(debouncedSearchInput);
  }, [debouncedSearchInput]);

  const handleSearchInputChange = (searchInput: string) => {
    if (searchInput === ""){
      setSearchInput("")
      setshowResultList(false)
    }else{
      setSearchInput(searchInput);
    }
  };

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

      {showResultList === true && (
        <View>
          <FlatList
            data={users}
            keyExtractor={(item) => item.username}
            renderItem={({ item }) => (
              <View>
                <Text>{item.username}</Text>
                <Text>{item.nickname}</Text>
              </View>
            )}
          ></FlatList>
        </View>
      )}
    </View>
  );
};
export default Search;
