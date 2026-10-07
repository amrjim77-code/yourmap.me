/**
 * Translations and numeral helpers for multilingual map displays (including Bengali support)
 */

export const BENGALI_COUNTRY_NAMES: Record<string, string> = {
  '050': 'বাংলাদেশ',
  '156': 'চীন',
  '356': 'ভারত',
  '764': 'থাইল্যান্ড',
  '458': 'মালয়েশিয়া',
  '702': 'সিঙ্গাপুর',
  '682': 'সৌদি আরব',
  '840': 'যুক্তরাষ্ট্র',
  '826': 'যুক্তরাজ্য',
  '276': 'জার্মানি',
  '392': 'জাপান',
  '124': 'কানাডা',
  '036': 'অস্ট্রেলিয়া',
  '250': 'ফ্রান্স',
  '380': 'ইতালি',
  '724': 'স্পেন',
  '756': 'সুইজারল্যান্ড',
  '784': 'সংযুক্ত আরব আমিরাত',
  '792': 'তুরস্ক',
  '818': 'মিশর',
  '710': 'দক্ষিণ আফ্রিকা',
  '076': 'ব্রাজিল',
  '410': 'দক্ষিণ কোরিয়া',
  '360': 'ইন্দোনেশিয়া',
  '643': 'রাশিয়া',
  '528': 'নেদারল্যান্ডস',
  '586': 'পাকিস্তান',
  '524': 'নেপাল',
  '064': 'ভুটান',
  '144': 'শ্রীলঙ্কা',
  '462': 'মালদ্বীপ',
  '608': 'ফিলিপাইন',
  '704': 'ভিয়েতনাম',
  '496': 'মঙ্গোলিয়া',
  '620': 'পর্তুগাল',
  '578': 'নরওয়ে',
  '752': 'সুইডেন',
  '246': 'ফিনল্যান্ড',
  '208': 'ডেনমার্ক',
  '554': 'নিউজিল্যান্ড',
  '032': 'আর্জেন্টিনা',
  '484': 'মেক্সিকো',
};

export const toBengaliNumerals = (num: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, digit => bengaliDigits[parseInt(digit, 10)]);
};

export const getLocalizedCountryName = (
  id: string,
  englishName: string,
  lang: 'bn' | 'en' = 'bn'
): string => {
  if (lang === 'bn' && BENGALI_COUNTRY_NAMES[id]) {
    return BENGALI_COUNTRY_NAMES[id];
  }
  return englishName;
};
