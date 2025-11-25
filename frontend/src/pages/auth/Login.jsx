import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import authService from '../../services/AuthService'

const Login = () => {
  const [loginData, setLoginData] = useState({
    login: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login(loginData)
      const userRole = response.data.data.role;
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token)

        switch (userRole) {
          case 'admin':
            navigate('/admin/dashboard')
            break;
          case 'user':
            navigate('/')
            break;
          default:
            break;
        }
     
      } else {
        setError(response.data.msg || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      }
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        setError(error.response.data.msg || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      } else if (error.request) {
        // Network error
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้')
      } else {
        setError('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ')
      }
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-green-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-800">เข้าสู่ระบบ</h1>
          <p className="text-gray-600 mt-2">กรุณากรอกรายละเอียดเพื่อเข้าสู่ระบบ</p>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="label text-green-700 font-medium">อีเมล/ชื่อผู้ใช้</label>
            <input
              type="text"
              name="login"
              placeholder="กรุณากรอกอีเมลหรือชื่อผู้ใช้ของคุณ"
              className="input input-bordered w-full bg-white border-green-200"
              value={loginData.login}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label text-green-700 font-medium">รหัสผ่าน</label>
            <input
              type="password"
              name="password"
              placeholder="กรุณากรอกรหัสผ่านของคุณ"
              className="input input-bordered w-full bg-white border-green-200"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-green" />
              <span className="ml-2 text-gray-600">จดจำฉัน</span>
            </label>
            <Link to="#" className="text-green-600 text-sm hover:underline">ลืมรหัสผ่าน?</Link>
          </div>

          <button
            type="submit"
            className={`btn bg-green-600 text-white hover:bg-green-700 w-full py-3 ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="divider my-6">หรือ</div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="btn btn-outline text-gray-700 border-gray-300 hover:bg-gray-50 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button className="btn btn-outline text-gray-700 border-gray-300 hover:bg-gray-50 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        <div className="text-center text-gray-600">
          ยังไม่มีบัญชี? <Link to="/register" className="text-green-600 hover:underline">ลงทะเบียน</Link>
        </div>
      </div>
    </div>
  )
}

export default Login