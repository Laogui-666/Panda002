/**
 * 盼达旅行 - 行程规划页面（全新设计版）
 * 玻璃拟态 + 莫兰迪色系 + 爱彼迎风格
 * 支持智能导入、动态行程配置、结果导出
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, TextArea, Select } from '@/components/ui/Input';
import { springConfig } from '@/hooks/useAnimation';

// ===== 类型定义 =====
interface FlightInfo {
  id: string;
  flightNumber: string;
  departureRegion: string;
  departureCountry: string;
  departureProvince: string;
  departureCity: string;
  departureTime: string;
  arrivalRegion: string;
  arrivalCountry: string;
  arrivalProvince: string;
  arrivalCity: string;
  arrivalTime: string;
}

interface CityNode {
  id: string;
  city: string;
  startDate: string;
  endDate: string;
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
}

interface CountrySegment {
  id: string;
  region: string;
  country: string;
  cities: CityNode[];
}

// 中国省份选项
const chinaProvinces = [
  { value: 'beijing', label: '北京市' },
  { value: 'tianjin', label: '天津市' },
  { value: 'hebei', label: '河北省' },
  { value: 'shanxi', label: '山西省' },
  { value: 'neimenggu', label: '内蒙古自治区' },
  { value: 'liaoning', label: '辽宁省' },
  { value: 'jilin', label: '吉林省' },
  { value: 'heilongjiang', label: '黑龙江省' },
  { value: 'shanghai', label: '上海市' },
  { value: 'jiangsu', label: '江苏省' },
  { value: 'zhejiang', label: '浙江省' },
  { value: 'anhui', label: '安徽省' },
  { value: 'fujian', label: '福建省' },
  { value: 'jiangxi', label: '江西省' },
  { value: 'shandong', label: '山东省' },
  { value: 'henan', label: '河南省' },
  { value: 'hubei', label: '湖北省' },
  { value: 'hunan', label: '湖南省' },
  { value: 'guangdong', label: '广东省' },
  { value: 'guangxi', label: '广西壮族自治区' },
  { value: 'hainan', label: '海南省' },
  { value: 'chongqing', label: '重庆市' },
  { value: 'sichuan', label: '四川省' },
  { value: 'guizhou', label: '贵州省' },
  { value: 'yunnan', label: '云南省' },
  { value: 'xizang', label: '西藏自治区' },
  { value: 'shaanxi', label: '陕西省' },
  { value: 'gansu', label: '甘肃省' },
  { value: 'qinghai', label: '青海省' },
  { value: 'ningxia', label: '宁夏回族自治区' },
  { value: 'xinjiang', label: '新疆维吾尔自治区' },
  { value: 'xianggang', label: '香港特别行政区' },
  { value: 'aomen', label: '澳门特别行政区' },
  { value: 'taiwan', label: '台湾省' },
];

// 中国城市按省份
const chinaCitiesByProvince: Record<string, { value: string; label: string }[]> = {
  beijing: [{ value: 'beijing', label: '北京市' }],
  tianjin: [{ value: 'tianjin', label: '天津市' }],
  hebei: [
    { value: 'shijiazhuang', label: '石家庄市' },
    { value: 'tangshan', label: '唐山市' },
    { value: 'qinhuangdao', label: '秦皇岛市' },
    { value: 'handan', label: '邯郸市' },
    { value: 'xingtai', label: '邢台市' },
    { value: 'baoding', label: '保定市' },
    { value: 'zhangjiakou', label: '张家口市' },
    { value: 'chengde', label: '承德市' },
    { value: 'cangzhou', label: '沧州市' },
    { value: 'langfang', label: '廊坊市' },
    { value: 'hengshui', label: '衡水市' },
  ],
  shanxi: [
    { value: 'taiyuan', label: '太原市' },
    { value: 'datong', label: '大同市' },
    { value: 'yangquan', label: '阳泉市' },
    { value: 'changzhi', label: '长治市' },
    { value: 'jincheng', label: '晋城市' },
    { value: 'shuozhou', label: '朔州市' },
    { value: 'jinzhong', label: '晋中市' },
    { value: 'yuncheng', label: '运城市' },
    { value: 'xinzhou', label: '忻州市' },
    { value: 'linfen', label: '临汾市' },
    { value: 'lvliang', label: '吕梁市' },
  ],
  neimenggu: [
    { value: 'huhehaote', label: '呼和浩特市' },
    { value: 'baotou', label: '包头市' },
    { value: 'wuhai', label: '乌海市' },
    { value: 'chifeng', label: '赤峰市' },
    { value: 'tongliao', label: '通辽市' },
    { value: 'ordos', label: '鄂尔多斯市' },
    { value: 'hulunbuir', label: '呼伦贝尔市' },
    { value: 'bayannur', label: '巴彦淖尔市' },
    { value: 'wulanchabu', label: '乌兰察布市' },
    { value: 'xingan', label: '兴安盟' },
    { value: 'xilinguole', label: '锡林郭勒盟' },
    { value: 'alxa', label: '阿拉善盟' },
  ],
  liaoning: [
    { value: 'shenyang', label: '沈阳市' },
    { value: 'dalian', label: '大连市' },
    { value: 'anshan', label: '鞍山市' },
    { value: 'fushun', label: '抚顺市' },
    { value: 'benxi', label: '本溪市' },
    { value: 'dandong', label: '丹东市' },
    { value: 'jinzhou', label: '锦州市' },
    { value: 'yingkou', label: '营口市' },
    { value: 'fuxin', label: '阜新市' },
    { value: 'liaoyang', label: '辽阳市' },
    { value: 'panjin', label: '盘锦市' },
    { value: 'tieling', label: '铁岭市' },
    { value: 'chaoyang', label: '朝阳市' },
    { value: 'huludao', label: '葫芦岛市' },
  ],
  jilin: [
    { value: 'changchun', label: '长春市' },
    { value: 'jilin', label: '吉林市' },
    { value: 'siping', label: '四平市' },
    { value: 'liaoyuan', label: '辽源市' },
    { value: 'tonghua', label: '通化市' },
    { value: 'baishan', label: '白山市' },
    { value: 'songyuan', label: '松原市' },
    { value: 'baicheng', label: '白城市' },
    { value: 'yanbian', label: '延边朝鲜族自治州' },
  ],
  heilongjiang: [
    { value: 'haerbin', label: '哈尔滨市' },
    { value: 'qiqihar', label: '齐齐哈尔市' },
    { value: 'jixi', label: '鸡西市' },
    { value: 'hegang', label: '鹤岗市' },
    { value: 'shuangyashan', label: '双鸭山市' },
    { value: 'daqing', label: '大庆市' },
    { value: 'yichun', label: '伊春市' },
    { value: 'jiamusi', label: '佳木斯市' },
    { value: 'qitaihe', label: '七台河市' },
    { value: 'mudanjiang', label: '牡丹江市' },
    { value: 'heihe', label: '黑河市' },
    { value: 'suihua', label: '绥化市' },
    { value: 'daxinganling', label: '大兴安岭地区' },
  ],
  shanghai: [{ value: 'shanghai', label: '上海市' }],
  jiangsu: [
    { value: 'nanjing', label: '南京市' },
    { value: 'wuxi', label: '无锡市' },
    { value: 'xuzhou', label: '徐州市' },
    { value: 'changzhou', label: '常州市' },
    { value: 'suzhou', label: '苏州市' },
    { value: 'nantong', label: '南通市' },
    { value: 'lianyungang', label: '连云港市' },
    { value: 'huaian', label: '淮安市' },
    { value: 'yancheng', label: '盐城市' },
    { value: 'yangzhou', label: '扬州市' },
    { value: 'zhenjiang', label: '镇江市' },
    { value: 'taizhou', label: '泰州市' },
    { value: 'suqian', label: '宿迁市' },
  ],
  zhejiang: [
    { value: 'hangzhou', label: '杭州市' },
    { value: 'ningbo', label: '宁波市' },
    { value: 'wenzhou', label: '温州市' },
    { value: 'jiaxing', label: '嘉兴市' },
    { value: 'huzhou', label: '湖州市' },
    { value: 'shaoxing', label: '绍兴市' },
    { value: 'jinhua', label: '金华市' },
    { value: 'quzhou', label: '衢州市' },
    { value: 'zhoushan', label: '舟山市' },
    { value: 'taizhou_zj', label: '台州市' },
    { value: 'lishui', label: '丽水市' },
  ],
  anhui: [
    { value: 'hefei', label: '合肥市' },
    { value: 'wuhu', label: '芜湖市' },
    { value: 'bengbu', label: '蚌埠市' },
    { value: 'huainan', label: '淮南市' },
    { value: 'maanshan', label: '马鞍山市' },
    { value: 'huaibei', label: '淮北市' },
    { value: 'tongling', label: '铜陵市' },
    { value: 'anqing', label: '安庆市' },
    { value: 'huangshan', label: '黄山市' },
    { value: 'chuzhou', label: '滁州市' },
    { value: 'fuyang', label: '阜阳市' },
    { value: 'suzhou', label: '宿州市' },
    { value: 'liuan', label: '六安市' },
    { value: 'bozhou', label: '亳州市' },
    { value: 'chizhou', label: '池州市' },
    { value: 'xuancheng', label: '宣城市' },
  ],
  fujian: [
    { value: 'fuzhou', label: '福州市' },
    { value: 'xiamen', label: '厦门市' },
    { value: 'putian', label: '莆田市' },
    { value: 'sanming', label: '三明市' },
    { value: 'quanzhou', label: '泉州市' },
    { value: 'zhangzhou', label: '漳州市' },
    { value: 'nanping', label: '南平市' },
    { value: 'longyan', label: '龙岩市' },
    { value: 'ningde', label: '宁德市' },
  ],
  jiangxi: [
    { value: 'nanchang', label: '南昌市' },
    { value: 'jingdezhen', label: '景德镇市' },
    { value: 'pingxiang', label: '萍乡市' },
    { value: 'jiujiang', label: '九江市' },
    { value: 'xinyu', label: '新余市' },
    { value: 'yingtan', label: '鹰潭市' },
    { value: 'ganzhou', label: '赣州市' },
    { value: 'jian', label: '吉安市' },
    { value: 'yichun', label: '宜春市' },
    { value: 'fuzhou_jx', label: '抚州市' },
    { value: 'shangrao', label: '上饶市' },
  ],
  shandong: [
    { value: 'jinan', label: '济南市' },
    { value: 'qingdao', label: '青岛市' },
    { value: 'zibo', label: '淄博市' },
    { value: 'zaozhuang', label: '枣庄市' },
    { value: 'dongying', label: '东营市' },
    { value: 'yantai', label: '烟台市' },
    { value: 'weifang', label: '潍坊市' },
    { value: 'jining', label: '济宁市' },
    { value: 'taian', label: '泰安市' },
    { value: 'weihai', label: '威海市' },
    { value: 'rizhao', label: '日照市' },
    { value: 'laiwu', label: '莱芜市' },
    { value: 'linyi', label: '临沂市' },
    { value: 'dezhou', label: '德州市' },
    { value: 'liaocheng', label: '聊城市' },
    { value: 'binzhou', label: '滨州市' },
    { value: 'heze', label: '菏泽市' },
  ],
  henan: [
    { value: 'zhengzhou', label: '郑州市' },
    { value: 'kaifeng', label: '开封市' },
    { value: 'luoyang', label: '洛阳市' },
    { value: 'pingdingshan', label: '平顶山市' },
    { value: 'anyang', label: '安阳市' },
    { value: 'hebi', label: '鹤壁市' },
    { value: 'xinxiang', label: '新乡市' },
    { value: 'jiaozuo', label: '焦作市' },
    { value: 'puyang', label: '濮阳市' },
    { value: 'xuchang', label: '许昌市' },
    { value: 'luohe', label: '漯河市' },
    { value: 'sanmenxia', label: '三门峡市' },
    { value: 'nanyang', label: '南阳市' },
    { value: 'shangqiu', label: '商丘市' },
    { value: 'xinyang', label: '信阳市' },
    { value: 'zhoukou', label: '周口市' },
    { value: 'zhumadian', label: '驻马店市' },
    { value: 'jiyuan', label: '济源市' },
  ],
  hubei: [
    { value: 'wuhan', label: '武汉市' },
    { value: 'huangshi', label: '黄石市' },
    { value: 'shiyan', label: '十堰市' },
    { value: 'yichang', label: '宜昌市' },
    { value: 'xiangyang', label: '襄阳市' },
    { value: 'ezhou', label: '鄂州市' },
    { value: 'jinmen', label: '荆门市' },
    { value: 'xiaogan', label: '孝感市' },
    { value: 'jingzhou', label: '荆州市' },
    { value: 'huanggang', label: '黄冈市' },
    { value: 'xianning', label: '咸宁市' },
    { value: 'suizhou', label: '随州市' },
    { value: 'enshi', label: '恩施土家族苗族自治州' },
    { value: 'shennongjia', label: '神农架林区' },
  ],
  hunan: [
    { value: 'changsha', label: '长沙市' },
    { value: 'zhuzhou', label: '株洲市' },
    { value: 'xiangtan', label: '湘潭市' },
    { value: 'hengyang', label: '衡阳市' },
    { value: 'yueyang', label: '岳阳市' },
    { value: 'changde', label: '常德市' },
    { value: 'zhangjiajie', label: '张家界市' },
    { value: 'yiyang', label: '益阳市' },
    { value: 'chenzhou', label: '郴州市' },
    { value: 'yongzhou', label: '永州市' },
    { value: 'huaihua', label: '怀化市' },
    { value: 'loudi', label: '娄底市' },
    { value: 'xiangxi', label: '湘西土家族苗族自治州' },
  ],
  guangdong: [
    { value: 'guangzhou', label: '广州市' },
    { value: 'shaoguan', label: '韶关市' },
    { value: 'shenzhen', label: '深圳市' },
    { value: 'zhuhai', label: '珠海市' },
    { value: 'shantou', label: '汕头市' },
    { value: 'foshan', label: '佛山市' },
    { value: 'jiangmen', label: '江门市' },
    { value: 'zhanjiang', label: '湛江市' },
    { value: 'maoming', label: '茂名市' },
    { value: 'zhaoqing', label: '肇庆市' },
    { value: 'huizhou', label: '惠州市' },
    { value: 'meizhou', label: '梅州市' },
    { value: 'shanwei', label: '汕尾市' },
    { value: 'heyuan', label: '河源市' },
    { value: 'yangjiang', label: '阳江市' },
    { value: 'qingyuan', label: '清远市' },
    { value: 'dongguan', label: '东莞市' },
    { value: 'zhongshan', label: '中山市' },
    { value: 'chaozhou', label: '潮州市' },
    { value: 'jieyang', label: '揭阳市' },
    { value: 'yunfu', label: '云浮市' },
  ],
  guangxi: [
    { value: 'nanning', label: '南宁市' },
    { value: 'liuzhou', label: '柳州市' },
    { value: 'guilin', label: '桂林市' },
    { value: 'wuzhou', label: '梧州市' },
    { value: 'beihai', label: '北海市' },
    { value: 'fangchenggang', label: '防城港市' },
    { value: 'qinzhou', label: '钦州市' },
    { value: 'guigang', label: '贵港市' },
    { value: 'yulin', label: '玉林市' },
    { value: 'baise', label: '百色市' },
    { value: 'hezhou', label: '贺州市' },
    { value: 'hechi', label: '河池市' },
    { value: 'laibin', label: '来宾市' },
    { value: 'chongzuo', label: '崇左市' },
  ],
  hainan: [
    { value: 'haikou', label: '海口市' },
    { value: 'sanya', label: '三亚市' },
    { value: 'sansha', label: '三沙市' },
    { value: 'danzhou', label: '儋州市' },
  ],
  chongqing: [{ value: 'chongqing', label: '重庆市' }],
  sichuan: [
    { value: 'chengdu', label: '成都市' },
    { value: 'zigong', label: '自贡市' },
    { value: 'panzhihua', label: '攀枝花市' },
    { value: 'luzhou', label: '泸州市' },
    { value: 'deyang', label: '德阳市' },
    { value: 'mianyang', label: '绵阳市' },
    { value: 'guangyuan', label: '广元市' },
    { value: 'suining', label: '遂宁市' },
    { value: 'neijiang', label: '内江市' },
    { value: 'leshan', label: '乐山市' },
    { value: 'nanchong', label: '南充市' },
    { value: 'meishan', label: '眉山市' },
    { value: 'yibin', label: '宜宾市' },
    { value: 'guangan', label: '广安市' },
    { value: 'dazhou', label: '达州市' },
    { value: 'yaan', label: '雅安市' },
    { value: 'bazhong', label: '巴中市' },
    { value: 'ziyang', label: '资阳市' },
    { value: 'aba', label: '阿坝藏族羌族自治州' },
    { value: 'ganzi', label: '甘孜藏族自治州' },
    { value: 'liangshan', label: '凉山彝族自治州' },
  ],
  guizhou: [
    { value: 'guiyang', label: '贵阳市' },
    { value: 'liupanshui', label: '六盘水市' },
    { value: 'zunyi', label: '遵义市' },
    { value: 'anshun', label: '安顺市' },
    { value: 'bijie', label: '毕节市' },
    { value: 'tongren', label: '铜仁市' },
    { value: 'qianxinan', label: '黔西南布依族苗族自治州' },
    { value: 'qiandongnan', label: '黔东南苗族侗族自治州' },
    { value: 'qiannan', label: '黔南布依族苗族自治州' },
  ],
  yunnan: [
    { value: 'kunming', label: '昆明市' },
    { value: 'qujing', label: '曲靖市' },
    { value: 'yuxi', label: '玉溪市' },
    { value: 'baoshan', label: '保山市' },
    { value: 'zhaotong', label: '昭通市' },
    { value: 'lishui', label: '丽江市' },
    { value: "pu'er", label: '普洱市' },
    { value: 'lincang', label: '临沧市' },
    { value: 'chuxiong', label: '楚雄彝族自治州' },
    { value: 'honghe', label: '红河哈尼族彝族自治州' },
    { value: 'wenshan', label: '文山壮族苗族自治州' },
    { value: 'xishuangbanna', label: '西双版纳傣族自治州' },
    { value: 'dali', label: '大理白族自治州' },
    { value: 'dehong', label: '德宏傣族景颇族自治州' },
    { value: 'nujiang', label: '怒江傈僳族自治州' },
    { value: 'diqing', label: '迪庆藏族自治州' },
  ],
  xizang: [
    { value: 'lasa', label: '拉萨市' },
    { value: 'shigatse', label: '日喀则市' },
    { value: 'qamdo', label: '昌都市' },
    { value: 'nyingchi', label: '林芝市' },
    { value: 'shannan', label: '山南市' },
    { value: 'naqu', label: '那曲市' },
    { value: 'ali', label: '阿里地区' },
  ],
  shaanxi: [
    { value: 'xian', label: '西安市' },
    { value: 'tongchuan', label: '铜川市' },
    { value: 'baoji', label: '宝鸡市' },
    { value: 'xianyang', label: '咸阳市' },
    { value: 'weinan', label: '渭南市' },
    { value: 'yanan', label: '延安市' },
    { value: 'hanzhong', label: '汉中市' },
    { value: 'yulin', label: '榆林市' },
    { value: 'ankang', label: '安康市' },
    { value: 'shangluo', label: '商洛市' },
  ],
  gansu: [
    { value: 'lanzhou', label: '兰州市' },
    { value: 'jiayuguan', label: '嘉峪关市' },
    { value: 'jinchang', label: '金昌市' },
    { value: 'baiyin', label: '白银市' },
    { value: 'tianshui', label: '天水市' },
    { value: 'wuwei', label: '武威市' },
    { value: 'zhangye', label: '张掖市' },
    { value: 'pingliang',label: '平凉市' },
    { value: 'jiuquan', label: '酒泉市' },
    { value: 'qingyang', label: '庆阳市' },
    { value: 'dingxi', label: '定西市' },
    { value: 'longnan', label: '陇南市' },
    { value: 'linxia', label: '临夏回族自治州' },
    { value: 'gannan', label: '甘南藏族自治州' },
  ],
  qinghai: [
    { value: 'xining', label: '西宁市' },
    { value: 'haidong', label: '海东市' },
    { value: 'haibei', label: '海北藏族自治州' },
    { value: 'huangnan', label: '黄南藏族自治州' },
    { value: 'hainan', label: '海南藏族自治州' },
    { value: 'guoluo', label: '果洛藏族自治州' },
    { value: 'yushu', label: '玉树藏族自治州' },
    { value: 'haixi', label: '海西蒙古族藏族自治州' },
  ],
  ningxia: [
    { value: 'yinchuan', label: '银川市' },
    { value: 'shizuishan', label: '石嘴山市' },
    { value: 'wuzhong', label: '吴忠市' },
    { value: 'guyuan', label: '固原市' },
    { value: 'zhongwei', label: '中卫市' },
  ],
  xinjiang: [
    { value: 'wulumuqi', label: '乌鲁木齐市' },
    { value: 'kelamayi', label: '克拉玛依市' },
    { value: 'tianshan', label: '吐鲁番市' },
    { value: 'hami', label: '哈密市' },
    { value: 'changji', label: '昌吉回族自治州' },
    { value: 'boertala', label: '博尔塔拉蒙古自治州' },
    { value: 'bayinguolin', label: '巴音郭楞蒙古自治州' },
    { value: 'ks', label: '阿克苏地区' },
    { value: 'kizilsu', label: '克孜勒苏柯尔克孜自治州' },
    { value: 'hetian', label: '和田地区' },
    { value: 'yili', label: '伊犁哈萨克自治州' },
    { value: 'tacheng', label: '塔城地区' },
    { value: 'altay', label: '阿勒泰地区' },
  ],
  xianggang: [{ value: 'xianggang', label: '香港特别行政区' }],
  aomen: [{ value: 'aomen', label: '澳门特别行政区' }],
  taiwan: [
    { value: 'taipei', label: '台北市' },
    { value: 'kaohsiung', label: '高雄市' },
    { value: 'taichung', label: '台中市' },
    { value: 'tainan', label: '台南市' },
  ],
};

// 地区选项（申请地区用）
const regionOptions = [
  { value: 'shengen', label: '申根国家' },
  { value: 'oceania', label: '大洋洲' },
  { value: 'north_america', label: '北美' },
  { value: 'europe_non_shengen', label: '欧洲（非申根）' },
  { value: 'asia', label: '亚洲' },
];

// 出发地区选项（航班用，包含中国）
const departureRegionOptions = [
  { value: 'china', label: '中国' },
  { value: 'shengen', label: '申根国家' },
  { value: 'oceania', label: '大洋洲' },
  { value: 'north_america', label: '北美' },
  { value: 'europe_non_shengen', label: '欧洲（非申根）' },
  { value: 'asia', label: '亚洲' },
];

// 全部国家选项（按地区）
const countryOptionsByRegion: Record<string, { value: string; label: string }[]> = {
  shengen: [
    { value: 'france', label: '法国' },
    { value: 'germany', label: '德国' },
    { value: 'italy', label: '意大利' },
    { value: 'spain', label: '西班牙' },
    { value: 'denmark', label: '丹麦' },
    { value: 'netherlands', label: '荷兰' },
    { value: 'switzerland', label: '瑞士' },
    { value: 'iceland', label: '冰岛' },
    { value: 'hungary', label: '匈牙利' },
    { value: 'greece', label: '希腊' },
    { value: 'sweden', label: '瑞典' },
    { value: 'czech', label: '捷克' },
    { value: 'austria', label: '奥地利' },
    { value: 'belgium', label: '比利时' },
    { value: 'bulgaria', label: '保加利亚' },
    { value: 'croatia', label: '克罗地亚' },
    { value: 'estonia', label: '爱沙尼亚' },
    { value: 'finland', label: '芬兰' },
    { value: 'latvia', label: '拉脱维亚' },
    { value: 'liechtenstein', label: '列支敦士登' },
    { value: 'lithuania', label: '立陶宛' },
    { value: 'luxembourg', label: '卢森堡' },
    { value: 'malta', label: '马耳他' },
    { value: 'norway', label: '挪威' },
    { value: 'poland', label: '波兰' },
    { value: 'portugal', label: '葡萄牙' },
    { value: 'romania', label: '罗马尼亚' },
    { value: 'slovakia', label: '斯洛伐克' },
    { value: 'slovenia', label: '斯洛文尼亚' },
  ],
  oceania: [
    { value: 'australia', label: '澳大利亚' },
    { value: 'new_zealand', label: '新西兰' },
  ],
  north_america: [
    { value: 'usa', label: '美国' },
    { value: 'canada', label: '加拿大' },
  ],
  europe_non_shengen: [
    { value: 'uk', label: '英国' },
    { value: 'ireland', label: '爱尔兰' },
  ],
  asia: [
    { value: 'japan', label: '日本' },
    { value: 'korea', label: '韩国' },
    { value: 'thailand', label: '泰国' },
    { value: 'singapore', label: '新加坡' },
    { value: 'malaysia', label: '马来西亚' },
    { value: 'vietnam', label: '越南' },
  ],
};

// 城市选项（按国家）
const cityOptionsByCountry: Record<string, { value: string; label: string }[]> = {
  // 申根国家
  france: [
    { value: 'paris', label: '巴黎' },
    { value: 'lyon', label: '里昂' },
    { value: 'nice', label: '尼斯' },
    { value: 'marseille', label: '马赛' },
    { value: 'bordeaux', label: '波尔多' },
  ],
  germany: [
    { value: 'berlin', label: '柏林' },
    { value: 'munich', label: '慕尼黑' },
    { value: 'frankfurt', label: '法兰克福' },
    { value: 'hamburg', label: '汉堡' },
    { value: 'cologne', label: '科隆' },
  ],
  italy: [
    { value: 'rome', label: '罗马' },
    { value: 'milan', label: '米兰' },
    { value: 'venice', label: '威尼斯' },
    { value: 'florence', label: '佛罗伦萨' },
    { value: 'naples', label: '那不勒斯' },
  ],
  spain: [
    { value: 'madrid', label: '马德里' },
    { value: 'barcelona', label: '巴塞罗那' },
    { value: 'seville', label: '塞维利亚' },
    { value: 'valencia', label: '瓦伦西亚' },
    { value: 'malaga', label: '马拉加' },
  ],
  denmark: [{ value: 'copenhagen', label: '哥本哈根' }],
  netherlands: [{ value: 'amsterdam', label: '阿姆斯特丹' }],
  switzerland: [{ value: 'zurich', label: '苏黎世' }],
  iceland: [{ value: 'reykjavik', label: '雷克雅未克' }],
  hungary: [{ value: 'budapest', label: '布达佩斯' }],
  greece: [{ value: 'athens', label: '雅典' }],
  sweden: [{ value: 'stockholm', label: '斯德哥尔摩' }],
  czech: [{ value: 'prague', label: '布拉格' }],
  austria: [{ value: 'vienna', label: '维也纳' }],
  // 其他申根国家默认
  belgium: [{ value: 'brussels', label: '布鲁塞尔' }],
  bulgaria: [{ value: 'sofia', label: '索非亚' }],
  croatia: [{ value: 'zagreb', label: '萨格勒布' }],
  estonia: [{ value: 'tallinn', label: '塔林' }],
  finland: [{ value: 'helsinki', label: '赫尔辛基' }],
  latvia: [{ value: 'riga', label: '里加' }],
  liechtenstein: [{ value: 'vaduz', label: '瓦杜兹' }],
  lithuania: [{ value: 'vilnius', label: '维尔纽斯' }],
  luxembourg: [{ value: 'luxembourg_city', label: '卢森堡市' }],
  malta: [{ value: 'valletta', label: '瓦莱塔' }],
  norway: [{ value: 'oslo', label: '奥斯陆' }],
  poland: [{ value: 'warsaw', label: '华沙' }],
  portugal: [{ value: 'lisbon', label: '里斯本' }],
  romania: [{ value: 'bucharest', label: '布加勒斯特' }],
  slovakia: [{ value: 'bratislava', label: '布拉迪斯拉发' }],
  slovenia: [{ value: 'ljubljana', label: '卢布尔雅那' }],
  // 非申根欧洲
  uk: [{ value: 'london', label: '伦敦' }],
  ireland: [{ value: 'dublin', label: '都柏林' }],
  // 大洋洲
  australia: [{ value: 'sydney', label: '悉尼' }],
  new_zealand: [{ value: 'auckland', label: '奥克兰' }],
  // 北美
  usa: [{ value: 'new_york', label: '纽约' }],
  canada: [{ value: 'toronto', label: '多伦多' }],
  // 亚洲
  japan: [{ value: 'tokyo', label: '东京' }],
  korea: [{ value: 'seoul', label: '首尔' }],
  thailand: [{ value: 'bangkok', label: '曼谷' }],
  singapore: [{ value: 'singapore', label: '新加坡' }],
  malaysia: [{ value: 'kuala_lumpur', label: '吉隆坡' }],
  vietnam: [{ value: 'hanoi', label: '河内' }],
};

// 获取今天的日期字符串（YYYY-MM-DD）
const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ===== 加载状态文案 =====
const loadingMessages = [
  '正在深度解析您的行程信息...',
  '正在智能匹配最优路线...',
  '正在优化城市间动线...',
  '正在生成住宿建议...',
  '即将完成行程单生成...',
];

// ===== 组件：多文件上传区域 =====
function MultiFileUploadZone({
  label,
  placeholder,
  hint,
  files,
  onFilesChange,
}: {
  label: string;
  placeholder: string;
  hint: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const maxFiles = 5;

  const handleClick = () => {
    if (files.length < maxFiles) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const combined = [...files, ...newFiles].slice(0, maxFiles);
    onFilesChange(combined);
    // 清空input以允许重复选择相同文件
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-morandi-deep mb-2">
        {label}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 ${
          files.length > 0
            ? 'border-morandi-ocean bg-morandi-ocean/5'
            : 'border-morandi-mist/30 hover:border-morandi-ocean/50 hover:bg-morandi-cream/30'
        }`}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          multiple
          onChange={handleFileChange}
        />
        
        {/* 已上传文件列表 */}
        {files.length > 0 && (
          <div className="mb-3 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white/50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <svg className="w-4 h-4 text-morandi-ocean flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-morandi-deep truncate">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRemove(index, e)}
                  className="p-1 rounded hover:bg-red-50 text-morandi-mist hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* 上传提示 */}
        {files.length < maxFiles && (
          <>
            <div className="w-10 h-10 rounded-xl bg-morandi-mist/10 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-morandi-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-xs text-morandi-deep font-medium">{placeholder}</p>
            <p className="text-xs text-morandi-mist mt-1">{hint} ({files.length}/{maxFiles})</p>
          </>
        )}
      </div>
    </div>
  );
}

