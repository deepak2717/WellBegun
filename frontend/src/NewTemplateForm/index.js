import React, { Component } from 'react';
import { Form, Stack, Button, InputGroup, FormControl } from 'react-bootstrap';

const electron = window.require('electron');
const { ipcRenderer } = electron;
const fs = window.require('fs');

class PullRequestForm extends Component {

	constructor(props) {
		super(props)
		this.state = {
			prLink: ''
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

    importFiles(){
        console.log("start import")

		ipcRenderer.send('START_PR_IMPORT_PROCESS', {
			prUrl: this.state.prLink,
	   });
    }

	handleSubmit(event) {
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
		// })
	}

	render() {
		return (
            <Form onSubmit={this.handleSubmit}>
                <Stack gap={3}>
                
                <InputGroup className="mt-3">
                    <InputGroup.Text>PR Template Link</InputGroup.Text>
                    <FormControl
                        placeholder="link to github PR"
                        aria-label="PR Template Link"
                        aria-describedby="basic-addon2"
                        name='prLink' 
                        type="text" 
                        onChange={this.handleChange} 
                        value={this.state.prLink}
                    />
                    <Button variant="outline-secondary" id="button-addon2" onClick={this.importFiles}>
                        Import Files
                    </Button>
                </InputGroup>
        
                </Stack>
            </Form>
		);
	}
}

export default PullRequestForm;
