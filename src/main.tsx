import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from "react-redux";
import { Store, persistor } from './library/store.ts';
import { PersistGate } from "redux-persist/integration/react";


createRoot(document.getElementById('root')!).render(
  <Provider store={Store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
