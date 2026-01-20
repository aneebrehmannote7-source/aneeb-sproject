/*
  # Add delivery fee and total amount to orders table

  1. New Columns
    - `delivery_fee` (integer) - Delivery fee amount in PKR, defaults to 0
    - `total_amount` (integer) - Total order amount including delivery fee

  2. Schema Changes
    - Add `delivery_fee` column to track delivery charges separately
    - Add `total_amount` column to store final total amount
    - Both columns default to 0 for existing non-delivery orders

  3. Notes
    - delivery_fee: 0 for pickup orders, 300 for delivery orders
    - total_amount: calculated as subtotal + delivery_fee and stored in DB
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'delivery_fee'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_fee integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN total_amount integer DEFAULT 0;
  END IF;
END $$;
