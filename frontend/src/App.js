import React, { Component } from 'react';
import { Form, FloatingLabel, Row, Col, Stack, Button, Card, ListGroup, Container, Navbar, Nav } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams,
  } from "react-router-dom";
import PullRequestForm from './PullRequestForm'; 
import NewTemplateForm from './NewTemplateForm'; 


const electron = window.require('electron');
const { ipcRenderer } = electron;
const fs = window.require('fs');


class App extends Component {

	constructor(props) {
		super(props)
		this.state = { 
			REPO: '', 
			ACTION: '', 
			BRANCH: '', 
			COMMIT_MESSAGE: '',
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
		this.hideTodoList()
	}

	setInputs(actionName, repoName = this.state.REPO) {
		let rawdata = fs.readFileSync('../backend/repo/'+ repoName + '/mapping/' + actionName + '.json');
		let inputMapping = JSON.parse(rawdata);
		this.setState({
			inputs: inputMapping
		})
		this.hideTodoList()
	}

	hideTodoList(){
		this.setState({
			todoList: undefined
		})
	}

	showTodoList() {
		let rawdata = fs.readFileSync('../backend/repo/'+ this.state.REPO + '/todoList/' + this.state.ACTION + '.json');
		let todoList = JSON.parse(rawdata);
		todoList.forEach( todoListItem => {
			this.state.inputs.forEach( inputMap => {
				const stringToFind = '{{' + inputMap.fragmentKey + '}}'
				if( todoListItem.fileName.search(stringToFind) > -1){
					const fileNameEdited = todoListItem.fileName.replace(stringToFind, this.state[inputMap.fragmentKey])
					todoListItem.fileNameEdited = fileNameEdited
				}
			})
		})
		this.setState({
			todoList
		})
	}

	handleSubmit(event) {
		console.log("SUBMIT")
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
		  COMMIT MESSAGE : ${this.state.COMMIT_MESSAGE} 
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

		this.showTodoList()
	}

	handleChange(event) {
		console.log("handlechange")
		this.setState({
			// Computed property names
			// keys of the objects are computed dynamically
			[event.target.name]: event.target.value
		})
		
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
			return (
			<Form.Group as={Row} controlId={inputObj.fragmentKey} key={inputObj.fragmentKey}>
				<Form.Label column md="auto">
					{inputObj.inputName}
				</Form.Label>
				<Col sm="8">
				<Form.Control name={inputObj.fragmentKey} type="text" placeholder={inputObj.description} onChange={this.handleChange} value={this.state[inputObj.fragmentKey]}/>
				</Col>
			</Form.Group>
			)
		})
	}

	renderTodoList() {
		if( this.state.todoList){
			return (
				<Card>
					<Card.Header as="h5">TODO List</Card.Header>
					<Card.Body>
						<Card.Text>
							<ListGroup as="ol" numbered>
								{this.state.todoList.map( todoItem => {
									return (
										<ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" key={todoItem.fileName}>
											<div className="ms-2 me-auto">
											<div className="fw-bold">{todoItem.fileNameEdited}</div>
												{todoItem.action}
											</div>
										</ListGroup.Item>
									)
								})}
							</ListGroup>
						</Card.Text>
					</Card.Body>
				</Card>
			)
		}
		return null
	}

	render() {
		return (
			<Container>
				<Router>

				<Navbar bg="light" variant="light">
					<Container>
					<Navbar.Brand href="/">Well Begun</Navbar.Brand>
					<Nav className="me-auto">
					<Nav.Link href="/">Create Pull Request</Nav.Link>
					<Nav.Link href="/new-template">Create New Template</Nav.Link>
					</Nav>
					</Container>
				</Navbar>
				<Switch>
					<Route exact path="/">
						<PullRequestForm />
					</Route>
					<Route path="/new-template">
						<NewTemplateForm />
					</Route>
				</Switch>
				</Router>
			</Container>
	
		);
	}
}

export default App;
