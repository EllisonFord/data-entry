// src/utils/currencies.utils.js

import {
  AttachMoney as AttachMoneyIcon,
  CurrencyBitcoin as CurrencyBitcoinIcon,
  CurrencyFranc as CurrencyFrancIcon,
  CurrencyPound as CurrencyPoundIcon,
  CurrencyRuble as CurrencyRubleIcon,
  CurrencyYen as CurrencyYenIcon,
  Euro as EuroIcon
} from '@mui/icons-material';


export const currencies = {
  USD: {
    symbol: '$',
    active: false,
    name: 'US Dollar',
    isoCode: 'USD',
    decimalPlaces: 2,
    category: 'fiat',
    minAmount: 0.01,
    maxAmount: 1000000,
    icon: <AttachMoneyIcon />,
    fallbackRateFromEUR: 1.05  // Slightly conservative EUR to USD rate
  },
  EUR: {
    symbol: '€',
    active: true,
    name: 'Euro',
    isoCode: 'EUR',
    decimalPlaces: 2,
    category: 'fiat',
    minAmount: 0.01,
    maxAmount: 1000000,
    icon: <EuroIcon />,
    fallbackRateFromEUR: 1.00  // Base currency
  },
  GBP: {
    symbol: '£',
    active: false,
    name: 'British Pound',
    isoCode: 'GBP',
    decimalPlaces: 2,
    category: 'fiat',
    minAmount: 0.01,
    maxAmount: 1000000,
    icon: <CurrencyPoundIcon />,
    fallbackRateFromEUR: 0.80  // Slightly conservative EUR to GBP rate
  },
  JPY: {
    symbol: '¥',
    active: false,
    name: 'Japanese Yen',
    isoCode: 'JPY',
    decimalPlaces: 0,
    category: 'fiat',
    minAmount: 1,
    maxAmount: 100000000,
    icon: <CurrencyYenIcon />,
    fallbackRateFromEUR: 155  // Slightly conservative EUR to JPY rate
  },
  CNY: {
    symbol: '¥',
    active: false,
    name: 'Renminbi',
    isoCode: 'CNY',
    decimalPlaces: 2,
    category: 'fiat',
    minAmount: 0.01,
    maxAmount: 10000000,
    icon: <CurrencyYenIcon />,
    fallbackRateFromEUR: 7.50  // Slightly conservative EUR to CNY rate
  },
  CAD: {
    symbol: 'C$',
    active: false,
    name: 'Canadian Dollar',
    isoCode: 'CAD',
    decimalPlaces: 2,
    category: 'fiat',
    minAmount: 0.01,
    maxAmount: 1000000,
    fallbackRateFromEUR: 1.50  // Conservative fallback rate
  },
  AUD: {
    symbol: 'A$',
    active: false,
    name: 'Australian Dollar',
    isoCode: 'AUD',
    decimalPlaces: 2,
    category: 'fiat',
    minAmount: 0.01,
    maxAmount: 1000000,
    fallbackRateFromEUR: 1.60  // Conservative fallback rate
  },
  INR: {
    symbol: '₹',
    active: false,
    name: 'Indian Rupee',
    isoCode: 'INR',
    decimalPlaces: 2,
    category: 'fiat',
    minAmount: 0.01,
    maxAmount: 10000000,
    fallbackRateFromEUR: 90.00  // Conservative fallback rate
  },
  KRW: {
    symbol: '₩',
    active: false,
    name: 'South Korean Won',
    isoCode: 'KRW',
    decimalPlaces: 0,
    category: 'fiat',
    minAmount: 1,
    maxAmount: 1000000000,
    fallbackRateFromEUR: 1400.00  // Conservative fallback rate
  },
  BRL: {
    symbol: 'R$',
    active: false,
    name: 'Brazilian Real',
    isoCode: 'BRL',
    decimalPlaces: 2,
    category: 'fiat',
    minAmount: 0.01,
    maxAmount: 1000000,
    fallbackRateFromEUR: 5.50  // Conservative fallback rate
  },
  RUB: {
    symbol: '₽',
    active: false,
    name: 'Russian Ruble',
    isoCode: 'RUB',
    decimalPlaces: 2,
    category: 'fiat',
    minAmount: 0.01,
    maxAmount: 10000000,
    icon: <CurrencyRubleIcon />,
    fallbackRateFromEUR: 90.00  // Slightly conservative EUR to RUB rate
  },
  SGD: {
    symbol: 'S$',
    active: false,
    name: 'Singapore Dollar',
    isoCode: 'SGD',
    decimalPlaces: 2,
    category: 'fiat',
    minAmount: 0.01,
    maxAmount: 1000000,
    fallbackRateFromEUR: 1.40  // Conservative fallback rate
  },
  MXN: {
    symbol: 'Mex$',
    active: false,
    name: 'Mexican Peso',
    isoCode: 'MXN',
    decimalPlaces: 2,
    category: 'fiat',
    minAmount: 0.01,
    maxAmount: 10000000,
    fallbackRateFromEUR: 20.00  // Conservative fallback rate
  },
  CHF: {
    symbol: 'Fr',
    active: false,
    name: 'Swiss Franc',
    isoCode: 'CHF',
    decimalPlaces: 2,
    category: 'fiat',
    minAmount: 0.01,
    maxAmount: 1000000,
    icon: <CurrencyFrancIcon />,
    fallbackRateFromEUR: 0.95  // Slightly conservative EUR to CHF rate
  },
  AED: {
    symbol: 'د.إ',
    active: false,
    name: 'UAE Dirham',
    isoCode: 'AED',
    decimalPlaces: 2,
    category: 'fiat',
    minAmount: 0.01,
    maxAmount: 1000000,
    fallbackRateFromEUR: 4.00  // Conservative fallback rate
  },
  BTC: {
    symbol: '₿',
    active: false,
    name: 'Bitcoin Core',
    isoCode: 'BTC',
    decimalPlaces: 8,
    category: 'cryptocurrency',
    minAmount: 0.00000001,
    maxAmount: 21000000,
    icon: <CurrencyBitcoinIcon />,
    fallbackRateFromEUR: 0.000020  // Very conservative EUR to BTC rate
  },
  BCH: {
    symbol: '₿',
    active: false,
    name: 'Bitcoin Cash',
    isoCode: 'BCH',
    decimalPlaces: 8,
    category: 'cryptocurrency',
    minAmount: 0.00000001,
    maxAmount: 21000000,
    icon: <CurrencyBitcoinIcon />,
    fallbackRateFromEUR: 0.002000  // Very conservative EUR to BCH rate
  },
  ETH: {
    symbol: 'Ξ',
    active: false,
    name: 'Ethereum',
    isoCode: 'ETH',
    decimalPlaces: 18,
    category: 'cryptocurrency',
    minAmount: 0.000000000000000001,
    maxAmount: null,
    fallbackRateFromEUR: 0.000600  // Conservative fallback rate
  }
};


export const activeCurrencies = Object.keys(currencies).filter(currency => currencies[currency].active);


export const activeFiatCurrencies = Object.keys(currencies).filter(currency => currencies[currency].active && currencies[currency].category === 'fiat');
