import config from './config';

export function getSteps(){
    return fetch(`${config.baseUrl}`)
        .then(response => response.json())
        .then(response => response.steps);
}