"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function SportsCommunityStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div
      className="min-h-screen text-foreground"
      style={{ background: "var(--sports-bg)" }}
    >
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: isInView ? 0.5 : 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          style={{ background: "var(--section-bg)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: isInView ? 0.5 : 0 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mr-4"></div>
              <span className="text-blue-400 uppercase tracking-wider text-sm font-bold">
                Our Journey
              </span>
            </div>
            <h1 className="sports-text text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Our Sports Story
              </span>
            </h1>
            <div className="space-y-6 body-text text-[var(--text-muted)]">
              <p className="text-lg leading-relaxed">
                Founded in 2020, our sports community began with a simple idea:
                create a space where students could share their passion for
                running and grow together.
              </p>
              <p className="text-lg leading-relaxed">
                From small running events with just a few dozen participants,
                we've grown into a massive community with thousands of members
                across the country.
              </p>
              <p className="text-lg leading-relaxed">
                We're proud to have successfully organized many large-scale
                running events, helping to spread the spirit of sports and
                healthy living among youth.
              </p>
              <p className="text-lg leading-relaxed">
                Looking ahead, we aim to expand our reach, inspire more young
                individuals, and build a stronger, more inclusive community for
                the future.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                Join Our Community
              </div>
              <div className="px-6 py-3 border border-blue-400 rounded-full flex items-center hover:bg-blue-900/30 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Events
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: isInView ? 0.8 : 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden border-4 border-blue-400/20 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Running community"
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-white/10"
              animate={{ scale: isInView ? 1 : 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <div className="sports-text text-3xl font-bold">5000+</div>
                <div className="body-text text-sm uppercase tracking-wider">
                  Members
                </div>
              </div>
            </motion.div>
            <motion.div
              className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white/10"
              animate={{ scale: isInView ? 1 : 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        :root {
          --sports-bg: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          --section-bg: transparent;
          --text-muted: #d1d5db;
        }

        .dark {
          --sports-bg: linear-gradient(135deg, #0d0d0d 0%, #0a0f1e 100%);
          --section-bg: rgba(13, 13, 13, 0.8);
          --text-muted: #9ca3af;
        }

        .sports-text {
          font-family: "Bebas Neue", sans-serif;
        }
        .body-text {
          font-family: "Montserrat", sans-serif;
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
