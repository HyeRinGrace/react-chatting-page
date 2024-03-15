import React,{useEffect, useState} from 'react'
import {FaRegSmileWink,FaPlus} from 'react-icons/fa'
import {Modal,Form,Button} from 'react-bootstrap';
import { child, ref as dbRef, onChildAdded, push, update,off } from 'firebase/database';
import { useSelector,useDispatch } from 'react-redux';
import { db } from '../../../firebase';
import { SetCurrentChatRoom, setPrivateChatRoom } from '../../../store/chatRoomSlice';


const ChatRooms = () => {

  const [show,setShow] = useState(false);
  const [name,setName] = useState('');
  const [description,setDescription] = useState('');

  const chatRoomsRef = dbRef(db,"chatRooms");

  const [chatRooms,setChatRooms] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [activeChatRoomId, setActiveChatRoomId] = useState("");

  const {currentUser} = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(()=>{
    addChatRoomsListeners();
    return()=>{
      off(chatRoomsRef);
    }
  },[]);

  //방 생성하는 함수
  const handleSubmit = async() =>{

    //유료성 체크
    if(isFormValid(name,description)){
      const key = push(chatRoomsRef).key;

      const newChatRoom = {
        id:push(chatRoomsRef).key,
        name:name,
        description: description,
        createdBy:{
          name:currentUser.displayName,
          image:currentUser.photoURL
        }
      }

      try {
        await update(child(chatRoomsRef, key), newChatRoom);
        setName('');
        setDescription('');
        setShow(false);
      } catch (error) {
        alert(error);
      }
    }

  }

  const addChatRoomsListeners = () =>{
    let chatRoomsArray = [];

    onChildAdded(chatRoomsRef, DataSnapshot =>{

      chatRoomsArray.push(DataSnapshot.val());
      const newChatRooms = [...chatRoomsArray];
      setChatRooms(newChatRooms);

      setFirstChatRoom(newChatRooms);

    })
  }

  const setFirstChatRoom = (chatRooms) =>{
    const firstChatRoom = chatRooms[0];
    if(firstLoad && chatRooms.length > 0){
      dispatch(SetCurrentChatRoom(firstChatRoom));
      setActiveChatRoomId(firstChatRoom.id);

    }
    setFirstLoad(false);

  }

  const isFormValid = (name,description)=> name && description;

  const changeChatRoom = (room)=>{
    dispatch(SetCurrentChatRoom(room));
    dispatch(setPrivateChatRoom(false));
    setActiveChatRoomId(room.id);


  }

  const renderChatRooms = () =>{
    return chatRooms.length > 0 &&
    chatRooms.map(room =>(
      <li key={room.id}
      onClick={()=>changeChatRoom(room)}
      style={{
        backgroundColor:room.id === activeChatRoomId ? '#ffffff45' : ''
      }}>
        #{room.name}
      </li>
    ))
  }

  return (
    <div>
      <div style={{
        position:'relative',
        width:'100%',
        display:'flex',
        alignItems:'center'
      }}>
        <FaRegSmileWink style={{marginRight:3}}/>
        CHAT ROOMS {""}
        <FaPlus style={{position:'absolute',right:0,cursor:'pointer'}}onClick={()=>setShow(!show)}/>

      </div>
      <ul style={{listStyleType:'none', padding:0}}>
        {renderChatRooms(chatRooms)}
      </ul>

      <Modal show={show} onHide={()=>setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>채팅 방 생성하기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>방 이름</Form.Label>
              <Form.Control
              onChange={(e)=> setName(e.target.value)}
              type = 'text'
              placeholder = '채팅 방 이름을 입력하세요'/>
            </Form.Group>

            <Form.Group>
              <Form.Label>방 설명</Form.Label>
              <Form.Control
              onChange={(e)=> setDescription(e.target.value)}
              type = 'text'
              placeholder = '채팅 방 설명을 입력하세요'/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={()=>setShow(false)}>
            취소
          </Button>
          <Button variant='primary' onClick={handleSubmit}>
            생성
          </Button>
        </Modal.Footer>
      </Modal>



    </div>
  )
}

export default ChatRooms
