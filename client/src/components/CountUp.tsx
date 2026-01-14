import { useEffect, useRef } from 'react';
import { useInView, motion, useSpring, useTransform } from 'framer-motion';
import { formatCurrency } from '../utils/currency';

interface CountUpProps {
    value: number;
    currency?: string;
    duration?: number;
    className?: string;
}

const CountUp = ({ value, currency = 'USD', duration = 2, className = '' }: CountUpProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-10px" });

    // Spring physics for smooth "landing"
    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 20,
        duration: duration * 1000
    });

    const displayValue = useTransform(springValue, (current) => {
        // Avoid formatting flicker by checking if close to target
        if (Math.abs(current - value) < 0.01) return formatCurrency(value, currency);
        return formatCurrency(current, currency);
    });

    // Handle "prefix" manually if needed, but formatCurrency usually handles symbols
    // If prefix is "+", we can check sign.

    useEffect(() => {
        if (inView) {
            springValue.set(value);
        }
    }, [inView, value, springValue]);

    return (
        <motion.span ref={ref} className={className}>
            {displayValue}
        </motion.span>
    );
};

export default CountUp;
