import React, { useState } from 'react';
import { useAuth } from './auth-context';
import { Brain, Heart, Activity, Shield, Plus, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { toast } from 'sonner';

export default function LoginPage() {
  const { signInWithGoogle, register, login } = useAuth();
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerStep, setRegisterStep] = useState(1); // 1 = basic info, 2 = account settings
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerGender, setRegisterGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [registerCgpa, setRegisterCgpa] = useState('');
  const [registerActivities, setRegisterActivities] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(loginUsername, loginPassword);
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    // Validate step 1 fields
    if (!registerUsername || !registerPassword || !registerEmail || !registerFullName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (registerPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // Move to step 2
    setRegisterStep(2);
  };

  const handleBackStep = () => {
    setRegisterStep(1);
  };

  const handleRegister = async () => {
    // Validate step 2 required field
    if (!registerGender) {
      toast.error('Please select your gender');
      return;
    }

    if (registerCgpa && (isNaN(parseFloat(registerCgpa)) || parseFloat(registerCgpa) < 0 || parseFloat(registerCgpa) > 10)) {
      toast.error('CGPA must be between 0 and 10');
      return;
    }

    const validActivities = registerActivities.filter(activity => activity.trim() !== '');

    setLoading(true);
    try {
      await register(registerUsername, registerPassword, {
        email: registerEmail,
        fullName: registerFullName,
        gender: registerGender,
        cgpa: registerCgpa ? parseFloat(registerCgpa) : undefined,
        extracurricularActivities: validActivities.length > 0 ? validActivities : undefined,
      });
      toast.success('Account created successfully!');
      // User will be automatically redirected to home page via App.tsx when user state is set
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = () => {
    if (registerActivities.length < 5) {
      setRegisterActivities([...registerActivities, '']);
    }
  };

  const handleRemoveActivity = (index: number) => {
    setRegisterActivities(registerActivities.filter((_, i) => i !== index));
  };

  const handleActivityChange = (index: number, value: string) => {
    const updated = [...registerActivities];
    updated[index] = value;
    setRegisterActivities(updated);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--nb-peach) 0%, var(--nb-yellow) 100%)', padding: '2rem' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="text-center md:text-left space-y-6">
            <div className="inline-flex items-center gap-3 nb-card nb-card-lavender" style={{ padding: '1rem 2rem' }}>
              <Brain className="w-6 h-6" style={{ color: 'var(--nb-black)' }} />
              <span className="nb-heading-xs" style={{ fontSize: '1rem', letterSpacing: '1px' }}>AI-POWERED WELLNESS</span>
            </div>

            <h1 className="nb-heading-xl" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
              VISHUDDHI<span style={{ color: '#8B5CF6' }}>.</span>
            </h1>

            <p className="nb-body" style={{ fontSize: '1.25rem', maxWidth: '500px', margin: '0 auto', marginLeft: 'md:0' }}>
              Your personal stress management companion powered by machine learning
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="nb-card" style={{ padding: '1.5rem' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 nb-card-lavender flex items-center justify-center" style={{ borderRadius: '50%', border: 'var(--nb-border-md)', boxShadow: 'var(--nb-shadow-sm)' }}>
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="nb-heading-xs" style={{ fontSize: '0.875rem' }}>ML PREDICTIONS</p>
                  </div>
                </div>
              </div>

              <div className="nb-card" style={{ padding: '1.5rem' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 nb-card-peach flex items-center justify-center" style={{ borderRadius: '50%', border: 'var(--nb-border-md)', boxShadow: 'var(--nb-shadow-sm)' }}>
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="nb-heading-xs" style={{ fontSize: '0.875rem' }}>CYCLE TRACKING</p>
                  </div>
                </div>
              </div>

              <div className="nb-card" style={{ padding: '1.5rem' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 nb-card-mint flex items-center justify-center" style={{ borderRadius: '50%', border: 'var(--nb-border-md)', boxShadow: 'var(--nb-shadow-sm)' }}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="nb-heading-xs" style={{ fontSize: '0.875rem' }}>DAILY JOURNALING</p>
                  </div>
                </div>
              </div>

              <div className="nb-card" style={{ padding: '1.5rem' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 nb-card-yellow flex items-center justify-center" style={{ borderRadius: '50%', border: 'var(--nb-border-md)', boxShadow: 'var(--nb-shadow-sm)' }}>
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="nb-heading-xs" style={{ fontSize: '0.875rem' }}>24/7 SUPPORT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login/Register Card */}
          <div className="nb-card" style={{ padding: '3rem' }}>
            <div className="text-center space-y-6">
              <div>
                <h2 className="nb-heading-md" style={{ marginBottom: '0.5rem' }}>WELCOME</h2>
                <p className="nb-body">Sign in or create an account to continue your wellness journey</p>
              </div>

              <Tabs defaultValue="login" className="w-full" onValueChange={(value) => {
                if (value === 'register') {
                  setRegisterStep(1); // Reset to step 1 when switching to register tab
                }
              }}>
                <TabsList className="w-full grid grid-cols-2 mb-6">
                  <TabsTrigger value="login">LOGIN</TabsTrigger>
                  <TabsTrigger value="register">REGISTER</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-left mb-2 nb-body-sm" style={{ fontWeight: 600 }}>
                        Username
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter your username"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem' }}
                      />
                    </div>
                    <div>
                      <label className="block text-left mb-2 nb-body-sm" style={{ fontWeight: 600 }}>
                        Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem' }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleLogin();
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleLogin}
                      disabled={loading || !loginUsername || !loginPassword}
                      className="nb-button nb-button-primary"
                      style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                    >
                      {loading ? 'Signing in...' : 'SIGN IN'}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <div className="space-y-4" style={{ minHeight: '400px' }}>
                    {/* Step 1: Basic Information */}
                    {registerStep === 1 && (
                      <>
                        <div className="nb-card nb-card-lavender" style={{ padding: '0.75rem', marginBottom: '0.5rem' }}>
                          <div className="nb-body-sm" style={{ fontWeight: 600 }}>BASIC INFORMATION</div>
                        </div>

                        <div>
                          <label className="block text-left mb-2 nb-body-sm" style={{ fontWeight: 600 }}>
                            Username <span style={{ color: '#EA4335' }}>*</span>
                          </label>
                          <Input
                            type="text"
                            placeholder="Choose a username"
                            value={registerUsername}
                            onChange={(e) => setRegisterUsername(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem' }}
                          />
                        </div>

                        <div>
                          <label className="block text-left mb-2 nb-body-sm" style={{ fontWeight: 600 }}>
                            Email <span style={{ color: '#EA4335' }}>*</span>
                          </label>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem' }}
                          />
                        </div>

                        <div>
                          <label className="block text-left mb-2 nb-body-sm" style={{ fontWeight: 600 }}>
                            Full Name <span style={{ color: '#EA4335' }}>*</span>
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter your full name"
                            value={registerFullName}
                            onChange={(e) => setRegisterFullName(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem' }}
                          />
                        </div>

                        <div>
                          <label className="block text-left mb-2 nb-body-sm" style={{ fontWeight: 600 }}>
                            Password <span style={{ color: '#EA4335' }}>*</span>
                          </label>
                          <Input
                            type="password"
                            placeholder="Create a password (min. 6 characters)"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem' }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleNextStep();
                              }
                            }}
                          />
                        </div>

                        <div>
                          <label className="block text-left mb-2 nb-body-sm" style={{ fontWeight: 600 }}>
                            Confirm Password <span style={{ color: '#EA4335' }}>*</span>
                          </label>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem' }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleNextStep();
                              }
                            }}
                          />
                        </div>

                        {registerPassword && confirmPassword && registerPassword !== confirmPassword && (
                          <p className="text-sm" style={{ color: '#EA4335', textAlign: 'left' }}>
                            Passwords do not match
                          </p>
                        )}

                        <div className="flex justify-end mt-4">
                          <Button
                            onClick={handleNextStep}
                            disabled={!registerUsername || !registerPassword || !registerEmail || !registerFullName || registerPassword !== confirmPassword}
                            className="nb-button nb-button-primary"
                            style={{ padding: '1rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                          >
                            Next
                            <ArrowRight className="w-5 h-5" />
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Step 2: Account Settings */}
                    {registerStep === 2 && (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={handleBackStep}
                            className="nb-button nb-button-secondary"
                            style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <div className="nb-card nb-card-peach" style={{ padding: '0.75rem', flex: 1, marginLeft: '0.5rem', marginRight: '0.5rem' }}>
                            <div className="nb-body-sm" style={{ fontWeight: 600 }}>ACCOUNT SETTINGS</div>
                          </div>
                          <div style={{ width: '48px' }}></div>
                        </div>

                        <div>
                          <label className="block text-left mb-2 nb-body-sm" style={{ fontWeight: 600 }}>
                            Gender <span style={{ color: '#EA4335' }}>*</span>
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {['male', 'female', 'other'].map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setRegisterGender(g as any)}
                                className={`nb-toggle ${registerGender === g ? 'active' : ''}`}
                                style={{
                                  background: registerGender === g ? 'var(--nb-black)' : 'var(--nb-white)',
                                  color: registerGender === g ? 'var(--nb-white)' : 'var(--nb-black)',
                                  padding: '0.75rem',
                                  fontSize: '0.875rem',
                                }}
                              >
                                {g.charAt(0).toUpperCase() + g.slice(1)}
                              </button>
                            ))}
                          </div>
                          <p className="nb-body-sm mt-1" style={{ opacity: 0.7 }}>
                            Helps us provide personalized features
                          </p>
                        </div>

                        <div>
                          <label className="block text-left mb-2 nb-body-sm" style={{ fontWeight: 600 }}>
                            CGPA (Optional)
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            placeholder="Enter your CGPA (0-10)"
                            value={registerCgpa}
                            onChange={(e) => setRegisterCgpa(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem' }}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-left nb-body-sm" style={{ fontWeight: 600 }}>
                              Extracurricular Activities (Optional)
                            </label>
                            {registerActivities.length < 5 && (
                              <button
                                type="button"
                                onClick={handleAddActivity}
                                className="nb-button nb-button-sm"
                                style={{ background: 'var(--nb-mint)', padding: '0.25rem 0.5rem' }}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <div className="space-y-2">
                            {registerActivities.map((activity, index) => (
                              <div key={index} className="flex gap-2 items-center">
                                <Input
                                  type="text"
                                  placeholder={`Activity ${index + 1} (e.g., Sports, Clubs)`}
                                  value={activity}
                                  onChange={(e) => handleActivityChange(index, e.target.value)}
                                  style={{ flex: 1, padding: '0.75rem' }}
                                />
                                {registerActivities.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveActivity(index)}
                                    className="nb-button nb-button-sm"
                                    style={{ background: 'var(--nb-red-light)', padding: '0.5rem' }}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          <p className="nb-body-sm mt-1" style={{ opacity: 0.7 }}>
                            Add up to 5 activities (clubs, sports, volunteering, etc.)
                          </p>
                        </div>

                        <Button
                          onClick={handleRegister}
                          disabled={loading || !registerGender}
                          className="nb-button nb-button-primary"
                          style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '1rem' }}
                        >
                          {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
                        </Button>
                      </>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 nb-body-sm" style={{ backgroundColor: 'var(--nb-white)', color: 'rgba(0,0,0,0.6)' }}>
                    OR
                  </span>
                </div>
              </div>

              <button
                onClick={signInWithGoogle}
                className="nb-button nb-button-secondary"
                style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', justifyContent: 'center' }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="text-center nb-body-sm" style={{ paddingTop: '1rem', color: 'rgba(0,0,0,0.6)' }}>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Banner */}
        <div className="mt-8 nb-card nb-card-gradient" style={{ padding: '2rem', textAlign: 'center' }}>
          <p className="nb-body" style={{ color: 'var(--nb-white)', fontSize: '1.1rem', fontWeight: 600 }}>
            🎉 Join 1,247+ students already managing their mental wellness with Vishuddhi
          </p>
        </div>
      </div>
    </div>
  );
}
