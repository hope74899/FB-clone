import './App.css'
import AllPosts from './Components/AllPosts'
import Logout from './Components/LoginComponents/Logout'
import Signin from './Components/LoginComponents/Signin'
import Signup from './Components/LoginComponents/Signup'
import Admin from './Components/Admin/Admin'
import AdminSignupUsers from './Components/Admin/AdminSignupUsers'
import NavBar from './Components/NavBar'
import MyPosts from './Components/MyPosts'
import Errorpage from './Components/Errorpage'


import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Friends from './screen/Friends'
import Messages from './screen/Messages'

function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<AllPosts />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/messages" element={<Messages />} />

          <Route path="*" element={<Errorpage />} />
          <Route path='/admin' element={<Admin />}>
            <Route path="users" element={<AdminSignupUsers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
