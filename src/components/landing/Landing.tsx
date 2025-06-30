import Footer from './elements/Footer'
import Header from './elements/Header'
import CTA from './elements/sections/CTA'
import Faq from './elements/sections/FAQ'
import Features from './elements/sections/Features'
import Hero from './elements/sections/Hero'
import Pricing from './elements/sections/Pricing'
import Solutions from './elements/sections/Solutions'

export default function Landing() {
    return (
        <div
            style={{
                fontFamily: 'Segoe UI',
            }}
            className='min-h-screen'
        >
            <Header />
            <Hero />
            <Solutions />
            <Features />
            <Faq />
            <Pricing />
            <CTA />
            <Footer />
        </div>
    )
}
