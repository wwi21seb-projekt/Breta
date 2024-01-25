import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image } from "native-base";
import { StyleSheet, TouchableOpacity, Modal } from "react-native";
import { TextInput } from "react-native";
import { Button } from "react-native";
import { Dimensions } from "react-native";
import { ScrollView } from "react-native";
import { Animated } from "react-native";

const windowHeight = Dimensions.get("window").height;

interface Comment {
  id: string;
  text: string;
  username: string;
  profilePic: string;
  date: string; // Fügen Sie diese Zeile hinzu, wenn sie noch nicht existiert
}

interface Props {
  username: string;
  profilePic: string;
  date: string;
  initialLikes?: number;
  postContent: any;
  style?: React.CSSProperties;
}

const TextPostCard: React.FC<Props> = (props) => {
  const { username, postContent, profilePic, date, initialLikes = 149999, style } = props;
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false); // Zustand für das Kommentar-Popup
  const [commentText, setCommentText] = useState(""); // Zustand für den Kommentar-Text
  const [comments, setComments] = useState([]); // Hält die Liste der Kommentare
  const [modalY, setModalY] = useState(new Animated.Value(windowHeight));


 
  const addComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now().toString(), // Einfache ID-Erzeugung basierend auf der aktuellen Zeit
        text: commentText,
        username: username,
        profilePic: profilePic,
      };
      setComments([...comments, newComment]);
      setCommentText(""); // Kommentartext zurücksetzen
    }
  };

  // Funktion zum Formatieren der Likes
  const formatLikes = (count: number): string => {
    const roundToTenths = (num: number) => Math.floor(num * 10) / 10;
  
    if (count >= 1000000) {
      return roundToTenths(count / 1000000) + ' M';
    }
    if (count >= 1000) {
      return roundToTenths(count / 1000) + ' T';
    }
    return count.toString();
};

  // Funktion zum Handhaben des Like-Button-Drucks
  const handleLikePress = () => {
    const newLikes = isLiked ? Math.max(likes - 1, 0) : likes + 1;
    setLikes(newLikes);
    setIsLiked(!isLiked);
  };

  const openCommentModal = () => {
    // Funktion zum Öffnen des Kommentar-Pop-ups
    setCommentModalVisible(true);
  };

  const closeCommentModal = () => {
    // Funktion zum Schließen des Kommentar-Pop-ups
    setCommentModalVisible(false);
  };

  const handleCommentSubmit = () => {
    // Funktion zum Verarbeiten des eingereichten Kommentars
    // Hier können Sie den KommentarText verwenden
    // ...
    setCommentText(""); // Leeren Sie das Kommentarfeld nach dem Absenden
    closeCommentModal(); // Schließen Sie das Kommentar-Popup
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerCard}>
        <View style={styles.header}>
          <Image source={{ uri: props.profilePic }} style={styles.profilePic} />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{props.username}</Text>
            <Text style={styles.date}>{props.date}</Text>
          </View>
          <TouchableOpacity onPress={openCommentModal}>
          <Ionicons name="chatbox-ellipses-outline" size={24} style={{ marginRight: 5 }} />
        </TouchableOpacity>
          <TouchableOpacity style={styles.likes} onPress={handleLikePress}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color={isLiked ? "aqua" : "black"} />
            <Text style={styles.likesText}>{formatLikes(likes)}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bodyCard}>
        <Text style={styles.postContent}>{props.postContent}</Text>
      </View>
      <Modal animationType='slide' transparent={true} visible={isCommentModalVisible} onRequestClose={() => setCommentModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.commentModal}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentTitle}>Kommentare</Text>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)} style={styles.closeButton}>
                <Ionicons name='close' size={24} color='black' />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.commentList}>
              {comments.length === 0 ? (
                <Text style={styles.noCommentsText}>Es sind noch keine Kommentare da!</Text>
              ) : (
                comments.map((comment) => (
                  <View key={comment.id} style={styles.comment}>
                    <Image source={{ uri: comment.profilePic }} style={styles.commentProfilePic} />
                    <View style={styles.commentInfo}>
                      <View style={styles.commentText}>
                        <Text style={styles.commentUsername}>{comment.username}</Text>
                        <Text>{comment.text}</Text>
                      </View>
                      <Text style={styles.commentDate}>{comment.date}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder='Schreiben Sie einen Kommentar...'
                onChangeText={setCommentText}
                value={commentText}
                multiline
              />
              <TouchableOpacity style={styles.postButton} onPress={addComment}>
                <Text style={styles.postButtonText}>Posten</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, // Erhöhen Sie die Opazität
    shadowRadius: 10, // Vergrößern Sie den Radius
    elevation: 12, // Erhöhen Sie die Elevation für Android
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: 'grey',
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    marginLeft: 4,
  },
  MainCard: {
    backgroundColor: 'lightgreen',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  contentContainer: {
    
    
    // Anpassungen für den Inhaltsteil
  },
  postText: {
    fontSize: 16,
    color: 'black',
    // Weitere Formatierungen für den Post-Text
  },
  mainContainer: {
    alignItems: 'center', // Zentriert die Karten horizontal
    margin: 10,
  },
  headerCard: {
    width: '100%', // Header ist voller Breite
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Gibt dem Header einen Schatten auf Android
    zIndex: 1, // Stellt sicher, dass der Header über dem Body liegt
  },
 
  bodyCard: {
    width: '98%', // Body ist etwas schmaler
    backgroundColor: '#D0E6D2',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: -20, // Negativer Margin, um den Body näher an den Header zu schieben
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0, // Kein Schatten auf dem Body für Android
  },
  postContent: {
    fontSize: 16,
    marginTop: 15,
    color: 'black',
    // ... Post Content Styles ...
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  commentModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: windowHeight * 0.7,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  closeButton: {
    // Stile für den Schließen-Button
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentList: {
    paddingHorizontal: 20,
  },
  noCommentsText: {
    marginTop: 20,
    textAlign: 'center',
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Statt 'center' verwenden wir 'flex-start'
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    paddingRight: 20, // Rechter Rand für Abstand
  },
  commentProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentInfo: {
    flex: 1,
    flexDirection: 'row', // Flex-Richtung für horizontale Anordnung
    justifyContent: 'space-between', // Verteilt den Raum gleichmäßig
  },
  commentText: {
    flex: 1, // Nimmt den verfügbaren Raum ein
    // Weitere Styles für den Kommentartext
  },
  commentDate: {
    // Styles für das Datum
    color: 'grey',
    fontSize: 12,
  },
  commentUsername: {
    fontWeight: 'bold',
    marginBottom: 4
  },


  commentInputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    position: 'relative', // Für die absolute Positionierung des Buttons
  },
  commentInput: {
    flex: 1,
    marginLeft: 10,
    paddingRight: 60, // Platz für den Button im Eingabefeld
    paddingLeft: 20,
    paddingTop: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    backgroundColor: '#f2f2f2',
  },
  postButton: {
    position: 'absolute', // Absolute Positionierung
    right: 15, // Positionierung von der rechten Seite des Containers
    top: 10, // Zentrierung im Eingabefeld
    
    borderRadius: 15,
    padding: 10,
  },
  postButtonText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default TextPostCard;
