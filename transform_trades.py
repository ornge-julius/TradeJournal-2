#!/usr/bin/env python3
"""
Transform Robinhood trades CSV to Supabase trades table format.
Matches BTO (Buy To Open) with STC (Sell To Close) transactions to create complete trades.
"""

import csv
import re
from datetime import datetime
from collections import defaultdict

# Constants
ACCOUNT_ID = ""
USER_ID = ""
SOURCE = "DATA UPLOAD"
REASONING = "DATA UPLOAD"

# Position type mapping
POSITION_TYPE_CALL = 1
POSITION_TYPE_PUT = 0

# Result mapping
RESULT_WIN = 1
RESULT_LOSS = 0


def parse_amount(amount_str):
    """Parse amount string like '($386.04)' or '$225.95' to float."""
    # Remove dollar sign and parentheses
    cleaned = amount_str.replace('$', '').replace('(', '').replace(')', '').strip()
    # If original had parentheses, it's negative
    if '(' in amount_str:
        return -float(cleaned)
    return float(cleaned)


def parse_date(date_str):
    """Parse MM/DD/YYYY date string to YYYY-MM-DD HH:mm:ss format."""
    try:
        dt = datetime.strptime(date_str, "%m/%d/%Y")
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None


def parse_price(price_str):
    """Parse price string like '$3.86' to float."""
    return float(price_str.replace('$', '').strip())


def get_position_type(description):
    """Extract position type from description. Call = 1, Put = 0."""
    if 'Call' in description:
        return POSITION_TYPE_CALL
    elif 'Put' in description:
        return POSITION_TYPE_PUT
    return None


def get_symbol(instrument):
    """Get symbol from instrument column."""
    return instrument.strip().upper()


def match_trades(transactions):
    """
    Match BTO and STC transactions to create complete trades.
    Handles quantity matching and partial fills.
    Returns list of matched trades.
    """
    # Group transactions by a unique key (symbol + description)
    pending_opens = defaultdict(list)  # key -> list of BTO transactions with remaining quantity
    trades = []
    
    # Sort transactions by date, then by transaction code (BTO before STC on same date)
    def sort_key(trans):
        date_str = trans['activity_date']
        try:
            dt = datetime.strptime(date_str, "%m/%d/%Y")
            # Use transaction code: BTO=0 (comes first), STC=1 (comes after)
            code_order = 0 if trans['trans_code'] == 'BTO' else 1
            return (dt, code_order)
        except:
            return (date_str, 0)
    
    sorted_transactions = sorted(transactions, key=sort_key)
    
    for trans in sorted_transactions:
        trans_code = trans['trans_code']
        symbol = get_symbol(trans['instrument'])
        description = trans['description']
        key = f"{symbol}|{description}"
        trans_quantity = int(trans['quantity'])
        
        if trans_code == 'BTO':
            # Add to pending opens with quantity tracking
            pending_opens[key].append({
                'trans': trans,
                'remaining_qty': trans_quantity
            })
        elif trans_code == 'STC':
            # Try to match with pending BTOs
            remaining_stc_qty = trans_quantity
            
            while remaining_stc_qty > 0 and key in pending_opens and len(pending_opens[key]) > 0:
                # Get the first available BTO
                bto_entry = pending_opens[key][0]
                bto = bto_entry['trans']
                bto_remaining = bto_entry['remaining_qty']
                
                # Determine how much to match
                match_qty = min(remaining_stc_qty, bto_remaining)
                
                # Create a trade with the matched quantity
                trade = create_trade_with_quantity(bto, trans, match_qty)
                if trade:
                    trades.append(trade)
                
                # Update remaining quantities
                remaining_stc_qty -= match_qty
                bto_entry['remaining_qty'] -= match_qty
                
                # Remove BTO if fully matched
                if bto_entry['remaining_qty'] <= 0:
                    pending_opens[key].pop(0)
            
            # If there's still unmatched STC quantity, it's an error
            if remaining_stc_qty > 0:
                print(f"Warning: STC without matching BTO: {symbol} {description} on {trans['activity_date']} (qty: {remaining_stc_qty})")
    
    # Handle any remaining unmatched BTO transactions (incomplete trades)
    for key, bto_list in pending_opens.items():
        for bto_entry in bto_list:
            bto = bto_entry['trans']
            symbol = get_symbol(bto['instrument'])
            print(f"Warning: Unmatched BTO (incomplete trade): {symbol} {bto['description']} on {bto['activity_date']} (qty: {bto_entry['remaining_qty']})")
    
    return trades


