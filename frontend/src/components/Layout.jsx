// eslint-disable-next-line no-unused-vars
import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import Footer from './Footer'
import HeroSection from './HeroSection'

const Layout = ({ children }) => {
    return (
        <div>
            <Header />
            <HeroSection/>
            <main>
                {children}
            </main>
            <Footer />
        </div>
    )
}
Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout