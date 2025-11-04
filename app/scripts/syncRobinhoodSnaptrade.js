#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envPaths = [
  path.resolve(__dirname, '..', '.env'),
  path.resolve(__dirname, '..', '..', '.env')
];

if (process.env.SNAPTRADE_ENV_PATH) {
  envPaths.unshift(path.resolve(process.env.SNAPTRADE_ENV_PATH));
}

envPaths.forEach((envPath) => {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
});

dotenv.config();

const { Snaptrade } = require('snaptrade-typescript-sdk');
const { createClient } = require('@supabase/supabase-js');

const REQUIRED_ENV_VARS = [
  'SNAPTRADE_CLIENT_ID',
  'SNAPTRADE_CONSUMER_KEY',
  'SNAPTRADE_USER_ID',
  'SNAPTRADE_USER_SECRET',
  'SNAPTRADE_TARGET_ACCOUNT_ID',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name, fallback = undefined) {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}

function parseDate(dateString) {
  if (!dateString) {
    return null;
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function formatDate(dateString) {
  const date = parseDate(dateString);
  if (!date) {
    return null;
  }
  return date.toISOString().split('T')[0];
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return null;
  }
  return num;
}

function computeContracts(activity) {
  if (!activity) {
    return 0;
  }
  const optionSymbol = activity.option_symbol;
  const unitsRaw = Math.abs(toNumber(activity.units) ?? 0);
  const price = Math.abs(toNumber(activity.price) ?? 0);
  const amount = Math.abs(toNumber(activity.amount) ?? 0);

  let contracts = unitsRaw;

  if (optionSymbol) {
    if (amount > 0 && price > 0) {
      const impliedContracts = amount / (price * 100);
      if (Number.isFinite(impliedContracts) && impliedContracts > 0) {
        contracts = impliedContracts;
      }
    }

    if ((!contracts || contracts === 0) && unitsRaw > 0) {
      if (unitsRaw >= 100 && unitsRaw % 100 === 0) {
        contracts = unitsRaw / 100;
      } else {
        contracts = unitsRaw;
      }
    }
  }

  if (!contracts || !Number.isFinite(contracts)) {
    return 0;
  }

  return Math.round(Math.abs(contracts) * 1000) / 1000;
}

function deriveOptionPrice(activity, totalContracts) {
  if (!activity) {
    return null;
  }
  const priceRaw = toNumber(activity.price);
  const amount = Math.abs(toNumber(activity.amount) ?? 0);
  const contracts = totalContracts || computeContracts(activity);

  if (priceRaw !== null && priceRaw !== undefined) {
    const priceAbs = Math.abs(priceRaw);
    if (amount > 0 && contracts > 0) {
      const amountPerContract = amount / contracts;
      const diffPerContract = Math.abs(amountPerContract - priceAbs);
      const diffPerShare = Math.abs(amountPerContract - priceAbs * 100);

      if (diffPerContract < 0.01 && diffPerShare > diffPerContract) {
        return Number((priceAbs / 100).toFixed(6));
      }

      if (diffPerShare < 0.5) {
        return Number(priceAbs.toFixed(6));
      }
    }

    if (priceAbs > 100) {
      return Number((priceAbs / 100).toFixed(6));
    }

    return Number(priceAbs.toFixed(6));
  }

  if (amount > 0 && contracts > 0) {
    return Number((amount / (contracts * 100)).toFixed(6));
  }

  return null;
}

function buildOptionDescription(optionSymbol) {
  if (!optionSymbol) {
    return '';
  }
  const underlyingSymbol = optionSymbol?.underlying_symbol?.symbol
    || optionSymbol?.underlying_symbol?.raw_symbol
    || '';
  const expiry = formatDate(optionSymbol.expiration_date);
  const strike = optionSymbol.strike_price !== undefined && optionSymbol.strike_price !== null
    ? Number(optionSymbol.strike_price).toFixed(2)
    : '';
  const type = optionSymbol.option_type || '';

  return [
    underlyingSymbol,
    expiry,
    strike ? `$${strike}` : '',
    type
  ].filter(Boolean).join(' ');
}

function determineSymbol(activity) {
  const optionSymbol = activity?.option_symbol;
  if (optionSymbol?.underlying_symbol?.symbol) {
    return optionSymbol.underlying_symbol.symbol.toUpperCase();
  }
  if (optionSymbol?.underlying_symbol?.raw_symbol) {
    return optionSymbol.underlying_symbol.raw_symbol.toUpperCase();
  }
  if (activity?.symbol?.symbol) {
    return activity.symbol.symbol.toUpperCase();
  }
  if (activity?.symbol?.raw_symbol) {
    return activity.symbol.raw_symbol.toUpperCase();
  }
  if (activity?.description) {
    const match = activity.description.match(/^[A-Z]{1,5}/);
    if (match) {
      return match[0];
    }
  }
  return 'UNKNOWN';
}

function mapOptionTypeToPosition(optionSymbol) {
  const type = optionSymbol?.option_type;
  if (!type) {
    return null;
  }
  if (type.toUpperCase() === 'PUT') {
    return 2;
  }
  if (type.toUpperCase() === 'CALL') {
    return 1;
  }
  return null;
}

function isOpenActivity(activity) {
  const optionType = activity?.option_type;
  if (!optionType || typeof optionType !== 'string') {
    return false;
  }
  return optionType.toUpperCase().includes('TO_OPEN');
}

function isCloseActivity(activity) {
  const optionType = activity?.option_type;
  if (!optionType || typeof optionType !== 'string') {
    return false;
  }
  return optionType.toUpperCase().includes('TO_CLOSE');
}

function isLongOpen(activity) {
  const optionType = activity?.option_type;
  if (!optionType) {
    return true;
  }
  return optionType.toUpperCase().includes('BUY_TO_OPEN');
}

function buildTradeRecord(openEntry, closeActivity, matchedContracts, accountId, targetUserId) {
  const openActivity = openEntry.activity;
  const optionSymbol = openActivity.option_symbol || closeActivity.option_symbol;
  const positionType = mapOptionTypeToPosition(optionSymbol);
  const symbol = determineSymbol(openActivity) || determineSymbol(closeActivity);

  const entryDate = formatDate(openActivity.trade_date);
  const exitDate = formatDate(closeActivity.trade_date) || entryDate;
  if (!entryDate || !exitDate) {
    return null;
  }

  const openContractsTotal = openEntry.totalContracts || computeContracts(openActivity);
  const closeContractsTotal = computeContracts(closeActivity);
  const entryPrice = openEntry.pricePerShare ?? deriveOptionPrice(openActivity, openContractsTotal);
  const exitPrice = deriveOptionPrice(closeActivity, closeContractsTotal);

  if (entryPrice === null || exitPrice === null) {
    return null;
  }

  const quantity = Math.max(1, Math.round(matchedContracts));
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return null;
  }

  const longPosition = isLongOpen(openActivity);

  const openPerContractAmount = openContractsTotal > 0 && openActivity.amount !== undefined && openActivity.amount !== null
    ? Number(openActivity.amount) / openContractsTotal
    : (longPosition ? -entryPrice * 100 : entryPrice * 100);

  const closePerContractAmount = closeContractsTotal > 0 && closeActivity.amount !== undefined && closeActivity.amount !== null
    ? Number(closeActivity.amount) / closeContractsTotal
    : (longPosition ? exitPrice * 100 : -exitPrice * 100);

  const profit = (openPerContractAmount + closePerContractAmount) * quantity;
  const roundedProfit = Number(profit.toFixed(2));

  const sourceKeyParts = [
    'SNAPTRADE',
    openActivity.id || formatDate(openActivity.trade_date) || 'open',
    closeActivity.id || formatDate(closeActivity.trade_date) || 'close'
  ];

  const sourceKey = sourceKeyParts.join(':');

  const notes = [
    openActivity.description,
    closeActivity.description
  ].filter(Boolean).join(' | ');

  return {
    symbol,
    position_type: positionType,
    entry_price: Number(entryPrice.toFixed(4)),
    exit_price: Number(exitPrice.toFixed(4)),
    quantity,
    entry_date: entryDate,
    exit_date: exitDate,
    notes,
    reasoning: 'Imported from SnapTrade Robinhood synchronization',
    result: roundedProfit > 0 ? 1 : 0,
    option: buildOptionDescription(optionSymbol),
    source: sourceKey,
    profit: roundedProfit,
    account_id: accountId,
    user_id: targetUserId || undefined
  };
}

