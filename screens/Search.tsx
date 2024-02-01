import { useEffect, useState } from "react";
import { TextInput, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Icon } from "native-base";
import { useDebounce } from "use-debounce";
import { baseUrl } from "../env";
import { COLORS } from "../theme";
import { User, ResponseData } from "../components/types/UserListTypes";
import AsyncStorage from "@react-native-async-storage/async-storage"
import AuthScreen from "./AuthScreen";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebounce(searchInput, 1000);

  const [showResultList, setshowResultList] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState("")

  useEffect(() => {
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
    async function getData(){
      let t
      t = await AsyncStorage.getItem("token");
      setToken(t);
    }
    getData()
  }, [debouncedSearchInput]);

  const handleSearchInputChange = (searchInput: string) => {
    setSearchInput(searchInput);
  };

  if (token === null) {
    return (
      <AuthScreen></AuthScreen>
    )
  }
  else {

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
            }
};
export default Search;
