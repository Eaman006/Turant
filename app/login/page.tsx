"use client"
import { useState, useEffect } from 'react'
import React from 'react'
import Image from 'next/image'
import PhoneInput from 'react-phone-input-2'

const Page = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  const handleGetOtp = (e) => {
    e.preventDefault();
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    // India code (91) + 10 digits = 12
    if (digitsOnly.length < 12) {
      setError("Please enter a valid 10-digit mobile number");
    } else {
      setError("");
      setStep(2);
    }
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    /* h-screen + overflow-hidden prevents "extra height" scrolling */
    <div className='flex h-screen w-full bg-[#FFF3E0] overflow-hidden'>

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
          <form className='flex flex-col gap-6 w-full max-w-md'>
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
                    fontSize: '1.25rem', // Increased text size (approx 20px)
                    fontWeight: '500',    // Optional: makes it easier to read
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
                  // Optional: Increases text size in the country dropdown list as well
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
                onClick={handleGetOtp}
                className="w-1/2 py-3 bg-[#E67E22] text-white text-lg font-bold rounded-lg hover:bg-[#d6711c] transition-all shadow-md cursor-pointer"
              >
                GET OTP
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
              <Image src="/Search.png" height={20} width={20} alt='G'></Image>
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

            <div className="flex justify-between gap-3 my-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="w-14 h-14 border border-gray-300 rounded-lg text-center text-xl font-bold focus:border-[#E67E22] outline-none"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                />
              ))}
            </div>

            <div className="flex justify-between text-xs text-gray-400">
              <span>Remaining time: <span className="text-orange-500">00:{timer < 10 ? `0${timer}` : timer}s</span></span>
              <span>Didn't get code? <span className="text-[#E67E22] cursor-pointer font-bold">Resend</span></span>
            </div>

            <button className="w-full py-3 bg-[#E67E22] text-white text-lg font-bold rounded-full shadow-lg cursor-pointer">
              Verify
            </button>
            <button onClick={() => setStep(1)} className="w-full py-2 text-gray-400 font-bold uppercase text-sm cursor-pointer">
              cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page