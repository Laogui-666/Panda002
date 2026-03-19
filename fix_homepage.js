const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. 修改统计数据区域 - 上移
content = content.replace(
  'className="flex justify-center gap-3 sm:gap-8 md:gap-16 mb-8 md:mb-12 lg:mb-14"',
  'className="flex justify-center gap-3 sm:gap-8 md:gap-16 mb-6 md:mb-8"'
);

// 2. 修改服务卡片区域 - 从hero移出，独立成新section
// 找到服务卡片的开始部分
const oldCardsStart = `          {/* Bottom Section: 6 Service Cards - 增强版设计 */}
          <motion.div
            className="flex-1 flex flex-col justify-start -mt-8 md:-mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {/* Section Title */}
            <motion.div
              className="text-center mb-1 md:mb-2 -mt-4 md:-mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig.medium, delay: 0.65 }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-morandi-deep">
                选择您需要的服务
              </h2>
            </motion.div>`;

const newCardsStart = `        </motion.div>
      </div>
    </section>
    
    {/* Service Cards Section - 独立于Hero区域 */}
    <section className="py-8 md:py-12 bg-gradient-to-br from-slate-50 via-morandi-cream to-morandi-blush">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig.medium, delay: 0.1 }}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-morandi-deep">
            选择您需要的服务
          </h2>
        </motion.div>`;

content = content.replace(oldCardsStart, newCardsStart);

// 3. 关闭服务卡片区域 - 找到hero区域结束位置
const oldHeroEnd = `          {/* 移动端：2列紧凑间距 | 桌面端：3列正常间距 - 增强版服务卡片 */}`;

const newHeroEnd = `        {/* 移动端：2列紧凑间距 | 桌面端：3列正常间距 - 增强版服务卡片 */}`;

content = content.replace(oldHeroEnd, newHeroEnd);

// 找到服务卡片结束位置，添加新的闭合标签
const oldCardsEnd = `                </Card>
              </Link>
            );
          })}
          
          {/* 一键翻译卡片 */}
          {service.id === 3 && (`;

const newCardsEnd = `                </Card>
              </Link>
            );
          })}

          {/* 一键翻译卡片 */}
          {service.id === 3 && (`;

content = content.replace(oldCardsEnd, newCardsEnd);

// 找到整个服务卡片的结束，在Footer之前添加闭合
const searchStr = `          {/* 底部背景装饰 */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>
      </div>
    </motion.div>
  );
}`;

const replaceStr = `          {/* 底部背景装饰 */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>
      </div>
    </section>
  );
}`;

content = content.replace(searchStr, replaceStr);

// 4. 修改证明文件卡片颜色 - 改为蓝色(morandi-ocean)
content = content.replace(
  "color: 'from-green-500 to-green-600',",
  "color: 'from-morandi-ocean to-morandi-deep',"
);
content = content.replace(
  "iconBg: 'bg-green-500',",
  "iconBg: 'bg-morandi-ocean',"
);

fs.writeFileSync(filePath, content);
console.log('Homepage updates completed!');
