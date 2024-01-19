import { useState, React } from 'react'
import { TextInput, TouchableOpacity, View, Text } from 'react-native'
import { COLORS } from '../theme'
import { baseUrl } from '../env'
import axios from 'axios'


const Post = ({ navigation }) => {
  const [postText, changePostText] = useState('')
  const [postError, setPostError] = useState('')

  const createPost = () => {
    axios
      .post(`${baseUrl}posts`, {
        // Daten
      })
      .then(function (response) {
        if (response.status === 201) {
          setPostError("");
          navigation.navigate('TopBar')
        }
      })
      .catch(function (error) {
        switch (error.response.status) {
          case 400: {
            setPostError('The request body is invalid. Please check the request body and try again.')
            break
          }
          case 401: {
            setPostError('Unauthorized')
            break
          }
        }
      })
  }

  return (
    <View className="bg-white flex-1">
      <View className="bg-white justify-center flex-row">
        <TextInput
          className='flex-1 border-2 mt-10 ml-2.5 mr-2.5 border-[#ccc] rounded-[8px] p-2'
          value={postText}
          onChangeText={(post) => { changePostText(post) }}
          multiline={true}
          numberOfLines={8} // Anzahl der sichtbaren Zeilen
          placeholder="Verfasse hier deinen Text ..."
          maxLength={256}
        />
      </View>
      <View className="mt-1.5 ml-2.5 justify-start flex-row" >
        <Text className='text-black text-xs'>{postText.length} / 256</Text>
      </View>
      <View>
      {!(postError.length === 0) && (
        <Text className='text-red pt-5 text-center'>
          {postError}
        </Text>
      )}
      </View>
      <View className="bg-white justify-center flex-row">
        <TouchableOpacity
          style={{ backgroundColor: postText === '' ? COLORS.lightgray : COLORS.primary }}
          className='flex-1 mt-[50px] mx-[120px] p-3 items-center rounded-[18px]'
          disabled={postText === ''}
          onPress={() => { createPost() }}
        >
          <Text className='text-black text-xs'>
            Beitrag erstellen
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Post
