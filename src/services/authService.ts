import { supabase } from '@/integrations/supabase/client';

export const AuthService = {
async getUser() {
const { data, error } = await supabase.auth.getUser();
if (error) console.error('Get user error:', error);
return data?.user || null;
},

async getSession() {
const { data, error } = await supabase.auth.getSession();
if (error) console.error('Get session error:', error);
return data?.session || null;
},

onAuthStateChange(callback: (event: string, session: any) => void) {
return supabase.auth.onAuthStateChange((_event, session) => {
callback(_event, session);
});
},

async signInWithOtp(email: string) {
return await supabase.auth.signInWithOtp({
email,
options: {
shouldCreateUser: true,
},
});
},

async signOut() {
return await supabase.auth.signOut();
},
};
