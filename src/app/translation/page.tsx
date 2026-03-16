'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import TextTranslationZone from '@/components/translation/TextTranslationZone';
import TranslationZone from '@/components/translation/TranslationZone';
import CertificateTranslationZone from '@/components/translation/CertificateTranslationZone';

export default function TranslationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              智能翻译
            </h1>
            <p className="text-gray-600 text-lg">
              一站式翻译服务
            </p>
          </div>

          {/* 文本翻译功能区域 */}
          <div className="max-w-7xl mx-auto">
            <TextTranslationZone />
          </div>

          {/* 文档翻译功能区域 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="max-w-7xl mx-auto mt-16">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  文档翻译
                </h2>
                <p className="text-gray-500 text-base">
                  高保真文档翻译，保留原文档格式
                </p>
              </div>
              <TranslationZone />
            </div>
          </motion.div>

          {/* 证件翻译功能区域 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <CertificateTranslationZone />
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}
