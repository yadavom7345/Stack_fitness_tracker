import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Pricing from '../components/landing/Pricing'
import Contact from '../components/landing/Contact'
import Footer from '../components/landing/Footer'
import Toast from '../components/app/Toast'
import { useToast } from '../hooks/useToast'
import '../index.css'

export default function LandingPage() {
  const { toast, showToast } = useToast();

  return (
    <>
      <Navbar />
      <Hero />
      <Pricing />
      <Contact showToast={showToast} />
      <Footer />
      <Toast show={toast.show} message={toast.message} />
    </>
  )
}
