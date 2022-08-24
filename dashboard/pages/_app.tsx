import { studioTheme, ThemeProvider } from '@sanity/ui'
import { enableMapSet } from 'immer'
import type { AppProps } from 'next/app'
import 'style.css'

enableMapSet()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={studioTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
