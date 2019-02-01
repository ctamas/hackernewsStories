import React, { Component } from "react";
import CardDeck from "react-bootstrap/CardDeck";
import Navbar from "react-bootstrap/Navbar";
import CardContainer from "./components/cardContainer";

import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      stories: []
    };

    this.loadNews();
  }

  loadNews = () => {
    // Load main news object.
    fetch("https://hacker-news.firebaseio.com/v0/beststories.json")
      .then(res => res.json())
      .then(
        newsList => {
          this.loadNewsStories(newsList);
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  };

  // Load individual news stories and store in state
  loadNewsStories = newsList => {
    newsList.forEach((storyId, index) => {
      fetch("https://hacker-news.firebaseio.com/v0/item/" + storyId + ".json")
        .then(res => res.json())
        .then(story => {
          let newStories = this.state.stories;
          newStories[index] = story;
          // Render after every 60 stories loaded for performance
          if (index % 60 === 0 || index === newsList.length) {
            this.setState({
              stories: newStories
            });
          }
        });
    });
  };

  render() {
    let storyList;
    storyList = this.state.stories.map(story => {
      return <CardContainer key={story.id} story={story} />;
    });

    return (
      <React.Fragment>
        <Navbar bg="light">
          <Navbar.Brand className="navbar-title" href="#home">
            Hackernews Stories
          </Navbar.Brand>
        </Navbar>
        <div className="card-container">
          <CardDeck>{storyList}</CardDeck>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
