import {useEffect, useState} from 'react'
import {ScrollView, TextInput, View, TouchableOpacity, Text, SafeAreaView} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {FlatList, Icon} from 'native-base'
import { useDebounce } from 'use-debounce'
import { baseUrl } from "../env";




const Search = () => {

  // type User = {
  //   username: string,
  //   nickname: string,
  //   profilePictureUrl: string
  // }

  let data: any

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchInput] = useDebounce(searchInput, 1000);

  const [showResultList, setshowResultList] = useState(false)
  


  useEffect(() => {
    

    (async () => {
      const encodedSearchValue = encodeURIComponent(debouncedSearchInput)

      const urlWithParams = `${baseUrl}users?username=${encodedSearchValue}&offset=0&limit=3000`

      console.log(urlWithParams)
      let response

      try{
        response = await fetch(urlWithParams, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
        }})
        data = await response.json()
      }catch(error){
        console.log(error)
      }

      if (response?.ok){
        console.log(data)
        setshowResultList(true)
      }
    })();
    console.log(debouncedSearchInput)
  }, [debouncedSearchInput])

  const handleSearchInputChange = (searchInput: string) => {
    setSearchInput(searchInput);
  }

  return (
    <SafeAreaView className='bg-white'>
      <View className='flex flex-row  bg-lightgray rounded-full m-4'>
        <TextInput value={searchInput} placeholder='search for users' className='flex-1 p-4' onChangeText={handleSearchInputChange}/>
          <TouchableOpacity className='flex items-center justify-center m-4'>
            <Icon as={Ionicons} name="search-outline" size="xl" color="black"/>
          </TouchableOpacity>
      </View>

      {showResultList === true && (
        <View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.username}
            renderItem={({item}) => (
              <View>
                <Text>ist die view am arsch?</Text>
                <Text>item.username</Text>
                <Text>item.nickname</Text>
              </View>
            )}
            >

          </FlatList>
          </View>
      )}
    </SafeAreaView>
  );
}
export default Search
