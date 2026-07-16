import { useState,useRef, useEffect,useMemo} from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import "animate.css";
import { BiEnvelope, BiArrowBack,BiLock, BiHide, BiShow, BiCheckCircle, BiShieldQuarter} from "react-icons/bi";
import axiosInstance from "../axiosInstance";
import axios from "axios";
import { showToast } from "../utils/showToast";
function ForgetPassword()
{
    const [step, setStep] = useState(1);
     const [email, setEmail] = useState("");
    return(
        <div className="page-content forgot-container-otp">
            {step===1 && (
                <EmailVerification  email={email} setEmail={setEmail}  setStep={setStep}/>
            )}
            {step===2 && (
                <OtpVerification email={email} setStep={setStep}/>
            )}
            {step===3 && (
                <ResetPassword email={email}/>
            )}
        </div>

    )
}

function EmailVerification({email,setEmail,setStep}) {

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email)
    {
      alert("Please Select Emailid");
    }

    console.log(email);
    try{
      setLoading(true);
      const resp=await axiosInstance.post("/common/send-reset-otp",{emailid:email});
      if(resp.data.success)
      {
        showToast.success(resp.data.message);
        setStep(2); 
      }
    }
    catch(err)
    {
     console.log(err.message);
    }
    finally{
      setLoading(false);
    }
    
  };
  const navigate=useNavigate();
  return (
      <div className="forgot-card-otp animate__animated animate__fadeIn">

        <button className="back-btn-otp" onClick={()=>navigate("/login")}>
          <BiArrowBack />
        </button>

        <div className="forgot-icon-otp">
          <BiEnvelope />
        </div>

        <h2>Forgot Password</h2>

        <p>
          Enter your registered email address.
          <br />
          We'll send you a verification code.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group-otp">

            <label>Email Address</label>

            <div className="input-box-otp">

              <BiEnvelope className="input-icon-otp" />

              <input
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

          </div>

          <button className="send-btn-otp" type="submit" disabled={loading}>
           {loading ? (
            <>
              <span className="spinner-otp"></span>
              Sending...
          </>
          ) : (
            "Send Verification Code"
          )}
          </button>

        </form>

        <div className="security-box-otp">

          🔒 OTP expires in 5 minutes.

        </div>

      </div>

  );
}

