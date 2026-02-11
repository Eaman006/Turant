"use client"
import { useState, useEffect } from 'react'
import React from 'react'
import Image from 'next/image'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css' // Ensure the styles are imported
import { useRouter } from 'next/navigation'

// Firebase imports
import { auth } from '../lib/firebase' // Adjust this path if your firebase.js is elsewhere
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth'

const Page: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  // Changed to 6 digits because Firebase OTPs are strictly 6 digits
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']); 
  const [timer, setTimer] = useState<number>(60);
  
  // Firebase specific states
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const router = useRouter();

  // Initialize reCAPTCHA on component mount
  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  const handleGetOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    
    // India code (91) + 10 digits = 12
    if (digitsOnly.length < 12) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    } 

    setError("");
    setLoading(true);

    try {
      // Firebase requires E.164 format (e.g., +919999999999)
      const formattedNumber = `+${digitsOnly}`;
      const appVerifier = (window as any).recaptchaVerifier;
      
      const confirmation = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      
      setConfirmationResult(confirmation);
      setStep(2);
      setTimer(60); // Reset timer just in case
    } catch (err: any) {
      console.error("Error during OTP request:", err);
      setError("Failed to send OTP. Try again.");
      // If reCAPTCHA fails, you sometimes need to reset it
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.render().then((widgetId: any) => {
          (window as any).grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    // Auto-focus next input (Updated to index < 5 for 6 digits)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    // Auto-focus previous input if backspacing
    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!confirmationResult) throw new Error("No confirmation result found.");
      
      const result = await confirmationResult.confirm(otpCode);
      const user = result.user;
      
      console.log("Successfully logged in!", user);
      // SUCCESS! Show verified message and redirect to home
      setSuccess("OTP verified successfully! Redirecting to home...");
      setTimeout(() => {
        router.push('/home');
      }, 1000);

    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      setError("Incorrect OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex h-screen w-full bg-[#FFF3E0] overflow-hidden'>
      {/* Invisible reCAPTCHA container required by Firebase */}
      <div id="recaptcha-container"></div>

      {/* LEFT SECTION */}
      <div className="hidden lg:flex w-1/2 h-full relative bg-[url('/tt.png')] bg-cover bg-center items-center justify-center">
        <div className="relative w-[80%] h-[80%]">
          <Image
            src="/log.png"
            fill
            alt='Illustration'
            priority
            className='object-contain'
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="bg-white w-full lg:w-1/2 h-full flex items-center justify-center p-6">

        {step === 1 ? (
          <form className='flex flex-col gap-6 w-full max-w-md' onSubmit={handleGetOtp}>
            <div className='text-[#3E2723] text-6xl font-bold font-[family-name:var(--font-poppins)]'>
              Namaste!
            </div>

            <div className="flex flex-col gap-1">
              <label className='text-[#333333] text-sm font-bold'>
                Phone Number
              </label>
              <div className="relative">
                <PhoneInput
                  country={'in'}
                  value={phoneNumber}
                  onChange={(phone) => {
                    setPhoneNumber(phone);
                    if (error) setError("");
                  }}
                  inputStyle={{
                    height: '52px',
                    width: '100%',
                    fontSize: '1.25rem',
                    fontWeight: '500',
                    background: '#F5F5F5',
                    borderRadius: '8px',
                    border: error ? '1px solid #ef4444' : '1px solid #e5e7eb'
                  }}
                  buttonStyle={{
                    height: '52px',
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px',
                    border: error ? '1px solid #ef4444' : '1px solid #e5e7eb'
                  }}
                  dropdownStyle={{
                    fontSize: '2rem'
                  }}
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {error}
                  </p>
                )}
              </div>
            </div>
            
            <div className='flex justify-center'>
              <button
                type="submit"
                disabled={loading}
                className={`w-1/2 py-3 text-white text-lg font-bold rounded-lg transition-all shadow-md cursor-pointer ${loading ? 'bg-gray-400' : 'bg-[#E67E22] hover:bg-[#d6711c]'}`}
              >
                {loading ? "SENDING..." : "GET OTP"}
              </button>
            </div>

            <div className='flex items-center gap-4'>
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              type="button"
              className='text-[#333333] text-base font-medium flex items-center justify-center gap-3 border py-2.5 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer'
            >
              <Image src="/Search.png" height={20} width={20} alt='G' />
              Login with Google
            </button>
          </form>
        ) : (
          /* OTP VIEW */
          <div className='flex flex-col gap-5 w-full max-w-md'>
            <h2 className='text-[#3E2723] text-4xl font-bold'>OTP Verification</h2>
            <p className='text-gray-500 text-sm'>
              Enter the OTP sent to your registered phone number.
            </p>

            <div className="flex justify-between gap-2 my-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  className="w-12 h-14 border border-gray-300 rounded-lg text-center text-xl font-bold focus:border-[#E67E22] outline-none"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => {
                    // Better UX: Handle backspace to go to previous input
                    if (e.key === 'Backspace' && !data && index > 0) {
                      document.getElementById(`otp-${index - 1}`)?.focus();
                    }
                  }}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-xs font-medium text-center">
                {error}
              </p>
            )}

            {success && (
              <p className="text-green-600 text-xs font-medium text-center mt-1">
                {success}
              </p>
            )}

            <div className="flex justify-between text-xs text-gray-400">
              <span>Remaining time: <span className="text-orange-500">00:{timer < 10 ? `0${timer}` : timer}s</span></span>
              <span>Didn't get code? <span className="text-[#E67E22] cursor-pointer font-bold" onClick={(e) => timer === 0 && handleGetOtp(e as any)}>Resend</span></span>
            </div>

            <button 
              onClick={handleVerifyOtp}
              disabled={loading}
              className={`w-full py-3 text-white text-lg font-bold rounded-full shadow-lg cursor-pointer ${loading ? 'bg-gray-400' : 'bg-[#E67E22]'}`}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
            <button 
              onClick={() => {
                setStep(1);
                setOtp(['', '', '', '', '', '']);
                setError("");
                setSuccess("");
              }} 
              className="w-full py-2 text-gray-400 font-bold uppercase text-sm cursor-pointer hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page