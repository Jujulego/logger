import { Receiver } from 'kyrielle';

import { Log } from './index.js';

// Types
export interface LogReceiver<in L extends Log> extends Receiver<L> {}