// ===== 组件：带省份联动的地区城市选择 =====
function RegionProvinceCitySelect({
  label,
  regionValue,
  provinceValue,
  cityValue,
  onRegionChange,
  onProvinceChange,
  onCityChange,
  required = false,
}: {
  label: string;
  regionValue: string;
  provinceValue: string;
  cityValue: string;
  onRegionChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onCityChange: (value: string) => void;
  required?: boolean;
}) {
  const isChina = regionValue === 'china';
  const provinceCities = provinceValue ? (chinaCitiesByProvince[provinceValue] || []) : [];

  // 获取可选的城市列表
  const getCityOptions = () => {
    if (isChina) {
      return provinceCities;
    }
    return regionValue ? (cityOptionsByCountry[regionValue] || []) : [];
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-morandi-deep mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={`grid gap-2 ${isChina ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {/* 地区选择 */}
        <Select
          value={regionValue}
          options={departureRegionOptions}
          onChange={(v) => {
            onRegionChange(v);
            onProvinceChange('');
            onCityChange('');
          }}
          placeholder="地区"
        />
        
        {/* 中国：省份选择 */}
        {isChina && (
          <Select
            value={provinceValue}
            options={chinaProvinces}
            onChange={(v) => {
              onProvinceChange(v);
              onCityChange('');
            }}
            placeholder="省份"
            disabled={!regionValue}
          />
        )}
        
        {/* 城市选择 */}
        <Select
          value={cityValue}
          options={getCityOptions()}
          onChange={(v) => onCityChange(v)}
          placeholder={isChina ? (provinceValue ? '城市' : '请先选省份') : '城市'}
          disabled={isChina ? !provinceValue : !regionValue}
        />
      </div>
    </div>
  );
}


// ===== 组件：国家联动城市选择 =====
function CountryCitySelect({
  label,
  countryValue,
  cityValue,
  onCountryChange,
  onCityChange,
  required = false,
}: {
  label: string;
  countryValue: string;
  cityValue: string;
  countryOptions: { value: string; label: string }[];
  onCountryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  required?: boolean;
}) {
  const availableCities = countryValue ? (cityOptionsByCountry[countryValue] || []) : [];

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-morandi-deep mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Select
        value={cityValue}
        options={availableCities}
        onChange={(v) => onCityChange(v)}
        placeholder={countryValue ? '选择城市' : '请先选择国家'}
        disabled={!countryValue}
      />
    </div>
  );
}

// ===== 组件：航班信息输入行（完全重写版）=====
function FlightInputRow({
  flight,
  onChange,
  onDelete,
  canDelete,
}: {
  flight: FlightInfo;
  onChange: (flight: FlightInfo) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const today = getTodayString();
  
  // 判断是否为China
  const isDepartureChina = flight.departureRegion === 'china';
  const isArrivalChina = flight.arrivalRegion === 'china';
  
  // 获取国家选项（按地区）
  const getDepartureCountryOptions = () => {
    if (isDepartureChina) return [];
    return flight.departureRegion ? (countryOptionsByRegion[flight.departureRegion] || []) : [];
  };
  
  const getArrivalCountryOptions = () => {
    if (isArrivalChina) return [];
    return flight.arrivalRegion ? (countryOptionsByRegion[flight.arrivalRegion] || []) : [];
  };
  
  // 获取城市选项
  const getDepartureCityOptions = () => {
    if (isDepartureChina) {
      return flight.departureProvince ? (chinaCitiesByProvince[flight.departureProvince] || []) : [];
    }
    // 非中国：根据国家获取城市
    return flight.departureCountry ? (cityOptionsByCountry[flight.departureCountry] || []) : [];
  };
  
  const getArrivalCityOptions = () => {
    if (isArrivalChina) {
      return flight.arrivalProvince ? (chinaCitiesByProvince[flight.arrivalProvince] || []) : [];
    }
    // 非中国：根据国家获取城市
    return flight.arrivalCountry ? (cityOptionsByCountry[flight.arrivalCountry] || []) : [];
  };

  // 出发地区变化
  const handleDepartureRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value;
    onChange({
      ...flight,
      departureRegion: newRegion,
      departureCountry: '',
      departureProvince: '',
      departureCity: ''
    });
  };
  
  // 出发国家变化
  const handleDepartureCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...flight,
      departureCountry: e.target.value,
      departureCity: ''
    });
  };
  
  // 出发省份变化
  const handleDepartureProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...flight,
      departureProvince: e.target.value,
      departureCity: ''
    });
  };
  
  // 出发城市变化
  const handleDepartureCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...flight,
      departureCity: e.target.value
    });
  };
  
  // 抵达地区变化
  const handleArrivalRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value;
    onChange({
      ...flight,
      arrivalRegion: newRegion,
      arrivalCountry: '',
      arrivalProvince: '',
      arrivalCity: ''
    });
  };
  
  // 抵达国家变化
  const handleArrivalCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...flight,
      arrivalCountry: e.target.value,
      arrivalCity: ''
    });
  };
  
  // 抵达省份变化
  const handleArrivalProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...flight,
      arrivalProvince: e.target.value,
      arrivalCity: ''
    });
  };
  
  // 抵达城市变化
  const handleArrivalCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...flight,
      arrivalCity: e.target.value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-morandi-cream/30 rounded-2xl p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-morandi-ocean/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-morandi-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <span className="text-sm font-medium text-morandi-deep">航班信息</span>
        </div>
        {canDelete && (
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-red-50 text-morandi-mist hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      
      {/* 航班号 */}
      <div className="mb-4">
        <Input
          label="航班号"
          placeholder="如：CA833"
          value={flight.flightNumber}
          onChange={(e) => onChange({ ...flight, flightNumber: e.target.value })}
        />
      </div>
      
      {/* 出发城市 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-morandi-blush/50 flex items-center justify-center">
            <svg className="w-4 h-4 text-morandi-clay" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-morandi-deep">出发</span>
        </div>
        <div className="grid grid-cols-4 gap-3 items-start">
          {/* 地区选择 */}
          <div>
            <select
              value={flight.departureRegion}
              onChange={handleDepartureRegionChange}
              className="w-full px-3 py-2.5 rounded-xl border border-morandi-mist/30 bg-white appearance-none cursor-pointer focus:outline-none focus:border-morandi-ocean text-sm"
            >
              <option value="">地区</option>
              {departureRegionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {/* 省份选择（仅中国显示） */}
          {isDepartureChina && (
            <div>
              <select
                value={flight.departureProvince}
                onChange={handleDepartureProvinceChange}
                disabled={!flight.departureRegion}
                className="w-full px-3 py-2.5 rounded-xl border border-morandi-mist/30 bg-white appearance-none cursor-pointer focus:outline-none focus:border-morandi-ocean text-sm disabled:opacity-50"
              >
                <option value="">省份</option>
                {chinaProvinces.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
          {/* 国家选择（非中国显示） */}
          {!isDepartureChina && (
            <div>
              <select
                value={flight.departureCountry}
                onChange={handleDepartureCountryChange}
                disabled={!flight.departureRegion}
                className="w-full px-3 py-2.5 rounded-xl border border-morandi-mist/30 bg-white appearance-none cursor-pointer focus:outline-none focus:border-morandi-ocean text-sm disabled:opacity-50"
              >
                <option value="">国家</option>
                {getDepartureCountryOptions().map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
          {/* 城市选择 */}
          <div>
            <select
              value={flight.departureCity}
              onChange={handleDepartureCityChange}
              disabled={isDepartureChina ? !flight.departureProvince : !flight.departureCountry}
              className="w-full px-3 py-2.5 rounded-xl border border-morandi-mist/30 bg-white appearance-none cursor-pointer focus:outline-none focus:border-morandi-ocean text-sm disabled:opacity-50"
            >
              <option value="">
                {isDepartureChina 
                  ? (flight.departureProvince ? '城市' : '请选省份')
                  : (flight.departureCountry ? '城市' : '请选国家')}
              </option>
              {getDepartureCityOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {/* 时间选择 */}
          <div className="col-span-4 md:col-span-1">
            <input
              type="datetime-local"
              value={flight.departureTime}
              min={today + 'T00:00'}
              onChange={(e) => onChange({ ...flight, departureTime: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-morandi-mist/30 bg-white text-sm focus:outline-none focus:border-morandi-ocean focus:ring-2 focus:ring-morandi-ocean/20 transition-all duration-200 hover:border-morandi-ocean/50"
              placeholder="出发时间"
            />
          </div>
        </div>
      </div>
      
      {/* 抵达城市 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-morandi-blush/50 flex items-center justify-center">
            <svg className="w-4 h-4 text-morandi-clay" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-morandi-deep">抵达</span>
        </div>
        {/* 4列布局：地区 / 省份或国家 / 城市 / 时间 */}
        <div className="grid grid-cols-4 gap-3 items-start">
          {/* 地区选择 */}
          <div>
            <select
              value={flight.arrivalRegion}
              onChange={handleArrivalRegionChange}
              className="w-full px-3 py-2.5 rounded-xl border border-morandi-mist/30 bg-white appearance-none cursor-pointer focus:outline-none focus:border-morandi-ocean text-sm"
            >
              <option value="">地区</option>
              {departureRegionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {/* 省份选择（仅中国显示） */}
          {isArrivalChina && (
            <div>
              <select
                value={flight.arrivalProvince}
                onChange={handleArrivalProvinceChange}
                disabled={!flight.arrivalRegion}
                className="w-full px-3 py-2.5 rounded-xl border border-morandi-mist/30 bg-white appearance-none cursor-pointer focus:outline-none focus:border-morandi-ocean text-sm disabled:opacity-50"
              >
                <option value="">省份</option>
                {chinaProvinces.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
          {/* 国家选择（非中国显示） */}
          {!isArrivalChina && (
            <div>
              <select
                value={flight.arrivalCountry}
                onChange={handleArrivalCountryChange}
                disabled={!flight.arrivalRegion}
                className="w-full px-3 py-2.5 rounded-xl border border-morandi-mist/30 bg-white appearance-none cursor-pointer focus:outline-none focus:border-morandi-ocean text-sm disabled:opacity-50"
              >
                <option value="">国家</option>
                {getArrivalCountryOptions().map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
          {/* 城市选择 */}
          <div>
            <select
              value={flight.arrivalCity}
              onChange={handleArrivalCityChange}
              disabled={isArrivalChina ? !flight.arrivalProvince : !flight.arrivalCountry}
              className="w-full px-3 py-2.5 rounded-xl border border-morandi-mist/30 bg-white appearance-none cursor-pointer focus:outline-none focus:border-morandi-ocean text-sm disabled:opacity-50"
            >
              <option value="">
                {isArrivalChina 
                  ? (flight.arrivalProvince ? '城市' : '请选省份')
                  : (flight.arrivalCountry ? '城市' : '请选国家')}
              </option>
              {getArrivalCityOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
</select>
          </div>
          {/* 时间选择 */}
          <div className="col-span-4 md:col-span-1">
            <input
              type="datetime-local"
              value={flight.arrivalTime}
              min={flight.departureTime || today + 'T00:00'}
              onChange={(e) => onChange({ ...flight, arrivalTime: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-morandi-mist/30 bg-white text-sm focus:outline-none focus:border-morandi-ocean focus:ring-2 focus:ring-morandi-ocean/20 transition-all duration-200 hover:border-morandi-ocean/50"
              placeholder="抵达时间"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===== 组件：城市节点 =====
function CityNodeInput({
  node,
  onChange,
  onDelete,
  countryValue,
}: {
  node: CityNode;
  onChange: (node: CityNode) => void;
  onDelete: () => void;
  countryValue: string;
}) {
  const today = getTodayString();
  
  const getNights = () => {
    if (node.startDate && node.endDate) {
      const start = new Date(node.startDate);
      const end = new Date(node.endDate);
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return nights > 0 ? `${nights}晚` : '0晚';
    }
    return '0晚';
  };

  const availableCities = countryValue ? (cityOptionsByCountry[countryValue] || []) : [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white/50 rounded-xl p-4 mb-3 border border-morandi-mist/10"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-morandi-sand/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-morandi-clay" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-morandi-deep">城市节点</span>
          <span className="px-2 py-0.5 text-xs font-medium bg-morandi-ocean/10 text-morandi-ocean rounded-full">
            {getNights()}
          </span>
        </div>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-red-50 text-morandi-mist hover:text-red-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-morandi-deep mb-2">城市</label>
          <Select
            value={node.city}
            options={availableCities}
            onChange={(v) => onChange({ ...node, city: v })}
            placeholder={countryValue ? '选择城市' : '请先选择国家段'}
            disabled={!countryValue}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="开始日期"
            type="date"
            value={node.startDate}
            min={today}
            onChange={(e) => onChange({ ...node, startDate: e.target.value })}
          />
          <Input
            label="结束日期"
            type="date"
            value={node.endDate}
            min={node.startDate || today}
            onChange={(e) => onChange({ ...node, endDate: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <Input
          label="酒店名称"
          placeholder="请输入酒店名称"
          value={node.hotelName}
          onChange={(e) => onChange({ ...node, hotelName: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input
            label="酒店地址"
            placeholder="请输入酒店地址"
            value={node.hotelAddress}
            onChange={(e) => onChange({ ...node, hotelAddress: e.target.value })}
          />
          <Input
            label="酒店电话"
            placeholder="请输入酒店电话"
            value={node.hotelPhone}
            onChange={(e) => onChange({ ...node, hotelPhone: e.target.value })}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ===== 组件：国家段 =====
function CountrySegmentInput({
  segment,
  onChange,
  onDelete,
  canDelete,
}: {
  segment: CountrySegment;
  onChange: (segment: CountrySegment) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const countries = segment.region ? countryOptionsByRegion[segment.region] || [] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-morandi-light/50 rounded-2xl p-5 mb-4 border border-morandi-mist/20"
    >
      <div className="flex items-center justify-center mb-4 relative">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-morandi-blush/50 flex items-center justify-center">
            <svg className="w-5 h-5 text-morandi-clay" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-base font-semibold text-morandi-deep">国家段行程</span>
        </div>
        {canDelete && (
          <button
            onClick={onDelete}
            className="absolute right-0 p-2 rounded-lg hover:bg-red-50 text-morandi-mist hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="地区"
          value={segment.region}
          options={regionOptions}
          onChange={(v) => onChange({ ...segment, region: v, country: '' })}
          placeholder="选择地区"
        />
        <Select
          label="国家"
          value={segment.country}
          options={countries}
          onChange={(v) => onChange({ ...segment, country: v })}
          placeholder={segment.region ? '选择国家' : '请先选择地区'}
        />
      </div>
      
      {/* 城市节点列表 */}
      <div className="mt-4">
        <span className="text-sm font-medium text-morandi-deep block mb-3">城市节点</span>
        <AnimatePresence>
          {segment.cities.map((city, index) => (
            <CityNodeInput
              key={city.id}
              node={city}
              countryValue={segment.country}
              onChange={(updated) => {
                const newCities = [...segment.cities];
                newCities[index] = updated;
                onChange({ ...segment, cities: newCities });
              }}
              onDelete={() => {
                const newCities = segment.cities.filter((_, i) => i !== index);
                onChange({ ...segment, cities: newCities });
              }}
            />
          ))}
        </AnimatePresence>
        {segment.cities.length === 0 && (
          <div className="text-center py-6 text-morandi-mist text-sm">
            点击下方"添加行程点"开始配置行程
          </div>
        )}
        
        {/* 添加行程点按钮 - 突出显示 */}
        <motion.button
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
          className="group w-full mt-4 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-morandi-cream/50 to-morandi-cream/30 hover:from-morandi-cream/70 hover:to-morandi-cream/60 border border-morandi-mist/40 hover:border-morandi-mist/70 rounded-xl text-morandi-deep font-medium shadow-sm hover:shadow-lg hover:shadow-morandi-sand/20 transition-all duration-200"
          onClick={() => {
            const newCity: CityNode = {
              id: Date.now().toString(),
              city: '',
              startDate: '',
              endDate: '',
              hotelName: '',
              hotelAddress: '',
              hotelPhone: '',
            };
            onChange({ ...segment, cities: [...segment.cities, newCity] });
          }}
        >
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加行程点
        </motion.button>
      </div>
    </motion.div>
  );
}

// ===== 主页面组件 =====
export default function ItineraryPage() {
  // 智能导入区状态
  const [ticketFiles, setTicketFiles] = useState<File[]>([]);
  const [hotelFiles, setHotelFiles] = useState<File[]>([]);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  // 基础信息
  const [applyRegion, setApplyRegion] = useState('');
  const [applyCountry, setApplyCountry] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [exitDate, setExitDate] = useState('');

  // 航班信息
  const [flights, setFlights] = useState<FlightInfo[]>([
    {
      id: '1',
      flightNumber: '',
      departureRegion: '',
      departureCountry: '',
      departureProvince: '',
      departureCity: '',
      departureTime: '',
      arrivalRegion: '',
      arrivalCountry: '',
      arrivalProvince: '',
      arrivalCity: '',
      arrivalTime: '',
    },
    {
      id: '2',
      flightNumber: '',
      departureRegion: '',
      departureCountry: '',
      departureProvince: '',
      departureCity: '',
      departureTime: '',
      arrivalRegion: '',
      arrivalCountry: '',
      arrivalProvince: '',
      arrivalCity: '',
      arrivalTime: '',
    },
  ]);

  // 国家段行程
  const [countrySegments, setCountrySegments] = useState<CountrySegment[]>([
    {
      id: '1',
      region: '',
      country: '',
      cities: [],
    },
  ]);

  // 特殊要求
  const [specialRequirements, setSpecialRequirements] = useState('');

  // 生成状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // 中文行程单状态
  const [isGeneratingCN, setIsGeneratingCN] = useState(false);
  const [showCNResult, setShowCNResult] = useState(false);
  const [showCNError, setShowCNError] = useState(false);
  const [cnErrorMessage, setCnErrorMessage] = useState('');

  // 历史记录弹窗状态
  const [showENHistory, setShowENHistory] = useState(false);
  const [showCNHistory, setShowCNHistory] = useState(false);

  // 模拟历史记录数据
  const [enHistoryList, setEnHistoryList] = useState([
    { id: '1', name: '法国意大利7日游', date: '2026-02-28', status: '已完成' },
    { id: '2', name: '德国深度游', date: '2026-02-25', status: '已完成' },
  ]);

  const [cnHistoryList, setCnHistoryList] = useState([
    { id: '1', name: '法国意大利7日游', date: '2026-02-28', status: '已完成' },
  ]);

  // 中文行程单上传的文件
  const [uploadedCNFile, setUploadedCNFile] = useState<File | null>(null);

  // 删除确认弹窗状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmInfo, setDeleteConfirmInfo] = useState<{
    type: 'enHistory' | 'cnHistory' | 'uploadedFile';
    id?: string;
    fileName?: string;
  } | null>(null);

  // 删除历史记录 - 带确认
  const handleDeleteENHistory = (id: string) => {
    setDeleteConfirmInfo({ type: 'enHistory', id });
    setShowDeleteConfirm(true);
  };

  const handleDeleteCNHistory = (id: string) => {
    setDeleteConfirmInfo({ type: 'cnHistory', id });
    setShowDeleteConfirm(true);
  };

  // 删除上传的文件
  const handleDeleteUploadedFile = () => {
    setDeleteConfirmInfo({ type: 'uploadedFile', fileName: uploadedCNFile?.name });
    setShowDeleteConfirm(true);
  };

  // 确认删除
  const confirmDelete = () => {
    if (!deleteConfirmInfo) return;
    
    if (deleteConfirmInfo.type === 'enHistory' && deleteConfirmInfo.id) {
      setEnHistoryList(enHistoryList.filter(item => item.id !== deleteConfirmInfo.id));
    } else if (deleteConfirmInfo.type === 'cnHistory' && deleteConfirmInfo.id) {
      setCnHistoryList(cnHistoryList.filter(item => item.id !== deleteConfirmInfo.id));
    } else if (deleteConfirmInfo.type === 'uploadedFile') {
      setUploadedCNFile(null);
    }
    
    setShowDeleteConfirm(false);
    setDeleteConfirmInfo(null);
  };

  // 下载历史记录
  const handleDownloadENHistory = (id: string) => {
    console.log('下载英文行程单:', id);
  };

  const handleDownloadCNHistory = (id: string) => {
    console.log('下载中文行程单:', id);
  };

  // 生成按钮验证状态
  const [generateButtonShake, setGenerateButtonShake] = useState(false);
  const [showBasicInfoError, setShowBasicInfoError] = useState(false);

  // 验证状态
  const [basicInfoErrors, setBasicInfoErrors] = useState({
    applyRegion: false,
    applyCountry: false,
    entryDate: false,
    exitDate: false,
  });
  const basicInfoRef = useRef<HTMLDivElement>(null);
  const basicInfoControls = useAnimation();

  // 检查基础信息是否完整
  const isBasicInfoValid = () => {
    return applyRegion && applyCountry && entryDate && exitDate;
  };

  // 触发验证失败动画
  const triggerValidationError = async () => {
    if (!isBasicInfoValid()) {
      setBasicInfoErrors({
        applyRegion: !applyRegion,
        applyCountry: !applyCountry,
        entryDate: !entryDate,
        exitDate: !exitDate,
      });
      await basicInfoControls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
      });
    } else {
      setBasicInfoErrors({
        applyRegion: false,
        applyCountry: false,
        entryDate: false,
        exitDate: false,
      });
    }
  };

  // 清除验证错误
  const clearValidationError = (field: keyof typeof basicInfoErrors) => {
    setBasicInfoErrors(prev => ({ ...prev, [field]: false }));
  };

  const today = getTodayString();

  // 处理提取
  const handleExtract = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      // 模拟填充数据
      setApplyRegion('shengen');
      setApplyCountry('france');
      setEntryDate('2026-03-15');
      setExitDate('2026-03-22');
    }, 2000);
  };

  // 处理生成
  const handleGenerate = () => {
    // 验证基础信息
    if (!isBasicInfoValid()) {
      // 设置错误状态
      setBasicInfoErrors({
        applyRegion: !applyRegion,
        applyCountry: !applyCountry,
        entryDate: !entryDate,
        exitDate: !exitDate,
      });
      setShowBasicInfoError(true);
      // 按钮抖动动画
      setGenerateButtonShake(true);
      setTimeout(() => setGenerateButtonShake(false), 500);
      // 滚动到基础信息区域
      setTimeout(() => {
        document.getElementById('basic-info-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    
    // 清除错误状态
    setBasicInfoErrors({
      applyRegion: false,
      applyCountry: false,
      entryDate: false,
      exitDate: false,
    });
    setShowBasicInfoError(false);
    
    setIsGenerating(true);
    let messageIndex = 0;
    
    // 重置中文行程单区域状态
    setShowCNResult(false);
    
    const interval = setInterval(() => {
      setCurrentLoadingMessage(messageIndex);
      messageIndex++;
      if (messageIndex >= loadingMessages.length) {
        clearInterval(interval);
        setIsGenerating(false);
        setShowPreview(true);
        setTimeout(() => {
          document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }, 800);
  };

  // 生成中文行程单
  const handleGenerateCN = () => {
    // 判断状态
    const hasGeneratedEnglish = showPreview; // 英文行程单已生成
    const hasUploadedFile = uploadedCNFile !== null; // 上传了文件
    
    // 场景1: 既没有生成英文行程单，也没有上传文件
    if (!hasGeneratedEnglish && !hasUploadedFile) {
      setCnErrorMessage('请先生成英文行程单或上传行程单文件');
      setShowCNError(true);
      setTimeout(() => setShowCNError(false), 3000);
      return;
    }
    
    // 场景2/3/4: 有英文行程单或有上传文件（或两者都有）
    // 优先使用上传的文件
    const sourceType = hasUploadedFile ? '上传的文件' : '英文行程单';
    console.log(`根据${sourceType}生成中文行程单`);
    
    setIsGeneratingCN(true);
    setTimeout(() => {
      setIsGeneratingCN(false);
      setShowCNResult(true);
    }, 2500);
  };

  const countries = applyRegion ? countryOptionsByRegion[applyRegion] || [] : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Page Header - 增加顶部间距避免被导航栏遮挡 */}
      <section className="relative pt-28 pb-12 px-6 bg-gradient-to-br from-morandi-light via-morandi-cream to-morandi-blush overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-morandi-ocean opacity-15 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-80 h-80 bg-morandi-blush opacity-20 rounded-full blur-3xl"
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.gentle }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-morandi-deep mb-4">
              行程规划
            </h1>
            <p className="text-lg text-morandi-mist max-w-2xl mx-auto">
              输入您的旅行信息，AI 智能生成专属行程单
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* 1. 智能导入区 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.medium }}
          >
            <Card variant="glass" padding="lg">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-morandi-ocean/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-morandi-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-morandi-deep">智能导入</h2>
                </div>
                <p className="text-sm text-morandi-mist">上传文件，AI 自动解析行程信息</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <MultiFileUploadZone
                  label="机票单"
                  placeholder="点击上传机票"
                  hint="自动解析往返细节"
                  files={ticketFiles}
                  onFilesChange={setTicketFiles}
                />
                <MultiFileUploadZone
                  label="酒店单"
                  placeholder="点击上传酒店订单"
                  hint="自动同步城市、酒店及电话"
                  files={hotelFiles}
                  onFilesChange={setHotelFiles}
                />
                <MultiFileUploadZone
                  label="参考资料"
                  placeholder="点击上传参考资料"
                  hint="闭馆日、景点清单等（选填）"
                  files={referenceFiles}
                  onFilesChange={setReferenceFiles}
                />
              </div>
              
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full max-w-md"
                  onClick={handleExtract}
                  disabled={isExtracting || (ticketFiles.length === 0 && hotelFiles.length === 0)}
                >
                  {isExtracting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      AI 正在提取并导入...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      一键提取并导入详细行程
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* 2. 基础信息配置区 */}
          <motion.div
            id="basic-info-section"
            ref={basicInfoRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.medium, delay: 0.1 }}
          >
            <Card variant="glass" padding="lg" className="bg-white/80">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-morandi-sand/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-morandi-clay" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-morandi-deep">基础信息</h2>
                </div>
                <p className="text-sm text-morandi-mist">填写签证申请相关基本信息</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 申请地区 - 使用原生select */}
                <div className={basicInfoErrors.applyRegion ? 'animate-pulse' : ''}>
                  <label className="block text-sm font-medium text-morandi-deep mb-2">
                    申请地区<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={applyRegion}
                    onChange={(e) => {
                      setApplyRegion(e.target.value);
                      setApplyCountry('');
                      clearValidationError('applyRegion');
                    }}
                    className="w-full px-4 py-3 rounded-2xl border border-morandi-mist/30 bg-white appearance-none cursor-pointer focus:outline-none focus:border-morandi-ocean focus:ring-2 focus:ring-morandi-ocean/20 transition-all duration-200 hover:border-morandi-ocean/50"
                  >
                    <option value="">选择申请地区</option>
                    {regionOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {basicInfoErrors.applyRegion && <p className="text-red-500 text-xs mt-1">请选择申请地区</p>}
                </div>
                
                {/* 申请国家 - 使用原生select */}
                <div className={basicInfoErrors.applyCountry ? 'animate-pulse' : ''}>
                  <label className="block text-sm font-medium text-morandi-deep mb-2">
                    申请国家<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={applyCountry}
                    onChange={(e) => {
                      setApplyCountry(e.target.value);
                      clearValidationError('applyCountry');
                    }}
                    disabled={!applyRegion}
                    className="w-full px-4 py-3 rounded-2xl border border-morandi-mist/30 bg-white appearance-none cursor-pointer focus:outline-none focus:border-morandi-ocean focus:ring-2 focus:ring-morandi-ocean/20 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200 hover:border-morandi-ocean/50"
                  >
                    <option value="">{applyRegion ? '选择国家' : '请先选择地区'}</option>
                    {countries.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {basicInfoErrors.applyCountry && <p className="text-red-500 text-xs mt-1">请选择申请国家</p>}
                </div>
                
                {/* 入境日期 */}
                <div className={basicInfoErrors.entryDate ? 'animate-pulse' : ''}>
                  <Input
                    label="入境日期"
                    type="date"
                    value={entryDate}
                    min={today}
                    onChange={(e) => { setEntryDate(e.target.value); clearValidationError('entryDate'); }}
                    required
                  />
                  {basicInfoErrors.entryDate && <p className="text-red-500 text-xs mt-1">请选择入境日期</p>}
                </div>
                
                {/* 离境日期 */}
                <div className={basicInfoErrors.exitDate ? 'animate-pulse' : ''}>
                  <Input
                    label="离境日期"
                    type="date"
                    value={exitDate}
                    min={entryDate || today}
                    onChange={(e) => { setExitDate(e.target.value); clearValidationError('exitDate'); }}
                    required
                  />
                  {basicInfoErrors.exitDate && <p className="text-red-500 text-xs mt-1">请选择离境日期</p>}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 3. 详细行程区 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.medium, delay: 0.2 }}
          >
            <Card variant="glass" padding="lg">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-morandi-blush/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-morandi-clay" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-morandi-deep">详细行程</h2>
                </div>
                <p className="text-sm text-morandi-mist">配置您的航班信息和旅行路线</p>
              </div>
              
              {/* 航班信息 */}
              <div className="mb-6" id="flight-section">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-semibold text-morandi-deep flex items-center gap-2">
                    <svg className="w-4 h-4 text-morandi-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    航班信息
                  </h3>
                </div>
                <AnimatePresence>
                  {flights.map((flight, index) => (
                    <FlightInputRow
                      key={flight.id}
                      flight={flight}
                      onChange={(updated) => {
                        const newFlights = [...flights];
                        newFlights[index] = updated;
                        setFlights(newFlights);
                      }}
                      onDelete={() => {
                        setFlights(flights.filter((_, i) => i !== index));
                      }}
                      canDelete={flights.length > 1}
                    />
                  ))}
                </AnimatePresence>
                
                {/* 添加航班按钮 - 突出显示 */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
                  className="group w-full mt-4 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-morandi-ocean/20 to-morandi-ocean/10 hover:from-morandi-ocean/35 hover:to-morandi-ocean/25 border border-morandi-ocean/30 hover:border-morandi-ocean/60 rounded-xl text-morandi-ocean font-medium shadow-sm hover:shadow-lg hover:shadow-morandi-ocean/20 transition-all duration-200"
                  onClick={() => {
                    const newFlight: FlightInfo = {
                      id: Date.now().toString(),
                      flightNumber: '',
                      departureRegion: '',
                      departureCountry: '',
                      departureProvince: '',
                      departureCity: '',
                      departureTime: '',
                      arrivalRegion: '',
                      arrivalCountry: '',
                      arrivalProvince: '',
                      arrivalCity: '',
                      arrivalTime: '',
                    };
                    setFlights([...flights, newFlight]);
                  }}
                >
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  添加航班
                </motion.button>
              </div>
              
              {/* 路线详情 */}
              <div>
                <h3 className="text-base font-semibold text-morandi-deep flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-morandi-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  路线详情
                </h3>
                <AnimatePresence>
                  {countrySegments.map((segment, index) => (
                    <CountrySegmentInput
                      key={segment.id}
                      segment={segment}
                      onChange={(updated) => {
                        const newSegments = [...countrySegments];
                        newSegments[index] = updated;
                        setCountrySegments(newSegments);
                      }}
                      onDelete={() => {
                        setCountrySegments(countrySegments.filter((_, i) => i !== index));
                      }}
                      canDelete={countrySegments.length > 1}
                    />
                  ))}
                </AnimatePresence>
                <motion.button
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
                  className="group w-full mt-4 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-morandi-ocean/15 to-morandi-blush/20 hover:from-morandi-ocean/30 hover:to-morandi-blush/35 border border-morandi-ocean/20 hover:border-morandi-ocean/50 rounded-xl text-morandi-deep font-medium shadow-sm hover:shadow-lg hover:shadow-morandi-ocean/15 transition-all duration-200"
                  onClick={() => {
                    const newSegment: CountrySegment = {
                      id: Date.now().toString(),
                      region: '',
                      country: '',
                      cities: [],
                    };
                    setCountrySegments([...countrySegments, newSegment]);
                  }}
                >
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  添加国家段行程
                </motion.button>
              </div>
            </Card>
          </motion.div>

          {/* 4. 特殊要求区 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.medium, delay: 0.3 }}
          >
            <Card variant="glass" padding="lg">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-morandi-clay/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-morandi-clay" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-morandi-deep">特殊行程要求</h2>
                </div>
                <p className="text-sm text-morandi-mist">智能系统将根据此项进行智能避雷与推荐</p>
              </div>
              <TextArea
                placeholder="例如：请在罗马行程中包含梵蒂冈行程；行程节奏舒缓；巴黎行程不去凡尔赛宫..."
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                rows={4}
              />
            </Card>
          </motion.div>

          {/* 5. 生成操作区 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.medium, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <motion.div
                  animate={generateButtonShake ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="flex justify-center"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full max-w-md"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {loadingMessages[currentLoadingMessage]}
                      </span>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        立即生成专业行程单
                      </>
                    )}
                  </Button>
                </motion.div>
                {showBasicInfoError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm text-center mt-2"
                  >
                    请将基础信息补充完整
                  </motion.p>
                )}
              </div>
              <div>
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="w-full hover:scale-105 hover:shadow-lg transition-all duration-200" 
                  onClick={() => setShowENHistory(true)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  历史记录
                </Button>
              </div>
            </div>
          </motion.div>

          {/* 6. 英文结果预览与导出区 */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                id="preview-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ ...springConfig.medium }}
              >
                <Card variant="glass" padding="lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-morandi-ocean/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-morandi-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-morandi-deep">生成预览</h2>
                        <p className="text-sm text-morandi-mist">英文行程单已生成完毕</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="glass" size="md">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        导出 HTML
                      </Button>
                      <Button variant="primary" size="md">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        下载 Word 版
                      </Button>
                    </div>
                  </div>
                  
                  {/* 预览容器 */}
                  <div className="bg-white rounded-2xl p-6 min-h-[400px] shadow-inner border border-morandi-mist/10">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-bold text-morandi-deep mb-4">Travel Itinerary</h3>
                      <p className="text-sm text-morandi-mist mb-6">France & Italy 7-Day Tour | March 15-22, 2026</p>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-morandi-cream/30 rounded-xl">
                          <h4 className="font-semibold text-morandi-deep mb-2">Day 1 - March 15 (Sunday)</h4>
                          <p className="text-sm text-morandi-mist">Arrival in Paris • Flight CA833 08:30 Beijing - 14:30 Paris</p>
                        </div>
                        <div className="p-4 bg-morandi-cream/30 rounded-xl">
                          <h4 className="font-semibold text-morandi-deep mb-2">Day 2 - March 16 (Monday)</h4>
                          <p className="text-sm text-morandi-mist">Paris: Eiffel Tower • Seine River Cruise • Champs-Élysées</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 7. 中文行程单定制区 - 始终显示 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.medium, delay: 0.1 }}
          >
            <Card variant="solid" padding="lg" className="bg-gradient-to-br from-morandi-blush/20 to-morandi-sand/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-morandi-clay/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-morandi-clay" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-morandi-deep">中文行程单生成</h2>
                    <p className="text-sm text-morandi-mist">基于英文行程单或上传文件，一键生成符合国人阅读习惯的中文行程单</p>
                  </div>
                </div>
                <Button 
                  variant="glass" 
                  size="md" 
                  onClick={() => setShowCNHistory(true)}
                  className="hover:scale-105 hover:shadow-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  历史记录
                </Button>
              </div>
              
              {/* 条件渲染：生成前显示表单，生成后显示成功卡片 */}
              {showCNResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-morandi-ocean/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-morandi-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-morandi-deep mb-2">中文行程单生成成功！</h3>
                  <p className="text-sm text-morandi-mist mb-6">已为您生成符合国人阅读习惯的中文行程单</p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="primary" size="lg" onClick={() => setShowCNResult(false)}>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      立即下载 PDF
                    </Button>
                    <Button variant="glass" size="lg" onClick={() => {
                      setShowCNResult(false);
                      setUploadedCNFile(null);
                    }}>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      再次生成
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-center">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full max-w-xs"
                      onClick={handleGenerateCN}
                      disabled={isGeneratingCN}
                    >
                    {isGeneratingCN ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        正在生成中文行程单...
                      </span>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        一键生成中文版
                      </>
                    )}
                  </Button>
                  </div>
                  <div className="relative border-2 border-dashed border-morandi-mist/30 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-morandi-ocean/50 transition-colors">
                    {/* 文件上传input - 当有文件时禁用，点击文件区域可以重新选择 */}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          setUploadedCNFile(files[0]);
                        }
                      }}
                    />
                    {uploadedCNFile ? (
                      <div className="flex flex-col items-center w-full">
                        <div className="flex items-center justify-between w-full">
                          <div 
                            className="flex-1 flex items-center justify-center cursor-pointer"
                            onClick={(e) => {
                              // 点击文件名区域触发文件选择
                              const input = e.currentTarget.parentElement?.parentElement?.previousSibling as HTMLInputElement;
                              input?.click();
                            }}
                          >
                            <svg className="w-6 h-6 text-morandi-ocean mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm text-morandi-deep font-medium truncate">{uploadedCNFile.name}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUploadedFile();
                            }}
                            className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 flex-shrink-0 z-10 hover:scale-110"
                            title="删除文件"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-morandi-ocean mt-2">点击文件名可更换文件</p>
                      </div>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-morandi-mist mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-morandi-deep font-medium">上传行程单文件</p>
                        <p className="text-xs text-morandi-mist mt-1">点击选择文件</p>
                    </>
                  )}
                </div>
              </div>
              )}
              
              {/* 错误提示 */}
              {showCNError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2 text-red-600">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium">{cnErrorMessage}</p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
          
          {/* 英文行程单历史记录弹窗 */}
          <AnimatePresence>
            {showENHistory && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/30 z-40"
                  onClick={() => setShowENHistory(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ ...springConfig.medium }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
                    <div className="p-6 border-b border-morandi-mist/20">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-morandi-deep">英文行程单历史记录</h3>
                        <button
                          onClick={() => setShowENHistory(false)}
                          className="p-2 rounded-lg hover:bg-morandi-mist/10 transition-colors"
                        >
                          <svg className="w-5 h-5 text-morandi-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-4 overflow-y-auto max-h-[60vh]">
                      {enHistoryList.length === 0 ? (
                        <div className="text-center py-8 text-morandi-mist">
                          暂无历史记录
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {enHistoryList.map((item) => (
                            <div key={item.id} className="p-4 bg-morandi-cream/30 rounded-xl">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-morandi-deep">{item.name}</div>
                                  <div className="text-xs text-morandi-mist mt-1">生成日期：{item.date}</div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <button 
                                    onClick={() => handleDownloadENHistory(item.id)}
                                    className="px-3 py-1.5 text-sm text-morandi-ocean border border-morandi-ocean/30 rounded-lg hover:bg-morandi-ocean/10 transition-colors"
                                  >再次下载</button>
                                  <button 
                                    onClick={() => handleDeleteENHistory(item.id)}
                                    className="px-3 py-1.5 text-sm text-red-500 border border-red-500/30 rounded-lg hover:bg-red-50 transition-colors"
                                  >删除</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* 中文行程单历史记录弹窗 */}
          <AnimatePresence>
            {showCNHistory && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/30 z-40"
                  onClick={() => setShowCNHistory(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ ...springConfig.medium }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
                    <div className="p-6 border-b border-morandi-mist/20">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-morandi-deep">中文行程单历史记录</h3>
                        <button
                          onClick={() => setShowCNHistory(false)}
                          className="p-2 rounded-lg hover:bg-morandi-mist/10 transition-colors"
                        >
                          <svg className="w-5 h-5 text-morandi-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-4 overflow-y-auto max-h-[60vh]">
                      {cnHistoryList.length === 0 ? (
                        <div className="text-center py-8 text-morandi-mist">
                          暂无历史记录
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {cnHistoryList.map((item) => (
                            <div key={item.id} className="p-4 bg-morandi-blush/30 rounded-xl">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-morandi-deep">{item.name}</div>
                                  <div className="text-xs text-morandi-mist mt-1">生成日期：{item.date}</div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <button 
                                    onClick={() => handleDownloadCNHistory(item.id)}
                                    className="px-3 py-1.5 text-sm text-morandi-clay border border-morandi-clay/30 rounded-lg hover:bg-morandi-clay/10 transition-colors"
                                  >再次下载</button>
                                  <button 
                                    onClick={() => handleDeleteCNHistory(item.id)}
                                    className="px-3 py-1.5 text-sm text-red-500 border border-red-500/30 rounded-lg hover:bg-red-50 transition-colors"
                                  >删除</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* 删除确认弹窗 */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setShowDeleteConfirm(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ ...springConfig.medium }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-morandi-deep mb-2">确认删除</h3>
                      <p className="text-sm text-morandi-mist mb-6">
                        {deleteConfirmInfo?.type === 'uploadedFile' 
                          ? `确定要删除文件 "${deleteConfirmInfo.fileName}" 吗？`
                          : '确定要删除该历史记录吗？'}
                      </p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-6 py-2.5 text-sm font-medium text-morandi-deep border border-morandi-mist/30 rounded-xl hover:bg-morandi-mist/10 transition-colors"
                        >
                          取消
                        </button>
                        <button
                          onClick={confirmDelete}
                          className="px-6 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

        </div>
      </section>

      <Footer />
    </div>
  );
}
