const EventEmitter = require('events');

/**
 * PlocEventEmitter
 * Centralizador de eventos do sistema para desacoplamento de ações.
 */
class PlocEventEmitter extends EventEmitter {}

const eventEmitter = new PlocEventEmitter();

// Definição de Eventos Comuns
const EVENTS = {
    TASK: {
        CREATED: 'task.created',
        UPDATED: 'task.updated',
        DELETED: 'task.deleted',
        COMPLETED: 'task.completed'
    },
    USER: {
        LOGIN: 'user.login',
        REGISTERED: 'user.registered'
    },
    AI: {
        INTERACTION: 'ai.interaction'
    }
};

module.exports = {
    emitter: eventEmitter,
    EVENTS
};
