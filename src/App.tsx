import './App.css'
import Home from './components/Home'
import Signin from './pages/Signin'
import { useAuth } from './context/AuthContext';
import { Route, Routes } from 'react-router';
import Projects from './pages/Projects';
import HomeSkeleton from './components/skeleton/HomeSkeleton';
import WeeklyReport from './components/Report';

function App() {

  const { user, loading } = useAuth();

  if (loading) {
    return <>
      <HomeSkeleton />
    </>
  }

  return (
    <>
      <Routes>
        <Route path='/' element={user?.name ? <Home /> : <Signin />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/analytics' element={<WeeklyReport />} />
      </Routes>
    </>
  )
}

export default App
