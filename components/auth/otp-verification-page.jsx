"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Loader2 } from "lucide-react"

import {  toast } from 'react-toastify';
import axios from "axios"
import { Api } from "@/app/apis/api"


export default function OtpPage() {
  const [otp, setOtp] = useState("")
  const [mobile, setMobile] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const tempMobile = sessionStorage.getItem("temp_mobile")
    if (!tempMobile) {
      router.push("/login")
      return
    }
    setMobile(tempMobile)
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await axios.post(Api.otp, {
          user_name: mobile,
          otp: otp,
      })
     
      if (response?.data?.status === true) {

        document.cookie = `auth_token=${response?.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`

        toast.success(response?.data?.message)
        localStorage.setItem("user_data", JSON.stringify(response?.data))

        sessionStorage.removeItem("temp_mobile")

        router.push("/dashboard")
      } else {
         toast.error(response?.data?.message)
        setError(response?.data?.message)
      }
    } catch (err) {
      setError(err?.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    sessionStorage.removeItem("temp_mobile")
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center relative">
          <Button variant="ghost" size="sm" onClick={handleBack} className="absolute left-4 top-4 p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
          <p className="text-gray-600 mt-2">
            Enter the 4-digit code sent to
            <br />
            <span className="font-semibold">+91 {mobile}</span>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="text-center text-lg tracking-widest h-12"
              maxLength={4}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700"
              disabled={loading || otp.length !== 4}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
