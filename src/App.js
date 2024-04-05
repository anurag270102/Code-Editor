import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import { Toaster } from 'react-hot-toast';
import Output from './components/Output/Output';
function App() {
  return (
    [
      <div>
        <Toaster position='top-right' 
        toastOptions={{
          success:{
            theme:{
              primary:"#03FA6E",
            }
          }
        }}>
        </Toaster>
      </div>,
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/editor/:roomId' element={<EditorPage></EditorPage>}></Route>
          <Route path='editor/:roomId/run' element={<Output></Output>}></Route>
        </Routes>
      </BrowserRouter>
    ]
  );
}

export default App;
