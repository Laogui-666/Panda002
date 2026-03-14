/**
 * 页脚组件
 */

import React from 'react';
import Link from 'next/link';

const footerLinks = {
  product: [
    { name: '一键翻译', href: '/translation' },
    { name: '签证资讯', href: '/visa-news' },
    { name: '行程规划', href: '/itinerary' },
    { name: '签证评估', href: '/assessment' },
    { name: '证明文件', href: '/proofs' },
    { name: '签证申请', href: '/services/visa' },
  ],
  partner: [
    { name: '华夏国际旅行社', href: '/partner' },
  ],
  company: [
    { name: '关于我们', href: '/about' },
    { name: '联系我们', href: '/contact' },
    { name: '隐私政策', href: '/privacy' },
    { name: '服务条款', href: '/terms' },
  ],
  support: [
    { name: '帮助中心', href: '/help' },
    { name: '常见问题', href: '/faq' },
    { name: '使用指南', href: '/guide' },
  ],
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-morandi-cream mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-morandi-ocean flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-morandi-deep">
                盼达旅行
              </span>
            </div>
            <p className="text-morandi-mist text-sm leading-relaxed">
              四海无界，一站畅游。为您的出境自由行提供专业的签证服务。
            </p>
          </div>
          
          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-morandi-deep mb-4">产品服务</h4>
            <div className="grid grid-cols-2 gap-3">
              {footerLinks.product.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-morandi-mist hover:text-morandi-ocean transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Partner Links */}
          <div>
            <h4 className="font-semibold text-morandi-deep mb-4">战略合作伙伴</h4>
            <ul className="space-y-3">
              {footerLinks.partner.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-morandi-mist hover:text-morandi-ocean transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-morandi-deep mb-4">关于我们</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-morandi-mist hover:text-morandi-ocean transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-morandi-deep mb-4">帮助支持</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-morandi-mist hover:text-morandi-ocean transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-morandi-mist border-opacity-20 flex flex-col md:flex-row items-center justify-between">
          <p className="text-morandi-mist text-sm">
            © 2024 盼达旅行. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-morandi-mist hover:text-morandi-ocean transition-colors" title="微信">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.6873.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.11.24-.245 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.406-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
              </svg>
            </a>
            <a href="#" className="text-morandi-mist hover:text-morandi-ocean transition-colors" title="微博">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="text-morandi-mist hover:text-morandi-ocean transition-colors" title="抖音">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-2.9 6.14-1.75 1.29-3.87 1.96-6.07 1.96-2.13 0-4.1-.63-5.81-1.72-1.7-1.09-2.96-2.6-3.74-4.31-.79-1.72-1.18-3.58-1.18-5.52 0-2.16.52-4.13 1.54-5.86C.02 5.81 0 5.4 0 5.01v-.02c0 2.21 1.08 4.23 2.84 5.54 1.76 1.31 3.93 2.07 6.18 2.07v-4.1c-1.56-.05-3.05-.55-4.18-1.42-.88-.68-1.47-1.61-1.68-2.68-.2-1.04-.22-2.13-.07-3.18.15-1.04.56-1.99 1.2-2.78.78-.97 1.86-1.55 3.06-1.74.05-.67.07-1.35.07-2.02zM9.06 16.65c.97.74 2.14 1.22 3.45 1.22 2.54 0 4.61-1.94 4.61-4.34v-3.84c-1.61.41-3.3.64-5.06.64-2.3 0-4.4-.7-6.08-1.88-1.35-.95-2.3-2.27-2.65-3.79-.21-.91-.27-1.85-.16-2.77.11-.91.36-1.78.74-2.57.73-1.52 1.92-2.72 3.39-3.44 1.48-.73 3.16-1.1 4.87-1.1 1.07 0 2.11.13 3.1.36v3.84c-.87-.23-1.79-.36-2.73-.36-1.45 0-2.81.43-3.94 1.18-.92.61-1.58 1.51-1.9 2.56-.32 1.05-.38 2.16-.19 3.23.19 1.07.63 2.02 1.26 2.75 1.22 1.41 2.87 2.21 4.68 2.21v-3.89c-1.14-.04-2.21-.36-3.14-.88z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
