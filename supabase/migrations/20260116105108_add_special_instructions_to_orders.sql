/*
  # Add Special Instructions to Orders

  1. Changes
    - Add `special_instructions` column to `orders` table
      - Type: text (allows for multi-line instructions)
      - Optional field (nullable)
      - Default value: empty string
  
  2. Notes
    - This field allows customers to provide special instructions or requests for their orders
    - Examples: allergies, custom decorations, preferred delivery times, etc.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'special_instructions'
  ) THEN
    ALTER TABLE orders ADD COLUMN special_instructions text DEFAULT '';
  END IF;
END $$;
