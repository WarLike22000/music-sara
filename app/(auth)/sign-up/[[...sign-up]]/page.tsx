import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
    return ( 
        <div className="flex items-center justify-center h-screen w-full backdrop-blur-sm">
            <SignUp />
        </div>
     );
}
 
export default SignUpPage;