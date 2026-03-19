'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/erp/api-client';

export default function ERPIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // 检查是否登录
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login?redirect=/erp');
      return;
    }
    
    // 根据角色跳转到对应页面
    if (currentUser.role === 'CUSTOMER') {
      router.push('/erp/my-orders');
    } else {
      router.push('/erp/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
    </div>
  );
}
