import { Emitter } from '@jujulego/event-tree';

import { Log } from './index.js';

// Types
export type LogTransport<L extends Log> = Emitter<L>;
