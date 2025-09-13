import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw
} from 'lucide-react'
import { useMedia } from '../hooks/useMedia'

const MediaPlayer = ({ file, onClose }) => {
  const { getDownloadLink } = useMedia()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const playerRef = useRef(null)

  const isVideo = file.type.startsWith('video/')
  const isAudio = file.type.startsWith('audio/')
  const isImage = file.type.startsWith('image/')

  useEffect(() => {
    const loadDownloadUrl = async () => {
      try {
        const result = await getDownloadLink(file.google_drive_id)
        if (result.success) {
          setDownloadUrl(result.downloadUrl)
        }
      } catch (error) {
        console.error('Erro ao carregar URL de download:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDownloadUrl()
  }, [file])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === ' ') {
        e.preventDefault()
        togglePlay()
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  const togglePlay = () => {
    if (isVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    } else if (isAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.muted = !isMuted
    } else if (isAudio && audioRef.current) {
      audioRef.current.muted = !isMuted
    }
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    
    if (isVideo && videoRef.current) {
      videoRef.current.volume = newVolume
    } else if (isAudio && audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleTimeUpdate = () => {
    const current = isVideo ? videoRef.current?.currentTime : audioRef.current?.currentTime
    const total = isVideo ? videoRef.current?.duration : audioRef.current?.duration
    
    if (current !== undefined) setCurrentTime(current)
    if (total !== undefined) setDuration(total)
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    
    if (isVideo && videoRef.current) {
      videoRef.current.currentTime = newTime
    } else if (isAudio && audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = file.name
      link.click()
    }
  }

  if (loading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        >
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          ref={playerRef}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="media-player relative max-w-4xl w-full max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Media Content */}
          <div className="relative">
            {isImage && downloadUrl && (
              <img
                src={downloadUrl}
                alt={file.name}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            )}

            {isVideo && downloadUrl && (
              <video
                ref={videoRef}
                src={downloadUrl}
                className="w-full h-auto max-h-[70vh]"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls={false}
              />
            )}

            {isAudio && downloadUrl && (
              <div className="flex items-center justify-center h-64 bg-gray-900">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{file.name}</h3>
                  <p className="text-gray-400">Arquivo de áudio</p>
                </div>
                <audio
                  ref={audioRef}
                  src={downloadUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>
            )}

            {/* Controls Overlay */}
            {(isVideo || isAudio) && (
              <div className="media-player-controls absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div
                  className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-4"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all duration-200"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlay}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleMute}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20"
                      />
                    </div>

                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDownload}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                      title="Tela cheia"
                    >
                      {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Image Controls */}
            {isImage && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  onClick={handleDownload}
                  className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
                  title="Tela cheia"
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MediaPlayer
