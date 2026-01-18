import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { createRoot } from 'react-dom/client';
import { rootStore, StoreProvider } from './store';
import { setupI18n } from './i18n';
import App from './App';
// styles
import 'src/styles/variables/index.scss';

setupI18n();

const root = document.getElementById('root');

if (root) {
    createRoot(root).render(
        <StoreProvider store={rootStore}>
            <App />
        </StoreProvider>,
    );
}
