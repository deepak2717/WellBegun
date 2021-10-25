import React, { Component } from 'react';
import './App.css';

const electron = window.require('electron');
const { ipcRenderer } = electron;
const fs = window.require('fs');

class App extends Component {

	constructor(props) {
		super(props)
		this.state = { REPO: '', ACTION: '', TABLENAME: '', CURRENTDATE: '', BRANCH: '' }
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleSubmit(event) {
		const { REPO, ACTION, TABLENAME, CURRENTDATE, BRANCH } = this.state
		event.preventDefault()
		alert(`
		  ____Changes____\n
		  REPO : ${REPO}
		  ACTION : ${ACTION}
		  TABLE NAME : ${TABLENAME}
		  CURRENT DATE : ${CURRENTDATE}
		  BRANCH : ${BRANCH}
		`)


		const jsonContent = JSON.stringify(this.state);
		//console.log(jsonContent);

		fs.writeFile("../backend/input/output.json", jsonContent, 'utf8', function (err) {
			if (err) {
				console.log("An error occured while writing JSON Object to File.");
				return console.log(err);
			}
			console.log("JSON file has been saved.");
		});

		ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
		 	jsonfile: jsonContent,
			// number: 25,
		});
	}

	handleChange(event) {
		this.setState({
			// Computed property names
			// keys of the objects are computed dynamically
			[event.target.name]: event.target.value
		})
	}

	componentDidMount() {
		// setting up an event listener to read data that background process
		// will send via the main process after processing the data we
		// send from visiable renderer process
		console.log("Check Loading")
		ipcRenderer.on('MESSAGE_FROM_BACKGROUND_VIA_MAIN', (event, args) => {
			console.log("success");
			console.log(args);
		});

		// trigger event to start background process
		// can be triggered pretty much from anywhere after
		// you have set up a listener to get the information
		// back from background process, as I have done in line 13
		// ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
		// 	number: 25,
		// });
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<div>
					<label htmlFor='REPO'>REPO</label>
					<input
						type ='text'
						name='REPO'
						placeholder='Enter REPO'
						value={this.state.REPO}
						onChange={this.handleChange}
					/>
				</div>
				<div>
					<label htmlFor='ACTION'>ACTION</label>
					<input
						type ='text'
						name='ACTION'
						placeholder='Enter ACTION'
						value={this.state.ACTION}
						onChange={this.handleChange}
					/>
				</div>
				<div>
					<label htmlFor='TABLENAME'>TABLE NAME</label>
					<input
						type ='text'
						name='TABLENAME'
						placeholder='Enter table name'
						value={this.state.TABLENAME}
						onChange={this.handleChange}
					/>
				</div>
				<div>
					<label htmlFor='CURRENTDATE'>CURRENT DATE</label>
					<input
						type ='text'
						name='CURRENTDATE'
						placeholder='Enter current date'
						value={this.state.CURRENTDATE}
						onChange={this.handleChange}
					/>
				</div>
				<div>
					<label htmlFor='BRANCH'>BRANCH</label>
					<input
					    type ='text'
						name='BRANCH'
						placeholder='Emter BRANCH'
						value={this.state.BRANCH}
						onChange={this.handleChange}
					/>
				</div>
				<div>
					<input type='submit' value='SUBMIT'></input>
				</div>
			</form>
		);
	}
}

export default App;
