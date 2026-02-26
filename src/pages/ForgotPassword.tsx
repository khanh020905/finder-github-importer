import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Phone, Lock, Check, ArrowRight, Flame } from "lucide-react";

const ForgotPassword = () => {
  const nav = useNavigate();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [step, setStep] = useState<"input" | "otp" | "reset" | "done">("input");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  if (step === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center space-y-6 animate-scale-in">
          <div className="w-20 h-20 rounded-3xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto"><Check className="w-10 h-10 text-green-500" /></div>
          <div><h2 className="text-2xl font-bold">Password Reset! 🎉</h2><p className="text-sm text-muted-foreground mt-2">Log in with your new password.</p></div>
          <Button onClick={() => nav("/login")} className="w-full h-[52px] rounded-2xl gradient-hot border-0 text-white font-semibold shadow-elevated">Log In Now <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-12">
      <div className="max-w-sm mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => { if (step==="input") nav("/login"); else step==="otp" ? setStep("input") : setStep("otp"); }} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button>
          <Flame className="w-5 h-5 text-primary" />
        </div>
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold">{step==="input"?"Reset Password":step==="otp"?"Verify OTP":"New Password"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{step==="input"?"Enter your registered email or phone":step==="otp"?`OTP sent to ${method==="email"?email:phone}`:"Create a new password"}</p>
        </div>
        {step==="input" && (
          <form onSubmit={(e)=>{e.preventDefault();setStep("otp")}} className="space-y-4 animate-slide-up">
            <div className="flex gap-2">
              {([["email","Email",Mail],["phone","SMS",Phone]] as const).map(([v,l,I]) => (
                <button key={v} type="button" onClick={() => setMethod(v)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${method===v?"gradient-hot text-white":"bg-muted text-muted-foreground"}`}><I className="w-4 h-4" />{l}</button>
              ))}
            </div>
            <Input type={method==="email"?"email":"tel"} value={method==="email"?email:phone} onChange={(e)=> method==="email"?setEmail(e.target.value):setPhone(e.target.value)} placeholder={method==="email"?"email@example.com":"0901 234 567"} className="h-[52px] rounded-2xl bg-muted/40 border-0 focus:ring-2 focus:ring-primary/20" />
            <Button type="submit" className="w-full h-[52px] rounded-2xl gradient-hot border-0 text-white font-semibold shadow-elevated">Send OTP <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </form>
        )}
        {step==="otp" && (
          <form onSubmit={(e)=>{e.preventDefault();setStep("reset")}} className="space-y-4 animate-slide-up">
            <div className="flex gap-2 justify-center">
              {[0,1,2,3,4,5].map((i)=>(<Input key={i} maxLength={1} value={otp[i]||""} onChange={(e)=>{const v=e.target.value;const n=otp.split("");n[i]=v;setOtp(n.join(""));if(v&&i<5)(e.target.parentElement?.children[i+1] as HTMLInputElement)?.focus();}} className="w-12 h-14 text-center text-xl font-bold rounded-2xl bg-muted/40 border-0 focus:ring-2 focus:ring-primary/20" />))}
            </div>
            <p className="text-xs text-muted-foreground text-center">Didn't receive? <button type="button" className="text-primary font-semibold hover:underline">Resend</button></p>
            <Button type="submit" className="w-full h-[52px] rounded-2xl gradient-hot border-0 text-white font-semibold shadow-elevated">Verify</Button>
          </form>
        )}
        {step==="reset" && (
          <form onSubmit={(e)=>{e.preventDefault();setStep("done")}} className="space-y-4 animate-slide-up">
            <div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} placeholder="New password (min 8 chars)" className="h-[52px] rounded-2xl bg-muted/40 border-0 pl-11 focus:ring-2 focus:ring-primary/20" /></div>
            <div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="password" value={pw2} onChange={(e)=>setPw2(e.target.value)} placeholder="Confirm password" className="h-[52px] rounded-2xl bg-muted/40 border-0 pl-11 focus:ring-2 focus:ring-primary/20" /></div>
            <Button type="submit" className="w-full h-[52px] rounded-2xl gradient-hot border-0 text-white font-semibold shadow-elevated">Reset Password</Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
