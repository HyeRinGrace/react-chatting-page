// LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../../firebase';
import { Container, Form, Button } from 'react-bootstrap'; // react-bootstrap 사용

const LoginPage = () => {
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);
  const [errorFromSubmit, setErrorFromSubmit] = useState('');
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 프로그래밍 방식으로 페이지 이동

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      console.error(error);
      setErrorFromSubmit(error.message);
      setTimeout(() => {
        setErrorFromSubmit('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className='d-flex align-items-center justify-content-center'>
      <div className='auth-inner'>
        <h3 style={{paddingBottom:30}}>로그인</h3>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group style={{paddingTop:20}}>
            <Form.Label>이메일</Form.Label>
            <Form.Control
              name='email'
              type='email'
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
              style={{width:500}}
            />
            {errors.email && <Form.Text className='text-danger'>This email field is required.</Form.Text>}
          </Form.Group>
          <Form.Group style={{paddingTop:20 , paddingBottom:30}}>
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type='password'
              name='password'
              {...register('password', { required: true, minLength: 6 })}
            />
            {errors.password && errors.password.type === 'required' && (
              <Form.Text className='text-danger'>Your password field is required.</Form.Text>
            )}
            {errors.password && errors.password.type === 'minLength' && (
              <Form.Text className='text-danger'>Password must have at least 6 characters.</Form.Text>
            )}
            {errorFromSubmit && <Form.Text className='text-danger'>{errorFromSubmit}</Form.Text>}
          </Form.Group>
          <Button type='submit' variant='warning' disabled={loading} className='w-100' style={{width:'50%'}}>
            {loading ? 'Loading...' : '로그인'}
          </Button>
          <div className='text-center mt-2' style={{padding:30}}>
            <Link to='/register'>회원가입</Link>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default LoginPage;
