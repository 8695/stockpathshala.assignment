"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  ArrowLeft,
  Play,
  Clock,
  Calendar,
  Users,
  Star,
  BookOpen,
  Share2,
  Heart,
  TrendingUp,
  LogOut,
  RefreshCw,
  Award,
  Target,
  UserCheck,
} from "lucide-react"
import axios from "axios"
import { Api } from "@/app/apis/api";
import moment from "moment"
import toast from "react-toastify"


export default function ClassPage() {
  const [classData, setClassData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [showAllFAQs, setShowAllFAQs] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    fetchClassDetails()
  }, [params.id])

  const fetchClassDetails = async () => {
    try {
      const userData = localStorage.getItem("user_data")
      if (!userData) {
        router.push("/login")
        return
      }

      const user = JSON.parse(userData)

      const response = await axios.get(`${Api.liveClass}/${params.id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
      })
      console.log("response",response)
      if (response?.data?.status === true) {
        
        setClassData(response?.data?.data)
      }
    } catch (err) {
      console.error("Failed to load class details:", err)
      
    } finally {
      setLoading(false)
    }
  }


  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    localStorage.removeItem("user_data")
     toast.succuss("Logout SuccessFully")
    router.push("/login")
  }

  

  const handleRegister = () => {
    setIsRegistered(true)
  }

  const handleJoinClass = () => {
    if (classData?.class_status === "live") {
      setShowVideo(true)
    } else if (classData?.class_status === "completed") {
      setShowVideo(true)
    }
  }

  const parseMultilineText = (text) => {
    if (!text) return []
    return text.split("\r\n").filter((item) => item.trim() !== "")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading class details...</p>
        </div>
      </div>
    )
  }

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Class not found</h2>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }


  const learningPoints = parseMultilineText(classData.class_points || classData.live_class_field?.learn_class)
  const targetAudience = parseMultilineText(classData.live_class_field?.title_class)
  const visibleFAQs = showAllFAQs ? classData.static_faq : classData.static_faq?.slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header - Same as Dashboard */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-blue-600">StockPathshala</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
              className="text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video/Image Section */}
            <Card className="overflow-hidden">
              <div className="relative">
                {showVideo ? (
                  <div className="aspect-video bg-black flex items-center justify-center">
                    <div className="text-white text-center">
                      <Play className="h-16 w-16 mx-auto mb-4" />
                      <p>Video Player Would Load Here</p>
                      <p className="text-sm text-gray-300 mt-2">
                        {classData.class_status === "live" ? "Live Stream" : "Recorded Session"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={classData.image || "/placeholder.svg"}
                      alt={classData.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Button
                        size="lg"
                        onClick={handleJoinClass}
                        className="bg-white/90 text-black hover:bg-white"
                        disabled={classData.class_status === "upcoming" && !isRegistered}
                      >
                        <Play className="h-6 w-6 mr-2" />
                        {classData.class_status === "live"
                          ? "Join Live Class"
                          : classData.class_status === "completed"
                            ? "Watch Recording"
                            : "Preview"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Class Info */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    className={
                      classData.class_status === "live"
                        ? "bg-red-500 text-white"
                        : classData.class_status === "upcoming"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-500 text-white"
                    }
                  >
                    {classData.class_status === "live" && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                    )}
                    {classData.class_status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{classData.category?.title}</Badge>
                  <Badge variant="outline">{classData.level?.level}</Badge>
                  {classData.is_free === 1 && <Badge className="bg-green-500 text-white">FREE</Badge>}
                </div>
                <CardTitle className="text-2xl">{classData.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <p className="text-sm font-medium">{moment(classData.start_datetime).format("DD-MM-YYYY")}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <p className="text-sm font-medium">{moment(classData.start_datetime).format("hh:mm A")}</p>
                  </div>
                  <div className="text-center">
                    <BookOpen className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <p className="text-sm font-medium">{classData.duration} min</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <p className="text-sm font-medium">{classData.teachers?.students_learn || 0}</p>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">
                    {classData.live_class_field?.about_title || "About This Class"}
                  </h3>
                  <p className="text-gray-600 mb-4">{classData.short_description}</p>
                  <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: classData.description }} />
                </div>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            {learningPoints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-600" />
                    {classData.live_class_field?.class_learn_heading || "What You'll Learn"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {learningPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Who Should Join */}
            {targetAudience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
                    {classData.live_class_field?.class_for_heading || "Who Should Join This Webinar?"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {targetAudience.map((audience, index) => (
                      <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <p className="font-medium text-gray-900">{audience}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQ Section with Accordion */}
            {classData.static_faq && classData.static_faq.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{classData.live_class_field?.faq_title || "Frequently Asked Questions"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {visibleFAQs.map((faq, index) => (
                      <AccordionItem key={faq.id} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {classData.static_faq.length > 3 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowAllFAQs(!showAllFAQs)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        {showAllFAQs ? "Show Less" : `Show ${classData.static_faq.length - 3} More FAQs`}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardContent className="p-6">
                {classData.price > 0 && classData.is_free === 0 && (
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-blue-600">₹{classData?.price}</span>
                  </div>
                )}

                <Button
                  className="w-full mb-4"
                  size="lg"
                  onClick={classData.class_status === "upcoming" ? handleRegister : handleJoinClass}
                  disabled={classData.class_status === "upcoming" && isRegistered}
                >
                  {classData.class_status === "live" ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {classData.buttons?.class_join_button_title || "Join Now"}
                    </>
                  ) : classData.class_status === "upcoming" ? (
                    isRegistered ? (
                      classData.buttons?.class_registered_button_title || "Registered"
                    ) : (
                      classData.buttons?.class_register_button_title || "Register Now"
                    )
                  ) : (
                    "Watch Recording"
                  )}
                </Button>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <CardTitle>{classData.live_class_field?.mentor_title || "Your Instructor"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <img
                    src={classData.teachers?.profile_image || "/placeholder.svg"}
                    alt={classData.teachers?.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{classData.teachers?.name}</h3>
                    <p className="text-blue-600 text-sm mb-1">{classData.teachers?.expertise}</p>
                    <p className="text-gray-600 text-sm mb-2">{classData.teachers?.trading_style}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{classData.teachers?.rating}</span>
                      </div>
                      <div>{classData.teachers?.total_experience} years exp</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Students:</span>
                        <span className="font-medium ml-1">{classData.teachers?.students_learn}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Hours:</span>
                        <span className="font-medium ml-1">{classData.teachers?.teaching_hours}</span>
                      </div>
                    </div>

                    {classData.teachers?.certification_text && (
                      <Badge className="bg-green-100 text-green-800 flex items-center w-fit">
                        <Award className="h-3 w-3 mr-1" />
                        {classData.teachers.certification_text}
                      </Badge>
                    )}
                  </div>
                </div>

                {classData.teachers?.bio && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">{classData.teachers.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Class Details */}
            <Card>
              <CardHeader>
                <CardTitle>Class Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium">{classData.language?.language_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{classData.level?.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{classData.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{classData?.category?.title}</span>
                </div>
                {classData?.price > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-blue-600">₹{classData?.price}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
