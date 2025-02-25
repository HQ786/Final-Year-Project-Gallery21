import { useState, useEffect } from 'react';
//import ReCAPTCHA from "react-google-recaptcha";

export const OtpModal = ({ savedEmail, userId, isOpen, onClose }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState(savedEmail);
  const [state, setState] = useState(null);
  const [verifyBtnDisabled, setVerifyBtnDisabled] = useState(true);
  const [timer, setTimer] = useState(30); 
  const [resendDisabled, setResendDisabled] = useState(false);
  const [tries, setTries] = useState(0);
  // const [captchaVerified, setCaptchaVerified] = useState(false);
  // const key = `${process.env.RECAPTCHA_SITE_KEY}`;
  useEffect(()=>{
    if(state!=null)
        setState(null);
  },[otp])

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false); // Enable resend when timer reaches 0
    }

    return () => clearInterval(countdown); // Clear timer on unmount
  }, [timer]);

  // const onCaptchaChange = (token) => {
  //   if (token) {
  //     setCaptchaVerified(true); // Enable resend once CAPTCHA is completed
  //   }
  // };

  const handleOtpChange = (element, index) => {
    const newOtp = [...otp];
    newOtp[index] = element.target.value;
    setOtp(newOtp);

    // Focus on the next input automatically if filled
    if (element.target.value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const sendOtp = async () => {
    if(tries===0)
      setTries(tries+1);
    setTimer(60); // Reset timer to 30 seconds
    setResendDisabled(true);
    const response = await fetch(`/api/user/${userId}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
        throw new Error('Failed to send otp');
    }

    setVerifyBtnDisabled(false);
    const result = await response.json();
    setState(result.message);
  };

  const verifyOtp = async () => {
    const otpValue = otp.join("");
    console.log('otpValue',otpValue)
    console.log(typeof otpValue)
    const response = await fetch(`/api/user/${userId}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otpValue }),
    });
  
    let result; // Declare a variable to hold the parsed JSON
  
    try {
      // Attempt to parse the response as JSON
      result = await response.json();
  
      if (response.ok) {
        setState(result.message); // Set the success message in state
        onClose(); // Close the modal if verification is successful
      } else {
        // Handle error responses (e.g., 4xx or 5xx)
        console.error('Error:', result.message || 'Failed to verify OTP');
        setState(result.message || 'An error occurred'); // Set the error message in state
      }
    } catch (error) {
      // Handle JSON parsing errors or other unexpected errors
      console.error('Error parsing response:', error);
      setState('An unexpected error occurred.'); // Set a general error message
    }
  };


  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-96">
        <h2 className="text-xl font-semibold mb-4">Verify Email through OTP</h2>
        <div className='flex flex-col gap-y-3'>
          <div className='flex gap-2'>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" py-1 px-2  border border-gray-300 rounded-md outline-none"
              disabled
            />
            <button
              onClick={sendOtp}
              className="text-sm font-medium bg-[#f54b33] text-white px-2 rounded-xl hover:bg-[#bd2713] transition h-8 self-center"
              disabled={resendDisabled}
            >
              {tries===0?"Send OTP" :"Resend OTP"}
            </button>
          </div>
          <div className='flex gap-2'>
            {otp.map((_, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={otp[index]}
                onChange={(e) => handleOtpChange(e, index)}
                className="w-7 h-10 text-center border-2 border-gray-300 rounded-md outline-none"
              />
            ))}
            <button
              onClick={verifyOtp}
              className={`text-sm font-medium bg-green-500 text-white px-2 rounded-xl hover:bg-green-700 transition h-8 self-center`}
              disabled={otp.includes("") || verifyBtnDisabled}
            >
              Verify OTP
            </button>
          </div>
          <div className="mt-4">
            {resendDisabled && <span className="ml-4 text-gray-500">Resend in {timer}s</span>}
          </div>
        </div>
        {state && <p className="mt-2 text-red-600">{state}</p>}
        {/* <div className="mt-4">
            <ReCAPTCHA
              sitekey={key} // Replace with your actual site key directly
              onChange={onCaptchaChange}
            />
        </div> */}
      </div>
    </div>
  );
};

//${verifyBtnDisabled?'opacity-75 hover:bg-green-500':'opacity-100'}