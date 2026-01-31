import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const GlowingEffect = ({ children, className }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;

        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "group relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50",
                className
            )}
        >
            <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(124, 58, 237, 0.15), transparent 40%)`,
                }}
            />

            {/* Border glow */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(124, 58, 237, 0.4), transparent 40%)`,
                    maskImage: "linear-gradient(black, black), linear-gradient(black, black)",
                    maskClip: "content-box, border-box",
                    maskComposite: "exclude",
                    WebkitMaskComposite: "xor",
                    padding: "1px",
                }}
            />

            <div className="relative h-full w-full">
                {children}
            </div>
        </div>
    );
};
