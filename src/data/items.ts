import appliances from '../assets/generated/items-appliances.webp';
import computers from '../assets/generated/items-computers.webp';
import tools from '../assets/generated/items-tools.webp';
import metals from '../assets/generated/items-metals.webp';
import bicycles from '../assets/generated/items-bicycles.webp';
import furniture from '../assets/generated/items-furniture.webp';

export const items = [
  { id: 'small-appliances', title: '小型家電', examples: 'カメラ・ドライヤー・ゲーム機など', image: appliances, publish: true },
  { id: 'computer-equipment', title: 'パソコン関連機器', examples: 'パソコン・キーボード・周辺機器など', image: computers, publish: true },
  { id: 'tools-machines', title: '工具・機械類', examples: '電動工具・ミシンなど', image: tools, publish: true },
  { id: 'metal-resources', title: '金属資源', examples: '鉄・アルミ・ステンレス・銅・電線など', image: metals, publish: true },
  { id: 'bicycle-motorcycle', title: '自転車・バイク', examples: '不要自転車・原付バイクなど', image: bicycles, publish: true },
  { id: 'furniture-office', title: '家具・オフィス用品', examples: '家具・事務机・椅子など', image: furniture, publish: true },
];
