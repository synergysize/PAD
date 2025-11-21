-- Create a game if none exists
INSERT INTO games (id, theme, phase, round_condition, condition_revealed, total_pot, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'What would you do if you won $1M?',
  'JOINING',
  'BULLISH',
  false,
  0,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
