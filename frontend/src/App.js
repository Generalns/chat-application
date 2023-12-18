import logo from './logo.svg';
import './App.css';
import ChatComponent from './components/ChatComponent';
import AuthComponent from './components/AuthComponent';
import { useEffect, useState } from 'react';

function App() {
  const [currentUser,setCurrentUser] = useState("");
  useEffect(()=>{
    console.log(currentUser);
  },[currentUser])
  console.log(currentUser);
  return (
    <div className="App">
      {currentUser===""?
      <AuthComponent setCurrentUser={setCurrentUser}/> :
      <ChatComponent currentUser={currentUser}/>
      }
    </div>
  );
}

export default App;
