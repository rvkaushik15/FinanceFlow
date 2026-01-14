import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

const variants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.61, 1, 0.88, 1] // Custom ease for "snappy" feel
        }
    },
    exit: {
        opacity: 0,
        y: -20, // Slide up on exit
        scale: 0.98,
        transition: {
            duration: 0.3
        }
    }
};

const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
    return (
        <motion.div
            initial="initial"
            animate="enter"
            exit="exit"
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
