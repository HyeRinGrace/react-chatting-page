import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import app from '../../firebase';
import md5 from 'md5';
import { ref, set } from 'firebase/database';
import { db } from '../../firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const RegisterPage = () => {
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);
  const [errorFromSubmit, setErrorFromSubmit] = useState('');
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const createdUser = await createUserWithEmailAndPassword(auth, data.email, data.password);

      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
      });

      const userData = {
        uid: createdUser.user.uid,
        displayName: createdUser.user.displayName,
        photoURL: createdUser.user.photoURL,
      }

      dispatch(setUser(userData));

      set(ref(db, `users/${createdUser.user.uid}`), {
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL
      });
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
    <Container className='auth-container'>
      <Row className='justify-content-center'>
        <Col xs={12} md={6}> {/* Adjusted column size for mobile */}
          <div className='auth-wrapper'>
            <div className='auth-inner'>
              <h2 style={{ paddingBottom: 10 }}>회원가입</h2>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className='mb-3'>
                  <Form.Label>이메일</Form.Label>
                  <Form.Control
                    name='email'
                    type='email'
                    {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                  />
                  {errors.email && <Form.Text className='text-danger'>This email field is required.</Form.Text>}
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>이름</Form.Label>
                  <Form.Control
                    type='text'
                    name='name'
                    {...register('name', { required: true, maxLength: 10 })}
                  />
                  {errors.name && errors.name.type === 'required' && <Form.Text className='text-danger'>This name field is required</Form.Text>}
                  {errors.name && errors.name.type === 'maxLength' && (
                    <Form.Text className='text-danger'>Your input exceeds the maximum length</Form.Text>
                  )}
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type='password'
                    name='password'
                    {...register('password', { required: true, minLength: 6 })}
                  />
                  {errors.password && errors.password.type === 'required' && (
                    <Form.Text className='text-danger'>Your password field is required</Form.Text>
                  )}
                  {errors.password && errors.password.type === 'minLength' && (
                    <Form.Text className='text-danger'>Password must have at least 6 characters</Form.Text>
                  )}
                  {errorFromSubmit && <Alert variant='danger'>{errorFromSubmit}</Alert>}
                </Form.Group>
                <Button type='submit' variant='warning' disabled={loading} className='mb-3'>
                  {loading ? 'Loading...' : '회원가입'}
                </Button>
                <div>
                  이미 계정이 있으신가요? <Link to='/login'>로그인 하러 가기</Link>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
