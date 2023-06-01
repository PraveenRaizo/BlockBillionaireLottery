import '@/styles/globals.css'
import { MoralisProvider } from 'react-moralis'
import { NotificationProvider } from 'web3uikit'

export default function App({ Component, pageProps }) { // initializeOnMount is used to hook into any server for more features for out website. Here we set it to false as we are totally dependent on local code and not on any server
  return (
    <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
    </MoralisProvider>
    )
}
