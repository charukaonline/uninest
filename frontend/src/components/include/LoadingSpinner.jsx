import { motion } from "framer-motion";

const LoadingSpinner = () => {
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
                <motion.div>
                    <img src="/uninestLogo.png" width={200} height={200} />
                </motion.div>
            </div>
        </div>
    );
};

export default LoadingSpinner;