import React, { Component } from 'react';
import { Form, FloatingLabel, Row, Col, Stack, Button, InputGroup, FormControl } from 'react-bootstrap';

const electron = window.require('electron');
const { ipcRenderer } = electron;
const fs = window.require('fs');


class PullRequestForm extends Component {

	constructor(props) {
		super(props)
		this.state = { 
			REPO: '', 
			ACTION: '', 
			CLASSNAME_CAMEL: '', 
			CLASSNAME_CAPITAL: '', 
			JOBNAME_CAPITAL: '', 
			JOBNAME_HYPHENATED: '', 
			BRANCH: '', 
			repoNames: [],
			actions: [],
			inputs:[]
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	initialSetup() {
		const repoNames = this.getRepoNames()
		this.setState({
			repoNames
		})
		this.setState({
			"REPO": repoNames[0]
		})
		console.log(this.state)
		this.setActions(repoNames[0])
	}

	getRepoNames() {
		const repoNames = fs.readdirSync('../backend/repo', { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name)
		return repoNames
	}

	setActions(repoName) {
		const actions = fs.readdirSync('../backend/repo/' + repoName + '/action' ).map( filename => {
			return filename.split('.').slice(0,-1).join('.')
		})
		this.setState({
			actions,
			"ACTION": actions[0]
		})
		this.setInputs(actions[0], repoName)
	}

	setInputs(actionName, repoName = this.state.REPO) {
		console.log("set inputs")
		console.log(actionName)
		console.log(repoName)
		let rawdata = fs.readFileSync('../backend/repo/'+ repoName + '/mapping/' + actionName + '.json');
		let inputMapping = JSON.parse(rawdata);
		console.log(inputMapping);
		this.setState({
			inputs: inputMapping
		})
	}

	handleSubmit(event) {
		console.log("SUBMIT")
		console.log(this.state)
		// const { REPO, ACTION, CLASSNAME_CAMEL, CLASSNAME_CAPITAL, JOBNAME_CAPITAL, JOBNAME_HYPHENATED, BRANCH } = this.state
		event.preventDefault()
		let inputAlertText = ''
		this.state.inputs.forEach( inputObj => {
			inputAlertText += inputObj.fragmentKey + ' : ' + this.state[inputObj.fragmentKey] + '\n'
		})
		alert(`
		  ____Changes____\n
		  REPO : ${this.state.REPO}
		  ACTION : ${this.state.ACTION}
		  ${inputAlertText}BRANCH : ${this.state.BRANCH}
		`)


		const jsonContent = JSON.stringify(this.state);
		console.log(jsonContent)
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
		console.log("handlechange")
		console.log(event.target.name)
		console.log(event.target.value)
		this.setState({
			// Computed property names
			// keys of the objects are computed dynamically
			[event.target.name]: event.target.value
		})
		console.log(this.state)
		
		switch(event.target.name){
			case "REPO": 
				this.setActions(event.target.value)
				break
			case "ACTION":
				this.setInputs(event.target.value)
				break
			default:
				return
		}
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
		this.initialSetup()
		
		// trigger event to start background process
		// can be triggered pretty much from anywhere after
		// you have set up a listener to get the information
		// back from background process, as I have done in line 13
		// ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
		// 	number: 25,
		// })
	}

	createInputs(){
		return this.state.inputs.map( inputObj => {
			console.log(inputObj);
			return (
            <InputGroup>
                <InputGroup.Text id="inputGroup-sizing-default">{inputObj.inputName}</InputGroup.Text>
                <FormControl
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                  name={inputObj.fragmentKey} type="text" placeholder={inputObj.description} onChange={this.handleChange} value={this.state[inputObj.fragmentKey]}
                />
            </InputGroup>
			)
		})
	}

	render() {
		return (
            <Form onSubmit={this.handleSubmit}>
                <Stack gap={3}>
                    <Row className="mt-3">
                        <Col>
                            <FloatingLabel controlId="floatingSelect" label="Repo Name">
                                <Form.Control as="select" custom onChange={this.handleChange} aria-label="Default select example" name='REPO'>
                                    {this.state.repoNames.map( opt => (
                                        <option value={opt} key={opt}>{opt}</option>
                                    ))}
                                </Form.Control>
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FloatingLabel controlId="floatingSelect" label="Action">
                                <Form.Control as="select" custom onChange={this.handleChange} aria-label="Default select example" name='ACTION'>
                                    {this.state.actions.map( opt => (
                                        <option value={opt} key={opt}>{opt}</option>
                                    ))}
                                </Form.Control>
                            </FloatingLabel>
                        </Col>
                    </Row>

                    {this.createInputs()}      

                    <InputGroup>
                        <InputGroup.Text id="inputGroup-sizing-default">Branch Name Hyphenated</InputGroup.Text>
                        <FormControl
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        name='BRANCH' 
                        type="text" 
                        placeholder="Name of branch created in GitHub. ex: add-new-feature" 
                        onChange={this.handleChange} 
                        value={this.state.BRANCH}
                        />
                    </InputGroup>

                    <Button variant="secondary" type="submit" value='SUBMIT'>
                        Submit
                    </Button>
        
                </Stack>
            </Form>
		);
	}
}

export default PullRequestForm;
