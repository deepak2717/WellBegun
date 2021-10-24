import './App.css';
import React from 'react';

function App() {
  return (
    
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
      <a className="navbar-brand" href="/"><h1 style={{float: 'center'}}>Well Begun</h1></a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>

  <form class="row g-3">
  <div class="col-auto">
    <label for="REPO" class="visually-hidden">REPO</label>
    <input type="text" readonly class="form-control-plaintext" id="REPO" value="REPO"/>
  </div>
  <div class="col-auto">
    <label for="reponame" class="visually-hidden">reponame</label>
    <input type="reponame" class="form-control" id="reponame" placeholder="repository name"/>
  </div>
  <div class="col-auto">
    <button type="submit" class="btn btn-primary mb-3">Submit</button>
  </div>
</form>
  
    </>
  );
}

export default App;
