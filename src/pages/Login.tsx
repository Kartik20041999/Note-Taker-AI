import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMagicLink = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your Email", description: "A magic link has been sent to your inbox." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Vocal Note Keeper Login</h1>
        <input
          className="w-full border p-2 mb-4 rounded"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          onClick={handleMagicLink}
          disabled={loading || !email}
          className="w-full"
        >
          {loading ? "Sending Link..." : "Send Magic Link"}
        </Button>
      </div>
    </div>
  );
};

export default Login;
