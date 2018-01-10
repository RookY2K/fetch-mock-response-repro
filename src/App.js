import React, { Component } from 'react';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit() {
		fetch('https://www.example.com/')
			.then(response => {
				if(response.ok) {
					return response;
				} else {
					throw Error(response.statusText);
				}
			})
			.then(response => response.json())
			.then(json => {
				this.setState({result: json});
			})
			.catch(error => {
				this.setState({error: error.message});
			});
	}
  render() {
    return (
      <div>
		  <button type="button" onClick={this.handleSubmit}/>
      </div>
    );
  }
}

export default App;
