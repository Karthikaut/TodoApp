import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { enqueueSnackbar} = useSnackbar();
  
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/register', { username , password})
      .then(res => {
        enqueueSnackbar('Registerd successfully ',{variant: 'success' });
        console.log(res);       
        navigate('/');
      })
      .catch(err => {
        enqueueSnackbar('Error',{variant: 'error'});
        console.log(err);
      } );
  };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleRegister}>
          <h2>User Registration</h2>
          <div className='mb-2'>
            <label htmlFor='username'>User Name</label>
            <input
              type='username'
              placeholder='Enter username'
              className='form-control'
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='Password'
              className='form-control'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className='btn btn-primary' type='submit'>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
