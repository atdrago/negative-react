import { initialize as initRemote } from '@electron/remote/main';

import { init as initApp } from 'main/app';

initRemote();
initApp();
