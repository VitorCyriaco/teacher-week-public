import { createClient } from '@supabase/supabase-js';
import { supabaseKey, supabaseURL } from '../data/supabase';

export const supabase = createClient(supabaseURL, supabaseKey);