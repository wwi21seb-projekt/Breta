import Ionicons from "@expo/vector-icons/Ionicons"
import { TouchableOpacity } from "react-native"
import { COLORS } from "../theme"

interface CommentIconProps {
    onPress: () => void;
}

const CommentIcon: React.FC<CommentIconProps> = ({ onPress }) => {

    return (
        <TouchableOpacity onPress={onPress}>
                        <Ionicons
                          name="chatbox-ellipses-outline"
                          size={18}
                          color={COLORS.black}
                          className="mr-1"
                        />
        </TouchableOpacity> 
        )
}

export default CommentIcon;
