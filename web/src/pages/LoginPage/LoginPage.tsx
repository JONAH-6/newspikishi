// src/pages/LoginPage/LoginPage.tsx
import React from 'react'

import { GoogleButton } from 'react-google-button'

import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/contexts/AuthContexts'

const LoginPage = () => {
  const { googleSignIn } = useAuth()

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn()
      // Redirect to home after successful login
      window.location.href = routes.home()
    } catch (error) {
      console.error('Error during Google sign-in:', error)
      alert('Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B0000] to-[#600000] flex items-center justify-center">
      <Metadata title="Login" description="Login page" />
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/80">Sign in to your account</p>
        </div>

        <div className="flex justify-center mb-6">
          <GoogleButton onClick={handleGoogleSignIn} />
        </div>

        <div className="text-center text-white/70">
          <p>By signing in, you agree to our Terms of Service</p>
        </div>

        <div className="mt-8 text-center">
          <Link
            to={routes.home()}
            className="text-[#FFD700] hover:text-[#FFC107] transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
