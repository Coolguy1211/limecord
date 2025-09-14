import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import { MessageCircle, Bell, Settings, LogOut, Plus, Smile } from 'lucide-react'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface User {
  id: string
  username: string
  email: string
}

interface Channel {
  id: string
  name: string
  description: string
}

interface Message {
  id: string
  content: string
  username: string
  avatar?: string
  created_at: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
}

const Home: NextPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<string>('general')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' })
  const [isRegistering, setIsRegistering] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUserProfile()
      fetchChannels()
      fetchNotifications()
      setIsLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    if (selectedChannel && isLoggedIn) {
      fetchMessages(selectedChannel)
    }
  }, [selectedChannel, isLoggedIn])

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/profile')
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      logout()
    }
  }

  const fetchChannels = async () => {
    try {
      const response = await axios.get('/api/channels')
      setChannels(response.data)
    } catch (error) {
      console.error('Error fetching channels:', error)
    }
  }

  const fetchMessages = async (channelId: string) => {
    try {
      const response = await axios.get(`/api/channels/${channelId}/messages`)
      setMessages(response.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications')
      setNotifications(response.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const response = await axios.post(`/api/channels/${selectedChannel}/messages`, {
        content: newMessage
      })
      setMessages(prev => [...prev, response.data])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/login', loginData)
      const { token, user } = response.data
      
      Cookies.set('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(user)
      setIsLoggedIn(true)
      setShowLogin(false)
      setLoginData({ username: '', password: '' })
      
      fetchChannels()
      fetchNotifications()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Login failed')
    }
  }

  const register = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/register', registerData)
      const { token, user } = response.data
      
      Cookies.set('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(user)
      setIsLoggedIn(true)
      setShowLogin(false)
      setRegisterData({ username: '', email: '', password: '' })
      
      fetchChannels()
      fetchNotifications()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Registration failed')
    }
  }

  const logout = () => {
    Cookies.remove('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setIsLoggedIn(false)
    setChannels([])
    setMessages([])
    setNotifications([])
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-5xl font-bold text-lime mb-8 text-center">Limecord</h1>
          
          {!isRegistering ? (
            <form onSubmit={login} className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-lime hover:bg-lime-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                Login
              </button>
              <p className="text-center text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="font-bold text-lime hover:text-lime-400"
                >
                  Register
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={register} className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-lime hover:bg-lime-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                Register
              </button>
              <p className="text-center text-gray-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="font-bold text-lime hover:text-lime-400"
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
        {/* Server Info */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lime font-extrabold text-xl">Limecord</h2>
        </div>

        {/* Channels */}
        <div className="flex-1 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm font-semibold uppercase">Channels</h3>
            <Plus className="w-4 h-4 text-gray-400 cursor-pointer hover:text-lime" />
          </div>
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center transition duration-200 ${
                  selectedChannel === channel.id
                    ? 'bg-lime text-gray-900 font-bold'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-lime'
                }`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                #{channel.name}
              </button>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-lime rounded-full flex items-center justify-center">
                <span className="text-gray-900 text-sm font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-gray-300 text-sm font-medium">{user?.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Bell 
                className="w-5 h-5 text-gray-400 cursor-pointer hover:text-lime"
                onClick={() => setShowNotifications(!showNotifications)}
              />
              <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-lime" />
              <LogOut 
                className="w-5 h-5 text-gray-400 cursor-pointer hover:text-lime"
                onClick={logout}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Channel Header */}
        <div className="h-16 bg-gray-800 border-b-2 border-gray-700 flex items-center px-6 shadow-md">
          <MessageCircle className="w-5 h-5 text-gray-400 mr-2" />
          <h1 className="text-gray-300 font-semibold">
            #{channels.find(c => c.id === selectedChannel)?.name}
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start">
              <div className="w-10 h-10 bg-lime rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-gray-900 text-sm font-bold">
                  {message.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="text-lime font-bold">{message.username}</span>
                  <span className="text-gray-400 text-xs">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-300">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-gray-800 border-t-2 border-gray-700 relative">
          {showEmojiPicker && (
            <div className="absolute bottom-20">
              <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
            </div>
          )}
          <form onSubmit={sendMessage} className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message #${channels.find(c => c.id === selectedChannel)?.name}`}
              className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-lime"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 bg-gray-700 hover:bg-gray-600"
            >
              <Smile className="text-gray-400 hover:text-lime" />
            </button>
            <button
              type="submit"
              className="bg-lime hover:bg-lime-600 text-gray-900 font-bold px-6 py-2 rounded-r-lg transition duration-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="w-80 bg-gray-800 border-l-2 border-gray-700 flex flex-col">
          <div className="p-4 border-b-2 border-gray-700">
            <h3 className="text-gray-300 font-semibold">Notifications</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-center">No new notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg cursor-pointer border transition-colors duration-200 ${
                    notification.read
                      ? 'bg-gray-700 border-transparent'
                      : 'bg-lime-900 border-lime hover:bg-lime-800'
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <h4 className={`font-medium ${notification.read ? 'text-gray-300' : 'text-lime'}`}>{notification.title}</h4>
                  <p className="text-gray-300 text-sm">{notification.message}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
