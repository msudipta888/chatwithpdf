import React from 'react'
import FileUpload from './components/FileUpload'
const Home = () => {
  return (
    <div className='flex min-h-screen w-screen'>
      <div className='w-[45vw] min-h-screen justify-center items-center p-4'>
        < FileUpload/>
      </div>
      <div className='w-[55vw] min-h-screen border-l-2 p-4'></div>
    </div>
  )
}

export default Home
