import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {

    useEffect(() => {
        document.title = 'UniNest | Page Not Found';
    })

    return (
        <div
            style={{
                backgroundImage: 'url(/heroBackground.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center'
            }}
        >
            <div>
                <h1 className=' text-8xl text-primaryBgColor font-bold'>404</h1>
                <h1 className=' text-2xl text-black font-bold'>This is not the web page you are looking for.</h1>
                <h1 className=' text-lg text-black font-bold'>Go <Link to="/" className=' underline'>Back</Link></h1>
            </div>
        </div>
    );
}

export default NotFound;
