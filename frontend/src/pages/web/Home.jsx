import React from 'react'
import Features from '../../components/web/Features'
// import Menu from './../../components/web/Menu';
import Testimonials from './../../components/web/Testimonials';
import Hero from './../../components/web/Hero';
import ReviewSummary from '../../components/shared/ReviewSummary';


const Home = () => {
  return (
    <div>
      <Hero />
      <Features />
      {/* <Menu /> */}
      <Testimonials />
    </div>
  )
}

export default Home