import { DataSnapshot, child, off, onChildAdded, onChildRemoved, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import {FaRegSmileBeam} from 'react-icons/fa';
import { db } from '../../../firebase';
import {useSelector,useDispatch} from 'react-redux'
import { SetCurrentChatRoom, setPrivateChatRoom } from '../../../store/chatRoomSlice';

const Favorite = () => {
  const [favoriteChatRooms, setFavoriteChatRooms] = useState([]);
  const [activeChatRoomId, setActiveChatRoomId] = useState("");
  const usersRef = ref(db,'users');
  const {currentUser} = useSelector(state=>state.user);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(currentUser?.uid){
      addListener(currentUser.uid);
    }
    return() =>{
      removeListener(currentUser.uid);
    }
  },[currentUser?.uid])

  const removeListener = (userId)=>{
    off(child(usersRef,`${userId}/favorite`))
  }

  const addListener = (userId) =>{
    let favoriteArray = [];
    onChildAdded(child(usersRef,`${userId}/favorite`),DataSnapshot =>{
      favoriteArray.push({id:DataSnapshot.key,...DataSnapshot.val()});

      const newFavoriteChatRooms = [...favoriteArray];
      setFavoriteChatRooms(newFavoriteChatRooms);

    })

    onChildRemoved(child(usersRef,`${userId}/favorite`),DataSnapshot =>{
      const filteredChatRooms = favoriteArray.filter(chatRoom => {
        return chatRoom.id !== DataSnapshot.key;
      })

      favoriteArray = filteredChatRooms; // 불변성을 지키지 않게 넣어줌
      setFavoriteChatRooms(filteredChatRooms);//불변성을 지켜서 넣어줌
    })
  }
  const changeChatRoom = (room)=>{
    dispatch(SetCurrentChatRoom(room));
    dispatch(setPrivateChatRoom(false));
    setActiveChatRoomId(room.id);


  }

  const renderFavoriteChatRooms = (favoriteChatRooms) =>
    favoriteChatRooms.length > 0 &&
    favoriteChatRooms.map((chatRoom)=>(
      <li 
      key={chatRoom.id}
      onClick={()=>changeChatRoom(chatRoom)}
      style={{
        backgroundColor:chatRoom.id === activeChatRoomId ? '#ffffff45' : ''
      }}
      >
        #{chatRoom.name}
      </li>
    ))


  return (
    <div>
      <span style={{display:'flex', alignItems:'center'}}>
        <FaRegSmileBeam style={{marginRight:3}}/>
        FAVORITE
      </span>
      <ul style={{listStyle:'none',padding:0}}>
        {renderFavoriteChatRooms(favoriteChatRooms)}
      </ul>
    </div>
  )
}

export default Favorite