function extractTradesFromActivities(activities, snaptradeAccountIds, supabaseAccountId, targetUserId, logger) {
  const accountFilter = new Set(snaptradeAccountIds);

  const sortedActivities = [...activities]
    .filter((activity) => activity && activity.option_symbol && activity.account && accountFilter.has(activity.account.id))
    .filter((activity) => (isOpenActivity(activity) || isCloseActivity(activity)))
    .sort((a, b) => {
      const dateA = parseDate(a.trade_date) || new Date(0);
      const dateB = parseDate(b.trade_date) || new Date(0);
      return dateA - dateB;
    });

  const openQueues = new Map();
  const trades = [];
  const unmatchedClosings = [];

  const enqueueOpen = (key, entry) => {
    if (!openQueues.has(key)) {
      openQueues.set(key, []);
    }
    openQueues.get(key).push(entry);
  };

  const dequeueOpen = (key) => {
    const queue = openQueues.get(key);
    if (!queue || queue.length === 0) {
      return null;
    }
    return queue[0];
  };

  const removeEmptyFront = (key) => {
    const queue = openQueues.get(key);
    if (!queue) {
      return;
    }
    while (queue.length > 0 && queue[0].remainingContracts <= 1e-6) {
      queue.shift();
    }
    if (queue.length === 0) {
      openQueues.delete(key);
    }
  };

  const buildKey = (activity) => {
    const accountKey = activity.account?.id || 'account';
    const optionKey = activity.option_symbol?.ticker
      || `${determineSymbol(activity)}-${activity.option_symbol?.expiration_date || ''}-${activity.option_symbol?.strike_price || ''}-${activity.option_symbol?.option_type || ''}`;
    return `${accountKey}:${optionKey}`;
  };

  for (const activity of sortedActivities) {
    const key = buildKey(activity);
    if (isOpenActivity(activity)) {
      const totalContracts = computeContracts(activity);
      const pricePerShare = deriveOptionPrice(activity, totalContracts);
      if (totalContracts <= 0 || pricePerShare === null) {
        if (logger) {
          logger.warn(`Skipping open activity ${activity.id || activity.trade_date} due to missing contract/price data.`);
        }
        continue;
      }
      enqueueOpen(key, {
        activity,
        totalContracts,
        remainingContracts: totalContracts,
        pricePerShare
      });
      continue;
    }

    if (isCloseActivity(activity)) {
      let remainingContracts = computeContracts(activity);
      if (remainingContracts <= 0) {
        if (logger) {
          logger.warn(`Skipping close activity ${activity.id || activity.trade_date} due to missing contract data.`);
        }
        continue;
      }

      while (remainingContracts > 1e-6) {
        const openEntry = dequeueOpen(key);
        if (!openEntry) {
          unmatchedClosings.push(activity);
          break;
        }
        const matched = Math.min(remainingContracts, openEntry.remainingContracts);
        const tradeRecord = buildTradeRecord(openEntry, activity, matched, supabaseAccountId, targetUserId);
        if (tradeRecord) {
          trades.push(tradeRecord);
        }
        openEntry.remainingContracts -= matched;
        remainingContracts -= matched;
        removeEmptyFront(key);
      }
    }
  }

  if (logger) {
    const remainingOpen = Array.from(openQueues.values()).flat().filter((entry) => entry.remainingContracts > 1e-6);
    if (remainingOpen.length > 0) {
      logger.info(`Remaining unmatched open option legs: ${remainingOpen.length}`);
    }
    if (unmatchedClosings.length > 0) {
      logger.info(`Unmatched closing option legs: ${unmatchedClosings.length}`);
    }
  }

  return trades;
}

