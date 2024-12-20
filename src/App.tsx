import Home from '@/components/pages/Home';
import AccessWrapper from './components/core/AccessWrapper';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div>
      <AccessWrapper>
        <Home />
      </AccessWrapper>
      <Toaster />
    </div>
  );
}

export default App;
