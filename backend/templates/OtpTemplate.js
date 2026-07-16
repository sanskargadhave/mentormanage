const OtpTemplate = (otp)=>{`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Password Reset OTP</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;
box-shadow:0 5px 20px rgba(0,0,0,0.08);">

<!-- Header -->
<tr>
<td align="center"
style="background:#0d6efd;padding:30px;color:white;">

<h1 style="margin:0;font-size:28px;">
🎓 EduMentor
</h1>

<p style="margin-top:8px;font-size:15px;">
Sangola College - Mentor Management System
</p>

</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<h2 style="margin-top:0;color:#222;">
Password Reset Request
</h2>

<p style="font-size:16px;color:#555;line-height:28px;">
Hello,
</p>

<p style="font-size:16px;color:#555;line-height:28px;">
We received a request to reset your account password.
Please use the following One-Time Password (OTP)
to continue.
</p>

<div
style="
margin:35px auto;
width:220px;
background:#f8f9fa;
border:2px dashed #0d6efd;
border-radius:10px;
padding:20px;
text-align:center;
">

<div
style="
font-size:38px;
font-weight:bold;
letter-spacing:10px;
color:#0d6efd;
">
${otp}
</div>

</div>

<p
style="
text-align:center;
font-size:15px;
color:#dc3545;
font-weight:bold;
">

⏰ This OTP is valid for only
<strong>5 minutes.</strong>

</p>

<hr
style="
margin:35px 0;
border:none;
border-top:1px solid #eee;
">

<p style="font-size:15px;color:#666;line-height:28px;">
If you did not request a password reset,
please ignore this email.
Your account will remain secure.
</p>

</td>
</tr>

<!-- Security Tips -->
<tr>
<td
style="
background:#f8f9fa;
padding:25px 40px;
">

<h3
style="
margin-top:0;
color:#0d6efd;
">

🔒 Security Tips

</h3>

<ul
style="
color:#555;
font-size:15px;
line-height:28px;
padding-left:20px;
">

<li>Never share your OTP with anyone.</li>

<li>College staff will never ask for your OTP.</li>

<li>Use a strong password after resetting.</li>

</ul>

</td>
</tr>

<!-- Footer -->
<tr>
<td
style="
background:#222;
color:#ddd;
text-align:center;
padding:25px;
">

<p
style="
margin:0;
font-size:14px;
">

EduMentor - Mentor Management System

</p>

<p
style="
margin:8px 0 0;
font-size:13px;
">

Designed & Developed by

<strong>Sanskar Gadhave</strong>

</p>

<p
style="
margin-top:12px;
font-size:12px;
color:#999;
">

© ${new Date().getFullYear()} Sangola College.
All Rights Reserved.

</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`};

module.exports={OtpTemplate};