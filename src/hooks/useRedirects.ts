import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"

const useLoginRedirect = (redirectTo: string) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // ログイン済みならリダイレクト
    if (user) { navigate(redirectTo, { replace: true }) }
  }, [user, navigate, redirectTo])
}

const useLogoutRedirect = (redirectTo: string) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // ログアウト済みならリダイレクト
    if (!user) { navigate(redirectTo, { replace: true }) }
  }, [user, navigate, redirectTo])
}

export { useLoginRedirect, useLogoutRedirect }
