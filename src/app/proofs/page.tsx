'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Briefcase, GraduationCap, FileSignature, Wallet, Mail, FileQuestion,
  ArrowRight
} from 'lucide-react';

// 证明文件类型
const PROOF_TYPES = [
  { 
    id: 'employment',
    name: '在职证明', 
    nameEn: 'Employment Certificate',
    icon: Briefcase,
    description: '用于申请签证的在职证明文件',
    href: '/proof',
    color: 'from-morandi-ocean to-morandi-deep',
  },
  { 
    id: 'dispatch',
    name: '派遣函（商务）', 
    nameEn: 'Business Dispatch Letter',
    icon: FileSignature,
    description: '公司商务派遣函证明文件',
    href: '#',
    color: 'from-morandi-teal to-morandi-ocean',
    comingSoon: true,
  },
  { 
    id: 'student',
    name: '在读证明', 
    nameEn: 'Student Status Certificate',
    icon: GraduationCap,
    description: '用于申请签证的在读证明',
    href: '#',
    color: 'from-morandi-lavender to-morandi-mist',
    comingSoon: true,
  },
  { 
    id: 'income',
    name: '出资证明', 
    nameEn: 'Financial Support Certificate',
    icon: Wallet,
    description: '收入证明及出资证明文件',
    href: '#',
    color: 'from-morandi-sand to-morandi-clay',
    comingSoon: true,
  },
  { 
    id: 'invitation',
    name: '邀请函', 
    nameEn: 'Invitation Letter',
    icon: Mail,
    description: '邀请函证明文件',
    href: '#',
    color: 'from-morandi-rose to-morandi-blush',
    comingSoon: true,
  },
  { 
    id: 'no-biz',
    name: '无法提供营业执照', 
    nameEn: 'No Business License',
    icon: FileQuestion,
    description: '无法提供营业执照解释信',
    href: '#',
    color: 'from-morandi-mist to-morandi-ocean',
    comingSoon: true,
  },
];

export default function ProofDocumentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-morandi-cream to-morandi-blush">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-morandi-ocean to-morandi-deep rounded-3xl shadow-lg mb-6"
            >
              <Briefcase className="text-white w-10 h-10" />
            </motion.div>
            <h1 className="text-4xl font-bold text-morandi-deep mb-4">
              证明文件助手
            </h1>
            <p className="text-morandi-mist text-lg max-w-2xl mx-auto">
              智能生成中英文在职证明、在读证明等证明文件，支持一键生成PDF
            </p>
          </div>

          {/* 服务卡片网格 */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2 md:px-4 max-w-6xl mx-auto">
            {PROOF_TYPES.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-[2rem] p-6 shadow-lg border border-slate-100 cursor-pointer hover:shadow-xl hover:border-morandi-ocean/30 hover:scale-[1.02] transition-all group relative overflow-hidden ${
                  type.comingSoon ? 'opacity-75' : ''
                }`}
                onClick={() => {
                  if (!type.comingSoon && type.href) {
                    window.location.href =type.href;
                  }
                }}
              >
                {/* 背景装饰 */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${type.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
                
                <div className="flex justify-center mb-4 mt-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <type.icon className="text-white w-8 h-8" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-morandi-deep mb-2 text-center">
                  {type.name}
                </h3>
                <p className="text-xs text-morandi-mist mb-3 text-center">
                  {type.nameEn}
                </p>
                <p className="text-sm text-gray-500 text-center mb-4">
                  {type.description}
                </p>
                
                {/* 按钮/状态 */}
                {type.comingSoon ? (
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-morandi-mist/20 rounded-full text-morandi-mist text-sm font-medium">
                    <span>即将上线</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-morandi-ocean to-morandi-deep text-white rounded-full text-sm font-medium group-hover:gap-3 transition-all">
                    <span>立即使用</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}
