import { Github } from "lucide-react";

function Signin() {
  const handleGithubSignin = async () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signin`;
  };

  // const handleGoogleSignin = () => {
  //   window.location.href = "http://localhost:3000/api/v1/auth/signin";
  // };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
          Welcome Back 👋
        </h1>
        <p className="text-gray-500 text-center text-sm mt-2">
          Sign in to continue to <span className="font-medium">Chronos</span>
        </p>

        <div className="mt-8 space-y-3">
          <button
            onClick={handleGithubSignin}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Github className="w-5 h-5" />
            <span className="text-sm font-medium">Continue with GitHub</span>
          </button>

          {/* <button
            onClick={handleGoogleSignin}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <IconBrandGoogle fill="#000" className="w-5 h-5" />
            <span className="text-sm font-medium">Continue with Google</span>
          </button> */}
        </div>

        <p className="text-xs text-center text-gray-400 mt-6">
          By signing in, you agree to our{" "}
          <span className="underline cursor-pointer hover:text-gray-600">
            Terms
          </span>{" "}
          and{" "}
          <span className="underline cursor-pointer hover:text-gray-600">
            Privacy Policy
          </span>.
        </p>
      </div>
    </div>
  );
}

export default Signin;
