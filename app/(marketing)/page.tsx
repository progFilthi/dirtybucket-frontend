'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { heroStagger } from '@/lib/motion';

export default function LandingPage() {
  return (
    <div className="marketing-page relative min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          variants={heroStagger.container}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="inline-block mb-6"
            variants={heroStagger.item}
          >
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium">
              New: Unlimited Downloads
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl font-semibold mb-8 tracking-tight"
            variants={heroStagger.item}
          >
            Beats on tap.
          </motion.h1>

          <motion.p
            className="text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed"
            variants={heroStagger.item}
          >
            Stop paying per beat. Subscribe and unlock a curated library of premium instrumentals.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-4"
            variants={heroStagger.item}
          >
            <Link href="/register">
              <motion.button
                className="px-8 py-3 rounded-xl bg-white text-black font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start subscription
              </motion.button>
            </Link>
            <Link href="/pricing">
              <motion.button
                className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.98 }}
              >
                View pricing
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-semibold mb-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why subscriptions work better
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '♾️',
                title: 'Unlimited access',
                desc: 'Download up to 50 beats per month. No per-beat pricing, no hidden fees.'
              },
              {
                icon: '⚡',
                title: 'Stay creative',
                desc: 'Try different beats without financial commitment. Experiment freely.'
              },
              {
                icon: '💎',
                title: 'Simple pricing',
                desc: 'One flat rate. No complex licensing tiers or confusing contracts.'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-semibold mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Simple pricing
          </motion.h2>
          <motion.p
            className="text-xl text-white/60 text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Choose the plan that works for you
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.div
              className="relative p-10 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <h3 className="text-2xl font-semibold mb-2">Monthly</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">$29</span>
                <span className="text-white/60">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-white/70">
                <li>• 50 downloads per month</li>
                <li>• Unlimited previews</li>
                <li>• Cancel anytime</li>
              </ul>
              <Link href="/register" className="block">
                <motion.button
                  className="w-full px-8 py-3 rounded-xl bg-white text-black font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              className="relative p-10 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Yearly</h3>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                  SAVE 20%
                </span>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold">$279</span>
                <span className="text-white/60">/year</span>
              </div>
              <ul className="space-y-3 mb-8 text-white/70">
                <li>• 50 downloads per month</li>
                <li>• Unlimited previews</li>
                <li>• Cancel anytime</li>
              </ul>
              <Link href="/register" className="block">
                <motion.button
                  className="w-full px-8 py-3 rounded-xl bg-white text-black font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-semibold mb-12">
            Ship more songs
          </h2>
          <Link href="/register">
            <motion.button
              className="px-8 py-3 rounded-xl bg-white text-black font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start subscription
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
