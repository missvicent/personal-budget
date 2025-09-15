import { useGoogleLogin } from '@react-oauth/google'

export const Login = () => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => console.log(codeResponse),
    onError: (error) => console.log(error),
    flow: 'auth-code',
  })

  return <button onClick={() => login()}>Login</button>
}
