import React,{useRef} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Image,Dropdown } from 'react-bootstrap'; // Image 컴포넌트를 import 해야 함
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import app, { storage } from '../../../firebase';
import { uploadBytesResumable, getDownloadURL, ref as strRef } from "firebase/storage";
import { update,ref as dbRef} from 'firebase/database';
import { setPhotoUrl } from '../../../store/userSlice';


const UserPanel = () => {
  const { currentUser } = useSelector(state => state.user);
  const auth = getAuth(app);
  const inputOpenImageRef = useRef(null);
  const dispatch = useDispatch();

  //로그아웃 함수
  const handleLogout = () =>{
    signOut(auth).then(()=>{

    })
    .catch((err)=>{
      console.error(err);
    })
  }

  const handleOpenImage = () =>{
    inputOpenImageRef.current.click();
  }

  const handleUploadImage =(event) => {

    const file = event.target.files[0];
    const user = auth.currentUser;


// Create the file metadata
/** @type {any} */
const metadata = {
  contentType: file.type
};

// Upload file and metadata to the object 'images/mountains.jpg'
const storageRef = strRef(storage, 'user_image/' + user.uid);
const uploadTask = uploadBytesResumable(storageRef, file, metadata);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
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

      //프로필 이미지 수정
      updateProfile(user,{
        photoURL:downloadURL
      })

      //리덕스 이미지 수정
      dispatch(setPhotoUrl(downloadURL));
      //데이터베이스 유저 이미지 수정
      update(dbRef(db,`users/${user.uid}`),{image:downloadURL});

    });
  }
);
  }


  return (
    <div>
      <h3 style={{ color: 'white' }}>
        Chat App
      </h3>
      <div style={{display:'flex', marginBottom:'1rem'}}>
        <Image src={currentUser.photoURL} roundedCircle style={{ width: 30, height: 30, marginTop: 3 }} />
        <Dropdown>
          <Dropdown.Toggle style={{
            backgroundColor:'transparent',border:0
          }}>
            {currentUser.displayName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleOpenImage}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>
              로그아웃
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <input onChange = {handleUploadImage}type='file' ref={inputOpenImageRef} style={{display:'none'}} accept='image/jpeg, image/png'/>
    </div>
  );
};

export default UserPanel;
