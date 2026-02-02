// web/src/App.tsx
import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import Routes from 'src/Routes'

import { AuthContextProvider } from './contexts/AuthContexts'
import { CartProvider } from './contexts/CartContext'

import './index.css'

const App = () => (
  <FatalErrorBoundary>
    <RedwoodProvider>
      <RedwoodApolloProvider>
        <AuthContextProvider>
          <CartProvider>
            <Routes />
          </CartProvider>
        </AuthContextProvider>
      </RedwoodApolloProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
