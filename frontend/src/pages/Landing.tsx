// frontend/src/pages/Landing.tsx

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../assets/landing-tokens.css'

import Navbar               from '../components/landing/Navbar'
import Hero                 from '../components/landing/Hero'
import ProcrastinationGrid  from '../components/landing/ProcrastinationGrid'
import HowItWorks           from '../components/landing/HowItWorks'
import MirrorPreview        from '../components/landing/MirrorPreview'
import SocialProof          from '../components/landing/SocialProof'
import CTASection           from '../components/landing/CTASection'
import Footer               from '../components/landing/Footer'


export default function Landing() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/dashboard')
  }, [user, loading, navigate])

 return (
  <div className="landingTheme">
    <Navbar />
    <main>
      <Hero />
      <ProcrastinationGrid />
      <HowItWorks />
      <MirrorPreview />
      <SocialProof />
      <CTASection />
    </main>
    <Footer />
  </div>
)
}