import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../theme'; 

interface LikeButtonProps {
  isLiked: boolean;
  likes: number;
  handleLikePress: () => void;
  formatLikes: (likes: number) => string;
}

const LikeIcon: React.FC<LikeButtonProps> = ({ isLiked, likes, handleLikePress, formatLikes }) => {
  return (
    <TouchableOpacity
      className="flex-row items-center"
      onPress={handleLikePress}
    >
      <Ionicons
        name={isLiked ? "heart" : "heart-outline"}
        size={20}
        color={isLiked ? COLORS.primary : COLORS.black}
      />
      <Text className="text-sm">{formatLikes(likes)}</Text>
    </TouchableOpacity>
  );
};

export default LikeIcon;