async function main() {
  REQUIRED_ENV_VARS.forEach(requireEnv);

  const snaptradeClientId = requireEnv('SNAPTRADE_CLIENT_ID');
  const snaptradeConsumerKey = requireEnv('SNAPTRADE_CONSUMER_KEY');
  const snaptradeUserId = requireEnv('SNAPTRADE_USER_ID');
  const snaptradeUserSecret = requireEnv('SNAPTRADE_USER_SECRET');
  const targetAccountId = requireEnv('SNAPTRADE_TARGET_ACCOUNT_ID');
  const targetUserId = optionalEnv('SNAPTRADE_TARGET_USER_ID');
  const brokerageName = optionalEnv('SNAPTRADE_BROKERAGE_NAME', 'Robinhood');
  const accountIdFilter = optionalEnv('SNAPTRADE_ACCOUNT_IDS');
  const startDate = optionalEnv('SNAPTRADE_START_DATE');

  const supabaseUrl = requireEnv('SUPABASE_URL');
  const supabaseKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  const snaptrade = new Snaptrade({
    clientId: snaptradeClientId,
    consumerKey: snaptradeConsumerKey
  });

  console.log('Fetching SnapTrade accounts...');
  const accountsResponse = await snaptrade.accountInformation.listUserAccounts({
    userId: snaptradeUserId,
    userSecret: snaptradeUserSecret
  });

  const accounts = accountsResponse?.data ?? [];
  if (!Array.isArray(accounts) || accounts.length === 0) {
    throw new Error('No accounts returned by SnapTrade for the specified user.');
  }

  const targetAccountIds = new Set();

  if (accountIdFilter) {
    accountIdFilter.split(',').map((id) => id.trim()).filter(Boolean).forEach((id) => targetAccountIds.add(id));
  }

  for (const account of accounts) {
    if (!account || !account.id) {
      continue;
    }
    if (targetAccountIds.size > 0) {
      continue;
    }
    if (!account.institution_name) {
      continue;
    }
    if (account.institution_name.toLowerCase().includes(brokerageName.toLowerCase())) {
      targetAccountIds.add(account.id);
    }
  }

  if (targetAccountIds.size === 0) {
    throw new Error(`No SnapTrade accounts found for brokerage name "${brokerageName}".`);
  }

  console.log(`Found ${targetAccountIds.size} SnapTrade Robinhood account(s). Fetching activities...`);

  const activityResponse = await snaptrade.transactionsAndReporting.getActivities({
    userId: snaptradeUserId,
    userSecret: snaptradeUserSecret,
    accounts: Array.from(targetAccountIds).join(','),
    startDate: startDate || undefined
  });

  const activities = activityResponse?.data ?? [];
  if (!Array.isArray(activities)) {
    throw new Error('Unexpected activities response from SnapTrade.');
  }

  console.log(`Received ${activities.length} total activities. Processing options trades...`);

  const trades = extractTradesFromActivities(activities, targetAccountIds, targetAccountId, targetUserId, console);

  if (trades.length === 0) {
    console.log('No completed option trades were detected in the supplied activities.');
    return;
  }

  console.log(`Identified ${trades.length} completed option trades. Checking for existing records...`);

  const { data: existingTrades, error: existingError } = await supabase
    .from('trades')
    .select('id, source')
    .eq('account_id', targetAccountId)
    .in('source', trades.map((trade) => trade.source));

  if (existingError) {
    throw new Error(`Supabase query failed: ${existingError.message}`);
  }

  const existingSources = new Set((existingTrades || []).map((trade) => trade.source));

  const newTrades = trades.filter((trade) => !existingSources.has(trade.source));

  if (newTrades.length === 0) {
    console.log('All detected trades already exist in Supabase. No new records to insert.');
    return;
  }

  console.log(`Inserting ${newTrades.length} new trade(s) into Supabase...`);

  const { error: insertError } = await supabase
    .from('trades')
    .insert(newTrades);

  if (insertError) {
    throw new Error(`Failed to insert trades into Supabase: ${insertError.message}`);
  }

  console.log(`Successfully synchronized ${newTrades.length} trade(s) from SnapTrade Robinhood account.`);
}

main().catch((error) => {
  console.error('SnapTrade synchronization failed.');
  console.error(error);
  process.exit(1);
});
