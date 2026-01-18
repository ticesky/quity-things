import { useLangAutoChange } from 'src/hooks/settings/useLangAutoChange';
import Demo from 'src/pages/Demo';

function App() {
    useLangAutoChange();

    return (
        <>
            <Demo />
        </>
    );
}

export default App;
