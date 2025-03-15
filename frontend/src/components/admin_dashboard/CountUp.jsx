import React, { useEffect, useState } from 'react'

const CountUp = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (count === end) return;

        let startTime;
        let animationFrame;

        const startCount = 0;
        const easeOutQuad = t => t * (2 - t);

        const updateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;

            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = easeOutQuad(progress);

            setCount(Math.floor(startCount + easedProgress * (end - startCount)));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(updateCount);
            }
        };

        animationFrame = requestAnimationFrame(updateCount);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <>{count}</>;
};

export default CountUp