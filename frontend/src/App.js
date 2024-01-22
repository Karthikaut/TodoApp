import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TodoApp from './Component/TodoApp';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateTodoApp from './Component/CreateTodoApp';
import UpdateTodoApp from './Component/UpdateTodoApp';
import {SnackbarProvider} from 'notistack';
import Login from './Component/Login';
import Register from './Component/Register';



function App() {
  return (
    <BrowserRouter>
    <SnackbarProvider>      
      <Routes>
        <Route path="/" element={<Login/> } />
        <Route path="/register" element={<Register/> }/>
        <Route path="/home" element={<TodoApp/> }/>
        <Route path="/create" element={<CreateTodoApp/> } />
        <Route path="/home/update/:id" element={<UpdateTodoApp/> } />        
      </Routes>      
    </SnackbarProvider>
    </BrowserRouter>);}

export default App;
