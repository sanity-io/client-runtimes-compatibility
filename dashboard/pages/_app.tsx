import { studioTheme, ThemeProvider } from '@sanity/ui'
import type { AppProps } from 'next/app'
import 'style.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={studioTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
