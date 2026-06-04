'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, { error: null })

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-black text-3xl tracking-widest mb-8">
          LC STUDIO
        </h1>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-medium text-black/50 tracking-wider uppercase">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="border border-black/20 px-4 py-3 text-sm text-black outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs font-medium text-black/50 tracking-wider uppercase">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="border border-black/20 px-4 py-3 text-sm text-black outline-none focus:border-black transition-colors"
            />
          </div>

          {state.error && (
            <p className="text-red-600 text-sm">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 bg-black text-white text-xs font-medium tracking-widest uppercase py-4 hover:bg-black/80 transition-colors disabled:opacity-50"
          >
            {pending ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  )
}
