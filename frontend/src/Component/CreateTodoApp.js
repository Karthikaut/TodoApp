import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

const CreateTodoApp = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [remainder, setRemainder] = useState(null);
  const { enqueueSnackbar} = useSnackbar();

  const navigate = useNavigate();
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const token = Cookies.get('jwt');
    axios.post('http://localhost:8081/create', { title, description, dueDate , notes, remainder }, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      .then(res => {
        enqueueSnackbar('Todo created ',{variant: 'success' });
        console.log(res);       
        navigate('/home');
      })
      .catch(err => {
        enqueueSnackbar('Error',{variant: 'error'});
        console.log(err);
      } );
  };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleSubmit}>
          <h2>Add Todo</h2>
          <div className='mb-2'>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              placeholder='Enter Title'
              className='form-control'
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='description'>Description</label>
            <input
              type='text'
              placeholder='Enter Description'
              className='form-control'
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='duedate'>Due Date : </label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              dateFormat="dd/MM/yyyy"
              className='form-control'
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='notes'>Notes</label>
            <textarea
              placeholder='Enter Notes'
              className='form-control'
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <div className = 'mb-2'>
            <label htmlFor='remainder'>Remainder : </label>
            <DatePicker
              selected={remainder}
              onChange={(dateTime) => setRemainder(dateTime) }
              showTimeSelect
              dateFormat="dd/MM/yyyy h:mm aa"
              className='form-control'
            />
          </div>
          <button className='btn btn-success'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTodoApp;
