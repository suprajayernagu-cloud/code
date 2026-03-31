import React from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import MonetizationManager from './components/MonetizationManager'
import Home from './pages/Home'
import JobDetails from './pages/JobDetails'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Disclaimer from './pages/Disclaimer'

function NotFound() {
  return (
    <section className="surface mx-auto max-w-3xl p-8 text-center sm:p-10">
      <p className="pill mx-auto w-fit">404</p>
      <h1 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">Page not found</h1>
      <p className="mt-3 text-base text-slate-600">
        The page you are looking for does not exist. Check the URL or continue browsing the latest jobs.
      </p>
      <Link to="/" className="primary-btn mt-6">
        Back to Jobs
      </Link>
    </section>
  )
}

const pageMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

export default function App() {
  const location = useLocation()

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-white">
      <MonetizationManager />

      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-white" />
      </div>

      <NavBar />

      <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-10" role="main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageMotion}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/jobs/:companySlug/:titleSlug" element={<JobDetails />} />
              <Route path="/jobs/:companyOrId" element={<JobDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
