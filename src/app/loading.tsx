import { LoaderCircleIcon } from 'lucide-react'
import React from 'react'

const LoadingPage = () => {
  return (
    <div className='flex justify-center items-center h-[100vh] gap-4'>
      <LoaderCircleIcon className='animate-spin text-white h-12 w-12' />
      <p className='text-2xl'>Loading</p>
    </div>
  )
}

export default LoadingPage