"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, TrendingUp, Loader2 } from "lucide-react"

import {  toast } from 'react-toastify';
import axios from "axios"
import { Api } from "@/app/apis/api"

export default function LoginPage() {
  const [mobile, setMobile] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await axios.post(Api.login, {
          user_name: mobile,
          hash_code: "96pYMmXfHNR",
      })

     console.log("response",response)

      if (response?.data?.status === true) {
        toast.success(response?.data.message)
        sessionStorage.setItem("temp_mobile", mobile)
        router.push("/otp")
      } else {
        setError(response?.data?.message)
      }
    } catch (err) {
      setError(err?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-600">StockPathshala</CardTitle>
          <p className="text-gray-600 mt-2">Enter your mobile number to continue</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="pl-10 h-12"
                maxLength={10}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              disabled={loading || mobile.length !== 10}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
