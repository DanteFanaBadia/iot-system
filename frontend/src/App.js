import './App.css';
import { getMqttClient } from './device';
import { getSteps } from './api';
import config from './config';
import React from 'react';


class App extends React.Component {

   constructor(props) {
      super(props);

      const mqttClient = getMqttClient();
      mqttClient.on('connect', () => { 
         mqttClient.subscribe(config.topic, () => console.log('mqttClient subscribe'));
         console.log('mqttClient connect');
      });
      mqttClient.on('reconnect', () => console.log('reconnect'));

      this.state = {
         enable: false,
         mqttClient: mqttClient,
         count: 10,
         steps: 0
      };
   }

   request(){
      this.state.mqttClient.publish(config.topic, JSON.stringify({}));
   };

   enable(topic, payload){
      if(this.isEnable())
         return;
      this.setState({
         enable: true,
         count: 10
      });
      this.count();
   };

   disable(){
      this.setState({
         enable: false,
         count: 10
      });
      this.refreshSteps();
   };

   count(){
      const repeater = setInterval(() => {
         let count = this.state.count;
         if (this.state.count > 0) {
            count -= 1;
            this.setState({
               count
            });
         } else {
            this.disable();
            clearInterval(repeater);
         }
      }, 1000);
   }

   refreshSteps(){
      getSteps()
         .then((steps) => {
            this.setState({
               steps: steps
            });
         })
   }

   componentDidMount() {
      this.state.mqttClient.on('message', (topic, payload) => this.enable(topic, payload));
      this.refreshSteps();
    }

   

   isEnable(){
      return this.state.enable;
   }

   render() {
      const count = this.state.count;
      const steps = this.state.steps;
      return (
            <div className="App">
               <div className="Screen">
                  {count}
                  <br/>
                  <small>
                     Steps: {steps}
                  </small>
               </div>
               
               <div className="Controls">
                  <button disabled={this.isEnable()} onClick={() => this.request()}>Request</button>
               </div>
         
               <div className="Semaphore">
                  <div className={ !this.isEnable()? "Light Red" : "Light Red Disable"}></div>
                  <div className={ this.isEnable()? "Light Green" : "Light Green Disable"}></div>
               </div>
            </div>
         );
   }
}

export default App;
