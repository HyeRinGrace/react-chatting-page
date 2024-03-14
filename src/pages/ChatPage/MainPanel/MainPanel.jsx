import React,{useEffect, useState} from 'react'
import MessageForm from './MessageForm'
import MessageHeader from './MessageHeader'
import { child, off, onChildAdded, ref as dbRef } from 'firebase/database'
import { db } from '../../../firebase'
import {useSelector,useDispatch} from 'react-redux';
import Message from './Message'
import { setUserPosts } from '../../../store/chatRoomSlice'

const MainPanel = () => {

  const messagesRef = dbRef(db,"messages");

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [searchTerm,setSearchTerm] = useState('');
  const [searchResults,setSearchResults] = useState([]);
  const [searchLoading,setSearchLoading] = useState(false);


  const {currentChatRoom} = useSelector(state => state.chatRoom);
  const {currentUser} = useSelector(state => state.user);
  const dispatch = useDispatch();


  useEffect(()=>{
    if(currentChatRoom.id){
      addMessagesListener(currentChatRoom.id);
    }
    return ()=>{
      off(messagesRef);
    }
  },[currentChatRoom.id])

  const handleSearchChange = (event) =>{
    setSearchTerm(event.target.value);
    setSearchLoading(true);
    handleSearchMessages(event.target.value);

  }

  const handleSearchMessages = (searchTerm) =>{
    const chatRoomMessages = [...messages];
    const regex = new RegExp(searchTerm,"gi");
    const searchResults = chatRoomMessages.reduce((acc,message) =>{
      if(
        (message.content && message.content.match(regex))|| message.user.name.match(regex)
      ){
        acc.push(message)
      }
      return acc;
    },[])
    setSearchResults(searchResults);
    setSearchLoading(false);
  }


  const addMessagesListener = (chatRoomId) =>{
    let messagesArray = [];
    setMessages([]); //빈배열로 채팅방 이동 시, 빈배열로 리턴

    onChildAdded(child(messagesRef, chatRoomId),DataSnapshot=>{
      messagesArray.push(DataSnapshot.val());
      const newMessageArray = [...messagesArray];

      setMessages(newMessageArray);
      setMessagesLoading(false);
      userPostCount(newMessageArray);
    })

  }

  const userPostCount = (messages) =>{
   const userPosts =  messages.reduce((acc,message)=>{
      if(message.user.name in acc){
        acc[message.user.name].count +=1;
      }else{
        acc[message.user.name]={
          image:message.user.image,
          count:1
        }
      }
      return acc;
    },{})
    dispatch(setUserPosts(userPosts))
  }

  const renderMessages = (messages) =>{
    return messages.length > 0 && messages.map((message)=>{
      return(<Message 
      key={message.timestamp}
      message = {message}
      user = {currentUser}
      />
    )})
  }
  
  return (
    <div style={{padding:'2rem 2rem 0 2rem'}}>
      <MessageHeader handleSearchChange = {handleSearchChange}/>

      <div style={{
        width:'100%',
        height:450,
        border:'0.2rem solid #ececec',
        borderRadius:'4px',
        padding:'1rem',
        marginBottom:'1rem',
        overflow:'auto',
      }}>
       {searchLoading && <div>Loading...</div>}
       {searchTerm? renderMessages(searchResults) : renderMessages(messages)}

      </div>

      <MessageForm/>
      
    </div>
  )
}

export default MainPanel
