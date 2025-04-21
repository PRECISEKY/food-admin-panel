// src/pages/restaurant/RestaurantLoginPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '../../supabaseClient'; // Import Supabase client
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook

export default function RestaurantLoginPage() {
  const navigate = useNavigate();
  // Use context to redirect if already logged in as a restaurant user
  const { session, profile, loading: authLoading } = useAuth();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Renamed from v0's 'isLoading' to avoid conflict if needed elsewhere

  // Redirect if already logged in as the correct role
  useEffect(() => {
    if (!authLoading && session && profile?.role === 'restaurant') {
      console.log('[RestaurantLoginPage] Restaurant session active, redirecting to dashboard');
      navigate('/restaurant/dashboard', { replace: true });
    }
  }, [session, profile, authLoading, navigate]);

  // Handle Login Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      // Call Supabase sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError; // Trigger catch block
      }
      // Successful Supabase login!
      console.log('[RestaurantLoginPage] Login successful. Waiting for context/redirect...');
      // Navigation is handled by the AuthContext listener updating state
      // and ProtectedRoute detecting the valid session/profile.

    } catch (err: any) {
      console.error("[RestaurantLoginPage] Login failed:", err);
      setError(err.message || "An error occurred during login.");
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  // Render Loading or Login Form
   if (authLoading) { // Use the loading state from AuthContext for initial checks
      return <div>Loading...</div>;
   }
   // Note: The redirect logic via useEffect/Navigate handles the already-logged-in case

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Restaurant Portal Login</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {/* Connect form onSubmit */}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your-email@restaurant.com"
                    value={email} // Bind value to state
                    onChange={(e) => setEmail(e.target.value)} // Update state on change
                    required
                    disabled={isLoading} // Use component's loading state
                    autoComplete="email" // Keep accessibility hint
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password} // Bind value to state
                    onChange={(e) => setPassword(e.target.value)} // Update state on change
                    required
                    disabled={isLoading} // Use component's loading state
                    autoComplete="current-password" // Keep accessibility hint
                  />
                </div>
              </div>
              <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                {/* Show loading text based on component's loading state */}
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
    </div>
  );
}