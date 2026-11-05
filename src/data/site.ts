export const site = {
  name: 'みどり♻リサイクル',
  company: '株式会社盈和商事',
  representative: '鈴木 翠',
  representativeKana: 'スズキ ミドリ',
  phone: '090-3530-4405',
  phoneHref: 'tel:09035304405',
  hours: '9:00〜20:00',
  postcode: '188-0014',
  prefecture: '東京都',
  city: '西東京市',
  street: '芝久保町1-14-1',
  address: '東京都西東京市芝久保町1-14-1',
  area: '関東エリア',
  visitArea: '西東京市エリア',
  visitNote: '回収・作業等の費用は、品物や条件により異なります。',
  feeNote: '料金は品物の種類・状態・数量・運搬条件などによって異なります。内容を確認し、費用が必要な場合は事前にご説明します。',
  compliance: '無料回収・買取・廃棄物処理については、関係法令や必要な許可に従って対応いたします。',
  title: 'みどり♻リサイクル|西東京市の不用品回収・買取相談',
  description: '西東京市を拠点に関東エリアへ。みどり♻リサイクルでは、不用品や金属類、自転車・バイクの回収・買取相談、退去後の残置物整理、遺品整理のご相談を承ります。電話対応9:00〜20:00。品物や条件を確認し、対応可否と費用をご案内します。',
  // 正式な許可証と照合するまで公開しません。
  permit: null as null | { authority: string; number: string },
  // 本人確認済みの友だち追加URLが用意できたら設定します。
  lineUrl: null as string | null,
};

export const navigation = [
  { href: '#items', label: 'ご相談いただける品目' },
  { href: '#results', label: '営業実績' },
  { href: '#flow', label: 'ご相談の流れ' },
  { href: '#company', label: '会社情報' },
];
