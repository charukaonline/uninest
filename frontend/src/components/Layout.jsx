// eslint-disable-next-line no-unused-vars
import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
    return (
        <div>
            <Header />
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