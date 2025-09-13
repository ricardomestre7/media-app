import { useContext } from 'react'
import { MediaContext } from '../contexts/MediaContext'

export const useMedia = () => {
  const context = useContext(MediaContext)
  
  if (!context) {
    throw new Error('useMedia deve ser usado dentro de um MediaProvider')
  }
  
  return context
}

export default useMedia
