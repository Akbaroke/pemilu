import * as React from 'react'
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import { Toaster } from 'react-hot-toast'
import { getAnalytics } from 'firebase/analytics'
import app from '@/lib/firebase/init'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  React.useEffect(() => {
    getAnalytics(app)
  }, [])

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <Toaster />
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  )
}