def create_trade_with_quantity(bto, stc, match_qty):
    """
    Create a trade record from BTO and STC transactions with specified quantity.
    Handles partial matches where match_qty may be less than full transaction quantities.
    """
    # Parse amounts
    bto_total_amount = parse_amount(bto['amount'])  # Already negative (cost)
    stc_total_amount = parse_amount(stc['amount'])  # Already positive (proceeds)
    
    # Get quantities
    bto_qty = int(bto['quantity'])
    stc_qty = int(stc['quantity'])
    
    # Calculate per-unit amounts
    bto_per_unit = bto_total_amount / bto_qty if bto_qty > 0 else 0
    stc_per_unit = stc_total_amount / stc_qty if stc_qty > 0 else 0
    
    # Calculate matched amounts (proportional to match_qty)
    matched_bto_amount = bto_per_unit * match_qty
    matched_stc_amount = stc_per_unit * match_qty
    
    # Calculate profit: STC proceeds + BTO cost (since BTO is negative)
    profit = matched_stc_amount + matched_bto_amount
    
    # Determine result (win or loss)
    result = RESULT_WIN if profit > 0 else RESULT_LOSS
    
    # Get position type
    position_type = get_position_type(bto['description'])
    if position_type is None:
        print(f"Warning: Could not determine position type for: {bto['description']}")
        return None
    
    # Parse dates
    entry_date = parse_date(bto['activity_date'])
    exit_date = parse_date(stc['activity_date'])
    
    if not entry_date or not exit_date:
        print(f"Warning: Invalid date format")
        return None
    
    # Parse prices (these are per-unit already)
    entry_price = parse_price(bto['price'])
    exit_price = parse_price(stc['price'])
    
    # Create trade record
    trade = {
        'symbol': get_symbol(bto['instrument']),
        'position_type': position_type,
        'entry_price': entry_price,
        'exit_price': exit_price,
        'quantity': match_qty,
        'entry_date': entry_date,
        'exit_date': exit_date,
        'source': SOURCE,
        'reasoning': REASONING,
        'result': result,
        'notes': None,
        'account_id': ACCOUNT_ID,
        'user_id': USER_ID,
        'profit': round(profit, 2),
        'option': bto['description']
    }
    
    return trade


def create_trade(bto, stc):
    """Create a trade record from BTO and STC transactions (full quantity match)."""
    bto_qty = int(bto['quantity'])
    return create_trade_with_quantity(bto, stc, bto_qty)


def read_input_csv(input_file):
    """Read the input CSV file and return list of transactions."""
    transactions = []
    
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Skip empty rows
            if not row:
                continue
            # Check if all values are None or empty strings
            is_empty = True
            for v in row.values():
                if v is not None and isinstance(v, str) and v.strip():
                    is_empty = False
                    break
            if is_empty:
                continue
            
            # Clean up keys and values (remove quotes if present, handle None values)
            clean_row = {}
            for k, v in row.items():
                # Handle None keys or values
                clean_key = k.strip().strip('"') if k is not None else ''
                clean_value = v.strip().strip('"') if v is not None else ''
                clean_row[clean_key] = clean_value
            
            trans_code = clean_row.get('Trans Code', '').strip()
            
            # Only process BTO and STC transactions
            if trans_code in ['BTO', 'STC']:
                transactions.append({
                    'activity_date': clean_row.get('Activity Date', ''),
                    'process_date': clean_row.get('Process Date', ''),
                    'settle_date': clean_row.get('Settle Date', ''),
                    'instrument': clean_row.get('Instrument', ''),
                    'description': clean_row.get('Description', ''),
                    'trans_code': trans_code,
                    'quantity': clean_row.get('Quantity', ''),
                    'price': clean_row.get('Price', ''),
                    'amount': clean_row.get('Amount', '')
                })
    
    return transactions


def write_output_csv(trades, output_file):
    """Write trades to output CSV file."""
    if not trades:
        print("No trades to write.")
        return
    
    # Define column order matching the schema
    fieldnames = [
        'symbol',
        'position_type',
        'entry_price',
        'exit_price',
        'quantity',
        'entry_date',
        'exit_date',
        'source',
        'reasoning',
        'result',
        'notes',
        'account_id',
        'user_id',
        'profit',
        'option'
    ]
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for trade in trades:
            writer.writerow(trade)
    
    print(f"Successfully wrote {len(trades)} trades to {output_file}")


def main():
    input_file = './RH_trades_090125_103125.csv'
    output_file = './trades_for_database.csv'
    
    print(f"Reading transactions from {input_file}...")
    transactions = read_input_csv(input_file)
    print(f"Found {len(transactions)} transactions")
    
    print("Matching BTO and STC transactions...")
    trades = match_trades(transactions)
    print(f"Created {len(trades)} complete trades")
    
    print(f"Writing trades to {output_file}...")
    write_output_csv(trades, output_file)
    
    # Print summary
    if trades:
        wins = sum(1 for t in trades if t['result'] == RESULT_WIN)
        losses = sum(1 for t in trades if t['result'] == RESULT_LOSS)
        total_profit = sum(t['profit'] for t in trades)
        
        print("\nSummary:")
        print(f"  Total trades: {len(trades)}")
        print(f"  Wins: {wins}")
        print(f"  Losses: {losses}")
        print(f"  Total profit: ${total_profit:.2f}")


if __name__ == "__main__":
    main()
