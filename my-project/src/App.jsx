
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import HomePage from './components/HomePage'
import SigninPage from './components/SigninPage'
import SignupPage from './components/SignupPage'
import CardPage from './components/shared/CardPage'
import AdminPage from './components/AdminPage'
import AdminPanelPage from './components/AdminPanelPage'
import { useEffect } from 'react'
import AdminProfile from './components/AdminProfile'
import UserNavbar from './components/shared/UserNavbar'
import UserProfilePage from './components/UserProfilePage'

const Header = () => {


  return <>
    {
      // cookies.token ? <span>Welcome back! <button onClick={handleLogout}>Logout</button></span> : <span>Please sign in. <button onClick={() => navigate('/')}>Login</button></span>
      // <div className="bg-gray-900 text-white flex items-center justify-between px-6 py-4 shadow-md">
      //   <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/home-page')}>Admin Panel</h1>

      //   {cookies.token && admin ? (
      //     <div className="flex items-center space-x-4">
      //       <img
      //         src={`https://ecom-backend-production-66e4.up.railway.app${admin.profileimage.slice(1)}`}
      //         alt="Admin"
      //         className="w-10 h-10 rounded-full object-cover border border-white"
      //       />
      //       <span className="hidden sm:inline">Welcome, {admin.username}</span>
      //       <button
      //         onClick={() => navigate('/panel-page')}
      //         className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
      //       >
      //         Back to Panel
      //       </button>
      //       <button
      //         onClick={handleLogout}
      //         className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
      //       >
      //         Logout
      //       </button>
      //     </div>
      //   ) : (
      //     <button
      //       onClick={() => navigate('/')}
      //       className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
      //     >
      //       Login
      //     </button>
      //   )}
      // </div>
      <UserNavbar />
    }
  </>
}

const Footer = () => {
  return <>
    This is the footer</>
}

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

function App() {


  return (
    <>
      {/* <Route path="/" element={<SigninPage />} /> */}
      <>
        <Routes>
          <Route path="/" element={<SigninPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path='/admin-login' element={<AdminPage />} />
          <Route path='/panel-page' element={<AdminPanelPage />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/user/profile" element={<UserProfilePage />} />
          <Route path='/' element={<Layout />}>
            <Route path="/home-page" element={<HomePage />} />
          </Route>
        </Routes>
      </>
    </>
  )
}

export default App
