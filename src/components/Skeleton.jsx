import React from 'react'
import Spinner from 'react-bootstrap/Spinner';

const Skeleton = () => {
  return (
    <Spinner animation="border" role="status" style={{display:'flex', justifyContent:'center'}}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )
}

export default Skeleton
