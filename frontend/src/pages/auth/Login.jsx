import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import authService from '../../services/AuthService'

const Login = () => {
  const [loginData, setLoginData] = useState({
    login: '',
    password: '',
    rememberMe: false
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  // Validate input fields
  const validateForm = () => {
    const newErrors = {}

    // Validate login field (email or username)
    if (!loginData.login.trim()) {
      newErrors.login = 'กรุณากรอกอีเมลหรือชื่อผู้ใช้'
    } else if (loginData.login.includes('@')) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(loginData.login)) {
        newErrors.login = 'รูปแบบอีเมลไม่ถูกต้อง'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Show loading alert
      Swal.fire({
        title: 'กำลังเข้าสู่ระบบ...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading()
        }
      })

      const response = await authService.login(loginData)
      const userRole = response.data.data.role;
      if (response.data.success) {
        // Store token in localStorage or sessionStorage based on "remember me" option
        if (loginData.rememberMe) {
          localStorage.setItem('token', response.data.data.token)
        } else {
          sessionStorage.setItem('token', response.data.data.token)
        }

        // Store user info
        localStorage.setItem('userRole', userRole)
        localStorage.setItem('username', response.data.data.username)

        // Close loading alert and show success message
        Swal.close()

        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ!',
          text: 'ยินดีต้อนรับกลับเข้าสู่ระบบ',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#10B981'
        })

        switch (userRole) {
          case 'admin':
            navigate('/admin/dashboard')
            break;
          case 'user':
            navigate('/')
            break;
          default:
            navigate('/')
            break;
        }

      } else {
        // Close loading alert and show error
        Swal.close()
        Swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบล้มเหลว',
          text: response.data.msg || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
          confirmButtonText: 'ลองอีกครั้ง',
          confirmButtonColor: '#EF4444'
        })
      }
    } catch (error) {
      // Close loading alert and show error
      Swal.close()

      if (error.response) {
        // Server responded with error status
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.response.data.msg || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
          confirmButtonText: 'ลองอีกครั้ง',
          confirmButtonColor: '#EF4444'
        })
      } else if (error.request) {
        // Network error
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถเชื่อมต่อได้',
          text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
          confirmButtonText: 'ลองอีกครั้ง',
          confirmButtonColor: '#EF4444'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ',
          text: 'กรุณาลองอีกครั้งในภายหลัง',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#EF4444'
        })
      }
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-green-100">
        <div className="text-center mb-8">
          <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-800">เข้าสู่ระบบ</h1>
          <p className="text-gray-600 mt-2">กรุณากรอกรายละเอียดเพื่อเข้าสู่ระบบ</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="label text-green-700 font-medium">อีเมล/ชื่อผู้ใช้</label>
            <input
              type="text"
              name="login"
              placeholder="กรุณากรอกอีเมลหรือชื่อผู้ใช้ของคุณ"
              className={`input input-bordered w-full bg-white border ${errors.login ? 'border-red-500' : 'border-green-200'} focus:border-green-500 focus:ring-1 focus:ring-green-500`}
              value={loginData.login}
              onChange={handleChange}
            />
            {errors.login && <p className="text-red-500 text-sm mt-1">{errors.login}</p>}
          </div>

          <div>
            <label className="label text-green-700 font-medium">รหัสผ่าน</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="กรุณากรอกรหัสผ่านของคุณ"
                className={`input input-bordered w-full bg-white border ${errors.password ? 'border-red-500' : 'border-green-200'} focus:border-green-500 focus:ring-1 focus:ring-green-500`}
                value={loginData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-green-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                className="checkbox checkbox-green"
                checked={loginData.rememberMe}
                onChange={handleChange}
              />
              <span className="ml-2 text-gray-600">จดจำฉัน</span>
            </label>
            <Link to="/forgot-password" className="text-green-600 text-sm hover:underline">ลืมรหัสผ่าน?</Link>
          </div>

          <button
            type="submit"
            className={`btn bg-green-600 text-white hover:bg-green-700 w-full py-3 transition duration-300 ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="divider my-6 text-gray-400">หรือ</div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="btn btn-outline text-gray-700 border-gray-300 hover:bg-gray-50 flex items-center justify-center py-2.5 transition duration-300">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button className="btn btn-outline text-gray-700 border-gray-300 hover:bg-gray-50 flex items-center justify-center py-2.5 transition duration-300">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        <div className="text-center text-gray-600">
          ยังไม่มีบัญชี? <Link to="/register" className="text-green-600 hover:underline font-medium">ลงทะเบียน</Link>
        </div>
      </div>
    </div>
  )
}

export default Login