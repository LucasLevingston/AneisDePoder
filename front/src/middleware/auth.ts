// middleware/auth.js
import { useUser } from '../hooks/use-user.ts'
import { useEffect } from 'react'

const useAuth = () => {
  const user = useUser((state) => state.user)

  useEffect(() => {
    if (!user) {
      window.location.href = '/login'
    }
  }, [user])
}

export default useAuth
