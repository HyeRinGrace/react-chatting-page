import React from 'react'
import UserPanel from '../SidePanel/UserPanel';
import Favorite from '../SidePanel/Favorite';
import ChatRooms from '../SidePanel/ChatRooms';
import DirectMessage from '../SidePanel/DirectMessages';

const SidePanel = () => {
  return (
    <div style={{
      backgroundColor:'#F0b023',
      padding: '2rem',
      minHeight:'100vh',
      color:'white',
      minWidth:'275px',
    }}>
      <UserPanel/>
      <Favorite/>
      <ChatRooms/>
      <DirectMessage/>
    </div>
  )
}

export default SidePanel
