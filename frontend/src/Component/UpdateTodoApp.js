import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie'; 

const UpdateTodoApp = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [remainder, setRemainder] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar} = useSnackbar();


  const parseDateString = (dateString) => {
    return dateString ? new Date(dateString) : null;
  };

  useEffect(() => {
    const fetchTodoData = async () => {
      try {
        const token = Cookies.get('jwt');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`http://localhost:8081/${id}`, config);
        const { title, description, duedate, notes, remainder } = response.data.todo;
        setTitle(title);
        setDescription(description);             
        setDueDate(parseDateString(duedate));
        setNotes(notes);
        setRemainder(parseDateString(remainder));
      } catch (err) {
        console.log(err);
      }
    };

    fetchTodoData();
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = Cookies.get('jwt'); 
    axios.put(`http://localhost:8081/update/${id}`, { title, description, dueDate, notes, remainder },{
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  )
      .then(res => {
        enqueueSnackbar('Todo Updated ',{variant: 'success' });
        console.log(res);
        navigate('/home');
      })
      .catch(err => {
        enqueueSnackbar('Error',{variant: 'error'});
        console.log(err);
      });
  };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleSubmit}>
          <h2>Update Todo</h2>
          <div className='mb-2'>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              placeholder='Enter Title'
              className='form-control'
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='description'>Description</label>
            <input
              type='text'
              placeholder='Enter Description'
              className='form-control'
              value={description}
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
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='remainder'>Remainder : </label>
            <DatePicker
              selected={remainder}
              onChange={(dateTime) => setRemainder(dateTime)}
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

export default UpdateTodoApp;
