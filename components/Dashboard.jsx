"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Clock,
  LogOut,
  Users,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Play,
  Calendar,
} from "lucide-react"
import Navbar from "../components/Navbar"

import axios from "axios"

import moment from "moment"
import { Api } from "@/app/apis/api"

export default function DashboardPage() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalClasses, setTotalClasses] = useState(0)
  const router = useRouter()

  const classesPerPage = 9

  useEffect(() => {
    const userData = localStorage.getItem("user_data")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchClasses()
    } else {
      router.push("/login")
    }
  }, [router, currentPage])

  const fetchClasses = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const userData = localStorage.getItem("user_data")
      if (!userData) return

      const user = JSON.parse(userData)

      const response = await axios.get(
        `${Api?.liveClass}?page=${currentPage}&limit=${classesPerPage}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user.access_token}`,
          },
        },
      )

      console.log("data",response)

      if (response?.data.status === true) {
  
        setClasses(response?.data?.data?.data)
        setTotalClasses(response?.data?.data?.pagination?.total )
        setTotalPages(response?.data?.data?.pagination?.last_page)
      }
    } catch (err) {
      console.error("Failed to load classes:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

 

 
  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white"
      case "upcoming":
        return "bg-blue-500 text-white"
      case "completed":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getButtonText = (status) => {
    switch (status) {
      case "live":
        return "Join Now"
      case "upcoming":
        return "Register"
      case "completed":
        return "View Recording"
      default:
        return "View Class"
    }
  }


  const handleClassClick = (classItem) => {
    router.push(`/class/${classItem.id}`)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your classes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
    
     <Navbar fetchClasses={fetchClasses} refreshing={refreshing} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Live Trading Classes</h2>
          <p className="text-gray-600">Join expert-led sessions to enhance your trading skills</p>
          <p className="text-sm text-gray-500 mt-1">Total Classes: {totalClasses}</p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {classes.map((classItem) => {
            return (
              <Card
                key={classItem.id}
                className="hover:shadow-lg transition-all duration-300 bg-white cursor-pointer transform hover:scale-105"
                onClick={() => handleClassClick(classItem)}
              >
                <div className="relative">
                  <img
                    src={classItem.image || "/placeholder.svg?height=200&width=400"}
                    alt={classItem.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={getStatusColor(classItem.class_status)}>
                      {classItem.class_status === "live" && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                      )}
                      {classItem.class_status.toUpperCase()}
                    </Badge>
                  </div>
                  {classItem.is_free === 1 && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white">FREE</Badge>
                    </div>
                  )}
                  {classItem.price > 0 && classItem.is_free === 0 && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      ₹{classItem.price}
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="mb-3">
                    <Badge variant="outline" className={`text-xs mb-2 text-[$]`}>
                      {classItem.category?.title}
                    </Badge>
                    <Badge variant="outline" className="text-xs mb-2 ml-2">
                      {classItem.level?.level}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2">{classItem.title}</h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {classItem.short_description ||
                      classItem.description?.replace(/<[^>]*>/g, "").slice(0, 100) + "..."}
                  </p>

                  <div className="space-y-3">
                    {/* Teacher Info */}
                    <div className="flex items-center space-x-3">
                      <img
                        src={classItem.teachers?.profile_image || "/placeholder.svg?height=32&width=32"}
                        alt={classItem.teachers?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{classItem?.teachers?.name}</p>
                        <p className="text-xs text-gray-500">{classItem?.teachers?.expertise}</p>
                      </div>
                      {classItem?.teachers?.rating && (
                        <div className="ml-auto text-xs text-yellow-600">⭐ {classItem?.teachers?.rating}</div>
                      )}
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{moment(classItem.start_datetime).format("DD-MM-YYYY")}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{moment(classItem.start_datetime).format("hh:mm A")}</span>
                      </div>
                    </div>

                    {/* Duration and Language */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{classItem.duration} minutes</span>
                      <span>{classItem.language?.language_name}</span>
                    </div>

                    {classItem.teachers?.students_learn && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{classItem.teachers.students_learn} students</span>
                      </div>
                    )}
                  </div>

                  <Button
                    className={`w-full mt-4 ${
                      classItem.class_status === "live"
                        ? "bg-red-600 hover:bg-red-700"
                        : classItem.class_status === "upcoming"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-600 hover:bg-gray-700"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClassClick(classItem)
                    }}
                  >
                    {classItem.class_status === "live" && <Play className="h-4 w-4 mr-2" />}
                    {getButtonText(classItem.class_status)}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 ${currentPage === page ? "bg-blue-600 text-white" : ""}`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {classes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes available</h3>
            <p className="text-gray-600">Check back later for new trading sessions</p>
          </div>
        )}
      </div>
    </div>
  )
}
