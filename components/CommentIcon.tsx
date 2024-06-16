import Ionicons from "@expo/vector-icons/Ionicons"
import { TouchableOpacity } from "react-native"
import { COLORS } from "../theme"

interface CommentIconProps {
    onPress: () => void;
}

const CommentIcon: React.FC<CommentIconProps> = ({ onPress }) => {

    return (
        <TouchableOpacity onPress={onPress} className="mr-1">
                        <Ionicons
                          name="chatbox-ellipses-outline"
                          size={20}
                          color={COLORS.black}
                        />
        </TouchableOpacity> 
        )
}

export default CommentIcon;
