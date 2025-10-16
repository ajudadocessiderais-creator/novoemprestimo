/*
# [Add installments_option column to loan_applications]
This migration script addresses a runtime error by adding the missing `installments_option` column to the `loan_applications` table. The application code attempts to write to this column, but it does not exist in the database schema, causing the operation to fail.

## Query Description: [This operation safely adds the `installments_option` column with an `integer` data type to the `public.loan_applications` table. The `IF NOT EXISTS` clause prevents errors if the column already exists, making the script safe to run multiple times. This change is non-destructive and will not affect existing data.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: `public.loan_applications`
- Column Added: `installments_option` (type: `integer`)

## Security Implications:
- RLS Status: [Unchanged]
- Policy Changes: [No]
- Auth Requirements: [None for this DDL change.]

## Performance Impact:
- Indexes: [None added]
- Triggers: [None added]
- Estimated Impact: [Negligible. Adding a column to a table is a fast metadata change and should not cause performance degradation.]
*/
ALTER TABLE public.loan_applications
ADD COLUMN IF NOT EXISTS installments_option integer;
