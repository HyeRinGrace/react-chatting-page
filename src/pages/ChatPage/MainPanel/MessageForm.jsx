import React, { useState,useRef } from 'react'
import { child, push, ref as dbRef, set, serverTimestamp, remove } from 'firebase/database';
import {useSelector} from 'react-redux'; 
import { db, storage } from '../../../firebase';
import { getDownloadURL, ref as strRef, uploadBytesResumable} from 'firebase/storage';
import {ProgressBar} from 'react-bootstrap'

const MessageForm = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors,setErrors] = useState([]);
  const [percentage,setPercentage] = useState(0);
  const inputOpenImageRef = useRef(null);

  const messagesRef = dbRef(db,'messages');

  const {currentChatRoom} = useSelector(state=>state.chatRoom);
  const {currentUser} = useSelector(state=>state.user);
  const {isPrivateChatRoom} = useSelector(state => state.chatRoom);

  const handleSubmit = async(e) =>{
    e.preventDefault();

    if(!content){
      setErrors(prev => prev.concat("Type contents first"));
      return;
    }
    setLoading(true);

    //firebase에 메세지 저장
    try {
      await set(push(child(messagesRef, currentChatRoom.id)),createMessage());
      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (error) {
      console.error('메세지 전송 오류',error);
      setErrors(prev=>prev.concat(error.message));
      setLoading(false);
      setTimeout(()=>{
        setErrors([]);
      },5000);
    }
  }
  //메세지 객체
  const createMessage = (fileURL = null) =>{
    const message = {
      timestamp : serverTimestamp(),
      user:{
        id: currentUser.uid,
        name:currentUser.displayName,
        image:currentUser.photoURL
      }
    }
    if(fileURL != null){
      message["image"] = fileURL;
    }else{
      message["content"] = content;
    }
    return message;
  }

  const handleOpenImageRef = ()=>{
    inputOpenImageRef.current.click();
  }

const getPath = () =>{
  if(isPrivateChatRoom){
    return `/message/private/${currentChatRoom.id}`;
  }else{
    return `/message/public`;
  }
}

  //이미지 올리기
const handleUploadImage = (event)=>{
  const file = event.target.files[0];


  // Create the file metadata
  /** @type {any} */
  const metadata = {
    contentType: file.type
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = strRef(storage, `${getPath()}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      setPercentage(Math.round(progress));
      
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
      // ...
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, 
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        //db 저장
        set(push(child(messagesRef,currentChatRoom.id)),createMessage(downloadURL));
        setLoading(false);
    });
  }
);
  }


  //텍스트 정보 데이터 베이스에 정보 넣기
  const handleChange = (event) =>{
    setContent(event.target.value);

    if(event.target.value){
      set(dbRef(db,`typing/${currentChatRoom.id}/${currentUser.uid}`),{
        userUid : currentUser.displayName
      })
    }else{
      remove(dbRef(db,`typing/${currentChatRoom.id}/${currentUser.uid}`));
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea style={{
          width:'100%',
          height:70,
          border:'0.2rem solid #ececec',
          borderRadius:4,
        }}
        value={content}
        onChange={handleChange}/>

        {
          !(percentage === 0 || percentage === 100) &&
          <ProgressBar variant='warning' label = {`${percentage}%`} now={percentage} />
        }

        <div>
          {errors.map((errorMsg,i) => <p style={{color:'red'}} key={i}>{errorMsg}</p>)}
        </div>
        <div style={{display:'flex', gap:16}}>
          <div style={{flexGrow:1}}>
            <button className='message-form-button'
              type='submit'
              style={{
              width:'100%',
              fontSize:20,
              fontWeight:'bold',
              backgroundColor:'#f0b023'
            }}
            disabled={loading}
            >
              보내기
            </button>
          </div>
          <div style={{flexGrow:1}}>
            <button  className='message-form-button'
              type='button'
              onClick={handleOpenImageRef}
              style={{
              width:'100%',
              fontSize:20,
              fontWeight:'bold',
              backgroundColor:'#f0b023'
            }}
            disabled={loading}
            >
              이미지
            </button>
          </div>
        </div>
      </form>

      <input type='file' accept='image/jpeg, image/png'style={{display:'none'}} ref={inputOpenImageRef} onChange={handleUploadImage}></input>
    </div>
  )
}

export default MessageForm
