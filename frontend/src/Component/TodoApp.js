import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

const TodoApp = () => {
  const [todolist, setTodolist] = useState([]);
  const [filterNotes, setFilterNotes] = useState('');
  const [filteredResultsCount, setFilteredResultsCount] = useState(0);
  const [noResults, setNoResults] = useState(false);
  const { enqueueSnackbar} = useSnackbar();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = Cookies.get('jwt'); 
      const response = await axios.get('http://localhost:8081/', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setTodolist(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token =Cookies.get('jwt');
      await axios.delete(`http://localhost:8081/todolist/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
          await fetchData();
          enqueueSnackbar('Todo Deleted ',{variant: 'success' });

    } catch (err) {
      enqueueSnackbar('Error ',{variant: 'error' });
      console.log(err);
    }
  };

  const applyFilter = (clickedHashtag) => {
    const filteredData = todolist.filter((data) => {
      const noteText = data.notes.toLowerCase();
      const filterText = filterNotes.toLowerCase();
  
      if (typeof clickedHashtag === 'string') {
        const hashtagToFilter = `#${clickedHashtag.toLowerCase()}`;
        return noteText.includes(hashtagToFilter);
      } else {
        const hashtags = filterText.match(/#\w+/g);
  
        if (hashtags && hashtags.length > 0) {
          return hashtags.every(tag => noteText.includes(tag));
        } else {
          return noteText.includes(filterText);
        }
      }
    });
  
    setFilteredResultsCount(filteredData.length);
    setTodolist(filteredData);
    setNoResults(filteredData.length === 0);
  };
  
  const resetFilter = () => {
    fetchData();
    setFilterNotes('');
    setFilteredResultsCount(0);
    setNoResults(false);
  };

   
  const formatDate = (dateTime, isDueDate = false) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);

    if (isDueDate) {
      const day = date.getDate();
      const month = date.getMonth() + 1; 
      const year = date.getFullYear();

      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }

    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = String(date.getFullYear()).slice(-2);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0'); 
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = todolist.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleLogout = () => {
    Cookies.remove('jwt');
    window.location.href = '/'; 
  };



  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded'>
      <div className='d-flex justify-content-end'>
          <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
        </div>
        <Link to="/create" className='btn btn-success'>Add +</Link>
        <div className='mb-3'>
          <label htmlFor='filterNotes' className='form-label'>Filter by Notes:</label>
          <input
            type='text'
            className='form-control'
            id='filterNotes'
            placeholder='Enter notes to filter'
            value={filterNotes}
            onChange={(e) => setFilterNotes(e.target.value)}
          />
          <button className='btn btn-primary ' onClick={applyFilter}>Apply Filter</button>
          <button className='btn btn-secondary' onClick={resetFilter}>Reset</button>
          {filteredResultsCount > 0 && (
            <span className="mx-2">
              {filteredResultsCount} {filteredResultsCount === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>
        {noResults && (
          <div className='alert alert-warning' role='alert'>
            No results found for the given filter.
          </div>
        )}
        <table className='table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Notes</th>
              <th>Remainder</th>
              <th>Action</th>              
            </tr>
          </thead>
          <tbody>
            {
             currentItems.map((data) => (
                <tr key={data.id}>
                  <td>{data.title}</td>
                  <td>{data.description}</td>
                  <td>{formatDate(data.duedate, true)}</td>
                  <td>
                      {data.notes.split(' ').map((word, index) => {
                        if (word.startsWith('#')) {
                          return (
                            <span
                              key={index}
                              onClick={() => applyFilter(word.substring(1))}
                              style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              {word}{' '}
                            </span>
                          );
                        }
                        return `${word} `;
                      })}
                  </td>                                
                  <td>{formatDate(data.remainder)}</td>
                  <td>
                    <Link to={`update/${data.id}`} className='btn btn-primary'>Update</Link>
                    <button className='btn btn-danger' onClick={() => handleDelete(data.id)}>Delete</button>
                  </td>
                </tr>
              ))
            }
          </tbody>                
          <tfoot>
            <tr>
              <td colSpan="6">
                <div className="d-flex justify-content-center my-3">
                  {currentPage > 1 && (
                    <button className="btn btn-secondary me-2" onClick={() => paginate(currentPage - 1)}>
                      &laquo; Previous
                    </button>
                  )}
                  {currentPage < Math.ceil(todolist.length / itemsPerPage) && (
                    <button className="btn btn-secondary" onClick={() => paginate(currentPage + 1)}>
                      Next &raquo; 
                    </button>
                  )}
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TodoApp;