function OtpVerification({email,setStep}) {
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(300);
    const navigate=useNavigate();
    const inputRefs = useRef([]);

    useEffect(() => {

        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);

    }, [timer]);

    const handleChange = (e, index) => {

        const value = e.target.value.replace(/\D/g, "");

        if (!value) return;

        const newOtp = [...otp];

        newOtp[index] = value;

        setOtp(newOtp);

        if (index < 5)
            inputRefs.current[index + 1].focus();

    };

    const handleKeyDown = (e, index) => {

        if (e.key === "Backspace") {

            const newOtp = [...otp];

            if (newOtp[index] === "") {

                if (index > 0)
                    inputRefs.current[index - 1].focus();

            } else {

                newOtp[index] = "";

                setOtp(newOtp);

            }

        }

    };

    const handlePaste = (e) => {

        e.preventDefault();

        const value = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (value.length === 6) {

            const arr = value.split("");

            setOtp(arr);

            arr.forEach((item, index) => {

                inputRefs.current[index].value = item;

            });

        }

    };

    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");

    const seconds = String(timer % 60).padStart(2, "0");

    const verifyOTP = async () => {

        
        try{
          setLoading(true);
          const resp=await axiosInstance.post("/common/verify-user-otp",{emailid:email,otp:otp.join("")});
          if(resp.data.success) 
          { 
            showToast.success(resp.data.message);
            setStep(3);
          }
          
        }
        catch(err)
        {
          console.log(err.message);
        }
        finally{
          setLoading(false);
        }

    };

    return (
            <div className="forgot-card-otp animate__animated animate__fadeIn">

                <button className="back-btn-otp">

                    <BiArrowBack />

                </button>

                <div className="forgot-icon-otp">

                    <BiShieldQuarter />

                </div>

                <h2>Verify OTP</h2>

                <p>

                    Enter the 6-digit code sent to

                    <br />

                    <strong>{email}</strong>

                </p>

                <div className="otp-wrapper-otp">

                    {otp.map((digit, index) => (

                        <input

                            key={index}

                            type="text"

                            maxLength="1"

                            className="otp-input-otp"

                            ref={(el) => inputRefs.current[index] = el}

                            value={digit}

                            onPaste={handlePaste}

                            onChange={(e) => handleChange(e, index)}

                            onKeyDown={(e) => handleKeyDown(e, index)}

                        />

                    ))}

                </div>

                <div className="timer-otp">

                    OTP expires in

                    <span>

                        {minutes}:{seconds}

                    </span>

                </div>

                <button
                    className="send-btn-otp"
                    onClick={verifyOTP} disabled={loading}
                >

                    {loading ? (
            <>
              <span className="spinner-otp"></span>
              Verifying...
          </>
          ) : (
            "Verify OTP"
          )}

                </button>

                <div className="resend-otp">

                    Didn't receive OTP?

                    <button onClick={()=>setStep(1)}>

                        Resend OTP

                    </button>

                </div>

            </div>

       

    );

}

 function ResetPassword({email}) {
  const navigate=useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const rules = useMemo(() => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }), [password]);

  const strength = Object.values(rules).filter(Boolean).length;

  const strengthText = [
    "Very Weak",
    "Weak",
    "Medium",
    "Strong",
    "Very Strong",
  ][strength];

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {
      showToast.error("Passwords do not match.");
      return;
    }
      try{
        setLoading(true);
        const resp=await axiosInstance.post("/common/reset-user-password",{emailid:email,password:confirmPassword});
        console.log(resp.data.message);
        if(resp.data.success)
        {
          showToast.success(resp.data.message);
          navigate("/login");
        }
          
      }
      catch(err)
      {
        console.log(err.message);
      }
      finally{
        setLoading(false);
      }


  };

  return (

      <div className="forgot-card-otp animate__animated animate__fadeInUp">

        <div className="forgot-icon-otp">
          <BiLock />
        </div>

        <h2>Create New Password</h2>

        <p>
          Your identity has been verified.
          <br />
          Please create a secure password.
        </p>

        <form onSubmit={handleSubmit}>

          <label style={{marginTop:"20px",color:"white"}}>New Password</label>

          <div className="password-box-otp">

            <BiLock className="input-icon-otp"/>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <button
              type="button"
              className="eye-btn-otp"
              onClick={()=>setShowPassword(!showPassword)}
            >

              {showPassword ? <BiHide/> : <BiShow/>}

            </button>

          </div>

          <label style={{marginTop:"20px",color:"white"}}>
            Confirm Password
          </label>

          <div className="password-box-otp">

            <BiLock className="input-icon-otp"/>

            <input
              type={showConfirmPassword ? "text":"password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              className="eye-btn-otp"
              onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
            >

              {showConfirmPassword ? <BiHide/> : <BiShow/>}

            </button>

          </div>

          <div className="strength-otp">

            <div className="strength-bar-otp">

              <div
                className="strength-fill-otp"
                style={{
                  width:`${strength*25}%`
                }}
              />

            </div>

            <span>{strengthText}</span>

          </div>

          <div className="rules-otp">

            <div className={rules.length ? "valid-otp":"invalid-otp"}>
              <BiCheckCircle/> Minimum 8 Characters
            </div>

            <div className={rules.upper ? "valid-otp":"invalid-otp"}>
              <BiCheckCircle/> One Uppercase Letter
            </div>

            <div className={rules.number ? "valid-otp":"invalid-otp"}>
              <BiCheckCircle/> One Number
            </div>

            <div className={rules.special ? "valid-otp":"invalid-otp"}>
              <BiCheckCircle/> One Special Character
            </div>

          </div>

          <button className="send-btn-otp" disabled={loading}>

             {loading ? (
            <>
              <span className="spinner-otp"></span>
              Updating...
          </>
          ) : (
            "Update Password"
          )}

          </button>

        </form>

      </div>

    

  );

}

export default ForgetPassword;